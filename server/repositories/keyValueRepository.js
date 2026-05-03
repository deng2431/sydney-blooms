const db = require('../db');

/**
 * Returns a repository for any key-value table (site_content, contact_info, etc.).
 * Callers never write SQL — all query logic lives here.
 */
function makeKeyValueRepository(tableName) {
  async function findAll() {
    const { rows } = await db.query(`SELECT key, value FROM ${tableName} ORDER BY key`);
    const result = {};
    rows.forEach(r => (result[r.key] = r.value));
    return result;
  }

  async function upsertMany(entries) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      for (const [key, value] of Object.entries(entries)) {
        await client.query(
          `INSERT INTO ${tableName} (key,value) VALUES ($1,$2)
           ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()`,
          [key, value]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  return { findAll, upsertMany };
}

module.exports = makeKeyValueRepository;
