-- =============================================================================
-- V001__create_customer_table.sql
-- Flyway versioned migration — creates the Customer table.
-- Naming convention: V<version>__<description>.sql
-- =============================================================================

CREATE TABLE dbo.Customer
(
    CustomerId   INT            NOT NULL IDENTITY(1,1),
    FullName     NVARCHAR(200)  NOT NULL,
    Email        NVARCHAR(320)  NOT NULL,
    IsActive     BIT            NOT NULL CONSTRAINT DF_Customer_IsActive DEFAULT (1),
    CreatedDate  DATETIME2      NOT NULL CONSTRAINT DF_Customer_CreatedDate DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT PK_Customer PRIMARY KEY (CustomerId),
    CONSTRAINT UX_Customer_Email UNIQUE (Email)
);
GO

CREATE INDEX IX_Customer_IsActive ON dbo.Customer (IsActive);
GO
