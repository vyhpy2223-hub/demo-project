CREATE VIEW vw_user_progress AS
SELECT 
    u.user_id,
    u.email,
    COUNT(s.session_id) AS total_sessions,
    AVG(a.overall_score) AS avg_score
FROM users u
LEFT JOIN speaking_sessions s ON u.user_id = s.user_id
LEFT JOIN ai_feedbacks a ON s.session_id = a.session_id
GROUP BY u.user_id;

