const db = require('../db');

const ALLOWED_CATEGORIES = ['bouquet', 'wedding', 'seasonal'];

async function findAll({ category } = {}) {
  if (category) {
    if (!ALLOWED_CATEGORIES.includes(category)) {
      const err = new Error('Invalid category');
      err.status = 400;
      throw err;
    }
    const { rows } = await db.query(
      'SELECT * FROM products WHERE category=$1 ORDER BY sort_order, id',
      [category]
    );
    return rows;
  }
  const { rows } = await db.query('SELECT * FROM products ORDER BY category, sort_order, id');
  return rows;
}

async function create({ category, name, description, price, tag, image_path, sort_order }) {
  const { rows } = await db.query(
    'INSERT INTO products (category,name,description,price,tag,image_path,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [category, name, description, price, tag, image_path, sort_order || 0]
  );
  return rows[0];
}

async function update(id, { category, name, description, price, tag, image_path, sort_order }) {
  const { rows } = await db.query(
    'UPDATE products SET category=$1,name=$2,description=$3,price=$4,tag=$5,image_path=$6,sort_order=$7 WHERE id=$8 RETURNING *',
    [category, name, description, price, tag, image_path, sort_order || 0, id]
  );
  return rows[0] || null;
}

async function remove(id) {
  await db.query('DELETE FROM products WHERE id=$1', [id]);
}

module.exports = { findAll, create, update, remove, ALLOWED_CATEGORIES };
