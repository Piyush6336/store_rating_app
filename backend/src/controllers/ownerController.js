const pool = require('../db');

async function dashboard(req, res) {
  const storeResult = await pool.query('SELECT id, name FROM stores WHERE owner_id = $1', [req.user.id]);

  if (storeResult.rows.length === 0) {
    return res.json({
      store: null,
      averageRating: 0,
      users: []
    });
  }

  const store = storeResult.rows[0];

  const ratingResult = await pool.query(
    `SELECT COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS average_rating
     FROM ratings r
     WHERE r.store_id = $1`,
    [store.id]
  );

  const usersResult = await pool.query(
    `SELECT u.id, u.name, u.email, u.address, r.rating, r.updated_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.updated_at DESC`,
    [store.id]
  );

  return res.json({
    store,
    averageRating: ratingResult.rows[0].average_rating,
    users: usersResult.rows
  });
}

module.exports = {
  dashboard
};
