-- Amara AI Database Schema
-- Create tables for borrowers, field agents, and visits

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Borrowers table
CREATE TABLE borrowers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    business VARCHAR(255) NOT NULL,
    loan_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    credit_score INTEGER DEFAULT 0,
    ai_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Field Agents table
CREATE TABLE field_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visits table
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES field_agents(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_borrowers_status ON borrowers(status);
CREATE INDEX idx_borrowers_created_at ON borrowers(created_at);
CREATE INDEX idx_field_agents_status ON field_agents(status);
CREATE INDEX idx_visits_agent_id ON visits(agent_id);
CREATE INDEX idx_visits_borrower_id ON visits(borrower_id);
CREATE INDEX idx_visits_scheduled_date ON visits(scheduled_date);
CREATE INDEX idx_visits_status ON visits(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_borrowers_updated_at BEFORE UPDATE ON borrowers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_field_agents_updated_at BEFORE UPDATE ON field_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO borrowers (name, business, loan_amount, status, credit_score, ai_score) VALUES
('Siti Nurhaliza', 'Warung Makan Sederhana', 5000000.00, 'approved', 750, 820),
('Budi Santoso', 'Toko Kelontong Sejahtera', 3000000.00, 'pending', 680, 710),
('Dewi Lestari', 'Salon Kecantikan Indah', 8000000.00, 'approved', 820, 890),
('Ahmad Wijaya', 'Bengkel Motor Jaya', 4500000.00, 'rejected', 550, 480),
('Ratna Sari', 'Konveksi Busana Muslim', 6000000.00, 'pending', 710, 750);

INSERT INTO field_agents (name, email, phone, status) VALUES
('Rizki Pratama', 'rizki@amara.ai', '+62 812-3456-7890', 'active'),
('Maya Putri', 'maya@amara.ai', '+62 813-9876-5432', 'active'),
('Hendra Kusuma', 'hendra@amara.ai', '+62 811-2345-6789', 'inactive');

INSERT INTO visits (borrower_id, agent_id, scheduled_date, status, priority, notes) VALUES
((SELECT id FROM borrowers WHERE name = 'Siti Nurhaliza'), (SELECT id FROM field_agents WHERE name = 'Rizki Pratama'), NOW() + INTERVAL '1 day', 'scheduled', 'medium', 'Follow-up visit for loan repayment'),
((SELECT id FROM borrowers WHERE name = 'Budi Santoso'), (SELECT id FROM field_agents WHERE name = 'Maya Putri'), NOW() + INTERVAL '2 days', 'scheduled', 'high', 'Initial business verification'),
((SELECT id FROM borrowers WHERE name = 'Dewi Lestari'), (SELECT id FROM field_agents WHERE name = 'Rizki Pratama'), NOW() - INTERVAL '1 day', 'completed', 'low', 'Routine check - business looks good'),
((SELECT id FROM borrowers WHERE name = 'Ahmad Wijaya'), (SELECT id FROM field_agents WHERE name = 'Maya Putri'), NOW() + INTERVAL '3 days', 'scheduled', 'medium', 'Document verification needed'),
((SELECT id FROM borrowers WHERE name = 'Ratna Sari'), (SELECT id FROM field_agents WHERE name = 'Hendra Kusuma'), NOW() - INTERVAL '2 days', 'completed', 'high', 'Business premises verification completed');

-- Enable Row Level Security (RLS)
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- For demo purposes, allow all operations (in production, implement proper RLS policies)
CREATE POLICY "Enable all operations for borrowers" ON borrowers FOR ALL USING (true);
CREATE POLICY "Enable all operations for field_agents" ON field_agents FOR ALL USING (true);
CREATE POLICY "Enable all operations for visits" ON visits FOR ALL USING (true);