# Agro Cloud Mandi - React Frontend

A modern, responsive React.js application for agricultural marketplace and price recommendations platform. This frontend provides smart recommendations for farmers and traders, ensuring fair market prices while considering proximity and market dynamics.

<<<<<<< HEAD
## 🌟 Features

### 🔐 Authentication System
- **Multi-user Support**: Separate registration/login for farmers and traders
- **Location-based Registration**: State and district selection with coordinates
- **Demo Credentials**: Quick testing with pre-configured accounts

### 📊 Smart Price Recommendations (Enhanced!)
- **AI-Powered Predictions**: Price forecasting with confidence levels
- **Market Comparison**: Interactive comparison across multiple mandis
- **Price Difference Analysis**: Real-time price variations and savings calculator
- **Grid & Table Views**: Switch between card view and comparison table
- **Quality Indicators**: Premium, Standard, Basic quality classifications
- **Market Trends**: Real-time trend analysis (up/down/stable)
- **Historical Data**: Price history and pattern analysis
- **Market Insights**: Weather, demand, and policy impact analysis

### 🤖 AI-Powered Chatbot (NEW!)
- **Google Gemini 1.5 Flash**: Advanced AI assistant for agricultural guidance
- **Smart Navigation**: Platform feature explanation and guidance
- **Agricultural Advice**: Crop cultivation, pest management, best practices
- **Market Assistance**: Price guidance, trading advice, mandi recommendations
- **Multi-language Support**: Primarily English with agricultural terminology
- **Context Awareness**: Understands farming and trading contexts
- **Doubt Clarification**: Instant answers to farming and platform questions

### 📊 API Documentation (NEW!)
- **Complete API Reference**: Comprehensive documentation for all endpoints
- **Interactive Examples**: Code samples and request/response examples
- **Authentication Guide**: JWT token implementation details
- **Rate Limiting**: API usage limits and best practices
- **Error Handling**: Common errors and troubleshooting guide

### 📍 Mandi Locator
- **Location-based Search**: Find nearby mandis with distance calculation
- **Commodity Filtering**: Filter by specific crops and commodities
- **Distance Control**: Adjustable search radius (10-100 km)
- **Detailed Information**: Ratings, active traders, facilities, and contact details

### 🗺️ Agro Mandi Locator (NEW!)
- **Interactive Maps**: Azure Maps-powered interactive mapping with React Leaflet
- **Real-time GPS**: Automatic location detection and manual search
- **Smart Route Planning**: Optimized routes with Google Maps integration
- **Visual Markers**: Color-coded mandi markers with detailed popups
- **Mobile-First Design**: Touch-friendly interface with responsive layout
- **Live Directions**: One-click navigation to selected mandis

### 👤 User Profiles
- **Farmer Profiles**: Farm size, crop portfolio, irrigation methods, soil type
- **Trader Profiles**: Business details, storage capacity, trading radius, specialization
- **Activity Tracking**: Recent transactions and market interactions

### 🎯 Dashboard
- **Personalized Insights**: Role-based dashboard for farmers and traders
- **Quick Actions**: Easy access to key features
- **Market Summary**: Recent prices, nearby mandis, smart recommendations
- **Activity Feed**: Recent user activities and transactions

## 🚀 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (modern, fast development)
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router v6 for navigation
- **HTTP Client**: Axios for API communication
- **State Management**: React Context API for authentication
- **Icons**: Heroicons and Lucide React

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   └── Footer.tsx       # Site footer
├── pages/               # Main application pages
│   ├── HomePage.tsx     # Landing page
│   ├── LoginPage.tsx    # Authentication
│   ├── RegisterPage.tsx # User registration
│   ├── DashboardPage.tsx # User dashboard
│   ├── PriceRecommendationsPage.tsx # Price insights
│   ├── MandiLocatorPage.tsx # Mandi finder
│   ├── FarmerProfilePage.tsx # Farmer profile
│   └── TraderProfilePage.tsx # Trader profile
├── context/             # React Context providers
│   └── AuthContext.tsx  # Authentication state
├── services/            # API service layers
│   ├── api.ts          # Base API configuration
│   ├── authAPI.ts      # Authentication endpoints
│   ├── priceAPI.ts     # Price-related APIs
│   └── mandiAPI.ts     # Mandi-related APIs
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Steps

1. **Clone & Navigate**
   ```bash
   cd "Agro Cloud Mandi"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional)
   Create a `.env` file for custom API endpoint:
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to `http://localhost:3000`

## 🎮 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🔗 API Integration

The frontend is designed to work with a REST API backend. All API calls include:

- **Authentication**: JWT token-based authentication
- **Error Handling**: Automatic token refresh and error management
- **Mock Data**: Fallback mock data for development without backend
- **Interceptors**: Request/response interceptors for consistent behavior

### API Endpoints Structure

```
/api/auth/          # Authentication endpoints
/api/prices/        # Price recommendation endpoints
/api/mandis/        # Mandi locator endpoints
/api/users/         # User profile endpoints
```

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessible Forms**: Proper labeling and keyboard navigation
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Boundaries**: Graceful error handling and user feedback
- **Toast Notifications**: Success/error notifications (ready to integrate)
- **Dark Mode Ready**: CSS structure prepared for theme switching

## 📱 Mobile Responsiveness

- **Breakpoints**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Touch-friendly**: Large tap targets and swipe gestures
- **Performance**: Optimized images and lazy loading ready
- **PWA Ready**: Structure prepared for Progressive Web App conversion

## 🔒 Security Features

- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: Sanitized inputs and outputs
- **HTTPS Ready**: Secure API communication
- **Token Management**: Secure JWT token storage and rotation

## 🧪 Demo Features

### Test Credentials
- **Farmer**: `farmer@demo.com` / `demo123`
- **Trader**: `trader@demo.com` / `demo123`

### Mock Data Includes
- Sample crop prices with trends
- Nearby mandi locations in Punjab
- User profiles with realistic data
- Market insights and recommendations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Popular Platforms
- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist/` to S3 bucket

## 🤝 API Backend Integration

To integrate with a real backend:

1. **Update API Base URL** in `src/services/api.ts`
2. **Remove Mock Data** from service files
3. **Configure CORS** on your backend server
4. **Update Authentication** flow based on your JWT implementation

## 📈 Performance Optimizations

- **Code Splitting**: Route-based lazy loading ready
- **Bundle Optimization**: Vite's built-in optimizations
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP support and lazy loading ready

## 🔧 Customization

### Adding New Features
1. Create new page in `src/pages/`
2. Add route in `App.tsx`
3. Create API service in `src/services/`
4. Update navigation in `Header.tsx`

### Styling Customization
- Edit `tailwind.config.js` for theme changes
- Modify `src/index.css` for global styles
- Use Tailwind utilities for component styling

## 📊 Future Enhancements

- [ ] Real-time price updates with WebSocket
- [ ] Interactive maps with Google Maps/Mapbox
- [ ] Push notifications for price alerts
- [ ] Offline support with service workers
- [ ] Advanced filters and search
- [ ] Data visualization with charts
- [ ] Multi-language support (i18n)
- [ ] Voice search capability

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Clear `node_modules` and reinstall
2. **Styling Issues**: Ensure Tailwind CSS is properly configured
3. **API Errors**: Check network tab and API endpoint configuration
4. **Authentication Issues**: Clear localStorage and re-login

## 📄 License

This project is created for educational and development purposes. Please ensure compliance with your organization's policies when using in production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for farmers and traders** 🌾

For questions or support, please refer to the documentation or create an issue in the repository.
=======


>>>>>>> d941ca8e21f6f73e6639c80f8f09982618ec9f8b
