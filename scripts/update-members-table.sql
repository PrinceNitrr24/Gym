-- Add new columns for membership cancellation and package tracking
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS package_end_date DATE,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancellation_date DATE,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS cancellation_notes TEXT,
ADD COLUMN IF NOT EXISTS reactivation_date DATE,
ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS reactivation_notes TEXT;

-- Update status constraint to include new statuses
ALTER TABLE members 
DROP CONSTRAINT IF EXISTS members_status_check;

ALTER TABLE members 
ADD CONSTRAINT members_status_check 
CHECK (status IN ('Active', 'Inactive', 'Cancelled', 'Dormant'));

-- Create notifications table for tracking sent notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  gym_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  recipients TEXT[] DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = gym_id);

CREATE POLICY "Users can insert their own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = gym_id);

-- Update trainers table to support multiple specializations
ALTER TABLE trainers 
ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT '{}';

-- Update existing trainers to use array format (if specialization column exists)
UPDATE trainers 
SET specializations = ARRAY[specialization]
WHERE specialization IS NOT NULL AND specializations = '{}';

-- Add schedule information to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS schedule_days TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS schedule_time TIME;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_package_end_date ON members(package_end_date);
CREATE INDEX IF NOT EXISTS idx_notifications_gym_id ON notifications(gym_id);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);

-- Add comments for documentation
COMMENT ON COLUMN members.package_end_date IS 'Date when the member package expires';
COMMENT ON COLUMN members.cancellation_reason IS 'Reason for membership cancellation';
COMMENT ON COLUMN members.cancellation_date IS 'Date when membership was cancelled';
COMMENT ON COLUMN members.refund_amount IS 'Amount refunded during cancellation';
COMMENT ON COLUMN trainers.specializations IS 'Array of trainer specializations';
COMMENT ON COLUMN activities.schedule_days IS 'Days of the week when activity is scheduled';
COMMENT ON COLUMN activities.schedule_time IS 'Time when activity is scheduled';
