-- Enhanced Gym CRM Database Schema
-- This script creates all necessary tables for the comprehensive gym management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Gym settings table
CREATE TABLE IF NOT EXISTS gym_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    gym_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    description TEXT,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    currency VARCHAR(3) DEFAULT 'USD',
    operating_hours JSONB DEFAULT '{"openTime": "06:00", "closeTime": "22:00", "alertBeforeClose": 30}',
    location JSONB DEFAULT '{}',
    owner_info JSONB DEFAULT '{}',
    gym_capacity INTEGER DEFAULT 50,
    gym_size VARCHAR(100),
    sections TEXT[] DEFAULT ARRAY['Cardio', 'Strength Training'],
    facilities TEXT[] DEFAULT ARRAY['Locker Rooms', 'WiFi'],
    rating DECIMAL(2,1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    emergency_contact JSONB,
    govt_id_type VARCHAR(50),
    govt_id_num VARCHAR(100),
    balance DECIMAL(10,2) DEFAULT 0.00,
    membership_start_date DATE,
    membership_end_date DATE,
    membership_amount DECIMAL(10,2),
    membership_balance DECIMAL(10,2) DEFAULT 0.00,
    has_personal_trainer BOOLEAN DEFAULT FALSE,
    pt_amount_paid DECIMAL(10,2) DEFAULT 0.00,
    pt_balance_due DECIMAL(10,2) DEFAULT 0.00,
    pt_payment_mode VARCHAR(50),
    pt_trainer_name VARCHAR(255),
    pt_joining_date DATE,
    pt_expiry_date DATE,
    pt_payment_date DATE,
    package_id UUID,
    status VARCHAR(20) DEFAULT 'Active',
    rating DECIMAL(2,1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Member attachments table
CREATE TABLE IF NOT EXISTS member_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    file_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced trainers table
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
    employment_type VARCHAR(50),
    govt_id_type VARCHAR(50),
    govt_id_num VARCHAR(100),
    joined_date DATE DEFAULT CURRENT_DATE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trainer attachments table
CREATE TABLE IF NOT EXISTS trainer_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    file_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced activities table (limited to 5)
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    capacity INTEGER,
    current_participants INTEGER DEFAULT 0,
    timing VARCHAR(100),
    weekdays TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity responses table
CREATE TABLE IF NOT EXISTS activity_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    member_name VARCHAR(255),
    response_status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, maybe, declined
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced packages table (limited to 5)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER, -- days
    price DECIMAL(10,2),
    discount_percentage INTEGER DEFAULT 0,
    subscribers INTEGER DEFAULT 0,
    timing VARCHAR(100),
    weekdays TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    notification_sent BOOLEAN DEFAULT FALSE,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Package responses table
CREATE TABLE IF NOT EXISTS package_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    member_name VARCHAR(255),
    response_status VARCHAR(20) DEFAULT 'interested', -- interested, maybe, not_interested
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    member_id UUID REFERENCES members(id),
    package_id UUID REFERENCES packages(id),
    invoice_id VARCHAR(100) UNIQUE,
    member_name VARCHAR(255),
    member_email VARCHAR(255),
    package_name VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    payment_direction VARCHAR(20) DEFAULT 'from_member', -- from_member, to_member (refund)
    payment_mode VARCHAR(50),
    transaction_date DATE,
    payment_status VARCHAR(20) DEFAULT 'Pending',
    due_date DATE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multiple payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    method VARCHAR(50) NOT NULL, -- cash, upi, credit_card, etc.
    amount DECIMAL(10,2) NOT NULL,
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal trainer reports table
CREATE TABLE IF NOT EXISTS pt_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    serial_number VARCHAR(20) UNIQUE NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    member_id VARCHAR(100) NOT NULL,
    personal_trainer_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    joining_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    pt_pay_date DATE NOT NULL,
    month VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily check-ins table
CREATE TABLE IF NOT EXISTS daily_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    member_name VARCHAR(255),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    auto_checkout BOOLEAN DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'checked_in' -- checked_in, checked_out, auto_checked_out
);

-- Trainer duty table
CREATE TABLE IF NOT EXISTS trainer_duty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    trainer_name VARCHAR(255),
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'off_duty', -- on_duty, off_duty, on_leave
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications log table
CREATE TABLE IF NOT EXISTS notifications_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL, -- member_expiry, payment_reminder, activity_notification, etc.
    title VARCHAR(255),
    message TEXT,
    recipients TEXT[], -- array of recipient identifiers
    sent_count INTEGER DEFAULT 0,
    delivery_status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Member ratings table
CREATE TABLE IF NOT EXISTS member_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    feedback TEXT,
    rated_by VARCHAR(255), -- gym owner/admin name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_gym_id ON members(gym_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_membership_end_date ON members(membership_end_date);
CREATE INDEX IF NOT EXISTS idx_trainers_gym_id ON trainers(gym_id);
CREATE INDEX IF NOT EXISTS idx_activities_gym_id ON activities(gym_id);
CREATE INDEX IF NOT EXISTS idx_packages_gym_id ON packages(gym_id);
CREATE INDEX IF NOT EXISTS idx_payments_gym_id ON payments(gym_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_gym_id ON daily_checkins(gym_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_date ON daily_checkins(date);
CREATE INDEX IF NOT EXISTS idx_pt_reports_gym_id ON pt_reports(gym_id);
CREATE INDEX IF NOT EXISTS idx_notifications_gym_id ON notifications_log(gym_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pt_reports_updated_at BEFORE UPDATE ON pt_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gym_settings_updated_at BEFORE UPDATE ON gym_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default gym settings
INSERT INTO gym_settings (
    gym_id, 
    gym_name, 
    email, 
    phone, 
    address, 
    description,
    operating_hours,
    location,
    owner_info,
    gym_capacity,
    gym_size,
    sections,
    facilities,
    rating
) VALUES (
    uuid_generate_v4(),
    'Demo Fitness Center',
    'demo@fitnesspro.com',
    '+1 234 567 8900',
    '123 Fitness Street, Health City, HC 12345',
    'A modern fitness center dedicated to helping you achieve your health goals.',
    '{"openTime": "06:00", "closeTime": "22:00", "alertBeforeClose": 30}',
    '{"city": "New York", "state": "NY", "latitude": "40.7128", "longitude": "-74.0060", "zipCode": "10001"}',
    '{"name": "John Smith", "email": "owner@fitnesspro.com", "phone": "+1 234 567 8901", "license": "GYM123456"}',
    50,
    '5000 sq ft',
    ARRAY['Cardio', 'Strength Training', 'Free Weights', 'Group Classes'],
    ARRAY['Steam Bath', 'Sauna', 'Locker Rooms', 'Parking', 'WiFi'],
    4.5
) ON CONFLICT DO NOTHING;

-- Add constraints to limit activities and packages to 5 each
-- Note: These would be enforced at the application level for better flexibility

COMMENT ON TABLE gym_settings IS 'Comprehensive gym configuration and settings';
COMMENT ON TABLE members IS 'Enhanced member information with PT details and attachments';
COMMENT ON TABLE trainers IS 'Trainer information with government ID and attachments';
COMMENT ON TABLE activities IS 'Gym activities limited to 5 with scheduling and notifications';
COMMENT ON TABLE packages IS 'Membership packages limited to 5 with timing and responses';
COMMENT ON TABLE payments IS 'Enhanced payment tracking with multiple methods and directions';
COMMENT ON TABLE pt_reports IS 'Personal trainer session reports and tracking';
COMMENT ON TABLE daily_checkins IS 'Daily member check-in/out tracking with auto-checkout';
COMMENT ON TABLE trainer_duty IS 'Trainer duty schedule and availability tracking';
COMMENT ON TABLE notifications_log IS 'Comprehensive notification delivery tracking';
