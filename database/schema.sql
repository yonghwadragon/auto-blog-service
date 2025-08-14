-- ===============================================
-- Auto Blog Service Database Schema
-- Supabase PostgreSQL
-- ===============================================

-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS python_jobs DISABLE ROW LEVEL SECURITY;

DROP TABLE IF EXISTS python_jobs;
DROP TABLE IF EXISTS posts;

-- Posts table (블로그 포스트 저장)
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '',
  publish_type TEXT NOT NULL DEFAULT 'public',
  status TEXT NOT NULL CHECK (status IN ('writing', 'completed', 'published')) DEFAULT 'writing',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Python automation jobs table (자동화 작업 추적)
CREATE TABLE python_jobs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_ids BIGINT[] NOT NULL DEFAULT '{}', -- Array of post IDs to process
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  progress_current INTEGER DEFAULT 0,
  progress_total INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_python_jobs_user_id ON python_jobs(user_id);
CREATE INDEX idx_python_jobs_status ON python_jobs(status);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE python_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts table
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for python_jobs table
CREATE POLICY "Users can view own jobs" ON python_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs" ON python_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs" ON python_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Automatic updated_at trigger for posts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();