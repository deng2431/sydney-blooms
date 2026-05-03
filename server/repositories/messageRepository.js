const db = require('../db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }) {
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    const err = new Error('Name, email and message are required.');
    err.status = 422;
    throw err;
  }
  if (!EMAIL_RE.test(email)) {
    const err = new Error('Please enter a valid email address.');
    err.status = 422;
    throw err;
  }
}

async function create({ name, email, phone, subject, message }) {
  validate({ name, email, message });
  await db.query(
    'INSERT INTO messages (name,email,phone,subject,message) VALUES ($1,$2,$3,$4,$5)',
    [name.trim(), email.trim(), phone?.trim() || null, subject?.trim() || null, message.trim()]
  );
}

async function findAll() {
  const { rows } = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
}

async function unreadCount() {
  const { rows } = await db.query('SELECT COUNT(*) AS count FROM messages WHERE read = false');
  return parseInt(rows[0].count, 10);
}

async function markRead(id) {
  await db.query('UPDATE messages SET read = true WHERE id = $1', [id]);
}

async function markAllRead() {
  await db.query('UPDATE messages SET read = true');
}

async function remove(id) {
  await db.query('DELETE FROM messages WHERE id = $1', [id]);
}

module.exports = { create, findAll, unreadCount, markRead, markAllRead, remove };
