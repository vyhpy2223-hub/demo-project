CREATE FUNCTION dbo.get_level (@score INT)
RETURNS VARCHAR(20)
AS
BEGIN
    DECLARE @level VARCHAR(20);

    IF @score < 40
        SET @level = 'Beginner';
    ELSE IF @score < 70
        SET @level = 'Intermediate';
    ELSE
        SET @level = 'Advanced';

    RETURN @level;
END;
GO

