-- =============================================================================
-- U001__create_customer_table.sql
-- Flyway undo migration — reverses V001.
-- Only required when Flyway Teams / Enterprise undo support is enabled.
-- =============================================================================

DROP TABLE IF EXISTS dbo.Customer;
GO
