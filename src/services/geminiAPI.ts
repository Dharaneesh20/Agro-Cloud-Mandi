import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

class GeminiAPIService {
  private apiKey: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
  }

  async sendMessage(message: string, context: string = ''): Promise<string> {
    if (!this.apiKey) {
      return this.getMockResponse(message);
    }

    try {
      const systemPrompt = `You are an agricultural assistant for Agro Cloud Mandi platform. You help farmers and traders with:
1. Market navigation and platform guidance
2. Price analysis and recommendations
3. Agricultural advice and best practices
4. Mandi information and location guidance
5. Crop market insights

Context about the platform:
- Users can check real-time crop prices across different mandis
- Compare prices between multiple markets
- Get AI-powered price predictions
- Find nearby mandis with interactive maps
- Access farmer and trader profiles
- Get personalized recommendations

${context}

Please provide helpful, accurate, and concise responses related to agriculture, markets, and the platform features. Keep responses friendly and informative.`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 1024,
        }
      };

      const response = await axios.post(`${GEMINI_API_URL}?key=${this.apiKey}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const geminiResponse: GeminiResponse = response.data;
      
      if (geminiResponse.candidates && geminiResponse.candidates[0]) {
        return geminiResponse.candidates[0].content.parts[0].text;
      }
      
      return 'I apologize, but I encountered an issue processing your request. Please try again.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return this.getMockResponse(message);
    }
  }

  private getMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return '🌾 For current market prices, you can use our price comparison tool to check rates across different mandis. I recommend comparing at least 3 markets to get the best deal. Would you like me to guide you to the price comparison feature?';
    }
    
    if (lowerMessage.includes('mandi') || lowerMessage.includes('location')) {
      return '📍 You can find nearby mandis using our interactive map feature. It shows real-time locations, distances, and contact information. Would you like me to help you navigate to the mandi locator?';
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('farming')) {
      return '🌱 I can help you with crop-related queries! Our platform provides insights on various crops including wheat, rice, maize, and more. What specific crop information do you need?';
    }
    
    if (lowerMessage.includes('navigation') || lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return '🗺️ I can help you navigate the platform! Here are the main features:\n\n• 📊 Smart Price Recommendations - Compare prices across markets\n• 📍 Interactive Mandi Locator - Find nearby mandis\n• 👤 Profile Management - Manage your farmer/trader profile\n• 📈 Market Analysis - Get AI-powered insights\n\nWhat would you like to explore?';
    }
    
    return '👋 Hello! I\'m your agricultural assistant. I can help you with market prices, mandi locations, crop advice, and platform navigation. What would you like to know about?';
  }
}

export const geminiAPI = new GeminiAPIService();
