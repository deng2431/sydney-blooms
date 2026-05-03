const router      = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const makeStore   = require('../repositories/keyValueRepository');

const store = makeStore('contact_info');

router.get('/', async (req, res) => {
  try   { res.json(await store.findAll()); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.put('/', requireAuth, async (req, res) => {
  try   { await store.upsertMany(req.body); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

module.exports = router;
