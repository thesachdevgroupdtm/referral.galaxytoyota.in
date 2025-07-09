-- Galaxy Toyota Referral Database Setup
-- Run this script in your MySQL database

-- Create database
CREATE DATABASE IF NOT EXISTS galaxy_toyota_referral;
USE galaxy_toyota_referral;

-- Users table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    referral_code VARCHAR(20) UNIQUE NULL,
    referred_by BIGINT UNSIGNED NULL,
    role ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
    total_referrals INT DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    points INT DEFAULT 0,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Cars table
CREATE TABLE cars (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) DEFAULT 'Toyota',
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2) NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    image VARCHAR(500) NULL,
    images JSON NULL,
    description TEXT NULL,
    features JSON NULL,
    specifications JSON NULL,
    fuel_type VARCHAR(50) NULL,
    transmission VARCHAR(50) NULL,
    mpg VARCHAR(50) NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    referral_reward DECIMAL(10,2) DEFAULT 10000.00,
    friend_discount DECIMAL(10,2) DEFAULT 5000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Referrals table
CREATE TABLE referrals (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    referrer_id BIGINT UNSIGNED NOT NULL,
    referee_id BIGINT UNSIGNED NULL,
    referee_name VARCHAR(255) NOT NULL,
    referee_email VARCHAR(255) NOT NULL,
    referee_phone VARCHAR(20) NULL,
    car_id BIGINT UNSIGNED NULL,
    referral_code VARCHAR(20) NOT NULL,
    status ENUM('pending', 'registered', 'purchased', 'completed', 'cancelled') DEFAULT 'pending',
    reward_amount DECIMAL(10,2) DEFAULT 0.00,
    points_earned INT DEFAULT 0,
    commission_paid BOOLEAN DEFAULT FALSE,
    purchase_date TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referee_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('referral_update', 'reward_earned', 'new_car', 'system', 'promotion') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rewards table
CREATE TABLE rewards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    referral_id BIGINT UNSIGNED NULL,
    type ENUM('cash', 'points', 'voucher', 'discount') DEFAULT 'cash',
    amount DECIMAL(10,2) NOT NULL,
    points INT DEFAULT 0,
    description TEXT NULL,
    status ENUM('pending', 'approved', 'paid', 'cancelled') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE SET NULL
);

