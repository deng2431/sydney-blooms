const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/requireAuth');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public: submit contact form
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(422).json({ error: 'Name, email and message are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(422).json({ error: 'Please enter a valid email address.' });
  }
  try {
    await db.query(
      'INSERT INTO messages (name,email,phone,subject,message) VALUES ($1,$2,$3,$4,$5)',
      [name.trim(), email.trim(), phone?.trim() || null, subject?.trim() || null, message.trim()]
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Admin: unread count — must be before /:id routes
router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) AS count FROM messages WHERE read = false");
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Admin: list all messages
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Admin: mark all as read
router.put('/read-all', requireAuth, async (req, res) => {
  try {
    await db.query('UPDATE messages SET read = true');
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Admin: mark one as read
router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    await db.query('UPDATE messages SET read = true WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Admin: delete message
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
