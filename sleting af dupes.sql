-- For at slettes dupes i tabel
SET SQL_SAFE_UPDATES = 0;

DELETE FROM metrics
WHERE ccpost_id IN (
    SELECT ccpost_id
    FROM (
        SELECT ccpost_id
        FROM metrics
        GROUP BY ccpost_id
        HAVING COUNT(*) > 1
    ) AS temp
);

Tjek

SELECT ccpost_id, COUNT(*) AS duplicate_count
FROM metrics
GROUP BY ccpost_id
HAVING COUNT(*) > 1;
