import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { lat, lng, radius_km = 10, age_min = 18, age_max = 100, gender_preference = [] } = await req.json()

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate geohash ranges for the search area
    const geohashRanges = getGeohashRanges(lat, lng, radius_km)
    
    // Get user's profile to exclude from results
    const { data: userProfile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get users that user has already liked or been liked by
    const { data: existingLikes } = await supabaseClient
      .from('likes')
      .select('to_user_id')
      .eq('from_user_id', user.id)

    const { data: existingMatches } = await supabaseClient
      .from('matches')
      .select('user_a_id, user_b_id')
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)

    const excludedIds = [
      user.id,
      ...(existingLikes?.map(like => like.to_user_id) || []),
      ...(existingMatches?.map(match => 
        match.user_a_id === user.id ? match.user_b_id : match.user_a_id
      ) || [])
    ]

    // Build the query
    let query = supabaseClient
      .from('profiles')
      .select('*')
      .not('id', 'in', `(${excludedIds.join(',')})`)
      .gte('age', age_min)
      .lte('age', age_max)
      .gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Active in last 7 days

    // Add gender preference filter
    if (gender_preference.length > 0) {
      query = query.in('gender', gender_preference)
    }

    // Add geohash range filter
    if (geohashRanges.ranges.length > 0) {
      query = query.or(geohashRanges.ranges.map(range => `geohash.like.${range}%`).join(','))
    }

    const { data: profiles, error } = await query

    if (error) {
      throw error
    }

    // Calculate distances and filter by actual radius
    const nearbyProfiles = profiles
      ?.map(profile => {
        const distance = calculateDistance(lat, lng, profile.lat, profile.lng)
        return { ...profile, distance }
      })
      .filter(profile => profile.distance <= radius_km)
      .sort((a, b) => a.distance - b.distance) || []

    return new Response(
      JSON.stringify({ profiles: nearbyProfiles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
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

// Helper function to generate geohash ranges
function getGeohashRanges(lat, lng, radiusKm) {
  const precision = 6
  const latRange = radiusKm / 111
  const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180))
  
  const minLat = lat - latRange
  const maxLat = lat + latRange
  const minLng = lng - lngRange
  const maxLng = lng + lngRange
  
  // This is a simplified version - in production you'd want a more sophisticated algorithm
  return {
    center: encodeGeohash(lat, lng, precision),
    ranges: [encodeGeohash(minLat, minLng, precision), encodeGeohash(maxLat, maxLng, precision)]
  }
}

// Simple geohash encoding (you might want to use a proper geohash library)
function encodeGeohash(lat, lng, precision) {
  // This is a very basic implementation
  // In production, use a proper geohash library
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
  let hash = ''
  let bit = 0
  let ch = 0
  let even = true
  
  while (hash.length < precision) {
    if (even) {
      const mid = (lng + 180) / 2
      if (mid > 0.5) {
        ch |= (1 << (4 - bit))
        lng = (lng + 180) / 2 - 180
      } else {
        lng = (lng + 180) / 2 - 180
      }
    } else {
      const mid = (lat + 90) / 2
      if (mid > 0.5) {
        ch |= (1 << (4 - bit))
        lat = (lat + 90) / 2 - 90
      } else {
        lat = (lat + 90) / 2 - 90
      }
    }
    
    even = !even
    bit++
    
    if (bit === 5) {
      hash += base32[ch]
      bit = 0
      ch = 0
    }
  }
  
  return hash
}
