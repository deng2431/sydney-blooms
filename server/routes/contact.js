const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/requireAuth');

// Public: get all contact info as { key: value }
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM contact_info ORDER BY key');
    const info = {};
    result.rows.forEach(r => (info[r.key] = r.value));
    res.json(info);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: bulk update all contact fields
router.put('/', requireAuth, async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    for (const [key, value] of Object.entries(req.body)) {
      await client.query(
        'INSERT INTO contact_info (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
        [key, value]
      );
    }
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

module.exports = router;
