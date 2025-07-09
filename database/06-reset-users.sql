-- Clean up existing test users
DELETE FROM notifications WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('test@example.com', 'admin@galaxytoyota.com', 'superadmin@galaxytoyota.com')
);

DELETE FROM referrals WHERE referrer_id IN (
  SELECT id FROM users WHERE email IN ('test@example.com', 'admin@galaxytoyota.com', 'superadmin@galaxytoyota.com')
);

DELETE FROM users WHERE email IN ('test@example.com', 'admin@galaxytoyota.com', 'superadmin@galaxytoyota.com');

-- Note: Run the Node.js script after this to create users with proper password hashing
