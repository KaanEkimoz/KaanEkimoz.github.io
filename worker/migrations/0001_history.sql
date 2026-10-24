-- Per-user chat history and settings for the /chat page.
CREATE TABLE IF NOT EXISTS conversations (
  user TEXT NOT NULL,
  id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (user, id)
);
CREATE INDEX IF NOT EXISTS conversations_by_user ON conversations (user, updated_at DESC);

CREATE TABLE IF NOT EXISTS settings (
  user TEXT PRIMARY KEY,
  instructions TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);
