import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  IconButton,
  Badge,
  InputAdornment,
} from '@mui/material';
import { Send, Search, MoreVert, Favorite, PhotoCamera, AttachFile } from '@mui/icons-material';
import { useAuth } from '../../App';
import { chat } from '../../lib/supabase';

const ChatsPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const { data, error } = await chat.getConversations();
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error loading conversations:', error);
          setConversations([]);
          return;
        }
        // Filter for conversations where current user is part of the match
        const visible = (data || []).filter((c) =>
          c.match?.user_a?.id === user?.id || c.match?.user_b?.id === user?.id
        );
        
        // Map conversations to UI shape
        const mapped = visible.map((c) => {
          const other = c.match?.user_a?.id === user?.id ? c.match?.user_b : c.match?.user_a;
          return {
            id: c.id,
            name: other?.display_name || 'Unknown',
            avatar: other?.photo_urls?.[0] || '/images/users/default-avatar.png',
            lastMessage: 'Start a conversation!',
            timestamp: new Date(c.created_at).toLocaleDateString(),
            unread: 0,
            online: false,
            messages: [],
            match: c.match,
            otherUser: other
          };
        });
        setConversations(mapped);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Conversations exception:', e);
        setConversations([]);
      }
    };
    loadConversations();
  }, [user?.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat) {
      const messageText = newMessage.trim();
      setNewMessage(''); // Clear input immediately for better UX
      
      try {
        const { data, error } = await chat.sendMessage(selectedChat.id, messageText);
        if (error) {
          console.error('Error sending message:', error);
          setNewMessage(messageText); // Restore message if sending failed
          return;
        }
        
        // Add the new message to the messages state immediately for better UX
        const newMessageObj = {
          id: data[0].id,
          sender: 'You',
          message: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMine: true,
        };
        
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === data[0].id);
          if (exists) {
            return prev;
          }
          return [...prev, newMessageObj];
        });
        
        console.log('Message sent successfully:', data[0]);
      } catch (e) {
        console.error('Error sending message:', e);
        setNewMessage(messageText); // Restore message if sending failed
      }
    }
  };

  // Load messages when a chat is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;
      
      try {
        setLoadingMessages(true);
        const { data, error } = await chat.getMessages(selectedChat.id);
        if (error) {
          console.error('Error loading messages:', error);
          setMessages([]);
          return;
        }
        
        // Transform messages to UI format
        const transformedMessages = (data || []).map(msg => ({
          id: msg.id,
          sender: msg.sender?.display_name || 'Unknown',
          message: msg.text,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMine: msg.sender_id === user?.id,
        }));
        
        setMessages(transformedMessages);
      } catch (e) {
        console.error('Error loading messages:', e);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    loadMessages();
  }, [selectedChat, user?.id]);

  // Subscribe to new messages for the selected chat
  useEffect(() => {
    if (!selectedChat) return;
    
    console.log('Setting up real-time subscription for conversation:', selectedChat.id);
    
    const subscription = chat.subscribeToMessages(selectedChat.id, (payload) => {
      console.log('Received real-time message:', payload);
      
      // Check if this is an INSERT event (new message)
      if (payload.eventType === 'INSERT' && payload.new) {
        const newMessage = payload.new;
        
        // Only add the message if it's not from the current user (to avoid duplicates)
        // The current user's messages are already added when they send them
        if (newMessage.sender_id !== user?.id) {
          console.log('Adding new message from other user:', newMessage);
          
          const transformedMessage = {
            id: newMessage.id,
            sender: selectedChat.otherUser?.display_name || 'Other User',
            message: newMessage.text,
            timestamp: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: false,
          };
          
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) {
              console.log('Message already exists, skipping duplicate');
              return prev;
            }
            console.log('Adding new message to state');
            return [...prev, transformedMessage];
          });
        } else {
          console.log('Message from current user, skipping (already added)');
        }
      }
    });
    
    return () => {
      console.log('Cleaning up subscription for conversation:', selectedChat.id);
      subscription.unsubscribe();
    };
  }, [selectedChat, user?.id]);

  const filteredChats = conversations.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 10, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Messages
      </Typography>

      <Grid container spacing={2} sx={{ height: '70vh' }}>
        {/* Chat List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <TextField
                fullWidth
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <List sx={{ p: 0, overflow: 'auto', height: 'calc(100% - 80px)' }}>
              {filteredChats.map((chat) => (
                <ListItem
                  key={chat.id}
                  button
                  onClick={() => setSelectedChat(chat)}
                  selected={selectedChat?.id === chat.id}
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '&.Mui-selected': {
                      backgroundColor: '#fff0f0',
                      '&:hover': {
                        backgroundColor: '#ffe6e6',
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!chat.online}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar src={chat.avatar} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {chat.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {chat.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                          }}
                        >
                          {chat.lastMessage}
                        </Typography>
                        {chat.unread > 0 && (
                          <Badge
                            badgeContent={chat.unread}
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: '#ff6b6b',
                              },
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Chat Window */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!selectedChat.online}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar src={selectedChat.avatar} sx={{ mr: 2 }} />
                    </Badge>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedChat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedChat.online ? 'Online' : 'Last seen recently'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {loadingMessages ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <Typography variant="body2" color="text.secondary">Loading messages...</Typography>
                    </Box>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.isMine ? 'flex-end' : 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: '70%',
                              p: 2,
                              borderRadius: 3,
                              backgroundColor: message.isMine ? '#ff6b6b' : '#f5f5f5',
                              color: message.isMine ? 'white' : 'black',
                            }}
                          >
                            <Typography variant="body1">{message.message}</Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                mt: 0.5,
                                opacity: 0.8,
                                textAlign: 'right',
                              }}
                            >
                              {message.timestamp}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <AttachFile />
                          </IconButton>
                          <IconButton>
                            <PhotoCamera />
                          </IconButton>
                          <IconButton
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            sx={{
                              color: newMessage.trim() ? '#ff6b6b' : 'inherit',
                            }}
                          >
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Favorite sx={{ fontSize: 60, mb: 2, color: '#ff6b6b' }} />
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Choose from your existing conversations or start a new one with your matches
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatsPage; 