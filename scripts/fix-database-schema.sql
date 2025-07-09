-- First, let's check and fix the referrals table structure
DESCRIBE referrals;

-- Drop and recreate referrals table with correct structure
DROP TABLE IF EXISTS referrals;
CREATE TABLE referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id INT NOT NULL,
    referee_name VARCHAR(255) NOT NULL,
    referee_email VARCHAR(255) NOT NULL,
    referee_phone VARCHAR(20),
    car_id INT,
    referral_code VARCHAR(50),
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    reward_amount DECIMAL(10, 2) DEFAULT 10000.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
);

-- Fix cars table structure
DROP TABLE IF EXISTS cars;
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) DEFAULT 'Toyota',
    model VARCHAR(100),
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    description TEXT,
    fuel_type VARCHAR(50) DEFAULT 'Petrol',
    transmission VARCHAR(50) DEFAULT 'Automatic',
    year INT DEFAULT 2024,
    features TEXT,
    image_url VARCHAR(500) DEFAULT '/placeholder.svg?height=300&width=400',
    referral_reward DECIMAL(10, 2) DEFAULT 10000.00,
    friend_discount DECIMAL(10, 2) DEFAULT 5000.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Toyota cars data
INSERT INTO cars (name, brand, model, price, original_price, description, fuel_type, transmission, year, features, image_url, referral_reward, friend_discount, is_active, is_popular, discount_amount) VALUES
('Toyota Camry 2024', 'Toyota', 'Camry', 3200000, 3500000, 'The 2024 Toyota Camry combines efficiency, style, and reliability in one exceptional package. With its hybrid powertrain option and advanced safety features, it is the perfect choice for modern drivers.', 'Hybrid', 'CVT Automatic', 2024, 'Hybrid Available, 4 Doors, Automatic, Toyota Safety Sense 2.0', '/placeholder.svg?height=300&width=400', 10000, 5000, TRUE, TRUE, 300000),
('Toyota Corolla 2024', 'Toyota', 'Corolla', 1800000, 2000000, 'The world best-selling car gets even better. The 2024 Corolla offers exceptional fuel economy, advanced safety features, and a comfortable ride.', 'Petrol', 'CVT Automatic', 2024, 'Fuel Efficient, Compact, Automatic, Safety Features', '/placeholder.svg?height=300&width=400', 8000, 4000, TRUE, TRUE, 200000),
('Toyota RAV4 2024', 'Toyota', 'RAV4', 4500000, 4800000, 'Adventure awaits with the 2024 RAV4. This compact SUV offers all-wheel drive capability, spacious interior, and Toyota legendary reliability.', 'Petrol', 'Automatic', 2024, 'AWD, SUV, Spacious, Off-road Capable', '/placeholder.svg?height=300&width=400', 12000, 6000, TRUE, FALSE, 300000),
('Toyota Prius 2024', 'Toyota', 'Prius', 2800000, 3100000, 'The pioneer of hybrid technology continues to lead the way. The 2024 Prius offers outstanding fuel efficiency and eco-friendly driving.', 'Hybrid', 'CVT Automatic', 2024, 'Hybrid, Eco-friendly, Fuel Efficient, Advanced Tech', '/placeholder.svg?height=300&width=400', 9000, 4500, TRUE, FALSE, 300000),
('Toyota Highlander 2024', 'Toyota', 'Highlander', 5200000, 5500000, 'Perfect for families, the 2024 Highlander offers three rows of seating, advanced safety features, and impressive cargo space.', 'Petrol', 'Automatic', 2024, '3-Row Seating, Family SUV, Spacious, Safety Features', '/placeholder.svg?height=300&width=400', 15000, 7500, TRUE, FALSE, 300000),
('Toyota Fortuner 2024', 'Toyota', 'Fortuner', 3800000, 4200000, 'Built for adventure and daily driving alike. The Fortuner combines rugged capability with refined comfort.', 'Diesel', 'Automatic', 2024, '4WD, SUV, Rugged, Premium Interior', '/placeholder.svg?height=300&width=400', 11000, 5500, TRUE, TRUE, 400000);

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Update notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Insert sample referrals for testing
INSERT INTO referrals (referrer_id, referee_name, referee_email, referee_phone, car_id, referral_code, status, reward_amount, notes) VALUES
((SELECT id FROM users WHERE email = 'harsh@example.com' LIMIT 1), 'Atul Kumar', 'atul@example.com', '9876543210', 1, 'HAR7878', 'pending', 10000, 'Referred Toyota Camry'),
((SELECT id FROM users WHERE email = 'harsh@example.com' LIMIT 1), 'Priya Sharma', 'priya@example.com', '9876543211', 2, 'HAR7878', 'completed', 8000, 'Referred Toyota Corolla');

-- Update user statistics
UPDATE users SET 
    total_referrals = (SELECT COUNT(*) FROM referrals WHERE referrer_id = users.id),
    total_earnings = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'completed'),
    available_balance = (SELECT COALESCE(SUM(reward_amount), 0) FROM referrals WHERE referrer_id = users.id AND status = 'completed')
WHERE role != 'ADMIN' AND role != 'SUPERADMIN';

-- Create welcome notifications
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
WHERE u.role != 'ADMIN' AND u.role != 'SUPERADMIN';

SELECT 'Database schema fixed successfully!' as message;
