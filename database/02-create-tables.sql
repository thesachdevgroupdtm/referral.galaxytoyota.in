-- Use the database
USE galaxy_toyota_referral;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('SUPERADMIN', 'ADMIN', 'USER') DEFAULT 'USER',
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by_code VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    total_referrals INT DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    available_balance DECIMAL(10,2) DEFAULT 0.00,
    profile_image VARCHAR(500),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_referral_code (referral_code),
    INDEX idx_referred_by_code (referred_by_code),
    INDEX idx_role (role)
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    discounted_price DECIMAL(12,2),
    description TEXT,
    features JSON,
    specifications JSON,
    images JSON,
    category ENUM('SEDAN', 'SUV', 'HATCHBACK', 'MPV', 'COUPE') DEFAULT 'SEDAN',
    fuel_type ENUM('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC') DEFAULT 'PETROL',
    transmission ENUM('MANUAL', 'AUTOMATIC', 'CVT') DEFAULT 'MANUAL',
    seating_capacity INT DEFAULT 5,
    mileage DECIMAL(5,2),
    engine_capacity VARCHAR(20),
    max_power VARCHAR(50),
    max_torque VARCHAR(50),
    safety_rating DECIMAL(2,1),
    warranty_years INT DEFAULT 3,
    is_featured BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_fuel_type (fuel_type),
    INDEX idx_price (price),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_available (is_available)
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id INT NOT NULL,
    referee_name VARCHAR(255) NOT NULL,
    referee_email VARCHAR(255) NOT NULL,
    referee_phone VARCHAR(20) NOT NULL,
    car_id INT NOT NULL,
    status ENUM('PENDING', 'CONTACTED', 'INTERESTED', 'VISIT_SCHEDULED', 'TEST_DRIVE', 'NEGOTIATION', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    referral_source ENUM('EMAIL', 'SMS', 'WHATSAPP', 'SOCIAL_MEDIA', 'DIRECT') DEFAULT 'DIRECT',
    notes TEXT,
    admin_notes TEXT,
    reward_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    is_reward_paid BOOLEAN DEFAULT FALSE,
    reward_paid_at TIMESTAMP NULL,
    contacted_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    follow_up_date DATE,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_referrer_id (referrer_id),
    INDEX idx_car_id (car_id),
    INDEX idx_status (status),
    INDEX idx_referee_email (referee_email),
    INDEX idx_referee_phone (referee_phone),
    INDEX idx_created_at (created_at)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'REFERRAL', 'REWARD', 'SYSTEM') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    metadata JSON,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    referral_id INT,
    type ENUM('REFERRAL_BONUS', 'MILESTONE_BONUS', 'SPECIAL_BONUS', 'CASHBACK') DEFAULT 'REFERRAL_BONUS',
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    status ENUM('PENDING', 'APPROVED', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    payment_method ENUM('BANK_TRANSFER', 'UPI', 'WALLET', 'CHEQUE') DEFAULT 'BANK_TRANSFER',
    payment_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_referral_id (referral_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(50) PRIMARY KEY,
    value JSON NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

SELECT 'All tables created successfully!' as message;
