-- Datos de prueba para el sistema de biblioteca
-- Insertar miembros
INSERT INTO members (name, email, member_type, joined_at, is_active) VALUES
('Juan Pérez', 'juan.perez@email.com', 'student', '2024-01-15', true),
('María García', 'maria.garcia@email.com', 'teacher', '2024-01-20', true),
('Carlos López', 'carlos.lopez@email.com', 'student', '2024-02-01', true),
('Ana Martínez', 'ana.martinez@email.com', 'public', '2024-02-10', true),
('Luis Rodríguez', 'luis.rodriguez@email.com', 'student', '2024-03-05', true),
('Elena Fernández', 'elena.fernandez@email.com', 'teacher', '2024-03-15', false),
('Pedro Sánchez', 'pedro.sanchez@email.com', 'student', '2024-04-01', true),
('Laura Gómez', 'laura.gomez@email.com', 'public', '2024-04-10', true),
('Diego Torres', 'diego.torres@email.com', 'student', '2024-05-01', true),
('Sofia Ruiz', 'sofia.ruiz@email.com', 'teacher', '2024-05-15', true);

-- Insertar libros
INSERT INTO books (title, author, category, isbn, publication_year) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 'Literatura', '978-0307474728', 1967),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 'Clásicos', '978-8420412146', 1605),
('1984', 'George Orwell', 'Ciencia Ficción', '978-0451524935', 1949),
('El principito', 'Antoine de Saint-Exupéry', 'Infantil', '978-0156012195', 1943),
('Sapiens', 'Yuval Noah Harari', 'Historia', '978-0062316097', 2011),
('Clean Code', 'Robert C. Martin', 'Tecnología', '978-0132350884', 2008),
('El amor en los tiempos del cólera', 'Gabriel García Márquez', 'Literatura', '978-0307389732', 1985),
('Rayuela', 'Julio Cortázar', 'Literatura', '978-8420471891', 1963),
('Fahrenheit 451', 'Ray Bradbury', 'Ciencia Ficción', '978-1451673319', 1953),
('El código Da Vinci', 'Dan Brown', 'Suspenso', '978-0307474278', 2003),
('Harry Potter y la piedra filosofal', 'J.K. Rowling', 'Fantasía', '978-0439708180', 1997),
('El alquimista', 'Paulo Coelho', 'Literatura', '978-0062315007', 1988),
('Introducción a los algoritmos', 'Thomas H. Cormen', 'Tecnología', '978-0262033848', 2009),
('La sombra del viento', 'Carlos Ruiz Zafón', 'Literatura', '978-0143034902', 2001),
('El perfume', 'Patrick Süskind', 'Literatura', '978-0375725845', 1985);

-- Insertar copias
INSERT INTO copies (book_id, barcode, status, acquired_at) VALUES
(1, 'BAR001', 'loaned', '2024-01-01'),
(1, 'BAR002', 'available', '2024-01-01'),
(2, 'BAR003', 'loaned', '2024-01-01'),
(2, 'BAR004', 'loaned', '2024-01-01'),
(2, 'BAR005', 'available', '2024-01-01'),
(3, 'BAR006', 'loaned', '2024-01-01'),
(3, 'BAR007', 'damaged', '2024-01-01'),
(4, 'BAR008', 'available', '2024-01-01'),
(4, 'BAR009', 'available', '2024-01-01'),
(5, 'BAR010', 'loaned', '2024-01-01'),
(6, 'BAR011', 'loaned', '2024-01-01'),
(6, 'BAR012', 'available', '2024-01-01'),
(7, 'BAR013', 'loaned', '2024-01-01'),
(8, 'BAR014', 'available', '2024-01-01'),
(9, 'BAR015', 'loaned', '2024-01-01'),
(10, 'BAR016', 'loaned', '2024-01-01'),
(10, 'BAR017', 'lost', '2024-01-01'),
(11, 'BAR018', 'loaned', '2024-01-01'),
(11, 'BAR019', 'available', '2024-01-01'),
(12, 'BAR020', 'available', '2024-01-01'),
(13, 'BAR021', 'available', '2024-01-01'),
(14, 'BAR022', 'loaned', '2024-01-01'),
(15, 'BAR023', 'available', '2024-01-01');

-- Insertar préstamos
INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
-- Préstamos activos
(1, 1, '2025-01-20', '2025-02-05', NULL),
(6, 3, '2025-01-22', '2025-02-07', NULL),
(11, 5, '2025-01-25', '2025-02-10', NULL),
-- Préstamos VENCIDOS
(3, 2, '2025-01-05', '2025-01-20', NULL),
(4, 4, '2025-01-08', '2025-01-23', NULL),
(10, 1, '2025-01-10', '2025-01-25', NULL),
(13, 7, '2025-01-12', '2025-01-27', NULL),
(15, 9, '2025-01-15', '2025-01-30', NULL),
-- Préstamos devueltos
(1, 2, '2024-12-01', '2024-12-16', '2024-12-15'),
(3, 1, '2024-12-05', '2024-12-20', '2024-12-18'),
(6, 3, '2024-12-10', '2024-12-25', '2024-12-24'),
(10, 5, '2024-11-15', '2024-11-30', '2024-12-05'),
(11, 4, '2024-11-20', '2024-12-05', '2024-12-04'),
(13, 7, '2024-11-25', '2024-12-10', '2024-12-09'),
(15, 8, '2024-10-01', '2024-10-16', '2024-10-20'),
(18, 2, '2024-10-10', '2024-10-25', '2024-10-24'),
(22, 1, '2024-09-15', '2024-09-30', '2024-09-29'),
(18, 6, '2025-01-28', '2025-02-12', NULL),
(22, 8, '2025-01-30', '2025-02-14', NULL);

-- Insertar multas
INSERT INTO fines (loan_id, amount, reason, paid_at, created_at) VALUES
-- Multas pendientes
(4, 50.00, 'Préstamo vencido - 14 días de retraso', NULL, '2025-02-03'),
(5, 35.00, 'Préstamo vencido - 11 días de retraso', NULL, '2025-02-03'),
(6, 25.00, 'Préstamo vencido - 9 días de retraso', NULL, '2025-02-03'),
(7, 20.00, 'Préstamo vencido - 7 días de retraso', NULL, '2025-02-03'),
(8, 15.00, 'Préstamo vencido - 4 días de retraso', NULL, '2025-02-03'),
-- Multas pagadas
(12, 25.00, 'Préstamo vencido - 5 días de retraso', '2024-12-10', '2024-12-06'),
(17, 30.00, 'Préstamo vencido - 4 días de retraso', '2024-10-25', '2024-10-21');
