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
import { storage } from '../../lib/supabase';

const StorageTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const testStorage = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      // List available buckets
      console.log('Testing storage...');
      const { data: buckets, error: bucketsError } = await storage.listBuckets();
      
      if (bucketsError) {
        setError(`Error listing buckets: ${bucketsError.message}`);
        return;
      }

      setResult(`Available buckets: ${JSON.stringify(buckets, null, 2)}`);

      // Test upload with a simple text file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const { data: uploadData, error: uploadError } = await storage.uploadPhoto(testFile, 'test-user');

      if (uploadError) {
        setError(`Upload error: ${uploadError.message}`);
      } else {
        setResult(prev => prev + `\n\nUpload successful: ${JSON.stringify(uploadData, null, 2)}`);
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
        Storage Test
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Test Supabase Storage functionality and check available buckets.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={testStorage}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Testing...' : 'Test Storage'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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

export default StorageTest;
