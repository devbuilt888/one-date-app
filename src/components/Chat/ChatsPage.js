import React, { useState } from 'react';
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
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Send,
  Search,
  MoreVert,
  Favorite,
  PhotoCamera,
  AttachFile,
} from '@mui/icons-material';

const ChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock chat data
  const chats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/images/users/sarahJohnson.jpeg',
      lastMessage: 'That sounds amazing! I love hiking too 😊',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: 'Sarah', message: 'Hi! Thanks for the like!', timestamp: '10:30 AM', isMine: false },
        { id: 2, sender: 'You', message: 'Hey Sarah! You seem really interesting. Love your hiking photos!', timestamp: '10:32 AM', isMine: true },
        { id: 3, sender: 'Sarah', message: 'Thank you! I see you\'re into photography too. We should go on a photo walk sometime!', timestamp: '10:35 AM', isMine: false },
        { id: 4, sender: 'You', message: 'That sounds amazing! I know some great spots around the city.', timestamp: '10:37 AM', isMine: true },
        { id: 5, sender: 'Sarah', message: 'That sounds amazing! I love hiking too 😊', timestamp: '10:40 AM', isMine: false },
      ]
    },
    {
      id: 2,
      name: 'Emma Wilson',
      avatar: '/images/users/emmaWilson.jpeg',
      lastMessage: 'Would love to check out that new restaurant!',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'Emma', message: 'Hey! How\'s your day going?', timestamp: '9:15 AM', isMine: false },
        { id: 2, sender: 'You', message: 'Pretty good! Just finished work. How about you?', timestamp: '9:18 AM', isMine: true },
        { id: 3, sender: 'Emma', message: 'Same here! I saw you like Italian food. Have you tried that new place downtown?', timestamp: '9:20 AM', isMine: false },
        { id: 4, sender: 'You', message: 'No, but I\'ve been wanting to! Want to check it out together?', timestamp: '9:22 AM', isMine: true },
        { id: 5, sender: 'Emma', message: 'Would love to check out that new restaurant!', timestamp: '9:25 AM', isMine: false },
      ]
    },
    {
      id: 3,
      name: 'Olivia Brown',
      avatar: '/images/users/oliviaBrown.jpeg',
      lastMessage: 'The art gallery was incredible!',
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
      messages: [
        { id: 1, sender: 'Olivia', message: 'The art gallery was incredible!', timestamp: '2:45 PM', isMine: false },
      ]
    },
    {
      id: 4,
      name: 'Ava Davis',
      avatar: '/images/users/avaDavis.jpeg',
      lastMessage: 'Let\'s plan that workout session!',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'Ava', message: 'Hey! Loved your profile. We have so much in common!', timestamp: 'Yesterday 6:20 PM', isMine: false },
        { id: 2, sender: 'You', message: 'Thanks! I see you\'re really into fitness. That\'s awesome!', timestamp: 'Yesterday 6:25 PM', isMine: true },
        { id: 3, sender: 'Ava', message: 'Let\'s plan that workout session!', timestamp: 'Yesterday 6:30 PM', isMine: false },
      ]
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // In a real app, this would send the message to a backend
      const updatedChat = {
        ...selectedChat,
        messages: [
          ...selectedChat.messages,
          {
            id: selectedChat.messages.length + 1,
            sender: 'You',
            message: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: true,
          }
        ]
      };
      setSelectedChat(updatedChat);
      setNewMessage('');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 10, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Messages
      </Typography>

      <Grid container spacing={2} sx={{ height: '70vh' }}>
        {/* Chat List */}
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={8}>
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
                  {selectedChat.messages.map((message) => (
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