-- Authorized avatar-only extension. Hibernate ddl-auto remains none.
IF COL_LENGTH('dbo.USERS', 'avatar_url') IS NULL
BEGIN
    ALTER TABLE dbo.USERS ADD avatar_url NVARCHAR(500) NULL;
END;
