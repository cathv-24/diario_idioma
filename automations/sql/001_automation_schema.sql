-- Ejecutar una vez en Neon SQL Editor. Es independiente de las tablas JPA de la API.
CREATE SCHEMA IF NOT EXISTS diary_automation;
CREATE TABLE IF NOT EXISTS diary_automation.entry_events (
    event_id uuid PRIMARY KEY,
    occurred_at timestamptz NOT NULL,
    entry_id bigint NOT NULL CHECK (entry_id > 0),
    entry_date date NOT NULL,
    level varchar(2) NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
    score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
    correction_count integer NOT NULL CHECK (correction_count >= 0),
    word_count integer NOT NULL CHECK (word_count > 0),
    received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS entry_events_occurred_at_idx
    ON diary_automation.entry_events (occurred_at);
CREATE TABLE IF NOT EXISTS diary_automation.weekly_reports (
    week_start date PRIMARY KEY,
    entry_count bigint NOT NULL,
    total_words bigint NOT NULL,
    total_corrections bigint NOT NULL,
    average_rule_score numeric(5,2),
    generated_at timestamptz NOT NULL DEFAULT now()
);
-- No guarda el texto del diario. entry_id sigue siendo un identificador pseudonimo:
-- restringir acceso a estas tablas. Los agregados son globales, no por persona.
