-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2025 at 06:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `galaxy_toyota_referral`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT 'Toyota',
  `model` varchar(100) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `original_price` decimal(12,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `fuel_type` varchar(50) DEFAULT 'Petrol',
  `transmission` varchar(50) DEFAULT 'Automatic',
  `year` int(11) DEFAULT 2024,
  `features` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT '/placeholder.svg?height=300&width=400',
  `referral_reward` decimal(10,2) DEFAULT 10000.00,
  `friend_discount` decimal(10,2) DEFAULT 5000.00,
  `is_active` tinyint(1) DEFAULT 1,
  `is_popular` tinyint(1) DEFAULT 0,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `name`, `brand`, `model`, `price`, `original_price`, `description`, `fuel_type`, `transmission`, `year`, `features`, `image_url`, `referral_reward`, `friend_discount`, `is_active`, `is_popular`, `discount_amount`, `created_at`, `updated_at`) VALUES
(1, 'Toyota Camry 2024', 'Toyota', 'Camry', 3200000.00, 3500000.00, 'The 2024 Toyota Camry combines efficiency, style, and reliability in one exceptional package. With its hybrid powertrain option and advanced safety features, it is the perfect choice for modern drivers.', 'Hybrid', 'CVT Automatic', 2024, 'Hybrid Available, 4 Doors, Automatic, Toyota Safety Sense 2.0', '/placeholder.svg?height=300&width=400', 10000.00, 5000.00, 1, 1, 300000.00, '2025-06-11 11:00:07', '2025-06-11 11:00:07'),
(2, 'Toyota Corolla 2024', 'Toyota', 'Corolla', 1800000.00, 2000000.00, 'The world\'s best-selling car gets even better. The 2024 Corolla offers exceptional fuel economy, advanced safety features, and a comfortable ride.', 'Petrol', 'CVT Automatic', 2024, 'Fuel Efficient, Compact, Automatic, Safety Features', '/placeholder.svg?height=300&width=400', 8000.00, 4000.00, 1, 1, 200000.00, '2025-06-11 11:00:07', '2025-06-11 11:00:07'),
(3, 'Toyota RAV4 2024', 'Toyota', 'RAV4', 4500000.00, 4800000.00, 'Adventure awaits with the 2024 RAV4. This compact SUV offers all-wheel drive capability, spacious interior, and Toyota\'s legendary reliability.', 'Petrol', 'Automatic', 2024, 'AWD, SUV, Spacious, Off-road Capable', '/placeholder.svg?height=300&width=400', 12000.00, 6000.00, 1, 0, 300000.00, '2025-06-11 11:00:07', '2025-06-11 11:00:07'),
(4, 'Toyota Prius 2024', 'Toyota', 'Prius', 2800000.00, 3100000.00, 'The pioneer of hybrid technology continues to lead the way. The 2024 Prius offers outstanding fuel efficiency and eco-friendly driving.', 'Hybrid', 'CVT Automatic', 2024, 'Hybrid, Eco-friendly, Fuel Efficient, Advanced Tech', '/placeholder.svg?height=300&width=400', 9000.00, 4500.00, 1, 0, 300000.00, '2025-06-11 11:00:07', '2025-06-11 11:00:07'),
(5, 'Toyota Highlander 2024', 'Toyota', 'Highlander', 5200000.00, 5500000.00, 'Perfect for families, the 2024 Highlander offers three rows of seating, advanced safety features, and impressive cargo space.', 'Petrol', 'Automatic', 2024, '3-Row Seating, Family SUV, Spacious, Safety Features', '/placeholder.svg?height=300&width=400', 15000.00, 7500.00, 1, 0, 300000.00, '2025-06-11 11:00:07', '2025-06-11 11:00:07'),
(6, 'Toyota Fortuner 2024', 'Toyota', 'Fortuner', 3800000.00, 4200000.00, 'Built for adventure and daily driving alike. The Fortuner combines rugged capability with refined comfort.', 'Diesel', 'Automatic', 2024, '4WD, SUV, Rugged, Premium Interior', '/placeholder.svg?height=300&width=400', 11000.00, 5500.00, 1, 1, 400000.00, '2025-06-11 11:00:07', '2025-06-11 11:00:07');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('INFO','SUCCESS','WARNING','ERROR','REFERRAL') DEFAULT 'INFO',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`, `updated_at`) VALUES
(3, 5, 'New Referral!', 'You earned ₹10,000 for referring Atul tiwari!', 'REFERRAL', 0, '2025-06-11 09:26:24', '2025-06-11 09:26:24'),
(4, 4, 'Welcome to Galaxy Toyota!', 'Thank you for joining our referral program. Start referring friends to earn rewards!', '', 0, '2025-06-11 10:35:38', '2025-06-11 10:35:38'),
(5, 5, 'Welcome to Galaxy Toyota!', 'Thank you for joining our referral program. Start referring friends to earn rewards!', '', 0, '2025-06-11 10:35:38', '2025-06-11 10:35:38'),
(6, 6, 'Welcome to Galaxy Toyota!', 'Thank you for joining our referral program. Start referring friends to earn rewards!', '', 0, '2025-06-11 10:35:38', '2025-06-11 10:35:38'),
(7, 8, 'Welcome to Galaxy Toyota!', 'Thank you for joining our referral program. Start referring friends to earn rewards!', '', 0, '2025-06-11 10:35:38', '2025-06-11 10:35:38'),
(8, 9, 'Welcome to Galaxy Toyota!', 'Thank you for joining our referral program. Start referring friends to earn rewards!', '', 0, '2025-06-11 10:35:38', '2025-06-11 10:35:38'),
(9, 10, 'Welcome to Galaxy Toyota!', 'Thank you for joining our referral program. Start referring friends to earn rewards!', '', 0, '2025-06-11 10:35:38', '2025-06-11 10:35:38'),
(10, 11, 'Welcome to Galaxy Toyota!', 'Thank you for joining our referral program. Start referring friends to earn rewards!', '', 0, '2025-06-11 10:35:38', '2025-06-11 10:35:38'),
(11, 4, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35'),
(12, 5, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35'),
(13, 6, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35'),
(14, 7, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35'),
(15, 8, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35'),
(16, 10, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35'),
(17, 11, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35'),
(18, 9, '', 'Welcome to Galaxy Toyota Referral Program!', '', 0, '2025-06-11 10:38:35', '2025-06-11 10:38:35');

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` int(11) NOT NULL,
  `referrer_id` int(11) NOT NULL,
  `referee_name` varchar(255) NOT NULL,
  `referee_email` varchar(255) NOT NULL,
  `referee_phone` varchar(20) DEFAULT NULL,
  `car_id` int(11) DEFAULT NULL,
  `referral_code` varchar(50) DEFAULT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `reward_amount` decimal(10,2) DEFAULT 10000.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `referral_id` int(11) DEFAULT NULL,
  `type` enum('SIGNUP','REFERRAL_BONUS','PURCHASE','WITHDRAWAL') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`id`, `user_id`, `referral_id`, `type`, `amount`, `description`, `status`, `created_at`, `updated_at`) VALUES
