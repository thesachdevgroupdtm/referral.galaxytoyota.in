-- Create a test user for login testing
INSERT INTO users (
    name, 
    email, 
    phone, 
    password, 
    referral_code, 
    role, 
    email_verified, 
    is_active, 
    total_referrals, 
    total_earnings, 
    available_balance,
    created_at, 
    updated_at
) VALUES (
    'Test User',
    'test@example.com',
    '1234567890',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', -- password: 'password'
    'TES1234',
    'USER',
    TRUE,
    TRUE,
    0,
    0.00,
    0.00,
    NOW(),
    NOW()
);

-- Create admin user
INSERT INTO users (
    name, 
    email, 
    phone, 
    password, 
    referral_code, 
    role, 
    email_verified, 
    is_active, 
    total_referrals, 
    total_earnings, 
    available_balance,
    created_at, 
    updated_at
) VALUES (
    'Admin User',
    'admin@galaxytoyota.com',
    '9876543210',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', -- password: 'password'
    'ADM1234',
    'ADMIN',
    TRUE,
    TRUE,
    0,
    0.00,
    0.00,
    NOW(),
    NOW()
);
