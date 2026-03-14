# Data & SQL Standards

This document defines standards for SQL development, data engineering, and testing of data pipelines and stored procedures within Mycoe.

## Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Database | Azure SQL / SQL Server | Standard relational platform |
| Data warehouse | Azure Synapse Analytics / Fabric | Analytical workloads |
| Data transformation | dbt (data build tool) | Version-controlled, testable SQL transformations |
| SQL unit testing | tSQLt | Stored procedure and function unit testing on SQL Server |
| Data pipeline | Azure Data Factory / Fabric Pipelines | Orchestration and ETL |
| Schema migrations | Flyway / DbUp | Version-controlled, repeatable database migrations |
| Source control | Git (`.sql` files or dbt project) | All schema and logic changes via pull request |

---

## SQL Coding Standards

### Naming Conventions

| Object | Convention | Example |
|---|---|---|
| Tables | PascalCase, singular | `Customer`, `OrderLine` |
| Views | `vw_` prefix + PascalCase | `vw_ActiveCustomers` |
| Stored procedures | `usp_` prefix + verb + noun | `usp_GetCustomerById` |
| Functions (scalar) | `ufn_` prefix + verb + noun | `ufn_CalculateTax` |
| Indexes | `IX_<Table>_<Columns>` | `IX_Customer_Email` |
| Unique indexes | `UX_<Table>_<Columns>` | `UX_Customer_Email` |
| Foreign keys | `FK_<ChildTable>_<ParentTable>` | `FK_Order_Customer` |
| Primary keys | `PK_<Table>` | `PK_Customer` |

### Query Style

- Use **explicit `INNER JOIN` / `LEFT JOIN`** — never implicit comma joins
- Always **alias tables** in multi-table queries: `c` for `Customer`, `o` for `Order`
- Never use `SELECT *` in stored procedures or views — list columns explicitly
- Always include a `WITH (NOLOCK)` hint on reporting queries only when explicitly documented and understood
- Use `TRY...CATCH` with `RAISERROR` or `THROW` for error handling in stored procedures
- Use **parameterised queries** — never concatenate user input into SQL strings (prevents SQL injection)

```sql
-- ✅ Good: parameterised, explicit columns, aliased tables
SELECT
    c.CustomerId,
    c.FullName,
    c.Email,
    COUNT(o.OrderId) AS TotalOrders
FROM dbo.Customer c
INNER JOIN dbo.[Order] o ON o.CustomerId = c.CustomerId
WHERE c.IsActive = 1
  AND c.CreatedDate >= @FromDate
GROUP BY c.CustomerId, c.FullName, c.Email;

-- ❌ Avoid: SELECT *, implicit join, no alias
-- Note: [Order] uses brackets because ORDER is a reserved SQL keyword — brackets are required here
SELECT * FROM Customer, [Order] WHERE Customer.CustomerId = [Order].CustomerId;
```

---

## SQL Unit Testing (tSQLt)

**tSQLt** is an open-source unit testing framework for SQL Server that runs tests inside transactions (rolled back after each test so they leave no data behind).

### Setup

```sql
-- Install tSQLt (run once per database, in non-production environments)
EXEC tSQLt.InstallExternalAccessKey;
EXEC tSQLt.InstallInternalAccessKey;
-- Then run the tSQLt.class.sql script from https://tsqlt.org/
```

For CI, use a dedicated test database per pipeline run or use a Docker-based SQL Server container.

### Test Structure

```sql
-- Create a test class (schema) for each stored procedure or function under test
EXEC tSQLt.NewTestClass 'GetCustomerByIdTests';
GO

CREATE PROCEDURE GetCustomerByIdTests.[test returns customer when id exists]
AS
BEGIN
    -- Arrange: fake the table and insert known data
    EXEC tSQLt.FakeTable 'dbo.Customer';
    INSERT INTO dbo.Customer (CustomerId, FullName, Email, IsActive)
    VALUES (1, 'Alice Smith', 'alice@example.com', 1);

    -- Act: call the stored procedure and capture results
    CREATE TABLE #ActualResult (CustomerId INT, FullName NVARCHAR(200), Email NVARCHAR(200));
    INSERT INTO #ActualResult
    EXEC dbo.usp_GetCustomerById @CustomerId = 1;

    -- Assert: compare with expected
    CREATE TABLE #ExpectedResult (CustomerId INT, FullName NVARCHAR(200), Email NVARCHAR(200));
    INSERT INTO #ExpectedResult VALUES (1, 'Alice Smith', 'alice@example.com');

    EXEC tSQLt.AssertEqualsTable '#ExpectedResult', '#ActualResult';
END;
GO

CREATE PROCEDURE GetCustomerByIdTests.[test returns empty result when id does not exist]
AS
BEGIN
    EXEC tSQLt.FakeTable 'dbo.Customer';

    CREATE TABLE #ActualResult (CustomerId INT, FullName NVARCHAR(200), Email NVARCHAR(200));
    INSERT INTO #ActualResult
    EXEC dbo.usp_GetCustomerById @CustomerId = 9999;

    EXEC tSQLt.AssertEmptyTable '#ActualResult';
END;
GO
```

### Running Tests

```sql
-- Run all tests in a class
EXEC tSQLt.Run 'GetCustomerByIdTests';

-- Run all tests in the database
EXEC tSQLt.RunAll;

-- Run in CI (outputs JUnit XML for Azure DevOps)
EXEC tSQLt.RunAll;
EXEC tSQLt.XmlResultFormatter;
```

**In Azure DevOps:**

