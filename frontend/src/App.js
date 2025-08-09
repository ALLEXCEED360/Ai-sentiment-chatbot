import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Paper, Typography, Box, Alert, Chip } from '@mui/material';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today? I can analyze the sentiment of your messages and respond accordingly!", sender: "bot", sentiment: "neutral" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await axios.post('http://localhost:5000/chat', { message: 'test' });
        setIsConnected(true);
        setError(null);
      } catch (error) {
        setIsConnected(false);
        setError('Cannot connect to backend server. Make sure your Flask app is running on port 5000.');
      }
    };
    
    testConnection();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input.trim(), sender: "user", sentiment: "neutral" };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/chat', { message: currentInput });
      const { reply, sentiment } = response.data;
      
      // Add a small delay to make the typing indicator visible
      setTimeout(() => {
        setMessages(prev => [...prev, { text: reply, sender: "bot", sentiment }]);
        setIsTyping(false);
      }, 800);
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setIsConnected(false);
      
      if (error.response) {
        setError(`Server error: ${error.response.status}`);
        setMessages(prev => [...prev, { text: "I'm having trouble processing that right now. Please try again.", sender: "bot", sentiment: "negative" }]);
      } else if (error.request) {
        setError('Cannot reach server. Please check if the backend is running.');
        setMessages(prev => [...prev, { text: "I can't connect to my brain right now! 🤖 Please make sure the backend server is running.", sender: "bot", sentiment: "negative" }]);
      } else {
        setError('An unexpected error occurred.');
        setMessages(prev => [...prev, { text: "Something unexpected happened. Please try again!", sender: "bot", sentiment: "negative" }]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageStyle = (sender, sentiment) => {
    if (sender === 'user') {
      return { 
        alignSelf: 'flex-end', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '25px 25px 8px 25px',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
        transform: 'translateY(0)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
        }
      };
    }

    const baseStyle = {
      alignSelf: 'flex-start',
      borderRadius: '25px 25px 25px 8px',
      transform: 'translateY(0)',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        transform: 'translateY(-2px)',
      }
    };

    switch (sentiment) {
      case 'positive': 
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          color: 'white',
          boxShadow: '0 8px 25px rgba(17, 153, 142, 0.3)',
          '&:hover': {
            ...baseStyle['&:hover'],
            boxShadow: '0 12px 35px rgba(17, 153, 142, 0.4)'
          }
        };
      case 'negative': 
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
          color: 'white',
          boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
          '&:hover': {
            ...baseStyle['&:hover'],
            boxShadow: '0 12px 35px rgba(255, 107, 107, 0.4)'
          }
        };
      default: 
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          color: 'white',
          boxShadow: '0 8px 25px rgba(116, 185, 255, 0.3)',
          '&:hover': {
            ...baseStyle['&:hover'],
            boxShadow: '0 12px 35px rgba(116, 185, 255, 0.4)'
          }
        };
    }
  };

  const getSentimentChip = (sentiment) => {
    const configs = {
      positive: { 
        color: 'success', 
        icon: '📈',
        style: { 
          background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
          color: 'white',
          fontWeight: 'bold'
        }
      },
      negative: { 
        color: 'error', 
        icon: '📉',
        style: { 
          background: 'linear-gradient(45deg, #f44336, #ff9800)',
          color: 'white',
          fontWeight: 'bold'
        }
      },
      neutral: { 
        color: 'default', 
        icon: '➖',
        style: { 
          background: 'linear-gradient(45deg, #607d8b, #90a4ae)',
          color: 'white',
          fontWeight: 'bold'
        }
      }
    };
    
    const config = configs[sentiment];
    
    return (
      <Chip 
        label={`${config.icon} ${sentiment.toUpperCase()}`} 
        size="small"
        sx={{ 
          ml: 1, 
          height: '24px', 
          fontSize: '0.75rem',
          ...config.style,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' }
          }
        }}
      />
    );
  };

  const clearChat = () => {
    setMessages([
      { text: "Chat cleared! How can I help you today?", sender: "bot", sentiment: "neutral" }
    ]);
    setError(null);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      '@keyframes gradientShift': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' }
      }
    }}>
      <Container maxWidth="md" sx={{ pt: 3, pb: 3 }}>
        {/* Floating Header */}
        <Paper 
          elevation={20}
          sx={{ 
            mb: 3, 
            p: 3, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(0)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Typography variant="h1" sx={{ fontSize: '2.5rem', mr: 1 }}>🧠</Typography>
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }}>
              Sentiment Analyzer
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ 
            color: '#666',
            fontWeight: 500,
            mb: 2
          }}>
            AI-Powered Emotion Detection
          </Typography>
          
          {/* Connection status with improved styling */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={isConnected ? "🟢 Connected" : "🔴 Disconnected"} 
              sx={{
                background: isConnected 
                  ? 'linear-gradient(45deg, #4caf50, #8bc34a)' 
                  : 'linear-gradient(45deg, #f44336, #ff9800)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}
            />
            <Button 
              size="small" 
              onClick={clearChat} 
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5252, #ffb74d)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              ✨ Clear Chat
            </Button>
          </Box>
        </Paper>

        {/* Error Alert with glassmorphism */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              background: 'rgba(244, 67, 54, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: '15px',
              color: '#d32f2f'
            }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Chat Container with glassmorphism */}
        <Paper 
          elevation={30} 
          sx={{ 
            height: '65vh', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: '30px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Messages Area */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(240,248,255,0.8) 100%)',
            position: 'relative'
          }}>
            {/* Floating particles background effect */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 70%, rgba(245, 87, 108, 0.1) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
              zIndex: 0
            }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {messages.map((msg, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    animation: 'slideIn 0.5s ease-out',
                    '@keyframes slideIn': {
                      '0%': { 
                        opacity: 0, 
                        transform: msg.sender === 'user' ? 'translateX(30px)' : 'translateX(-30px)' 
                      },
                      '100%': { 
                        opacity: 1, 
                        transform: 'translateX(0)' 
                      }
                    }
                  }}
                >
                  <Paper
                    elevation={8}
                    sx={{ 
                      p: 2, 
                      maxWidth: '80%', 
                      ...getMessageStyle(msg.sender, msg.sentiment),
                      wordWrap: 'break-word'
                    }}
                  >
                    <Typography sx={{ 
                      fontSize: '0.95rem', 
                      lineHeight: 1.4,
                      whiteSpace: 'pre-line'
                    }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                  {msg.sender === 'bot' && getSentimentChip(msg.sentiment)}
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Paper
                    elevation={8}
                    sx={{ 
                      p: 2, 
                      background: 'linear-gradient(45deg, #e8eaf6, #c5cae9)',
                      borderRadius: '25px 25px 25px 8px',
                      maxWidth: '75%',
                      animation: 'bounce 1.5s infinite',
                      '@keyframes bounce': {
                        '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                        '40%': { transform: 'translateY(-5px)' },
                        '60%': { transform: 'translateY(-3px)' }
                      }
                    }}
                  >
                    <Typography sx={{ 
                      fontStyle: 'italic', 
                      color: '#5c6bc0', 
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <span style={{ fontSize: '1rem', animation: 'spin 2s linear infinite' }}>🧠</span>
                      Analyzing your sentiment...
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 0.5,
                        '& > div': {
                          width: 4,
                          height: 4,
                          backgroundColor: '#5c6bc0',
                          borderRadius: '50%',
                          animation: 'typingDots 1.4s infinite ease-in-out'
                        },
                        '& > div:nth-of-type(1)': { animationDelay: '0s' },
                        '& > div:nth-of-type(2)': { animationDelay: '0.2s' },
                        '& > div:nth-of-type(3)': { animationDelay: '0.4s' },
                        '@keyframes typingDots': {
                          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                          '40%': { transform: 'scale(1)', opacity: 1 }
                        }
                      }}>
                        <div></div>
                        <div></div>
                        <div></div>
                      </Box>
                    </Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex', 
            gap: 2,
            alignItems: 'flex-end'
          }}>
            <TextField
              variant="outlined"
              placeholder="Share your thoughts and emotions..."
              fullWidth
              multiline
              maxRows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping || !isConnected}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid transparent',
                  backgroundClip: 'padding-box',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 1)',
                    border: '2px solid #667eea',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.2)'
                  }
                },
                '& .MuiInputBase-input': {
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: '#999',
                    fontStyle: 'italic'
                  }
                }
              }}
            />
            <Button 
              variant="contained" 
              onClick={sendMessage}
              disabled={!input.trim() || isTyping || !isConnected}
              sx={{ 
                borderRadius: '25px',
                minWidth: '100px',
                height: '56px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                background: isTyping 
                  ? 'linear-gradient(45deg, #bdbdbd, #e0e0e0)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)'
                },
                '&:disabled': {
                  background: 'linear-gradient(45deg, #bdbdbd, #e0e0e0)',
                  color: '#666'
                }
              }}
              startIcon={<span style={{ 
                fontSize: '1.2rem',
                transition: 'transform 0.3s ease',
                ...(isTyping && {
                  animation: 'sendPulse 1s infinite',
                  '@keyframes sendPulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' }
                  }
                })
              }}>🚀</span>}
            >
              {isTyping ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Box>
        </Paper>

        {/* Enhanced Instructions */}
        <Paper
          elevation={15}
          sx={{
            mt: 2,
            p: 2.5,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body1" sx={{ 
            color: '#555',
            fontWeight: 500,
            mb: 1
          }}>
            💭 Express yourself freely - I'll analyze your emotional state!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label="😊 Positive" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
            <Chip 
              label="😔 Negative" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(45deg, #f44336, #ff9800)',
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
            <Chip 
              label="😐 Neutral" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(45deg, #607d8b, #90a4ae)',
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;