(3, 5, NULL, 'REFERRAL_BONUS', 10000.00, 'Referral bonus for Atul tiwari', 'COMPLETED', '2025-06-11 09:26:24', '2025-06-11 09:26:24');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'referral_reward', '10000', 'Amount in INR rewarded for successful referrals', '2025-06-11 09:10:07', '2025-06-11 09:10:07'),
(2, 'referee_discount', '5000', 'Amount in INR discounted for referred users', '2025-06-11 09:10:07', '2025-06-11 09:10:07'),
(3, 'min_withdrawal', '1000', 'Minimum withdrawal amount in INR', '2025-06-11 09:10:07', '2025-06-11 09:10:07'),
(4, 'company_name', 'Galaxy Toyota', 'Company name', '2025-06-11 09:10:07', '2025-06-11 09:10:07'),
(5, 'company_email', 'contact@galaxytoyota.com', 'Company contact email', '2025-06-11 09:10:07', '2025-06-11 09:10:07'),
(6, 'company_phone', '+91-9876543210', 'Company contact phone', '2025-06-11 09:10:07', '2025-06-11 09:10:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `referral_code` varchar(10) NOT NULL,
  `referred_by` int(11) DEFAULT NULL,
  `role` enum('USER','ADMIN','SUPERADMIN') NOT NULL DEFAULT 'USER',
  `email_verified` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `total_referrals` int(11) DEFAULT 0,
  `total_earnings` decimal(12,2) DEFAULT 0.00,
  `available_balance` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `referral_code`, `referred_by`, `role`, `email_verified`, `is_active`, `total_referrals`, `total_earnings`, `available_balance`, `created_at`, `updated_at`, `last_login`) VALUES
