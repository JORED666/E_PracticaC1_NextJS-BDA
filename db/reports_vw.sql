-- VIEW 1: Libros más prestados
CREATE OR REPLACE VIEW vw_most_borrowed_books AS
SELECT 
    b.id AS book_id,
    b.title,
    b.author,
    b.category,
    COUNT(l.id) AS total_loans,
    RANK() OVER (ORDER BY COUNT(l.id) DESC) AS popularity_rank,
    COUNT(CASE WHEN l.returned_at IS NULL THEN 1 END) AS currently_loaned,
    COUNT(CASE WHEN l.returned_at IS NOT NULL THEN 1 END) AS completed_loans
FROM books b
INNER JOIN copies c ON b.id = c.book_id
LEFT JOIN loans l ON c.id = l.copy_id
GROUP BY b.id, b.title, b.author, b.category
HAVING COUNT(l.id) > 0
ORDER BY total_loans DESC, b.title;

-- VIEW 2: Préstamos vencidos
CREATE OR REPLACE VIEW vw_overdue_loans AS
WITH overdue_details AS (
    SELECT 
        l.id AS loan_id,
        m.id AS member_id,
        m.name AS member_name,
        m.email AS member_email,
        b.title AS book_title,
        b.author AS book_author,
        c.barcode,
        l.loaned_at,
        l.due_at,
        CURRENT_DATE - l.due_at::date AS days_overdue,
        CASE 
            WHEN CURRENT_DATE - l.due_at::date <= 7 THEN (CURRENT_DATE - l.due_at::date) * 5.00
            WHEN CURRENT_DATE - l.due_at::date <= 14 THEN 35.00 + ((CURRENT_DATE - l.due_at::date - 7) * 7.50)
            ELSE 87.50 + ((CURRENT_DATE - l.due_at::date - 14) * 10.00)
        END AS suggested_fine_amount
    FROM loans l
    INNER JOIN members m ON l.member_id = m.id
    INNER JOIN copies c ON l.copy_id = c.id
    INNER JOIN books b ON c.book_id = b.id
    WHERE l.returned_at IS NULL 
      AND l.due_at < CURRENT_DATE
)
SELECT * FROM overdue_details
ORDER BY days_overdue DESC, member_name;

-- VIEW 3: Resumen de multas
CREATE OR REPLACE VIEW vw_fines_summary AS
SELECT 
    DATE_TRUNC('month', f.created_at) AS month,
    TO_CHAR(DATE_TRUNC('month', f.created_at), 'YYYY-MM') AS month_label,
    COUNT(*) AS total_fines,
    SUM(f.amount) AS total_amount,
    SUM(CASE WHEN f.paid_at IS NOT NULL THEN f.amount ELSE 0 END) AS paid_amount,
    SUM(CASE WHEN f.paid_at IS NULL THEN f.amount ELSE 0 END) AS pending_amount,
    COUNT(CASE WHEN f.paid_at IS NOT NULL THEN 1 END) AS paid_count,
    COUNT(CASE WHEN f.paid_at IS NULL THEN 1 END) AS pending_count,
    ROUND(
        (COUNT(CASE WHEN f.paid_at IS NOT NULL THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 
        2
    ) AS payment_rate_percentage
FROM fines f
GROUP BY DATE_TRUNC('month', f.created_at)
HAVING COUNT(*) > 0
ORDER BY month DESC;

-- VIEW 4: Actividad de miembros
CREATE OR REPLACE VIEW vw_member_activity AS
WITH member_stats AS (
    SELECT 
        m.id AS member_id,
        m.name,
        m.email,
        m.member_type,
        m.joined_at,
        m.is_active,
        COUNT(l.id) AS total_loans,
        COUNT(CASE WHEN l.returned_at IS NOT NULL THEN 1 END) AS completed_loans,
        COUNT(CASE WHEN l.returned_at IS NULL AND l.due_at < CURRENT_DATE THEN 1 END) AS overdue_loans,
        COUNT(CASE WHEN l.returned_at IS NULL AND l.due_at >= CURRENT_DATE THEN 1 END) AS active_loans,
        COALESCE(SUM(f.amount), 0) AS total_fines,
        COALESCE(SUM(CASE WHEN f.paid_at IS NULL THEN f.amount ELSE 0 END), 0) AS pending_fines,
        MAX(l.loaned_at) AS last_loan_date
    FROM members m
    LEFT JOIN loans l ON m.id = l.member_id
    LEFT JOIN fines f ON l.id = f.loan_id
    GROUP BY m.id, m.name, m.email, m.member_type, m.joined_at, m.is_active
    HAVING COUNT(l.id) > 0 OR m.is_active = true
)
SELECT 
    member_id,
    name,
    email,
    member_type,
    joined_at,
    is_active,
    total_loans,
    completed_loans,
    overdue_loans,
    active_loans,
    total_fines,
    pending_fines,
    last_loan_date,
    CASE 
        WHEN total_loans > 0 THEN ROUND((overdue_loans::numeric / total_loans::numeric) * 100, 2)
        ELSE 0
    END AS overdue_rate_percentage,
    CASE
        WHEN overdue_loans = 0 AND pending_fines = 0 THEN 'Excelente'
        WHEN overdue_loans <= 1 AND pending_fines < 50 THEN 'Bueno'
        WHEN overdue_loans <= 2 OR pending_fines < 100 THEN 'Regular'
        ELSE 'Requiere atención'
    END AS status_category
FROM member_stats
ORDER BY total_loans DESC, name;

-- VIEW 5: Salud del inventario
CREATE OR REPLACE VIEW vw_inventory_health AS
SELECT 
    b.category,
    COUNT(DISTINCT b.id) AS unique_books,
    COUNT(c.id) AS total_copies,
    COUNT(CASE WHEN c.status = 'available' THEN 1 END) AS available_copies,
    COUNT(CASE WHEN c.status = 'loaned' THEN 1 END) AS loaned_copies,
    COUNT(CASE WHEN c.status = 'damaged' THEN 1 END) AS damaged_copies,
    COUNT(CASE WHEN c.status = 'lost' THEN 1 END) AS lost_copies,
    ROUND(
        (COUNT(CASE WHEN c.status = 'available' THEN 1 END)::numeric / 
         NULLIF(COUNT(c.id), 0)::numeric) * 100, 
        2
    ) AS availability_percentage,
    CASE
        WHEN COUNT(CASE WHEN c.status = 'available' THEN 1 END)::numeric / 
             NULLIF(COUNT(c.id), 0)::numeric >= 0.7 THEN 'Saludable'
        WHEN COUNT(CASE WHEN c.status = 'available' THEN 1 END)::numeric / 
             NULLIF(COUNT(c.id), 0)::numeric >= 0.4 THEN 'Aceptable'
        ELSE 'Crítico'
    END AS health_status
FROM books b
INNER JOIN copies c ON b.id = c.book_id
GROUP BY b.category
ORDER BY unique_books DESC, b.category;
