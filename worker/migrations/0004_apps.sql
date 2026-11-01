-- HTML pages Claude made, gathered from every chat, and what the person
-- did inside them. A deleted page stays as a tombstone so saving its chat
-- doesn't bring it back.
CREATE TABLE IF NOT EXISTS apps (
  user TEXT NOT NULL,
  id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  html TEXT NOT NULL DEFAULT '',
  convo_id TEXT,
  project_id TEXT,
  state TEXT,
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user, id)
);
CREATE INDEX IF NOT EXISTS apps_by_user ON apps (user, updated_at DESC);
