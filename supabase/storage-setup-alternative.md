# Alternative Storage Setup (No SQL Required)

Since you're getting permission errors with the SQL approach, let's use the Supabase dashboard interface instead.

## Method 1: Use Supabase Dashboard (Recommended)

### Step 1: Create Storage Bucket
1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. **Name**: `profile-photos`
5. **Public**: ✅ (check this box)
6. Click **"Create bucket"**

### Step 2: Configure Bucket Settings
1. Click on the `profile-photos` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. **Policy Name**: `Allow authenticated uploads`
5. **Policy Definition**:
   ```sql
   (bucket_id = 'profile-photos'::text) AND (auth.role() = 'authenticated'::text)
   ```
6. **Allowed Operations**: Select all (INSERT, SELECT, UPDATE, DELETE)
7. Click **"Save"**

## Method 2: Disable RLS Temporarily (For Testing)

If the above doesn't work, you can temporarily disable RLS for testing:

### Step 1: Create Bucket (same as above)

### Step 2: Disable RLS
1. Go to **Authentication** → **Policies**
2. Find the `storage.objects` table
3. **Disable RLS** temporarily
4. Test your uploads
5. **Re-enable RLS** after testing

## Method 3: Use a Different Bucket Name

Sometimes the issue is with the bucket name. Try:

1. Create a bucket named `avatars` instead of `profile-photos`
2. Update the code to use `avatars` bucket
3. Test the upload

## Method 4: Check Your Supabase Plan

The error might be due to your Supabase plan limitations. Check:
1. Go to **Settings** → **General**
2. Check your current plan
3. Some features might be limited on the free tier

## Quick Test

After setting up the bucket, test with this simple upload:

```javascript
// Test upload in browser console
const file = new File(['test'], 'test.txt', { type: 'text/plain' });
const { data, error } = await supabase.storage
  .from('profile-photos')
  .upload('test.txt', file);
console.log({ data, error });
```

If this works, the issue is with the app code. If it doesn't work, the issue is with the bucket setup.
