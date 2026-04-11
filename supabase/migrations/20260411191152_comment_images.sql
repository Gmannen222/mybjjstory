-- Add image_url column to comments
ALTER TABLE public.comments ADD COLUMN image_url text;

-- Create comment-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('comment-media', 'comment-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: authenticated users can upload to their own folder
CREATE POLICY "Users can upload comment media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'comment-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policy: anyone can view comment media
CREATE POLICY "Comment media is publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'comment-media');

-- Storage policy: users can delete their own comment media
CREATE POLICY "Users can delete own comment media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'comment-media' AND (storage.foldername(name))[1] = auth.uid()::text);
