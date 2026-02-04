CREATE INDEX idx_loans_member_returned 
ON loans(member_id, returned_at) 
INCLUDE (due_at, loaned_at);

COMMENT ON INDEX idx_loans_member_returned IS 
'Optimiza búsquedas de préstamos activos/históricos por miembro';

CREATE INDEX idx_loans_overdue 
ON loans(due_at, member_id, copy_id) 
WHERE returned_at IS NULL;

COMMENT ON INDEX idx_loans_overdue IS 
'Índice parcial para préstamos vencidos no devueltos';

CREATE INDEX idx_fines_created_paid 
ON fines(created_at, paid_at) 
INCLUDE (amount);

COMMENT ON INDEX idx_fines_created_paid IS 
'Optimiza agrupaciones temporales de multas por mes';

ANALYZE members;
ANALYZE books;
ANALYZE copies;
ANALYZE loans;
ANALYZE fines;
