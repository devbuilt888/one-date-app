import ngeohash from 'ngeohash'

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const geohash = ngeohash.encode(latitude, longitude, 6) // 6 characters = ~1.2km precision
        
        resolve({
          lat: latitude,
          lng: longitude,
          geohash
        })
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Generate geohash ranges for a given center point and radius
export const getGeohashRanges = (lat, lng, radiusKm) => {
  const precision = 6 // 6 characters = ~1.2km precision
  const centerGeohash = ngeohash.encode(lat, lng, precision)
  
  // Calculate bounding box
  const latRange = radiusKm / 111 // 1 degree latitude ≈ 111km
  const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180))
  
  const minLat = lat - latRange
  const maxLat = lat + latRange
  const minLng = lng - lngRange
  const maxLng = lng + lngRange
  
  // Get geohashes for corners
  const minGeohash = ngeohash.encode(minLat, minLng, precision)
  const maxGeohash = ngeohash.encode(maxLat, maxLng, precision)
  
  return {
    center: centerGeohash,
    min: minGeohash,
    max: maxGeohash,
    ranges: generateGeohashRanges(minGeohash, maxGeohash, precision)
  }
}

// Generate all geohash ranges between min and max
const generateGeohashRanges = (minHash, maxHash, precision) => {
  const ranges = []
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
  
  // This is a simplified version - in production you'd want a more sophisticated algorithm
  // For now, we'll use a basic approach that works for small ranges
  const minValue = geohashToNumber(minHash)
  const maxValue = geohashToNumber(maxHash)
  
  // Generate ranges by incrementing the geohash
  let current = minValue
  while (current <= maxValue) {
    const hash = numberToGeohash(current, precision)
    ranges.push(hash)
    current++
  }
  
  return ranges
}

// Convert geohash to number for range calculations
const geohashToNumber = (hash) => {
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
  let num = 0
  for (let i = 0; i < hash.length; i++) {
    num = num * 32 + base32.indexOf(hash[i])
  }
  return num
}

// Convert number back to geohash
const numberToGeohash = (num, precision) => {
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
  let hash = ''
  while (hash.length < precision) {
    hash = base32[num % 32] + hash
    num = Math.floor(num / 32)
  }
  return hash
}

// Check if location is within radius
export const isWithinRadius = (lat1, lng1, lat2, lng2, radiusKm) => {
  const distance = calculateDistance(lat1, lng1, lat2, lng2)
  return distance <= radiusKm
}

// Format distance for display
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}
