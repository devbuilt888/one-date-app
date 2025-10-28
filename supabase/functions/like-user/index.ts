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
    const { to_user_id } = await req.json()

    if (!to_user_id) {
      return new Response(
        JSON.stringify({ error: 'to_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is trying to like themselves
    if (user.id === to_user_id) {
      return new Response(
        JSON.stringify({ error: 'Cannot like yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user has already liked this person
    const { data: existingLike } = await supabaseClient
      .from('likes')
      .select('id')
      .eq('from_user_id', user.id)
      .eq('to_user_id', to_user_id)
      .single()

    if (existingLike) {
      return new Response(
        JSON.stringify({ error: 'Already liked this user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if there's already a match
    const { data: existingMatch } = await supabaseClient
      .from('matches')
      .select('id')
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .or(`user_a_id.eq.${to_user_id},user_b_id.eq.${to_user_id}`)
      .single()

    if (existingMatch) {
      return new Response(
        JSON.stringify({ error: 'Already matched with this user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the like
    const { data: like, error: likeError } = await supabaseClient
      .from('likes')
      .insert({
        from_user_id: user.id,
        to_user_id: to_user_id
      })
      .select()
      .single()

    if (likeError) {
      throw likeError
    }

    // Check if this creates a mutual like (match)
    const { data: mutualLike } = await supabaseClient
      .from('likes')
      .select('id')
      .eq('from_user_id', to_user_id)
      .eq('to_user_id', user.id)
      .single()

    let match = null
    let conversation = null

    if (mutualLike) {
      // Create a match
      const { data: newMatch, error: matchError } = await supabaseClient
        .from('matches')
        .insert({
          user_a_id: user.id,
          user_b_id: to_user_id
        })
        .select()
        .single()

      if (matchError) {
        throw matchError
      }

      // Create a conversation for the match
      const { data: newConversation, error: conversationError } = await supabaseClient
        .from('conversations')
        .insert({
          match_id: newMatch.id
        })
        .select()
        .single()

      if (conversationError) {
        throw conversationError
      }

      match = newMatch
      conversation = newConversation
    }

    return new Response(
      JSON.stringify({ 
        like, 
        isMatch: !!match, 
        match, 
        conversation 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
