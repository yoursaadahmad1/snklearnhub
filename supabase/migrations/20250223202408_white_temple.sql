/*
  # Initial Schema Setup for LearnHub

  1. New Tables
    - users
      - Custom user data extending auth.users
    - courses
      - Course information and content
    - enrollments
      - Track user course enrollments
    - payments
      - Payment history and transactions
    - instructor_applications
      - Instructor application process

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
*/

-- Create custom user profiles table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructor_id uuid REFERENCES users(id),
  price decimal(10,2) NOT NULL,
  image_url text,
  duration text,
  level text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  course_id uuid REFERENCES courses(id),
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  course_id uuid REFERENCES courses(id),
  amount decimal(10,2) NOT NULL,
  stripe_payment_id text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create instructor applications table
CREATE TABLE IF NOT EXISTS instructor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  expertise text[],
  experience text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Instructors can read and update their own courses
CREATE POLICY "Instructors can manage own courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (instructor_id = auth.uid());

-- Users can read published courses
CREATE POLICY "Users can view courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can read their own enrollments
CREATE POLICY "Users can read own enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can read their own payments
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can read their own applications
CREATE POLICY "Users can manage own applications"
  ON instructor_applications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());