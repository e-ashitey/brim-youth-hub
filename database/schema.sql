-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create update_requests table
CREATE TABLE IF NOT EXISTS update_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample data
INSERT INTO users (first_name, last_name, email, phone, date_of_birth, street, city, state, zip, country)
VALUES
  ('John', 'Doe', 'john.doe@example.com', '1234567890', '1980-01-15', '123 Main St', 'Anytown', 'CA', '12345', 'USA'),
  ('Jane', 'Smith', 'jane.smith@example.com', '9876543210', '1985-05-20', '456 Oak Ave', 'Somewhere', 'NY', '67890', 'USA');
