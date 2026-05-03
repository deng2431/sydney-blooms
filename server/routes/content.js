const router      = require('express').Router();
const db          = require('../db');
const requireAuth = require('../middleware/requireAuth');

// Public: get all site content as { key: value }
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM site_content ORDER BY key');
    const content = {};
    result.rows.forEach(r => (content[r.key] = r.value));
    res.json(content);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: upsert a single key
router.put('/:key', requireAuth, async (req, res) => {
  try {
    const { value } = req.body;
    await db.query(
      'INSERT INTO site_content (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
      [req.params.key, value]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: bulk update multiple keys at once
router.put('/', requireAuth, async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    for (const [key, value] of Object.entries(req.body)) {
      await client.query(
        'INSERT INTO site_content (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
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
