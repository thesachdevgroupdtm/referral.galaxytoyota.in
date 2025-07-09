-- Galaxy Toyota Referral Program - Fresh Database Schema
-- This script creates a complete database from scratch with proper relationships

-- Drop existing database if it exists
DROP DATABASE IF EXISTS galaxy_toyota_referral;

-- Create fresh database
CREATE DATABASE galaxy_toyota_referral;

-- Use the database
USE galaxy_toyota_referral;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  referral_code VARCHAR(10) NOT NULL UNIQUE,
  referred_by INT NULL,
  role ENUM('USER', 'ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'USER',
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  total_referrals INT DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  available_balance DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create cars table
CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  image VARCHAR(255) NULL,
  description TEXT NULL,
  features JSON NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create referrals table WITHOUT car_id foreign key constraint
CREATE TABLE referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referrer_id INT NOT NULL,
  referee_id INT NOT NULL,
  car_id INT NULL,  -- Optional, not required for registration
  referral_code VARCHAR(10) NOT NULL,
  status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  reward_amount DECIMAL(10,2) DEFAULT 0.00,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referee_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL  -- Set NULL if car is deleted
);

-- Create notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'REFERRAL') DEFAULT 'INFO',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create rewards table
CREATE TABLE rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  referral_id INT NULL,
  type ENUM('SIGNUP', 'REFERRAL_BONUS', 'PURCHASE', 'WITHDRAWAL') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NULL,
  status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE SET NULL
);

-- Create settings table
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('referral_reward', '10000', 'Amount in INR rewarded for successful referrals'),
('referee_discount', '5000', 'Amount in INR discounted for referred users'),
('min_withdrawal', '1000', 'Minimum withdrawal amount in INR'),
('company_name', 'Galaxy Toyota', 'Company name'),
('company_email', 'contact@galaxytoyota.com', 'Company contact email'),
('company_phone', '+91-9876543210', 'Company contact phone');

-- Insert sample cars
INSERT INTO cars (name, model, year, price, image, description, features, is_active) VALUES
('Toyota Camry', 'XLE', 2024, 3500000.00, '/images/camry.jpg', 'Luxury sedan with advanced features', '["Hybrid Engine", "Leather Seats", "Panoramic Sunroof", "Advanced Safety"]', TRUE),
('Toyota Fortuner', 'Legender', 2024, 4200000.00, '/images/fortuner.jpg', 'Powerful SUV for all terrains', '["4WD", "7 Seater", "Diesel Engine", "Off-road Capability"]', TRUE),
('Toyota Innova Crysta', 'VX', 2024, 2500000.00, '/images/innova.jpg', 'Comfortable MPV for families', '["8 Seater", "Spacious Interior", "Fuel Efficient", "Reliable"]', TRUE),
('Toyota Glanza', 'V', 2024, 900000.00, '/images/glanza.jpg', 'Compact hatchback for city driving', '["Fuel Efficient", "Touchscreen Infotainment", "Compact Design", "Low Maintenance"]', TRUE);

-- Insert test users with bcrypt hashed passwords
-- All passwords are 'password' for testing
INSERT INTO users (name, email, phone, password, referral_code, role, email_verified, is_active) VALUES
('Test User', 'test@example.com', '9876543210', '$2a$12$k8Y1THPD8KDNPAHPNgFGGOGfUmIhRlGfKkW4yd4nf9fSqPkUGQFHu', 'TES1234', 'USER', TRUE, TRUE),
('Admin User', 'admin@galaxytoyota.com', '9876543211', '$2a$12$k8Y1THPD8KDNPAHPNgFGGOGfUmIhRlGfKkW4yd4nf9fSqPkUGQFHu', 'ADM1234', 'ADMIN', TRUE, TRUE),
('Super Admin', 'superadmin@galaxytoyota.com', '9876543212', '$2a$12$k8Y1THPD8KDNPAHPNgFGGOGfUmIhRlGfKkW4yd4nf9fSqPkUGQFHu', 'SUP1234', 'SUPERADMIN', TRUE, TRUE);

-- Create sample referral
INSERT INTO users (name, email, phone, password, referral_code, referred_by, role, email_verified, is_active) VALUES
('Referred User', 'referred@example.com', '9876543213', '$2a$12$k8Y1THPD8KDNPAHPNgFGGOGfUmIhRlGfKkW4yd4nf9fSqPkUGQFHu', 'REF1234', 1, 'USER', TRUE, TRUE);

-- Update referrer stats
UPDATE users SET total_referrals = 1, total_earnings = 10000.00, available_balance = 10000.00 WHERE id = 1;

-- Create referral record
INSERT INTO referrals (referrer_id, referee_id, referral_code, status, reward_amount) VALUES
(1, 4, 'TES1234', 'COMPLETED', 10000.00);

-- Create reward record
INSERT INTO rewards (user_id, referral_id, type, amount, description, status) VALUES
(1, 1, 'REFERRAL_BONUS', 10000.00, 'Referral bonus for Referred User', 'COMPLETED');

-- Create notification
INSERT INTO notifications (user_id, title, message, type) VALUES
(1, 'New Referral!', 'You earned ₹10,000 for referring Referred User!', 'REFERRAL');

-- Show success message
SELECT 'Fresh database created successfully!' AS Message;
