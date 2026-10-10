SET NOCOUNT ON;
DECLARE @dir nvarchar(4000)=CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultBackupPath'));
IF @dir IS NULL THROW 51200,'SQL Server default backup path is unavailable',1;
DECLARE @path nvarchar(4000)=@dir+N'\T_Winkle_pre_final_integration_'+REPLACE(CONVERT(varchar(19),GETDATE(),126),':','')+N'.bak';
BACKUP DATABASE T_Winkle TO DISK=@path WITH COPY_ONLY,CHECKSUM,INIT;
RESTORE VERIFYONLY FROM DISK=@path WITH CHECKSUM;
SELECT @path AS recovery_backup_path;
