import React, { useState } from 'react'
import { Button, TextField, Box, Typography, Alert } from '@mui/material'
import { supabase } from '../../lib/supabase'

const TestAuth = () => {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const testSignUp = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage(`Success! User created: ${data.user?.email}`)
      }
    } catch (error) {
      setMessage(`Exception: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage(`Success! User signed in: ${data.user?.email}`)
      }
    } catch (error) {
      setMessage(`Exception: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Test Authentication
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={testSignUp}
          disabled={loading}
        >
          Test Sign Up
        </Button>
        <Button
          variant="outlined"
          onClick={testSignIn}
          disabled={loading}
        >
          Test Sign In
        </Button>
      </Box>

      {message && (
        <Alert severity={message.includes('Error') || message.includes('Exception') ? 'error' : 'success'}>
          {message}
        </Alert>
      )}
    </Box>
  )
}

export default TestAuth
