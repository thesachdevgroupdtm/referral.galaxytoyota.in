-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Update notifications table to include is_read column
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Insert sample cars data
INSERT IGNORE INTO cars (name, brand, model, price, original_price, description, fuel_type, transmission, year, features, image_url, referral_reward, is_active, is_popular, discount_amount) VALUES
('Toyota Camry 2024', 'Toyota', 'Camry', 3200000, 3500000, 'The 2024 Toyota Camry combines efficiency, style, and reliability in one exceptional package. With its hybrid powertrain option and advanced safety features, it\'s the perfect choice for modern drivers.', 'Hybrid', 'CVT Automatic', 2024, 'Hybrid Available, 4 Doors, Automatic, Toyota Safety Sense 2.0', '/placeholder.svg?height=300&width=400', 10000, TRUE, TRUE, 300000),
('Toyota Corolla 2024', 'Toyota', 'Corolla', 1800000, 2000000, 'The world\'s best-selling car gets even better. The 2024 Corolla offers exceptional fuel economy, advanced safety features, and a comfortable ride.', 'Petrol', 'CVT Automatic', 2024, 'Fuel Efficient, Compact, Automatic, Safety Features', '/placeholder.svg?height=300&width=400', 8000, TRUE, TRUE, 200000),
('Toyota RAV4 2024', 'Toyota', 'RAV4', 4500000, 4800000, 'Adventure awaits with the 2024 RAV4. This compact SUV offers all-wheel drive capability, spacious interior, and Toyota\'s legendary reliability.', 'Petrol', 'Automatic', 2024, 'AWD, SUV, Spacious, Off-road Capable', '/placeholder.svg?height=300&width=400', 12000, TRUE, FALSE, 300000),
('Toyota Prius 2024', 'Toyota', 'Prius', 2800000, 3100000, 'The pioneer of hybrid technology continues to lead the way. The 2024 Prius offers outstanding fuel efficiency and eco-friendly driving.', 'Hybrid', 'CVT Automatic', 2024, 'Hybrid, Eco-friendly, Fuel Efficient, Advanced Tech', '/placeholder.svg?height=300&width=400', 9000, TRUE, FALSE, 300000),
('Toyota Highlander 2024', 'Toyota', 'Highlander', 5200000, 5500000, 'Perfect for families, the 2024 Highlander offers three rows of seating, advanced safety features, and impressive cargo space.', 'Petrol', 'Automatic', 2024, '3-Row Seating, Family SUV, Spacious, Safety Features', '/placeholder.svg?height=300&width=400', 15000, TRUE, FALSE, 300000),
('Toyota Fortuner 2024', 'Toyota', 'Fortuner', 3800000, 4200000, 'Built for adventure and daily driving alike. The Fortuner combines rugged capability with refined comfort.', 'Diesel', 'Automatic', 2024, '4WD, SUV, Rugged, Premium Interior', '/placeholder.svg?height=300&width=400', 11000, TRUE, TRUE, 400000);

-- Update users table to ensure proper referral tracking
UPDATE users SET total_referrals = (
    SELECT COUNT(*) FROM referrals WHERE referrer_id = users.id
) WHERE role != 'ADMIN' AND role != 'SUPERADMIN';

UPDATE users SET total_earnings = (
    SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'completed'
) WHERE role != 'ADMIN' AND role != 'SUPERADMIN';

UPDATE users SET available_balance = total_earnings WHERE role != 'ADMIN' AND role != 'SUPERADMIN';

-- Create some sample notifications for testing
INSERT IGNORE INTO notifications (user_id, title, message, type, is_read, created_at, updated_at) 
SELECT 
    u.id,
    'Welcome to Galaxy Toyota!',
    'Thank you for joining our referral program. Start referring friends to earn rewards!',
    'welcome',
    FALSE,
    NOW(),
    NOW()
FROM users u 
WHERE u.role != 'ADMIN' AND u.role != 'SUPERADMIN'
AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.user_id = u.id AND n.type = 'welcome');

SELECT 'Database updated successfully!' as message;
