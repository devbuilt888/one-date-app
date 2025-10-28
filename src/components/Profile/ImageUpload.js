import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
} from '@mui/material'
import {
  Add,
  Delete,
  CloudUpload,
  PhotoCamera,
} from '@mui/icons-material'
import { storage } from '../../lib/supabase'

const ImageUpload = ({ 
  userId, 
  currentPhotos = [], 
  onPhotosUpdate, 
  maxPhotos = 6 
}) => {
  const [photos, setPhotos] = useState(currentPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewDialog, setPreviewDialog] = useState({ open: false, image: null })
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setError('Please select only JPEG, PNG, or WebP images')
      return
    }

    // Check if adding these files would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      setError(`You can only upload up to ${maxPhotos} photos`)
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploadPromises = files.map(async (file) => {
        const { data, error } = await storage.uploadPhoto(file, userId)
        if (error) throw error
        return data.url
      })

      const newPhotoUrls = await Promise.all(uploadPromises)
      const updatedPhotos = [...photos, ...newPhotoUrls]
      
      setPhotos(updatedPhotos)
      onPhotosUpdate(updatedPhotos)
    } catch (error) {
      setError(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = async (photoUrl) => {
    try {
      // Extract filename from URL
      const filename = photoUrl.split('/').pop()
      const { error } = await storage.deletePhoto(filename)
      
      if (error) {
        setError(`Failed to delete photo: ${error.message}`)
        return
      }

      const updatedPhotos = photos.filter(photo => photo !== photoUrl)
      setPhotos(updatedPhotos)
      onPhotosUpdate(updatedPhotos)
    } catch (error) {
      setError(`Delete failed: ${error.message}`)
    }
  }

  const handleAddPhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePreview = (image) => {
    setPreviewDialog({ open: true, image })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Profile Photos
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add up to {maxPhotos} photos to showcase your personality
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="120"
                image={photo}
                alt={`Profile photo ${index + 1}`}
                sx={{ cursor: 'pointer' }}
                onClick={() => handlePreview(photo)}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
                onClick={() => handleRemovePhoto(photo)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Card>
          </Grid>
        ))}

        {/* Add photo button */}
        {photos.length < maxPhotos && (
          <Grid item xs={6} sm={4} md={3}>
            <Card
              sx={{
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'grey.300',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={handleAddPhoto}
            >
              <Box sx={{ textAlign: 'center' }}>
                {uploading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <PhotoCamera sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Add Photo
                    </Typography>
                  </>
                )}
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, image: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Photo Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={previewDialog.image}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, image: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ImageUpload
