import React, { useState } from 'react'
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Divider
} from '@mui/material'
import { seedDatabase, clearTestData } from '../../utils/seedData'
import TestAuth from './TestAuth'
import CheckUsers from './CheckUsers'
import StorageTest from './StorageTest'
import SimpleStorageTest from './SimpleStorageTest'

const SeedPage = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')

  const handleSeed = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      await seedDatabase()
      setMessage('Database seeded successfully! You can now test with multiple users.')
      setMessageType('success')
    } catch (error) {
      setMessage(`Error seeding database: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      await clearTestData()
      setMessage('Test data cleared successfully!')
      setMessageType('success')
    } catch (error) {
      setMessage(`Error clearing data: ${error.message}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Database Seeding Tool
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          This tool helps you populate the database with test users and events for testing the dating app functionality.
        </Typography>

        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Stack spacing={3}>
          <TestAuth />
          
          <Divider />
          
          <CheckUsers />
          
          <Divider />
          
          <StorageTest />
          
          <Divider />
          
          <SimpleStorageTest />
          
          <Divider />
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Test Users
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Creates 4 test users with different profiles and locations:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li><strong>alice@test.com</strong> / password123 - Female, 25, loves hiking</li>
              <li><strong>bob@test.com</strong> / password123 - Male, 28, musician</li>
              <li><strong>charlie@test.com</strong> / password123 - Male, 30, foodie</li>
              <li><strong>diana@test.com</strong> / password123 - Female, 27, artist</li>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Test Events
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Creates sample dating events in different locations.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSeed}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Seeding...' : 'Seed Database'}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              disabled={loading}
            >
              Clear Test Data
            </Button>
          </Stack>

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Note:</strong> This will create real user accounts in your Supabase database. 
              Make sure you're using a development/test environment.
            </Typography>
          </Alert>
        </Stack>
      </Paper>
    </Container>
  )
}

export default SeedPage
