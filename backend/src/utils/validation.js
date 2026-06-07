function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password);
}

function validateUserInput(data, options = {}) {
  const errors = [];
  const name = data.name || '';
  const address = data.address || '';
  const password = data.password || '';
  const email = data.email || '';

  if (options.requireName !== false && (name.length < 20 || name.length > 60)) {
    errors.push('Name must be between 20 and 60 characters.');
  }

  if (!isValidEmail(email)) {
    errors.push('Email is not valid.');
  }

  if (address.length > 400 || address.length === 0) {
    errors.push('Address is required and cannot be more than 400 characters.');
  }

  if (options.requirePassword !== false && !isValidPassword(password)) {
    errors.push('Password must be 8-16 characters with one uppercase letter and one special character.');
  }

  return errors;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  validateUserInput
};
