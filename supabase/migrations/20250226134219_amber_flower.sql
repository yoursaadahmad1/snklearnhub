/*
  # Add Google Auth and Role Management

  1. Updates
    - Add `auth_provider` column to users table
    - Add `provider_id` column to users table
    - Add role validation check
    - Update RLS policies

  2. Security
    - Add role validation
    - Update RLS policies for role-based access
*/

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_provider text DEFAULT 'email',
ADD COLUMN IF NOT EXISTS provider_id text,
ADD CONSTRAINT valid_role CHECK (role IN ('student', 'instructor', 'admin'));

-- Create function to handle user role assignment
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, role, auth_provider, provider_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'auth_provider', 'email'),
    NEW.raw_user_meta_data->>'provider_id'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies
CREATE OR REPLACE POLICY "Users can read own data and admin can read all"
  ON users
  FOR SELECT
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );