# Data & SQL Templates

Copy-paste starter templates for SQL development, tSQLt unit testing, dbt transformations, and schema migrations.

## Contents

| Folder | What It Is |
|---|---|
| `tsqlt/` | tSQLt unit test template for SQL Server stored procedures |
| `dbt/` | dbt project skeleton with example model, schema tests, and custom test |
| `migrations/` | Flyway versioned migration scripts (create and undo) |

## Quick Start

### tSQLt — SQL Unit Testing

```bash
# Copy the tSQLt template to your database project
cp -r templates/data-sql/tsqlt ./database/tests
```

Run the example tests in SQL Server Management Studio (SSMS) or Azure Data Studio:

```sql
EXEC tSQLt.RunAll;
EXEC tSQLt.XmlResultFormatter;  -- publish results as JUnit XML for CI
```

See `tsqlt/example-tests.sql` for a ready-to-copy test class template.

### dbt — Data Transformations

```bash
# Copy the dbt skeleton to your analytics project
cp -r templates/data-sql/dbt ./analytics

cd analytics

# Install dbt packages
dbt deps

# Run models and tests
dbt run
dbt test
```

### Flyway — Schema Migrations

```bash
# Copy migration scripts to your migrations folder
cp -r templates/data-sql/migrations ./database/migrations

# Preview pending migrations
flyway info

# Apply migrations
flyway migrate

# Undo the latest migration (if configured)
flyway undo
```

## Related Standards

- [Data & SQL Standards](../../docs/standards/data-sql.md)
- [Data & SQL Training Pathway](../../docs/training/data-sql.md)
