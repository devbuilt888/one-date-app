import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';

const DatabaseTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testTable = async (tableName) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        return { exists: false, error: error.message };
      }
      return { exists: true, count: data?.length || 0 };
    } catch (err) {
      return { exists: false, error: err.message };
    }
  };

  const runTests = async () => {
    setLoading(true);
    const results = {};
    
    const tables = ['profiles', 'likes', 'matches', 'conversations', 'messages'];
    
    for (const table of tables) {
      results[table] = await testTable(table);
    }
    
    setTestResults(results);
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Database Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={runTests} 
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Database Tables'}
      </Button>

      {Object.keys(testResults).length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(testResults).map(([table, result]) => (
            <Paper key={table} sx={{ p: 2 }}>
              <Typography variant="h6" color={result.exists ? 'success.main' : 'error.main'}>
                {table}: {result.exists ? '✅ EXISTS' : '❌ MISSING'}
              </Typography>
              {result.error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Error: {result.error}
                </Alert>
              )}
              {result.exists && (
                <Typography variant="body2" color="text.secondary">
                  Records: {result.count}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          If any tables are missing, you need to run the database schema in your Supabase SQL Editor.
          Copy the contents of <code>supabase/database-schema.sql</code> and run it.
        </Typography>
      </Alert>
    </Box>
  );
};

export default DatabaseTest;
