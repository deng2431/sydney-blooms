const router      = require('express').Router();
const path        = require('path');
const multer      = require('multer');
const requireAuth = require('../middleware/requireAuth');
const products    = require('../repositories/productRepository');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'images/',
    filename: (req, file, cb) => cb(null, `product-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const okMime = file.mimetype.startsWith('image/');
    const okExt  = /\.(jpe?g|png|webp|gif)$/i.test(file.originalname);
    okMime && okExt ? cb(null, true) : cb(new Error('Images only (jpeg/png/webp/gif)'));
  },
});

router.get('/', async (req, res) => {
  try {
    res.json(await products.findAll({ category: req.query.category }));
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: status === 400 ? e.message : 'Something went wrong' });
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const imgPath = req.file ? `/images/${req.file.filename}` : req.body.image_path;
    res.json(await products.create({ ...req.body, image_path: imgPath }));
  } catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const imgPath = req.file ? `/images/${req.file.filename}` : req.body.image_path;
    const row = await products.update(req.params.id, { ...req.body, image_path: imgPath });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch { res.status(500).json({ error: 'Something went wrong' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try   { await products.remove(req.params.id); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Something went wrong' }); }
});

module.exports = router;
