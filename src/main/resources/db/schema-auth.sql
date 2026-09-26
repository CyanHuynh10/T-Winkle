-- SQL Server Schema for T-Winkle Auth Phase 1
-- Use this script to initialize database structure manually.

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ROLES' and xtype='U')
CREATE TABLE ROLES (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='USERS' and xtype='U')
CREATE TABLE USERS (
    email VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_enabled BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='USER_ROLES' and xtype='U')
CREATE TABLE USER_ROLES (
    user_email VARCHAR(100) FOREIGN KEY REFERENCES USERS(email),
    role_id INT FOREIGN KEY REFERENCES ROLES(id),
    PRIMARY KEY(user_email, role_id)
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OTP_VERIFICATIONS' and xtype='U')
CREATE TABLE OTP_VERIFICATIONS (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_email VARCHAR(100) FOREIGN KEY REFERENCES USERS(email),
    hashed_otp VARCHAR(255) NOT NULL,
    expires_at DATETIME2 NOT NULL,
    attempts INT DEFAULT 0,
    type VARCHAR(20) NOT NULL,
    is_used BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE()
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PASSWORD_RESET_TOKENS' and xtype='U')
CREATE TABLE PASSWORD_RESET_TOKENS (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_email VARCHAR(100) FOREIGN KEY REFERENCES USERS(email),
    hashed_token VARCHAR(255) NOT NULL,
    expires_at DATETIME2 NOT NULL,
    is_used BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE()
);
