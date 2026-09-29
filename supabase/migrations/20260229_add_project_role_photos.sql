-- Add role and photos columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Fullstack';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- Create storage bucket for project photos if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-photos', 'project-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to project photos
CREATE POLICY "Public read access for project photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-photos');

-- Allow authenticated users to upload project photos
CREATE POLICY "Authenticated users can upload project photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-photos');

-- Allow authenticated users to delete project photos
CREATE POLICY "Authenticated users can delete project photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-photos');
