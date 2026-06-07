const bcrypt = require('bcryptjs');
const pool = require('../db');
const { isValidEmail, validateUserInput } = require('../utils/validation');

const userSortFields = {
  name: 'u.name',
  email: 'u.email',
  address: 'u.address',
  role: 'u.role'
};

const storeSortFields = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  rating: 'rating'
};

function getSort(sortBy, order, allowedFields) {
  const column = allowedFields[sortBy] || allowedFields.name;
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return `${column} ${direction}`;
}

async function dashboard(req, res) {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM stores) AS total_stores,
      (SELECT COUNT(*)::int FROM ratings) AS total_ratings
  `);

  return res.json(result.rows[0]);
}

async function createUser(req, res) {
  const allowedRoles = ['admin', 'user', 'store_owner'];
  const role = req.body.role || 'user';

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Role is not valid.' });
  }

  const errors = validateUserInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const { name, email, password, address } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role`,
      [name, email, passwordHash, address, role]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    throw error;
  }
}

async function listUsers(req, res) {
  const { name = '', email = '', address = '', role = '', sortBy = 'name', order = 'asc' } = req.query;
  const sort = getSort(sortBy, order, userSortFields);

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.address, u.role,
      COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS owner_rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE LOWER(u.name) LIKE LOWER($1)
       AND LOWER(u.email) LIKE LOWER($2)
       AND LOWER(u.address) LIKE LOWER($3)
       AND LOWER(u.role) LIKE LOWER($4)
     GROUP BY u.id
     ORDER BY ${sort}`,
    [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`]
  );

  return res.json(result.rows);
}

async function getUserDetails(req, res) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.address, u.role,
      COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS owner_rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json(result.rows[0]);
}

async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;

  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({ message: 'Store name must be between 20 and 60 characters.' });
  }

  if (!isValidEmail(email || '') || !address || address.length > 400) {
    return res.status(400).json({ message: 'Valid email and address are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id`,
      [name, email, address, ownerId || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Store email already exists.' });
    }

    throw error;
  }
}

async function listStoresForAdmin(req, res) {
  const { name = '', email = '', address = '', sortBy = 'name', order = 'asc' } = req.query;
  const sort = getSort(sortBy, order, storeSortFields);

  const result = await pool.query(
    `SELECT s.id, s.name, s.email, s.address,
      COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE LOWER(s.name) LIKE LOWER($1)
       AND LOWER(s.email) LIKE LOWER($2)
       AND LOWER(s.address) LIKE LOWER($3)
     GROUP BY s.id
     ORDER BY ${sort}`,
    [`%${name}%`, `%${email}%`, `%${address}%`]
  );

  return res.json(result.rows);
}

module.exports = {
  dashboard,
  createUser,
  listUsers,
  getUserDetails,
  createStore,
  listStoresForAdmin
};
