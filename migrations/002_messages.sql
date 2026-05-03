-- Contact form enquiries

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  phone      VARCHAR(50),
  subject    VARCHAR(200),
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
