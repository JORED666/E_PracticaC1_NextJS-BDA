\set app_password `echo $APP_DB_PASS`

DROP ROLE IF EXISTS app_user;
CREATE ROLE app_user WITH LOGIN PASSWORD :'app_password';

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM app_user;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM app_user;

GRANT CONNECT ON DATABASE library_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT ON vw_most_borrowed_books TO app_user;
GRANT SELECT ON vw_overdue_loans TO app_user;
GRANT SELECT ON vw_fines_summary TO app_user;
GRANT SELECT ON vw_member_activity TO app_user;
GRANT SELECT ON vw_inventory_health TO app_user;

ALTER ROLE app_user WITH PASSWORD :'app_password';