```yaml
- task: SqlAzureDacpacDeployment@1
  displayName: 'Deploy test database schema'
  inputs:
    # ... connection details

- script: |
    sqlcmd -S $(DB_SERVER) -d $(TEST_DB) -Q "EXEC tSQLt.RunAll; EXEC tSQLt.XmlResultFormatter;" \
      -o test-results.xml
  displayName: 'Run tSQLt tests'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'test-results.xml'
```

### Useful tSQLt Assertions

| Assertion | Use |
|---|---|
| `tSQLt.AssertEquals @Expected, @Actual` | Compare scalar values |
| `tSQLt.AssertEqualsTable '#Expected', '#Actual'` | Compare full table result sets |
| `tSQLt.AssertEmptyTable '#Table'` | Assert no rows returned |
| `tSQLt.AssertLike @ExpectedPattern, @Actual` | Pattern match on strings |
| `tSQLt.Fail @Message` | Force a test failure with a message |
| `tSQLt.ExpectException @ExpectedMessagePattern` | Assert a procedure raises an error |
| `tSQLt.FakeTable 'schema.Table'` | Replace a table with an empty copy for isolation |
| `tSQLt.SpyProcedure 'schema.Proc'` | Capture calls to a dependency procedure |

---

## dbt Testing (Data Transformations)

Use **dbt** for all analytical SQL transformations in the data warehouse. dbt's built-in test framework validates data quality without additional tooling.

### Generic Tests

Add tests to `schema.yml` files alongside your dbt models:

```yaml
# models/staging/schema.yml
version: 2

models:
  - name: stg_customers
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null
      - name: email
        tests:
          - not_null
          - unique
      - name: status
        tests:
          - accepted_values:
              values: ['active', 'inactive', 'pending']

  - name: stg_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('stg_customers')
              field: customer_id
```

### Custom Singular Tests

Place custom SQL test files in `tests/`. A test fails if the query returns any rows.

```sql
-- tests/assert_total_revenue_positive.sql
-- Fails if any order has a negative or zero total
SELECT order_id, total_amount
FROM {{ ref('fct_orders') }}
WHERE total_amount <= 0
```

### dbt-Expectations (Extended Assertions)

Install `dbt-expectations` for richer column-level assertions:

```yaml
# packages.yml
packages:
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<0.11.0"]
```

```yaml
- name: fct_orders
  columns:
    - name: total_amount
      tests:
        - dbt_expectations.expect_column_values_to_be_between:
            min_value: 0
            max_value: 1000000
    - name: order_date
      tests:
        - dbt_expectations.expect_column_values_to_be_of_type:
            column_type: date
```

### Running dbt Tests

```bash
# Run all tests
dbt test

# Run tests for a specific model
dbt test --select stg_customers

# Run tests and output results
dbt test --store-failures
```

In CI, run `dbt test` after `dbt run` and publish the results.

---

## Data Pipeline Testing

### Testing Azure Data Factory Pipelines

- Use **separate integration runtime and linked service configurations** for Dev, UAT, and Production — pipelines should be environment-agnostic
- Validate pipelines with **debug runs** using sample/synthetic data before merging
- Write **data validation activities** at the end of pipelines (e.g., row count checks, null checks) using the `If Condition` activity and `Fail` activity on unexpected results

```json
// Example validation expression in a pipeline If Condition activity
@and(
  greater(activity('Copy Data').output.rowsCopied, 0),
  equals(activity('Copy Data').output.rowsCopied, activity('Get Source Count').output.firstRow.RowCount)
)
```

- Test **incremental load logic** explicitly: run the pipeline twice with the same source data and assert idempotent results
- Use **watermark tables** for incremental loads and test boundary conditions (empty source, duplicate keys, late-arriving data)

### Synthetic Test Data

- Never use production data (including anonymised copies) in development or test databases
- Generate synthetic data using tools such as:
  - **Faker.js / Bogus (.NET)** for application-layer test data
  - **SQL Server Data Tools (SSDT)** data generation
  - Custom seed scripts committed to the `tests/data/` folder
- Keep seed scripts idempotent — use `MERGE` or `IF NOT EXISTS` patterns

---

## Schema Migration Standards

- All schema changes must be scripted and committed to source control — no manual changes to shared databases
- Use **Flyway** (recommended) or **DbUp** for managing migration history
- Migrations are numbered sequentially: `V001__create_customer_table.sql`, `V002__add_email_index.sql`
- Every migration must be **reversible** where possible — include a corresponding `U001__undo_create_customer_table.sql` undo script
- Run migrations via CI/CD only — never run migration scripts manually in production

---

## Testing Gotchas and Recommendations

| Gotcha | Recommendation |
|---|---|
| tSQLt tests leaving data behind | tSQLt wraps each test in a transaction and rolls it back — but only if the test completes; always check for orphaned data after failed runs |
| `FakeTable` removes constraints | `tSQLt.FakeTable` drops all constraints on the faked table — re-add them manually if your procedure relies on FK integrity |
| dbt tests running against live prod data | Only run `dbt test` against the development or test target — configure `profiles.yml` targets explicitly in CI |
| NULL handling in SQL assertions | `tSQLt.AssertEquals` treats NULL as not equal to NULL; use `tSQLt.AssertEqualsTable` for result set comparisons that include NULLs |
| Pipeline tests with network dependencies | Mock external HTTP calls in ADF using the **HTTP linked service** pointed at a local mock server (e.g., WireMock) in test environments |
| Incremental load boundary testing | Always test the day/time boundary condition: records exactly at the watermark timestamp should be included or excluded consistently |
| Schema drift in pipelines | Enable **schema drift** handling in ADF/Synapse mappings and write explicit tests for new columns appearing in source data |
| dbt model freshness | Use `dbt source freshness` in CI to assert that source tables have been updated within the expected window |
