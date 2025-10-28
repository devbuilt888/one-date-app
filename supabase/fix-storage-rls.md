# Fix Storage RLS Issue

The error "new row violates row-level security policy" means the storage bucket has RLS enabled but no policies configured.

## Solution 1: Disable RLS for Storage (Recommended for Development)

### Step 1: Go to Supabase Dashboard
1. Navigate to **Storage** → **Policies**
2. Find the `avatars` bucket
3. **Disable RLS** for this bucket

### Step 2: Alternative - Configure Bucket as Public
1. Go to **Storage** → **Buckets**
2. Click on the `avatars` bucket
3. Make sure it's set to **Public**
4. Check if there are any policy restrictions

## Solution 2: Create Simple RLS Policy

If you can't disable RLS, try this SQL in the SQL Editor:

```sql
-- Create a simple policy for the avatars bucket
CREATE POLICY "Allow all for avatars bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'avatars');
```

## Solution 3: Use a Different Approach

If the above doesn't work, we can modify the code to use a different storage method or create a custom upload endpoint.

## Test After Fix

After applying any of the above solutions:

1. Go to `/seed` page
2. Click **"Test Storage"** again
3. Check if the upload succeeds
4. Try uploading a photo in the profile page

## Debug Information

From your console output:
- ✅ `avatars` bucket exists (no "Bucket not found" error)
- ❌ RLS policy is blocking uploads
- ❌ `profile-photos` bucket also has RLS issues
- ❌ `images` and `uploads` buckets don't exist

The `avatars` bucket is the one to focus on since it exists but has RLS blocking uploads.
