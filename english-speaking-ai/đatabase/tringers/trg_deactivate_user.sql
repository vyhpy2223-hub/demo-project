CREATE TRIGGER trg_deactivate_user
ON users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE s
    SET s.end_date = GETDATE()
    FROM subscriptions s
    INNER JOIN inserted i ON s.user_id = i.user_id
    WHERE i.status = 'INACTIVE';
END;
GO