-- Sessions table for authentication
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
-- Super Admin
INSERT INTO users (name, email, password, role, referral_code, phone) VALUES
('Super Admin', 'superadmin@galaxytoyota.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'SUPER001', '+91-9999999999');

-- Regular Admin
INSERT INTO users (name, email, password, role, referral_code, phone) VALUES
('Admin User', 'admin@galaxytoyota.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'ADMIN001', '+91-9876543210');

-- Sample Users
INSERT INTO users (name, email, password, referral_code, phone, total_referrals, total_earnings) VALUES
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'JOHN001', '+91-9876543211', 3, 30000.00),
('Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'JANE001', '+91-9876543212', 1, 10000.00),
('Mike Johnson', 'mike@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'MIKE001', '+91-9876543213', 0, 0.00);

-- Sample Cars
INSERT INTO cars (name, brand, model, year, price, original_price, discount_amount, description, features, specifications, fuel_type, transmission, mpg, is_popular, referral_reward, friend_discount) VALUES
('Toyota Camry 2024', 'Toyota', 'Camry', 2024, 3200000.00, 3500000.00, 300000.00, 'Premium sedan with advanced safety features and hybrid technology', 
'["Hybrid Engine", "Advanced Safety", "Premium Interior", "Touchscreen Display", "Automatic Transmission"]',
'{"engine": "2.5L 4-Cylinder Hybrid", "transmission": "CVT Automatic", "drivetrain": "Front-Wheel Drive", "seating": "5 Passengers", "cargo": "15.1 cubic feet", "safety": "5-Star Overall Rating"}',
'Hybrid', 'CVT Automatic', '32 city / 41 hwy', TRUE, 10000.00, 5000.00),

('Toyota RAV4 2024', 'Toyota', 'RAV4', 2024, 3850000.00, 4200000.00, 350000.00, 'Versatile SUV perfect for city and adventure driving',
'["AWD Available", "5 Doors", "CVT", "Safety Sense 2.0", "Cargo Space"]',
'{"engine": "2.5L 4-Cylinder", "transmission": "CVT", "drivetrain": "AWD Available", "seating": "5 Passengers", "cargo": "37.5 cubic feet", "safety": "5-Star Overall Rating"}',
'Gasoline', 'CVT', '27 city / 35 hwy', TRUE, 12000.00, 6000.00),

('Toyota Prius 2024', 'Toyota', 'Prius', 2024, 2820000.00, 3000000.00, 180000.00, 'Most fuel-efficient hybrid vehicle with cutting-edge technology',
'["Hybrid", "5 Doors", "CVT", "Eco Mode", "Solar Roof"]',
'{"engine": "1.8L Hybrid", "transmission": "CVT", "drivetrain": "Front-Wheel Drive", "seating": "5 Passengers", "cargo": "24.6 cubic feet", "safety": "5-Star Overall Rating"}',
'Hybrid', 'CVT', '57 city / 56 hwy', TRUE, 8000.00, 4000.00),

('Toyota Highlander 2024', 'Toyota', 'Highlander', 2024, 4520000.00, 4800000.00, 280000.00, 'Spacious 3-row SUV perfect for large families',
'["3-Row Seating", "8 Seats", "AWD", "V6 Engine", "Towing Capacity"]',
'{"engine": "3.5L V6", "transmission": "8-Speed Automatic", "drivetrain": "AWD", "seating": "8 Passengers", "cargo": "16 cubic feet", "safety": "5-Star Overall Rating"}',
'Gasoline', '8-Speed Automatic', '21 city / 29 hwy', FALSE, 15000.00, 7500.00),

('Toyota Corolla 2024', 'Toyota', 'Corolla', 2024, 1850000.00, 2000000.00, 150000.00, 'Reliable and efficient compact sedan for everyday driving',
'["Compact", "4 Doors", "CVT", "Toyota Safety Sense", "Fuel Efficient"]',
'{"engine": "2.0L 4-Cylinder", "transmission": "CVT", "drivetrain": "Front-Wheel Drive", "seating": "5 Passengers", "cargo": "13 cubic feet", "safety": "5-Star Overall Rating"}',
'Gasoline', 'CVT', '35 city / 42 hwy', TRUE, 7000.00, 3500.00),

('Toyota Land Cruiser 2024', 'Toyota', 'Land Cruiser', 2024, 8500000.00, 9000000.00, 500000.00, 'Premium full-size SUV with unmatched off-road capability',
'["Premium SUV", "7 Seats", "4WD", "Off-Road Package", "Luxury Interior"]',
'{"engine": "3.5L Twin-Turbo V6", "transmission": "10-Speed Automatic", "drivetrain": "4WD", "seating": "7 Passengers", "cargo": "33.5 cubic feet", "safety": "5-Star Overall Rating"}',
'Gasoline', '10-Speed Automatic', '18 city / 24 hwy', FALSE, 25000.00, 12500.00);

-- Sample Referrals
INSERT INTO referrals (referrer_id, referee_name, referee_email, referee_phone, car_id, referral_code, status, reward_amount, points_earned, commission_paid) VALUES
(3, 'Sarah Robinson', 'sarah@example.com', '+91-9876543214', 1, 'JOHN001', 'completed', 10000.00, 100, TRUE),
(3, 'Michael Brown', 'michael@example.com', '+91-9876543215', 2, 'JOHN001', 'purchased', 12000.00, 120, FALSE),
(3, 'Amanda Wilson', 'amanda@example.com', '+91-9876543216', 3, 'JOHN001', 'pending', 0.00, 0, FALSE),
(4, 'David Lee', 'david@example.com', '+91-9876543217', 1, 'JANE001', 'completed', 10000.00, 100, TRUE);

-- Sample Notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(3, 'Referral Completed!', 'Your referral Sarah Robinson has completed their purchase. You earned ₹10,000!', 'reward_earned'),
(3, 'New Referral Registered', 'Michael Brown has registered using your referral code.', 'referral_update'),
(4, 'Referral Completed!', 'Your referral David Lee has completed their purchase. You earned ₹10,000!', 'reward_earned'),
(3, 'New Car Added', 'Check out the new Toyota Land Cruiser 2024 now available for referral!', 'new_car');

-- Sample Rewards
INSERT INTO rewards (user_id, referral_id, type, amount, points, description, status, paid_at) VALUES
(3, 1, 'cash', 10000.00, 100, 'Referral reward for Sarah Robinson purchase', 'paid', NOW()),
(4, 4, 'cash', 10000.00, 100, 'Referral reward for David Lee purchase', 'paid', NOW()),
(3, 2, 'cash', 12000.00, 120, 'Referral reward for Michael Brown purchase', 'approved', NULL);

-- Update user totals based on rewards
UPDATE users SET 
    total_referrals = (SELECT COUNT(*) FROM referrals WHERE referrer_id = users.id AND status IN ('completed', 'purchased')),
    total_earnings = (SELECT COALESCE(SUM(amount), 0) FROM rewards WHERE user_id = users.id AND status = 'paid'),
    points = (SELECT COALESCE(SUM(points), 0) FROM rewards WHERE user_id = users.id)
WHERE role = 'user';

-- Create indexes for better performance
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_rewards_user ON rewards(user_id);
CREATE INDEX idx_cars_active ON cars(is_active);

COMMIT;
