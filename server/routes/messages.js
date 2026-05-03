const router      = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const messages    = require('../repositories/messageRepository');

router.post('/', async (req, res) => {
  try {
    await messages.create(req.body);
    res.json({ ok: true });
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: status === 422 ? e.message : 'Something went wrong. Please try again.' });
  }
});

router.get('/unread-count', requireAuth, async (req, res) => {
  try   { res.json({ count: await messages.unreadCount() }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.get('/', requireAuth, async (req, res) => {
  try   { res.json(await messages.findAll()); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.put('/read-all', requireAuth, async (req, res) => {
  try   { await messages.markAllRead(); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.put('/:id/read', requireAuth, async (req, res) => {
  try   { await messages.markRead(req.params.id); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try   { await messages.remove(req.params.id); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

module.exports = router;
