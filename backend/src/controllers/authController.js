const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { validateUserInput, isValidPassword } = require('../utils/validation');

function createToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

async function signup(req, res) {
  const errors = validateUserInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const { name, email, password, address } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, name, email, address, role`,
      [name, email, passwordHash, address]
    );

    const user = result.rows[0];
    return res.status(201).json({ user, token: createToken(user) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    throw error;
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role
  };

  return res.json({ user: safeUser, token: createToken(user) });
}

async function updatePassword(req, res) {
  const { password } = req.body;

  if (!isValidPassword(password || '')) {
    return res.status(400).json({
      message: 'Password must be 8-16 characters with one uppercase letter and one special character.'
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, req.user.id]);

  return res.json({ message: 'Password updated successfully.' });
}

module.exports = {
  signup,
  login,
  updatePassword
};
