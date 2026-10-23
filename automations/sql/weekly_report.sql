-- Ultima semana completa: lunes a lunes, zona America/Lima.
WITH bounds AS (
 SELECT date_trunc('week', now() AT TIME ZONE 'America/Lima')::date AS this_monday
), metrics AS (
 SELECT (b.this_monday - 7)::date AS week_start,
        count(e.event_id) AS entry_count,
        coalesce(sum(e.word_count), 0) AS total_words,
        coalesce(sum(e.correction_count), 0) AS total_corrections,
        round(avg(e.score)::numeric, 2) AS average_rule_score
 FROM bounds b LEFT JOIN diary_automation.entry_events e
   ON e.occurred_at >= ((b.this_monday - 7)::timestamp AT TIME ZONE 'America/Lima')
  AND e.occurred_at < (b.this_monday::timestamp AT TIME ZONE 'America/Lima')
 GROUP BY b.this_monday
)
INSERT INTO diary_automation.weekly_reports
 (week_start, entry_count, total_words, total_corrections, average_rule_score)
SELECT * FROM metrics
ON CONFLICT (week_start) DO UPDATE SET
 entry_count = excluded.entry_count, total_words = excluded.total_words,
 total_corrections = excluded.total_corrections,
 average_rule_score = excluded.average_rule_score, generated_at = now()
RETURNING *;
