# Storage Setup Instructions

## Step 1: Create the Storage Bucket

1. Go to your Supabase dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Name: `profile-photos`
5. Make it **Public** (so profile photos can be viewed)
6. Click **"Create bucket"**

## Step 2: Set Up RLS Policies

Go to **SQL Editor** and run this SQL:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to view profile photos
CREATE POLICY "Users can view profile photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'profile-photos' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own photos
CREATE POLICY "Users can update their own profile photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-photos' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own profile photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-photos' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Step 3: Test the Setup

After running the SQL, try uploading a profile photo again. The error should be resolved!

## Alternative: Simpler Policy (if above doesn't work)

If you're still getting errors, try this simpler approach:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

-- Create a simple policy for authenticated users
CREATE POLICY "Authenticated users can manage profile photos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'profile-photos' 
    AND auth.role() = 'authenticated'
  );
```

This gives authenticated users full access to the profile-photos bucket, which is simpler but still secure since only authenticated users can access it.
