INSERT INTO users (name, email, password_hash, address, role)
VALUES
(
  'System Administrator User',
  'admin@example.com',
  '$2a$10$R9OmcAMXqAwQduXFVHskeu4d7fJ5ZgIYwFLM6CLVGmAaIiov03Tzq',
  'Admin office address',
  'admin'
),
(
  'Main Store Owner Account',
  'owner@example.com',
  '$2a$10$R9OmcAMXqAwQduXFVHskeu4d7fJ5ZgIYwFLM6CLVGmAaIiov03Tzq',
  'Owner address for demo store',
  'store_owner'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO stores (name, email, address, owner_id)
SELECT
  'Demo Super Market Store',
  'store@example.com',
  'Demo store address near city center',
  users.id
FROM users
WHERE users.email = 'owner@example.com'
ON CONFLICT (email) DO NOTHING;

-- Seed password for both users is: Password@123
