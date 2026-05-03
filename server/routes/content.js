const router      = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const makeStore   = require('../repositories/keyValueRepository');

const store = makeStore('site_content');

router.get('/', async (req, res) => {
  try   { res.json(await store.findAll()); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.put('/:key', requireAuth, async (req, res) => {
  try   { await store.upsertMany({ [req.params.key]: req.body.value }); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.put('/', requireAuth, async (req, res) => {
  try   { await store.upsertMany(req.body); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

module.exports = router;
