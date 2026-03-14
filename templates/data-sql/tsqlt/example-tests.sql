-- =============================================================================
-- tSQLt Example Test Class
-- Copy this file and adapt it for each stored procedure or function under test.
-- Replace "ExampleTests" and "dbo.usp_Example" with your own names.
-- =============================================================================

-- Step 1: Create a test class (schema) for the object under test
EXEC tSQLt.NewTestClass 'ExampleTests';
GO

-- =============================================================================
-- Test 1: Verify the procedure returns the expected row when it exists
-- =============================================================================
CREATE OR ALTER PROCEDURE ExampleTests.[test returns row when record exists]
AS
BEGIN
    -- Arrange: fake the table so tests are isolated from real data
    EXEC tSQLt.FakeTable 'dbo.Customer';

    INSERT INTO dbo.Customer (CustomerId, FullName, Email, IsActive)
    VALUES (1, 'Alice Smith', 'alice@example.com', 1);

    -- Act: call the stored procedure and capture its output
    CREATE TABLE #ActualResult (CustomerId INT, FullName NVARCHAR(200), Email NVARCHAR(200));
    INSERT INTO #ActualResult
    EXEC dbo.usp_GetCustomerById @CustomerId = 1;

    -- Assert: compare actual output against expected
    CREATE TABLE #ExpectedResult (CustomerId INT, FullName NVARCHAR(200), Email NVARCHAR(200));
    INSERT INTO #ExpectedResult VALUES (1, 'Alice Smith', 'alice@example.com');

    EXEC tSQLt.AssertEqualsTable '#ExpectedResult', '#ActualResult';
END;
GO

-- =============================================================================
-- Test 2: Verify the procedure returns no rows when the record does not exist
-- =============================================================================
CREATE OR ALTER PROCEDURE ExampleTests.[test returns empty result when record does not exist]
AS
BEGIN
    -- Arrange: fake the table with no data
    EXEC tSQLt.FakeTable 'dbo.Customer';

    -- Act
    CREATE TABLE #ActualResult (CustomerId INT, FullName NVARCHAR(200), Email NVARCHAR(200));
    INSERT INTO #ActualResult
    EXEC dbo.usp_GetCustomerById @CustomerId = 9999;

    -- Assert
    EXEC tSQLt.AssertEmptyTable '#ActualResult';
END;
GO

-- =============================================================================
-- Test 3: Verify the procedure raises an error for invalid input
-- =============================================================================
CREATE OR ALTER PROCEDURE ExampleTests.[test raises error when CustomerId is null]
AS
BEGIN
    EXEC tSQLt.FakeTable 'dbo.Customer';

    -- tSQLt.ExpectException asserts that the following statement raises an error
    EXEC tSQLt.ExpectException
        @ExpectedMessagePattern = '%CustomerId cannot be null%',
        @ExpectedSeverity = 16;

    EXEC dbo.usp_GetCustomerById @CustomerId = NULL;
END;
GO

-- =============================================================================
-- How to run the tests
-- =============================================================================
-- Run all tests in this class:
--   EXEC tSQLt.Run 'ExampleTests';
--
-- Run all tests in the database:
--   EXEC tSQLt.RunAll;
--
-- Output JUnit XML for Azure DevOps:
--   EXEC tSQLt.RunAll;
--   EXEC tSQLt.XmlResultFormatter;
