-- Create database if it doesn't exist
SELECT 'CREATE DATABASE hapi'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hapi')\gexec

-- Connect to the hapi database
\c hapi;

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom tables for hospital management (optional)
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample hospitals
INSERT INTO hospitals (name, identifier, address, contact_phone, contact_email) VALUES
    ('General Hospital A', 'HOSP-A', '123 Main St, City A, State A 12345', '+1-555-0101', 'info@hospitala.com'),
    ('Community Medical Center B', 'HOSP-B', '456 Oak Ave, City B, State B 67890', '+1-555-0102', 'info@hospitalb.com'),
    ('Regional Health Center C', 'HOSP-C', '789 Pine Rd, City C, State C 11111', '+1-555-0103', 'info@hospitalc.com')
ON CONFLICT (identifier) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_hospitals_updated_at 
    BEFORE UPDATE ON hospitals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 