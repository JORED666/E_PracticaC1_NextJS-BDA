DROP USER IF EXISTS app_user;

CREATE USER app_user WITH PASSWORD 'app_secure_password_2024';

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM app_user;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM app_user;

GRANT USAGE ON SCHEMA public TO app_user;

GRANT SELECT ON vw_most_borrowed_books TO app_user;
GRANT SELECT ON vw_overdue_loans TO app_user;
GRANT SELECT ON vw_fines_summary TO app_user;
GRANT SELECT ON vw_member_activity TO app_user;
GRANT SELECT ON vw_inventory_health TO app_user;

ALTER USER app_user CONNECTION LIMIT 10;
