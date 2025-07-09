-- Fix database schema to match the API expectations
USE galaxy_toyota_referral;

-- Add missing columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referred_by INT,
ADD FOREIGN KEY IF NOT EXISTS (referred_by) REFERENCES users(id) ON DELETE SET NULL;

-- Update existing data to use the new structure
UPDATE users SET referred_by = (
    SELECT id FROM users u2 WHERE u2.referral_code = users.referred_by_code
) WHERE referred_by_code IS NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_referred_by ON users(referred_by);

-- Fix referrals table to match expected structure
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS referee_id INT,
ADD FOREIGN KEY IF NOT EXISTS (referee_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add missing columns if they don't exist
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20);

SELECT 'Database schema fixed successfully!' as message;
