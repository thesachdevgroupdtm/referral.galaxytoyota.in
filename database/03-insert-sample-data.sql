-- Use the database
USE galaxy_toyota_referral;

-- Insert default settings
INSERT INTO settings (id, value, description) VALUES
('referral_settings', JSON_OBJECT(
    'referral_reward_amount', 10000,
    'referee_discount_amount', 5000,
    'min_withdrawal_amount', 1000,
    'max_referrals_per_day', 10,
    'referral_code_length', 8
), 'Referral program configuration'),
('app_settings', JSON_OBJECT(
    'app_name', 'Galaxy Toyota Referral',
    'company_name', 'Galaxy Toyota',
    'support_email', 'support@galaxytoyota.com',
    'support_phone', '+91-9876543210',
    'address', 'Galaxy Toyota Showroom, Main Road, City'
), 'Application general settings'),
('notification_settings', JSON_OBJECT(
    'email_enabled', true,
    'sms_enabled', true,
    'push_enabled', true,
    'otp_expiry_minutes', 10
), 'Notification configuration');

-- Insert sample users (passwords are hashed for 'password')
INSERT INTO users (name, email, phone, password, role, referral_code, email_verified, is_active) VALUES
('Super Admin', 'superadmin@galaxytoyota.com', '+91-9999999999', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', 'SUPERADMIN', 'GALAXY-SUPER', TRUE, TRUE),
('Admin User', 'admin@galaxytoyota.com', '+91-9999999998', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', 'ADMIN', 'GALAXY-ADMIN', TRUE, TRUE),
('John Doe', 'john@example.com', '+91-9876543210', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', 'USER', 'JOHN2024', TRUE, TRUE),
('Jane Smith', 'jane@example.com', '+91-9876543211', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', 'USER', 'JANE2024', TRUE, TRUE),
('Mike Johnson', 'mike@example.com', '+91-9876543212', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', 'USER', 'MIKE2024', TRUE, TRUE),
('Sarah Wilson', 'sarah@example.com', '+91-9876543213', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGx9S8jyG', 'USER', 'SARAH2024', TRUE, TRUE);

-- Insert sample cars
INSERT INTO cars (name, model, year, price, discounted_price, description, category, fuel_type, transmission, seating_capacity, mileage, is_featured, is_available, stock_quantity) VALUES
('Toyota Camry', '2024', 2024, 4200000.00, 4000000.00, 'Premium sedan with advanced hybrid technology and luxurious features', 'SEDAN', 'HYBRID', 'AUTOMATIC', 5, 23.5, TRUE, TRUE, 15),
('Toyota Fortuner', '2024', 2024, 3500000.00, 3300000.00, 'Powerful SUV perfect for all terrains with 4WD capability', 'SUV', 'DIESEL', 'AUTOMATIC', 7, 14.2, TRUE, TRUE, 20),
('Toyota Innova Crysta', '2024', 2024, 2000000.00, 1900000.00, 'Spacious MPV ideal for families with premium comfort', 'MPV', 'DIESEL', 'MANUAL', 8, 15.6, TRUE, TRUE, 25),
('Toyota Corolla Altis', '2024', 2024, 1800000.00, 1700000.00, 'Elegant sedan with excellent fuel efficiency', 'SEDAN', 'PETROL', 'CVT', 5, 17.8, FALSE, TRUE, 18),
('Toyota Glanza', '2024', 2024, 700000.00, 650000.00, 'Compact hatchback with modern features', 'HATCHBACK', 'PETROL', 'MANUAL', 5, 22.3, FALSE, TRUE, 30),
('Toyota Urban Cruiser', '2024', 2024, 900000.00, 850000.00, 'Compact SUV for urban adventures', 'SUV', 'PETROL', 'MANUAL', 5, 18.5, FALSE, TRUE, 22);

-- Insert sample referrals
INSERT INTO referrals (referrer_id, referee_name, referee_email, referee_phone, car_id, status, reward_amount, discount_amount) VALUES
(3, 'Robert Brown', 'robert@example.com', '+91-9876543220', 1, 'COMPLETED', 10000.00, 5000.00),
(3, 'Lisa Davis', 'lisa@example.com', '+91-9876543221', 2, 'INTERESTED', 0.00, 5000.00),
(4, 'Tom Wilson', 'tom@example.com', '+91-9876543222', 3, 'PENDING', 0.00, 5000.00),
(4, 'Emma Johnson', 'emma@example.com', '+91-9876543223', 1, 'CONTACTED', 0.00, 5000.00),
(5, 'David Lee', 'david@example.com', '+91-9876543224', 2, 'TEST_DRIVE', 0.00, 5000.00),
(5, 'Anna Taylor', 'anna@example.com', '+91-9876543225', 4, 'COMPLETED', 10000.00, 5000.00),
(6, 'Chris Martin', 'chris@example.com', '+91-9876543226', 5, 'NEGOTIATION', 0.00, 5000.00),
(6, 'Sophie Clark', 'sophie@example.com', '+91-9876543227', 6, 'VISIT_SCHEDULED', 0.00, 5000.00);

-- Update user referral counts and earnings
UPDATE users SET 
    total_referrals = (SELECT COUNT(*) FROM referrals WHERE referrer_id = users.id),
    total_earnings = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'COMPLETED'),
    available_balance = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'COMPLETED')
WHERE role = 'USER';

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(3, 'Referral Completed!', 'Your referral for Robert Brown has been completed. You earned ₹10,000!', 'SUCCESS'),
(3, 'New Referral Interest', 'Lisa Davis is interested in the Toyota Fortuner you referred.', 'INFO'),
(4, 'Referral Update', 'Emma Johnson has been contacted regarding your referral.', 'INFO'),
(5, 'Congratulations!', 'Your referral for Anna Taylor is completed. Reward of ₹10,000 credited!', 'SUCCESS'),
(6, 'Referral Progress', 'Sophie Clark has scheduled a visit for the car you referred.', 'INFO');

-- Insert sample rewards
INSERT INTO rewards (user_id, referral_id, type, amount, description, status) VALUES
(3, 1, 'REFERRAL_BONUS', 10000.00, 'Referral bonus for Robert Brown - Toyota Camry', 'PAID'),
(5, 6, 'REFERRAL_BONUS', 10000.00, 'Referral bonus for Anna Taylor - Toyota Corolla Altis', 'PAID');

SELECT 'Sample data inserted successfully!' as message;
SELECT 'Login Credentials:' as info;
SELECT 'Super Admin: superadmin@galaxytoyota.com / password' as credentials;
SELECT 'Admin: admin@galaxytoyota.com / password' as credentials;
SELECT 'User: john@example.com / password' as credentials;
