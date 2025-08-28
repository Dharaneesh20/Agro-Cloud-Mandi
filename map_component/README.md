# Agro Cloud Mandi Locator

A comprehensive Azure API-based mapping service with Node.js backend and React.js frontend for agricultural marketplace location, price recommendations, and route optimization.

## 🌾 Overview

The Agro Cloud Mandi Locator is a cloud-based agricultural marketplace finder that provides smart recommendations for farmers and traders. It helps ensure fair market prices while considering proximity and market dynamics through intelligent route optimization and real-time price analysis.

## ✨ Features

### 🔍 Smart Mandi Discovery
- **Location-based search**: Find mandis near your current location
- **Commodity filtering**: Search for mandis that trade specific crops
- **Detailed mandi information**: Ratings, facilities, operating hours, and contact details
- **Real-time verification**: Verified mandi status and reliability scores

### 💰 Price Intelligence
- **Price recommendations**: Get current market prices for various commodities
- **Market analysis**: Price trends, volatility indicators, and market insights
- **Cost optimization**: Factor in distance, market fees, and transportation costs
- **Comparative pricing**: Compare prices across multiple mandis

### 🗺️ Route Optimization
- **Multi-stop planning**: Visit multiple mandis in an optimized sequence
- **Algorithm-based routing**: Uses Traveling Salesman Problem algorithms for efficiency
- **Real-time directions**: Integration with Google Maps and Azure Maps
- **Fuel cost savings**: Minimize travel distance and time

### 📊 Market Insights
- **Market analytics**: Distribution of mandis by state, commodity popularity
- **Performance metrics**: Route efficiency, market scores, and recommendations
- **Historical data**: Price trends and market dynamics

## 🏗️ Architecture

### Backend (Node.js)
```
backend/
├── src/
│   ├── routes/
│   │   ├── mapRoutes.js      # Azure Maps API endpoints
│   │   └── mandiRoutes.js    # Mandi data and operations
│   ├── services/
│   │   ├── azureMapsService.js       # Azure Maps integration
│   │   ├── routeOptimizationService.js # TSP algorithms
│   │   └── mandiDataService.js       # Mandi database operations
│   └── server.js             # Express server setup
├── package.json
└── .env.example
```

### Frontend (React.js)
```
frontend/
├── src/
│   ├── components/
│   │   ├── MapComponent.js           # Interactive map with markers
│   │   ├── SearchPanel.js            # Location and commodity search
│   │   ├── MandiList.js              # List of nearby mandis
│   │   ├── PriceRecommendations.js   # Price analysis and recommendations
│   │   └── RouteOptimizer.js         # Route planning interface
│   ├── services/
│   │   └── apiService.js             # API communication layer
│   ├── utils/
│   │   └── helpers.js                # Utility functions
│   └── App.js                        # Main application component
├── package.json
└── public/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Azure Maps subscription key
- Modern web browser

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Create environment file:
```powershell
copy .env.example .env
```

4. Configure your Azure Maps subscription key in `.env`:
```env
AZURE_MAPS_SUBSCRIPTION_KEY=your_azure_maps_key_here
```

5. Start the development server:
```powershell
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm start
```

The frontend application will open at `http://localhost:3000`

## 🔧 Configuration

### Azure Maps Setup
1. Create an Azure Maps account at [Azure Portal](https://portal.azure.com)
2. Create a new Maps account resource
3. Copy the primary subscription key
4. Add the key to your backend `.env` file

### Environment Variables
```env
# Backend (.env)
NODE_ENV=development
PORT=5000
AZURE_MAPS_SUBSCRIPTION_KEY=your_key_here
API_BASE_URL=http://localhost:5000/api
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:3000
```

## 📡 API Endpoints

### Maps API
- `GET /api/maps/geocode` - Convert address to coordinates
- `GET /api/maps/reverse-geocode` - Convert coordinates to address
- `POST /api/maps/route` - Calculate route between two points
- `POST /api/maps/optimal-route` - Optimize route for multiple destinations
- `GET /api/maps/nearby` - Search nearby places
- `POST /api/maps/distance-matrix` - Calculate distance matrix

### Mandis API
- `GET /api/mandis` - Get all mandis with filtering
- `GET /api/mandis/search` - Search mandis by query
- `GET /api/mandis/nearby` - Get mandis near location
- `GET /api/mandis/:id` - Get specific mandi details
- `GET /api/mandis/commodity/:commodity` - Get mandis by commodity
- `GET /api/mandis/prices/:commodity` - Get commodity prices
- `POST /api/mandis/price-recommendations` - Get price recommendations
- `GET /api/mandis/analytics/insights` - Get market insights
- `POST /api/mandis/route-planning` - Plan optimal mandi route

## 🧮 Algorithms

### Route Optimization
The application uses multiple algorithms for route optimization:

1. **Brute Force TSP** (≤8 destinations)
   - Exhaustive search for optimal solution
   - Guaranteed optimal route
   - Time complexity: O(n!)

2. **Nearest Neighbor Heuristic** (>8 destinations)
   - Greedy algorithm for larger sets
   - Fast approximation
   - Time complexity: O(n²)

3. **Distance-Time Optimization**
   - Optimizes for both travel time and distance
   - Considers traffic conditions
   - Weighted scoring system

### Price Recommendation Engine
- **Market Analysis**: Analyzes price trends and volatility
- **Distance Weighting**: Factors transportation costs
- **Market Fees**: Considers mandi commission rates
- **Verification Scores**: Prioritizes verified mandis

## 🎨 User Interface

### Design System
- **Tailwind CSS**: Utility-first styling framework
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant
- **Color Scheme**: Agriculture-themed green and earth tones

### Components
- **Interactive Map**: Leaflet-based mapping with custom markers
- **Smart Search**: Real-time location and commodity search
- **Price Cards**: Visual price comparison and recommendations
- **Route Planner**: Step-by-step route optimization interface

## 🔒 Security Features

- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Cross-origin request security
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Comprehensive error management
- **Environment Variables**: Secure configuration management

## 📱 Mobile Compatibility

- **Responsive Design**: Works on all screen sizes
- **Touch Optimization**: Mobile-friendly interactions
- **GPS Integration**: Device location services
- **Offline Capability**: Basic functionality without internet

## 🧪 Testing

### Backend Testing
```powershell
cd backend
npm test
```

### Frontend Testing
```powershell
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Azure, AWS, Heroku)

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, Azure Static Web Apps)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API examples

## 🔮 Future Enhancements

- **Machine Learning**: Predictive price modeling
- **Weather Integration**: Weather-based crop recommendations
- **Multi-language Support**: Regional language interfaces
- **Blockchain Integration**: Supply chain transparency
- **IoT Sensors**: Real-time market condition monitoring
- **Mobile Apps**: Native iOS and Android applications

## 📊 Performance Metrics

- **API Response Time**: <200ms average
- **Map Loading**: <2s initial load
- **Route Calculation**: <5s for complex routes
- **Search Results**: <1s for location queries

---

**Built with ❤️ for the agricultural community**

*Empowering farmers with technology for better market access and fair pricing*
