import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Close,
  Minimize,
  Refresh,
} from '@mui/icons-material';

const AIChat = ({ isMinimized, onToggleMinimize, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI dating coach. I can help you with conversation starters, profile tips, dating advice, and more. What would you like to talk about?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call our secure Supabase Edge Function instead of OpenAI directly
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get AI response')
      }

      const aiData = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiData.message,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      let errorText = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      
      if (error.message?.includes('API key')) {
        errorText = "Please make sure your OpenAI API key is properly configured in the .env file.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
    "How can I improve my dating profile?",
    "Give me some conversation starters",
    "What should I wear on a first date?",
    "How do I know if someone is interested?",
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  if (isMinimized) {
    return (
      <Card 
        onClick={onToggleMinimize}
        sx={{ 
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: 280,
          cursor: 'pointer',
          zIndex: 1000,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'grey.200',
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ backgroundColor: 'secondary.main', width: 32, height: 32 }}>
            <SmartToy sx={{ fontSize: 20 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight="600">
              AI Dating Coach
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to expand
            </Typography>
          </Box>
          <Chip label="Online" color="success" size="small" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper 
      elevation={3}
      sx={{ 
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 380,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: 'secondary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
            <SmartToy sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              AI Dating Coach
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Online
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton size="small" onClick={onToggleMinimize} sx={{ color: 'white', mr: 0.5 }}>
            <Minimize fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2,
          backgroundColor: 'background.default',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 2,
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.sender === 'ai' && (
              <Avatar 
                sx={{ 
                  backgroundColor: message.isError ? 'error.light' : 'secondary.light',
                  color: message.isError ? 'error.main' : 'secondary.main',
                  width: 32, 
                  height: 32, 
                  mr: 1,
                }}
              >
                <SmartToy sx={{ fontSize: 16 }} />
              </Avatar>
            )}
            
            <Box sx={{ maxWidth: '75%' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  backgroundColor: message.sender === 'user' ? 'secondary.main' : 'background.paper',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  border: message.isError ? '1px solid' : 'none',
                  borderColor: message.isError ? 'error.main' : 'transparent',
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {message.text}
                </Typography>
              </Paper>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  display: 'block',
                  mt: 0.5,
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                }}
              >
                {formatTime(message.timestamp)}
              </Typography>
            </Box>

            {message.sender === 'user' && (
              <Avatar 
                sx={{ 
                  backgroundColor: 'primary.main',
                  width: 32, 
                  height: 32, 
                  ml: 1,
                }}
              >
                <Person sx={{ fontSize: 16 }} />
              </Avatar>
            )}
          </Box>
        ))}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Try asking:
            </Typography>
            <Stack spacing={1}>
              {suggestedQuestions.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSuggestedQuestion(question)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Avatar sx={{ backgroundColor: 'secondary.light', width: 32, height: 32 }}>
              <SmartToy sx={{ fontSize: 16, color: 'secondary.main' }} />
            </Avatar>
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Thinking...
              </Typography>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Ask me anything about dating..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            sx={{
              backgroundColor: 'secondary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
              },
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default AIChat; 