(4, 'Referred User', 'referred@example.com', '9876543213', '$2a$12$k8Y1THPD8KDNPAHPNgFGGOGfUmIhRlGfKkW4yd4nf9fSqPkUGQFHu', 'REF1234', NULL, 'USER', 1, 1, 0, 0.00, 0.00, '2025-06-11 09:10:07', '2025-06-11 09:10:07', NULL),
(5, 'Harsh', 'harshsharma2401@gmail.com', '9718391218', '$2b$12$DUI8JXPdovKRaFWKMuGhUepyFOx0p4o/TYjmM2sDLx4qS.jhNhLnC', 'HAR7878', NULL, 'USER', 1, 1, 1, 0.00, 0.00, '2025-06-11 09:13:03', '2025-06-11 11:12:30', '2025-06-11 11:12:30'),
(6, 'Test User', 'test@example.com', '1234567890', '$2b$12$g5FK/oAgzFxj1JDXEMlJ9.jQ05WaDQzwu84L7FffiuVL17.baf/5K', 'TES1234', NULL, 'USER', 1, 1, 0, 0.00, 0.00, '2025-06-11 09:20:31', '2025-06-11 09:21:42', '2025-06-11 09:21:42'),
(7, 'Admin User', 'admin@galaxytoyota.com', '9876543210', '$2b$12$73LMvhZMimFP9rixo4wdXepSDBPoDc5AunYZvU565.IEh2JDkBsQi', 'ADM1234', NULL, 'ADMIN', 1, 1, 0, 0.00, 0.00, '2025-06-11 09:20:31', '2025-07-01 06:19:47', '2025-07-01 06:19:47'),
(8, 'Super Admin', 'superadmin@galaxytoyota.com', '5555555555', '$2b$12$9k5BsT1ni8z47XPaCnoXt.DlXm5mXbIo2nL9HcMOWiNJWFs.7NmrG', 'SUP1234', NULL, '', 1, 1, 0, 0.00, 0.00, '2025-06-11 09:20:31', '2025-06-11 10:44:42', '2025-06-11 10:44:42'),
(9, 'Atul tiwari', 'atul@gmail.com', '9982729200', '$2b$12$Y2J8HG67Vg5w1caH/DIgVOGDmVx3T9yqM9Ozv3OpoacEqTyGCwuZ.', 'ATU4606', 5, 'USER', 1, 1, 0, 0.00, 0.00, '2025-06-11 09:26:24', '2025-06-11 11:00:48', '2025-06-11 11:00:48'),
(10, 'Harsh Patel', 'harsh@example.com', '9876543210', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'HARSH123', NULL, 'USER', 0, 1, 0, 0.00, 0.00, '2025-06-11 10:22:40', '2025-06-11 10:22:40', NULL),
(11, 'Atul Kumar', 'atul@example.com', '9876543211', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ATUL456', NULL, 'USER', 0, 1, 0, 0.00, 0.00, '2025-06-11 10:22:40', '2025-06-11 10:22:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal_requests`
--

CREATE TABLE `withdrawal_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `referrer_id` (`referrer_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `referral_id` (`referral_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `referral_code` (`referral_code`),
  ADD KEY `referred_by` (`referred_by`);

--
-- Indexes for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `referrals`
--
ALTER TABLE `referrals`
  ADD CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `rewards`
--
ALTER TABLE `rewards`
  ADD CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rewards_ibfk_2` FOREIGN KEY (`referral_id`) REFERENCES `referrals` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  ADD CONSTRAINT `withdrawal_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
