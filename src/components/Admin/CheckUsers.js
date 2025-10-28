import React, { useState, useEffect } from 'react'
import { Button, Box, Typography, Alert, List, ListItem, ListItemText, Paper, Divider, Tabs, Tab } from '@mui/material'
import { supabase } from '../../lib/supabase'
import MatchDebugger from './MatchDebugger'

const CheckUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [testResults, setTestResults] = useState({})
  const [testingDb, setTestingDb] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const checkUsers = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setMessage(`Currently logged in as: ${user.email}`)
      } else {
        setMessage('Not logged in')
      }
      
      // Try to get profiles from the database
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(10)
      
      if (error) {
        setMessage(`Error fetching profiles: ${error.message}`)
      } else {
        setUsers(profiles || [])
        setMessage(`Found ${profiles?.length || 0} profiles in database`)
      }
      
    } catch (error) {
      setMessage(`Exception: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async (email, password) => {
    setLoading(true)
    setMessage('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setMessage(`Login failed for ${email}: ${error.message}`)
      } else {
        setMessage(`✅ Successfully logged in as ${email}`)
      }
    } catch (error) {
      setMessage(`Exception: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    setTestingDb(true)
    const results = {}
    
    const tables = ['profiles', 'likes', 'matches', 'conversations', 'messages']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          results[table] = { exists: false, error: error.message }
        } else {
          results[table] = { exists: true, count: data?.length || 0 }
        }
      } catch (err) {
        results[table] = { exists: false, error: err.message }
      }
    }
    
    setTestResults(results)
    setTestingDb(false)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin Tools
      </Typography>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Database Test" />
        <Tab label="Match Debugger" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Database & User Test
          </Typography>
      
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={checkUsers}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              Check Database
            </Button>
          </Box>

          {message && (
            <Alert severity={message.includes('Error') || message.includes('Exception') ? 'error' : 'info'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {users.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Profiles in Database:
              </Typography>
              <List>
                {users.map((user, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={user.display_name || 'No name'}
                      secondary={`ID: ${user.id}, Email: ${user.email || 'No email'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Test Login with Seeded Users:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['alice@test.com', 'bob@test.com', 'charlie@test.com', 'diana@test.com'].map(email => (
                <Button
                  key={email}
                  variant="outlined"
                  size="small"
                  onClick={() => testLogin(email, 'password123')}
                  disabled={loading}
                >
                  Test {email.split('@')[0]}
                </Button>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Database Tables Test:
            </Typography>
            <Button 
              variant="contained" 
              onClick={testDatabase} 
              disabled={testingDb}
              sx={{ mb: 2 }}
            >
              {testingDb ? 'Testing...' : 'Test Database Tables'}
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
        </Box>
      )}

      {activeTab === 1 && (
        <MatchDebugger />
      )}
    </Box>
  )
}

export default CheckUsers
