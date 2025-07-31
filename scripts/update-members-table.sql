-- Add new columns for membership cancellation and additional member info
ALTER TABLE members ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS cancellation_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS reactivation_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS fitness_goals TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS referral_source TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS health_conditions TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Credit Card';

-- Update status enum to include 'Cancelled'
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_status_check;
ALTER TABLE members ADD CONSTRAINT members_status_check 
CHECK (status IN ('Active', 'Inactive', 'Expired', 'Cancelled'));

-- Add index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_gym_status ON members(gym_id, status);
