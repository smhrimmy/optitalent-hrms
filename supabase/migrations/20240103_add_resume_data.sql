
-- Add resume_data column to applicants table
ALTER TABLE public.applicants ADD COLUMN IF NOT EXISTS resume_data JSONB;
