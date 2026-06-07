const pool = require('../db');

const storeSortFields = {
  name: 's.name',
  address: 's.address',
  rating: 'overall_rating'
};

function getSort(sortBy, order) {
  const column = storeSortFields[sortBy] || storeSortFields.name;
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return `${column} ${direction}`;
}

async function listStores(req, res) {
  const { search = '', sortBy = 'name', order = 'asc' } = req.query;
  const sort = getSort(sortBy, order);

  const result = await pool.query(
    `SELECT s.id, s.name, s.address,
      COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS overall_rating,
      my_rating.rating AS user_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings my_rating
       ON my_rating.store_id = s.id AND my_rating.user_id = $1
     WHERE LOWER(s.name) LIKE LOWER($2)
        OR LOWER(s.address) LIKE LOWER($2)
     GROUP BY s.id, my_rating.rating
     ORDER BY ${sort}`,
    [req.user.id, `%${search}%`]
  );

  return res.json(result.rows);
}

async function submitRating(req, res) {
  const rating = Number(req.body.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
  }

  const storeExists = await pool.query('SELECT id FROM stores WHERE id = $1', [req.params.id]);

  if (storeExists.rows.length === 0) {
    return res.status(404).json({ message: 'Store not found.' });
  }

  const result = await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating = EXCLUDED.rating, updated_at = CURRENT_TIMESTAMP
     RETURNING id, user_id, store_id, rating`,
    [req.user.id, req.params.id, rating]
  );

  return res.json(result.rows[0]);
}

module.exports = {
  listStores,
  submitRating
};
