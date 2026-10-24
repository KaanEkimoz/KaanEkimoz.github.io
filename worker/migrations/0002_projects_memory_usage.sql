-- Projects, Claude's memory, files Claude made, and monthly usage.
ALTER TABLE conversations ADD COLUMN project_id TEXT;
ALTER TABLE settings ADD COLUMN memory_enabled INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS projects (
  user TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  files TEXT NOT NULL DEFAULT '[]',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user, id)
);

CREATE TABLE IF NOT EXISTS memories (
  user TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user, path)
);

CREATE TABLE IF NOT EXISTS outputs (
  user TEXT NOT NULL,
  file_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user, file_id)
);

CREATE TABLE IF NOT EXISTS usage (
  user TEXT NOT NULL,
  month TEXT NOT NULL,
  cost_micros INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  requests INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user, month)
);
