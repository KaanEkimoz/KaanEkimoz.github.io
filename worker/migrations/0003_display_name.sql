-- The name each person wants to be called by (greeting + system prompt).
ALTER TABLE settings ADD COLUMN display_name TEXT NOT NULL DEFAULT '';
