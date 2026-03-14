-- =============================================================================
-- Custom singular test: assert no orders have a zero or negative total amount.
-- A custom test fails when this query returns one or more rows.
-- Rename this file to match the assertion it makes.
-- =============================================================================
SELECT
    order_id,
    total_amount
FROM {{ ref('stg_orders') }}
WHERE total_amount <= 0
