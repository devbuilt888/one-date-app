import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Paper,
} from '@mui/material';
import { supabase } from '../../lib/supabase';

const SimpleStorageTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const testSimpleUpload = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      console.log('Testing simple upload...');
      
      // Create a simple test file
      const testFile = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
      
      // Try direct upload to avatars bucket
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload('test-direct.txt', testFile);
      
      if (error) {
        console.error('Direct upload error:', error);
        setError(`Upload failed: ${error.message}`);
        
        // Try to get more details about the error
        if (error.message.includes('row-level security')) {
          setError(prev => prev + '\n\nThis is an RLS policy issue. You need to either:\n1. Disable RLS for the avatars bucket, or\n2. Create a policy allowing uploads to the avatars bucket.');
        }
      } else {
        console.log('Direct upload successful:', data);
        setResult(`Upload successful! File path: ${data.path}`);
        
        // Try to get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.path);
        
        setResult(prev => prev + `\nPublic URL: ${publicUrl}`);
      }

    } catch (err) {
      console.error('Upload exception:', err);
      setError(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkBucketPolicies = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      // Try to list buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        setError(`Error listing buckets: ${bucketsError.message}`);
        return;
      }

      setResult(`Available buckets: ${JSON.stringify(buckets, null, 2)}`);
      
      // Check if avatars bucket exists and is public
      const avatarsBucket = buckets.find(b => b.id === 'avatars');
      if (avatarsBucket) {
        setResult(prev => prev + `\n\nAvatars bucket found: ${JSON.stringify(avatarsBucket, null, 2)}`);
      } else {
        setResult(prev => prev + '\n\nAvatars bucket not found!');
      }

    } catch (err) {
      setError(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Simple Storage Test
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Test direct upload to avatars bucket and check bucket configuration.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={testSimpleUpload}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Testing...' : 'Test Direct Upload'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={checkBucketPolicies}
          disabled={loading}
        >
          Check Buckets
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {error}
          </pre>
        </Alert>
      )}

      {result && (
        <Alert severity="info">
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {result}
          </pre>
        </Alert>
      )}
    </Paper>
  );
};

export default SimpleStorageTest;
