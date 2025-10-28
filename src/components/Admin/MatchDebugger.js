import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { supabase, matching, chat } from '../../lib/supabase';
import { useAuth } from '../../App';

const MatchDebugger = () => {
  const { user } = useAuth();
  const [likes, setLikes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLikes, setAllLikes] = useState([]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load likes
      const { data: likesData } = await supabase
        .from('likes')
        .select('*')
        .eq('from_user_id', user.id);
      setLikes(likesData || []);

      // Load matches
      const { data: matchesData } = await matching.getMatches();
      setMatches(matchesData || []);

      // Load conversations
      const { data: conversationsData } = await chat.getConversations();
      setConversations(conversationsData || []);

      // Load all likes in the system for debugging
      const { data: allLikesData } = await supabase
        .from('likes')
        .select('*')
        .order('created_at', { ascending: false });
      setAllLikes(allLikesData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const testLikeUser = async () => {
    if (!user) return;
    
    // Get a random profile to like (not yourself)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', user.id)
      .limit(1);
    
    if (profiles && profiles.length > 0) {
      const targetId = profiles[0].id;
      console.log('Testing like on user:', targetId);
      
      const result = await matching.likeUser(targetId);
      console.log('Like result:', result);
      
      // Reload data
      loadData();
    }
  };

  const testCreateMatch = async () => {
    if (!user) return;
    
    // Get a random profile to match with (not yourself)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', user.id)
      .limit(1);
    
    if (profiles && profiles.length > 0) {
      const targetId = profiles[0].id;
      console.log('Manually creating match with user:', targetId);
      
      const result = await matching.createMatch(user.id, targetId);
      console.log('Create match result:', result);
      
      // Reload data
      loadData();
    }
  };

  const findAndCreateMatches = async () => {
    if (!user) return;
    
    console.log('Looking for mutual likes to create matches...');
    
    // Get all likes where current user is the target
    const { data: likesToUser } = await supabase
      .from('likes')
      .select('from_user_id')
      .eq('to_user_id', user.id);
    
    if (!likesToUser || likesToUser.length === 0) {
      console.log('No one has liked you yet');
      return;
    }
    
    // Check which of these users you have also liked
    const { data: mutualLikes } = await supabase
      .from('likes')
      .select('from_user_id')
      .eq('from_user_id', user.id)
      .in('to_user_id', likesToUser.map(like => like.from_user_id));
    
    if (!mutualLikes || mutualLikes.length === 0) {
      console.log('No mutual likes found');
      return;
    }
    
    console.log('Found mutual likes:', mutualLikes);
    
    // Create matches for mutual likes
    for (const like of mutualLikes) {
      const result = await matching.createMatch(user.id, like.from_user_id);
      console.log('Created match:', result);
    }
    
    // Reload data
    loadData();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Match & Chat Debugger
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={loadData} 
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Loading...' : 'Refresh Data'}
      </Button>

      <Button 
        variant="outlined" 
        onClick={testLikeUser} 
        disabled={loading}
        sx={{ mb: 2, ml: 2 }}
      >
        Test Like Random User
      </Button>

      <Button 
        variant="outlined" 
        onClick={testCreateMatch} 
        disabled={loading}
        sx={{ mb: 2, ml: 2 }}
        color="secondary"
      >
        Manually Create Match
      </Button>

      <Button 
        variant="outlined" 
        onClick={findAndCreateMatches} 
        disabled={loading}
        sx={{ mb: 2, ml: 2 }}
        color="warning"
      >
        Find & Create Matches
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Likes Section */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Likes ({likes.length})
          </Typography>
          {likes.length === 0 ? (
            <Typography color="text.secondary">No likes yet</Typography>
          ) : (
            <List>
              {likes.map(like => (
                <ListItem key={like.id}>
                  <ListItemText 
                    primary={`Liked: ${like.to_user_id}`}
                    secondary={`Date: ${new Date(like.created_at).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Matches Section */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Matches ({matches.length})
          </Typography>
          {matches.length === 0 ? (
            <Typography color="text.secondary">No matches yet</Typography>
          ) : (
            <List>
              {matches.map(match => (
                <ListItem key={match.id}>
                  <ListItemText 
                    primary={`Match with: ${match.user_a?.display_name || match.user_a_id} & ${match.user_b?.display_name || match.user_b_id}`}
                    secondary={`Date: ${new Date(match.created_at).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Conversations Section */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Conversations ({conversations.length})
          </Typography>
          {conversations.length === 0 ? (
            <Typography color="text.secondary">No conversations yet</Typography>
          ) : (
            <List>
              {conversations.map(conversation => (
                <ListItem key={conversation.id}>
                  <ListItemText 
                    primary={`Conversation ID: ${conversation.id}`}
                    secondary={`Match ID: ${conversation.match_id}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* All Likes Section */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            All Likes in System ({allLikes.length})
          </Typography>
          {allLikes.length === 0 ? (
            <Typography color="text.secondary">No likes in system</Typography>
          ) : (
            <List>
              {allLikes.map(like => (
                <ListItem key={like.id}>
                  <ListItemText 
                    primary={`${like.from_user_id} → ${like.to_user_id}`}
                    secondary={`Date: ${new Date(like.created_at).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          This debugger shows your current likes, matches, and conversations. 
          Use it to verify that the matching system is working correctly.
        </Typography>
      </Alert>
    </Box>
  );
};

export default MatchDebugger;
