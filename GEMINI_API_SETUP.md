# Setting up Google Gemini API for Agro Cloud Mandi

This guide explains how to configure the Google Gemini 1.5 Flash API for the AI chatbot feature in the Agro Cloud Mandi application.

## Getting Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create a New API Key**
   - Click "Create API Key"
   - Choose "Create API key in new project" or select an existing project
   - Copy the generated API key

3. **Set Up Environment Variables**
   - Copy `.env.example` to `.env` in your project root
   - Replace `your_gemini_api_key_here` with your actual API key:
   
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   VITE_USE_MOCK_RESPONSES=false
   ```

## Environment Configuration

### Production Setup
```env
# Required: Your Gemini API key
VITE_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Use mock responses as fallback
VITE_USE_MOCK_RESPONSES=false
```

### Development/Testing Setup
```env
# For testing without API key
VITE_GEMINI_API_KEY=
VITE_USE_MOCK_RESPONSES=true
```

## Features Enabled by Gemini API

The AI chatbot provides:

### 🌾 Agricultural Assistance
- Crop cultivation advice
- Pest and disease management
- Soil and weather guidance
- Best practices recommendations

### 💰 Market Navigation
- Price comparison guidance
- Market trend explanations
- Trading strategy advice
- Mandi location assistance

### 🗺️ Platform Navigation
- Feature explanations
- How-to guidance
- Troubleshooting help
- User support

### 💬 Smart Interactions
- Context-aware responses
- Agricultural terminology understanding
- Multi-language support (primarily English/Hindi)
- Conversation memory within session

## API Usage and Limits

### Free Tier Limits
- **Rate Limit**: 15 requests per minute
- **Daily Limit**: 1,500 requests per day
- **Monthly Limit**: 50,000 requests per month

### Best Practices
1. **Optimize Requests**: The app automatically optimizes prompts
2. **Fallback System**: Mock responses when API is unavailable
3. **Caching**: Responses are cached for similar queries
4. **Error Handling**: Graceful degradation with helpful error messages

## Troubleshooting

### Common Issues

**API Key Not Working**
- Verify the key is correctly copied
- Check if the key has proper permissions
- Ensure the Generative AI API is enabled in Google Cloud Console

**Rate Limit Exceeded**
- Wait for the rate limit to reset
- Implement user-side rate limiting
- Consider upgrading to paid tier for higher limits

**Network Errors**
- Check internet connection
- Verify firewall settings allow HTTPS requests to googleapis.com
- Check if corporate proxy is blocking requests

### Error Messages

The chatbot will show user-friendly messages:
- "I'm currently experiencing high traffic. Please try again in a moment."
- "I'm having trouble connecting. Let me help you with some common questions instead."
- "API service is temporarily unavailable. Here are some quick answers..."

## Security Considerations

### API Key Security
- ⚠️ **Never commit API keys to version control**
- Use environment variables only
- Rotate keys regularly
- Monitor usage in Google Cloud Console

### Frontend Exposure
Since this is a frontend application, the API key will be visible to users. Consider:
- Implementing rate limiting on your end
- Using a backend proxy for production
- Setting up API key restrictions in Google Cloud Console

### Recommended Restrictions
In Google Cloud Console, restrict your API key to:
- **Application restrictions**: HTTP referrers (websites)
- **Allowed referrers**: Your domain only
- **API restrictions**: Generative Language API only

## Production Deployment

### Backend Proxy (Recommended)
For production, consider proxying Gemini API calls through your backend:

```javascript
// Backend endpoint
app.post('/api/chat', async (req, res) => {
  const response = await geminiAPI.generateContent(req.body);
  res.json(response);
});
```

### Environment Variables for Production
```env
# Production backend API
VITE_CHAT_API_URL=https://your-api.com/api/chat
VITE_USE_BACKEND_PROXY=true

# Fallback to direct Gemini (not recommended for production)
VITE_GEMINI_API_KEY=your_key_here
```

## Monitoring and Analytics

### Usage Tracking
Monitor your API usage:
1. Google Cloud Console → APIs & Services → Quotas
2. Track daily/monthly usage
3. Set up billing alerts
4. Monitor error rates

### Performance Metrics
- Average response time
- Success/error rates
- User engagement with chatbot
- Most common query types

## Getting Help

### Resources
- [Google AI Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Google AI Community](https://developers.googleblog.com/search/label/AI)

### Support Channels
- GitHub Issues for app-specific problems
- Google AI Support for API issues
- Community forums for general guidance

---

**Note**: The Gemini API is currently in preview. Features and limits may change. Always refer to the official Google AI documentation for the most up-to-date information.
