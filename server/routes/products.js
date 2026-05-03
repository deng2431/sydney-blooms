const router      = require('express').Router();
const path        = require('path');
const multer      = require('multer');
const db          = require('../db');
const requireAuth = require('../middleware/requireAuth');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'images/',
    filename: (req, file, cb) => cb(null, `product-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Images only'));
    cb(null, true);
  },
});

// Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const q = category
      ? 'SELECT * FROM products WHERE category=$1 ORDER BY sort_order, id'
      : 'SELECT * FROM products ORDER BY category, sort_order, id';
    const result = category ? await db.query(q, [category]) : await db.query(q);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: create
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { category, name, description, price, tag, sort_order, image_path } = req.body;
    const imgPath = req.file ? `/images/${req.file.filename}` : image_path;
    const result = await db.query(
      'INSERT INTO products (category,name,description,price,tag,image_path,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [category, name, description, price, tag, imgPath, sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: update
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { category, name, description, price, tag, sort_order, image_path } = req.body;
    const imgPath = req.file ? `/images/${req.file.filename}` : image_path;
    const result = await db.query(
      'UPDATE products SET category=$1,name=$2,description=$3,price=$4,tag=$5,image_path=$6,sort_order=$7 WHERE id=$8 RETURNING *',
      [category, name, description, price, tag, imgPath, sort_order || 0, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
