import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '../config/supabase'

// Use environment variables - no hardcoded fallbacks
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY must be set')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Profile operations
export const profiles = {
  // Create or update profile
  upsert: async (profileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
    return { data, error }
  },

  // Get profile by user ID
  getById: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Get nearby profiles (will be replaced with edge function)
  getNearby: async (lat, lng, radiusKm = 10) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .not('id', supabase.auth.getUser().then(({ data: { user } }) => user?.id))
    return { data, error }
  }
}

// Matching operations
export const matching = {
  // Like a user
  likeUser: async (toUserId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      console.log('Liking user:', toUserId, 'by user:', user.id)

      // 1) Insert like (ignore duplicates if unique constraint exists)
      const { data: likeData, error: likeError } = await supabase
        .from('likes')
        .insert({ from_user_id: user.id, to_user_id: toUserId })
        .select()

      if (likeError) {
        console.error('Error inserting like:', likeError)
        // If it's a duplicate key error, that's okay - user already liked this person
        if (likeError.code === '23505') {
          console.log('User already liked this person')
          return { data: { like: null, matched: false, match: null, conversation: null }, error: null }
        }
        return { data: null, error: likeError }
      }

      console.log('Like inserted successfully:', likeData)

      // 2) Check for reciprocal like
      const { data: reciprocalLikes, error: reciprocalError } = await supabase
        .from('likes')
        .select('id')
        .eq('from_user_id', toUserId)
        .eq('to_user_id', user.id)
        .limit(1)

      if (reciprocalError) {
        console.error('Error checking reciprocal likes:', reciprocalError)
        return { data: { like: likeData?.[0] }, error: reciprocalError }
      }

      console.log('Reciprocal likes found:', reciprocalLikes)

      let matchCreated = false
      let match = null
      let conversation = null

      if (reciprocalLikes && reciprocalLikes.length > 0) {
        console.log('Mutual like detected! Creating match...')
        console.log('User A:', user.id, 'User B:', toUserId)
        
        // 3) Create match if not already present (normalize ordering to avoid duplicates)
        const userA = user.id < toUserId ? user.id : toUserId
        const userB = user.id < toUserId ? toUserId : user.id
        console.log('Normalized: userA =', userA, 'userB =', userB)

        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('*')
          .or(`and(user_a_id.eq.${userA},user_b_id.eq.${userB}),and(user_a_id.eq.${userB},user_b_id.eq.${userA})`)
          .limit(1)

        if (existingMatch && existingMatch.length > 0) {
          console.log('Match already exists:', existingMatch[0])
          match = existingMatch[0]
          matchCreated = true
        } else {
          // Try to insert match
          console.log('Inserting new match...')
          const { data: matchData, error: matchError } = await supabase
            .from('matches')
            .insert({ user_a_id: userA, user_b_id: userB })
            .select()

          if (matchError) {
            console.error('Error creating match:', matchError)
            return { data: { like: likeData?.[0] }, error: matchError }
          } else if (matchData && matchData.length > 0) {
            console.log('Match created successfully:', matchData[0])
            match = matchData[0]
            matchCreated = true
          }
        }

        if (match) {
          console.log('Match created/found:', match)
          
          // Ensure a conversation exists for the match
          const { data: convoData, error: convoError } = await supabase
            .from('conversations')
            .insert({ match_id: match.id })
            .select()
          
          if (convoError) {
            console.error('Error creating conversation:', convoError)
            // Try to fetch existing conversation
            const { data: existingConvos } = await supabase
              .from('conversations')
              .select('*')
              .eq('match_id', match.id)
              .limit(1)
            if (existingConvos && existingConvos.length > 0) {
              conversation = existingConvos[0]
            }
          } else if (convoData && convoData.length > 0) {
            conversation = convoData[0]
          }
        }
      }

      console.log('Final result:', { matched: matchCreated, match, conversation })
      return { data: { like: likeData?.[0], matched: matchCreated, match, conversation }, error: null }
    } catch (error) {
      console.error('Error in likeUser:', error)
      return { data: null, error }
    }
  },

  // Manually create a match for testing
  createMatch: async (userAId, userBId) => {
    try {
      console.log('Manually creating match between:', userAId, 'and', userBId)
      
      // Normalize the order
      const userA = userAId < userBId ? userAId : userBId
      const userB = userAId < userBId ? userBId : userAId
      
      // Check if match already exists
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('*')
        .or(`and(user_a_id.eq.${userA},user_b_id.eq.${userB}),and(user_a_id.eq.${userB},user_b_id.eq.${userA})`)
        .limit(1)

      if (existingMatch && existingMatch.length > 0) {
        console.log('Match already exists:', existingMatch[0])
        return { data: existingMatch[0], error: null }
      }

      // Create the match
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert({ user_a_id: userA, user_b_id: userB })
        .select()

      if (matchError) {
        console.error('Error creating match:', matchError)
        return { data: null, error: matchError }
      }

      console.log('Match created successfully:', matchData[0])

      // Create conversation for the match
      const { data: convoData, error: convoError } = await supabase
        .from('conversations')
        .insert({ match_id: matchData[0].id })
        .select()

      if (convoError) {
        console.error('Error creating conversation:', convoError)
        return { data: matchData[0], error: convoError }
      }

      console.log('Conversation created successfully:', convoData[0])
      return { data: matchData[0], error: null }
    } catch (error) {
      console.error('Error in createMatch:', error)
      return { data: null, error }
    }
  },

  // Get matches
  getMatches: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error in getMatches:', authError)
        throw new Error('Not authenticated')
      }

      console.log('Getting matches for user:', user.id)

      // First, get the matches
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)

      if (matchesError) {
        console.error('Error fetching matches:', matchesError)
        return { data: null, error: matchesError }
      }

      if (!matches || matches.length === 0) {
        console.log('No matches found')
        return { data: [], error: null }
      }

      // Get the profile IDs from matches
      const profileIds = []
      matches.forEach(match => {
        if (match.user_a_id !== user.id) profileIds.push(match.user_a_id)
        if (match.user_b_id !== user.id) profileIds.push(match.user_b_id)
      })

      // Get the profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', profileIds)

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        return { data: null, error: profilesError }
      }

      // Combine matches with profiles
      const enrichedMatches = matches.map(match => {
        const otherUser = profiles?.find(p => 
          p.id === (match.user_a_id === user.id ? match.user_b_id : match.user_a_id)
        )
        return {
          ...match,
          user_a: match.user_a_id === user.id ? { id: user.id } : otherUser,
          user_b: match.user_b_id === user.id ? { id: user.id } : otherUser
        }
      })

      console.log('Matches found:', enrichedMatches?.length || 0)
      return { data: enrichedMatches, error: null }
    } catch (err) {
      console.error('Exception in getMatches:', err)
      return { data: null, error: err }
    }
  }
}

