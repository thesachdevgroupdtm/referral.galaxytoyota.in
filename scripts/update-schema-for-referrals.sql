-- Add status column to referrals table if it doesn't exist
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Add notes column to referrals table if it doesn't exist
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add car_id column to referrals table if it doesn't exist
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS car_id INT;

-- Add foreign key constraint if it doesn't exist
-- Note: This might fail if the constraint already exists or if there are referrals with invalid car_ids
-- ALTER TABLE referrals ADD CONSTRAINT fk_referrals_car FOREIGN KEY (car_id) REFERENCES cars(id);

-- Add available_balance column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS available_balance DECIMAL(10,2) DEFAULT 0.00;

-- Add total_earnings column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0.00;

-- Add is_popular column to cars table if it doesn't exist
ALTER TABLE cars ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;

-- Add discount_amount column to cars table if it doesn't exist
ALTER TABLE cars ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT NULL;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Update existing referrals to have a status if they don't already
UPDATE referrals SET status = 'completed' WHERE status IS NULL;

-- Update users to have total_earnings based on their completed referrals
UPDATE users u
SET total_earnings = (
  SELECT COALESCE(SUM(r.reward_amount), 0)
  FROM referrals r
  WHERE r.referrer_id = u.id AND r.status = 'completed'
);

-- Update users to have available_balance equal to total_earnings initially
UPDATE users SET available_balance = total_earnings WHERE available_balance = 0;

-- Sample data for notifications
INSERT INTO notifications (user_id, title, message, type, created_at)
SELECT 
  id as user_id,
  'Welcome to Galaxy Toyota Referral Program!' as title,
  'Start referring your friends and family to earn rewards!' as message,
  'welcome' as type,
  NOW() as created_at
FROM users
WHERE role = 'USER'
AND NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = users.id AND type = 'welcome');

-- Mark some cars as popular
UPDATE cars SET is_popular = TRUE WHERE id IN (1, 3, 5) AND is_popular = FALSE;

-- Add discount amounts to some cars
UPDATE cars SET discount_amount = price * 0.1 WHERE discount_amount IS NULL AND id IN (2, 4, 6);