// Chat operations
export const chat = {
  // Get conversations (secure - only user's conversations)
  getConversations: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error in getConversations:', authError)
        throw new Error('Not authenticated')
      }

      console.log('Getting conversations for user:', user.id)

      // Get conversations only for matches where the user is involved
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          match:matches!conversations_match_id_fkey(
            *,
            user_a:profiles!matches_user_a_id_fkey(id, display_name, photo_urls),
            user_b:profiles!matches_user_b_id_fkey(id, display_name, photo_urls)
          )
        `)

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError)
        return { data: null, error: conversationsError }
      }

      // Filter conversations where the user is part of the match
      const userConversations = conversations.filter(conversation => 
        conversation.match && 
        (conversation.match.user_a_id === user.id || conversation.match.user_b_id === user.id)
      )

      console.log('User conversations found:', userConversations?.length || 0)
      return { data: userConversations, error: null }
    } catch (err) {
      console.error('Exception in getConversations:', err)
      return { data: null, error: err }
    }
  },

  // Get messages for a conversation (with security check)
  getMessages: async (conversationId) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error in getMessages:', authError)
        throw new Error('Not authenticated')
      }

      console.log('Getting messages for conversation:', conversationId, 'by user:', user.id)

      // First verify the user has access to this conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select(`
          *,
          match:matches!conversations_match_id_fkey(
            user_a_id,
            user_b_id
          )
        `)
        .eq('id', conversationId)
        .single()

      if (conversationError) {
        console.error('Error fetching conversation:', conversationError)
        return { data: null, error: conversationError }
      }

      // Check if user is part of this match
      if (!conversation.match || 
          (conversation.match.user_a_id !== user.id && conversation.match.user_b_id !== user.id)) {
        console.error('User not authorized to access this conversation')
        return { data: null, error: new Error('Not authorized to access this conversation') }
      }

      // Now get the messages (RLS will ensure user only sees their own messages)
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.error('Error fetching messages:', messagesError)
        return { data: null, error: messagesError }
      }

      if (!messages || messages.length === 0) {
        return { data: [], error: null }
      }

      // Get unique sender IDs
      const senderIds = [...new Set(messages.map(msg => msg.sender_id))]

      // Fetch sender profiles (only for users in this conversation)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, photo_urls')
        .in('id', senderIds)

      if (profilesError) {
        console.error('Error fetching sender profiles:', profilesError)
        return { data: null, error: profilesError }
      }

      // Combine messages with sender info
      const enrichedMessages = messages.map(message => ({
        ...message,
        sender: profiles.find(profile => profile.id === message.sender_id) || {
          id: message.sender_id,
          display_name: 'Unknown',
          photo_urls: []
        }
      }))

      console.log('Messages fetched successfully:', enrichedMessages.length)
      return { data: enrichedMessages, error: null }
    } catch (err) {
      console.error('Exception in getMessages:', err)
      return { data: null, error: err }
    }
  },

  // Send a message
  sendMessage: async (conversationId, text) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error in sendMessage:', authError)
        throw new Error('Not authenticated')
      }

      console.log('Sending message to conversation:', conversationId, 'by user:', user.id)

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          text
        })
        .select()

      if (error) {
        console.error('Error sending message:', error)
        return { data: null, error }
      }

      console.log('Message sent successfully:', data)
      return { data, error }
    } catch (err) {
      console.error('Exception in sendMessage:', err)
      return { data: null, error: err }
    }
  },

  // Subscribe to new messages
  subscribeToMessages: (conversationId, callback) => {
    console.log('Creating subscription for conversation:', conversationId)
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, callback)
      .subscribe((status) => {
        console.log('Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to messages')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error - check Supabase real-time settings')
        } else if (status === 'TIMED_OUT') {
          console.error('Subscription timed out')
        }
      })
    
    return subscription
  }
}

// Events operations
export const events = {
  // Get all events with attendance and likes data
  getAll: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error in getAll events:', authError)
        throw new Error('Not authenticated')
      }

      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('starts_at', { ascending: true })

      if (eventsError) {
        console.error('Error fetching events:', eventsError)
        return { data: null, error: eventsError }
      }

      // Transform events to include basic data (without attendance/likes for now)
      const transformedEvents = events.map(event => {
        return {
          ...event,
          isAttending: false,
          isLiked: false,
          attendingCount: 0,
          likesCount: 0,
          spotsLeft: event.max_participants || 0
        }
      })

      return { data: transformedEvents, error: null }
    } catch (err) {
      console.error('Exception in getAll events:', err)
      return { data: null, error: err }
    }
  },

  // Join/Leave an event (placeholder - requires event_attendance table)
  toggleAttendance: async (eventId, status = 'attending') => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error in toggleAttendance:', authError)
        throw new Error('Not authenticated')
      }

      // For now, just return a success response
      // TODO: Implement when event_attendance table is created
      console.log('Attendance toggle not yet implemented - requires event_attendance table')
      return { data: { action: 'placeholder', attendance: null }, error: null }
    } catch (err) {
      console.error('Exception in toggleAttendance:', err)
      return { data: null, error: err }
    }
  },

  // Like/Unlike an event (placeholder - requires event_likes table)
  toggleLike: async (eventId) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error in toggleLike:', authError)
        throw new Error('Not authenticated')
      }

      // For now, just return a success response
      // TODO: Implement when event_likes table is created
      console.log('Like toggle not yet implemented - requires event_likes table')
      return { data: { action: 'placeholder', like: null }, error: null }
    } catch (err) {
      console.error('Exception in toggleLike:', err)
      return { data: null, error: err }
    }
  }
}

// Storage operations
export const storage = {
  // Upload profile photo
  uploadPhoto: async (file, userId) => {
    try {
      console.log('Uploading photo for user:', userId)
      console.log('File details:', { name: file.name, size: file.size, type: file.type })
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      
      console.log('Uploading to path:', fileName)
      
      // Try different bucket names in order of preference
      const bucketNames = ['profile-photos', 'avatars', 'images', 'uploads']
      let lastError = null
      
      for (const bucketName of bucketNames) {
        console.log(`Trying bucket: ${bucketName}`)
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file)
        
        if (error) {
          console.error(`Upload error with ${bucketName}:`, error)
          lastError = error
          continue
        }
        
        console.log(`Upload successful with ${bucketName}:`, data)
        
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName)
        
        console.log('Public URL:', publicUrl)
        return { data: { url: publicUrl, bucket: bucketName }, error: null }
      }
      
      // If all buckets failed
      console.error('All bucket attempts failed')
      return { data: null, error: lastError || new Error('No working bucket found') }
      
    } catch (error) {
      console.error('Upload exception:', error)
      return { data: null, error }
    }
  },

  // Delete photo
  deletePhoto: async (fileName, bucketName = 'profile-photos') => {
    try {
      console.log('Deleting photo:', fileName, 'from bucket:', bucketName)
      const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([fileName])
      
      if (error) {
        console.error('Delete error:', error)
      } else {
        console.log('Delete successful:', data)
      }
      
      return { data, error }
    } catch (error) {
      console.error('Delete exception:', error)
      return { data: null, error }
    }
  },

  // List available buckets
  listBuckets: async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets()
      console.log('Available buckets:', data)
      return { data, error }
    } catch (error) {
      console.error('List buckets error:', error)
      return { data: null, error }
    }
  }
}
