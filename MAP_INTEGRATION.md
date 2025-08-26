# Agro Cloud Mandi - Map Integration

This document describes the integration of the Azure Maps-based Mandi Locator component into the main Agro Cloud Mandi application.

## 🚀 New Features Added

### 1. Agro Mandi Locator Page (`/agro-mandi-locator`)
- **Interactive Map**: Built with React Leaflet and OpenStreetMap tiles
- **Real-time Location**: GPS-based user location detection
- **Smart Search**: Location-based search with geocoding
- **Commodity Filtering**: Filter mandis by agricultural commodities
- **Route Planning**: Direct integration with Google Maps for directions
- **Responsive Design**: Mobile-friendly interface

### 2. Enhanced Navigation
- Added "Agro Mandi Locator" option in the main navigation
- Cross-linking between traditional list view and interactive map view
- Seamless navigation between different mandi finder interfaces

### 3. Map Components
- **MapComponent**: Interactive map with markers and popups
- **SearchPanel**: Location search and commodity filtering
- **MandiList**: Sidebar list with detailed mandi information
- **Integrated Directions**: One-click Google Maps integration

## 🛠️ Technical Implementation

### Dependencies Added
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "react-hot-toast": "^2.4.1",
  "framer-motion": "^10.16.4",
  "react-select": "^5.7.4",
  "date-fns": "^2.30.0"
}
```

### File Structure
```
src/
├── components/map/
│   ├── MapComponent.tsx      # Main interactive map
│   ├── SearchPanel.tsx       # Search and filters
│   └── MandiList.tsx         # Mandi listing component
├── services/map/
│   └── mapApiService.ts      # API service for map operations
├── utils/
│   └── mapHelpers.ts         # Map utility functions
└── pages/
    └── AgroMandiLocatorPage.tsx  # Main map page
```

### API Integration
- **Map API Service**: Handles communication with the map_component backend
- **Fallback Support**: Mock data when backend is unavailable
- **Error Handling**: Graceful degradation with user notifications

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Map Component API Configuration
VITE_MAP_API_URL=http://localhost:5000/api

# Optional: Enable mock data when API is not available
VITE_USE_MOCK_DATA=true
```

### Backend Setup (Optional)
To use the full Azure Maps integration:

1. Navigate to the `map_component/backend` directory
2. Install dependencies: `npm install`
3. Create `.env` file with Azure Maps credentials
4. Start the backend: `npm run dev`

The frontend will work with mock data if the backend is not available.

## 🎯 Key Features

### 1. Location Services
- **GPS Location**: Automatic user location detection
- **Manual Search**: Address-based location search
- **Geocoding**: Convert addresses to coordinates

### 2. Mandi Discovery
- **Proximity Search**: Find mandis within specified radius
- **Commodity Filtering**: Filter by crop types
- **Real-time Data**: Market status and operating hours
- **Detailed Information**: Ratings, facilities, contact details

### 3. Navigation Integration
- **Google Maps**: Direct directions integration
- **Route Optimization**: Multiple mandi route planning
- **Mobile Support**: Touch-friendly interface

### 4. User Experience
- **Toast Notifications**: Real-time feedback
- **Loading States**: Progress indicators
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on all screen sizes

## 🗺️ Map Component Backend

The map component includes a separate Node.js backend located in the `map_component/` folder:

### Backend Features
- **Azure Maps Integration**: Professional mapping services
- **Route Optimization**: TSP algorithms for optimal routes
- **Geocoding Services**: Address to coordinate conversion
- **Distance Matrix**: Calculate distances between multiple points
- **Mandi Database**: Searchable agricultural market data

### Backend API Endpoints
- `GET /api/mandis/nearby` - Find nearby mandis
- `POST /api/maps/route` - Calculate routes
- `GET /api/maps/geocode` - Geocode addresses
- `POST /api/mandis/price-recommendations` - Get price recommendations

## 🔄 Data Flow

1. **User Location**: Get GPS coordinates or manual search
2. **Mandi Search**: Query nearby agricultural markets
3. **Map Display**: Show mandis on interactive map
4. **Selection**: User selects mandis of interest
5. **Directions**: Generate routes to selected mandis

## 🎨 Styling

The integration uses:
- **Tailwind CSS**: Consistent with existing design system
- **Leaflet CSS**: Map-specific styling
- **Custom CSS**: Rating badges and map container styling

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Main app: http://localhost:3001
   - Agro Mandi Locator: http://localhost:3001/agro-mandi-locator

4. **Optional - Start Backend**:
   ```bash
   cd map_component/backend
   npm install
   npm run dev
   ```

## 🔗 Integration Points

### 1. Navigation Integration
- Added route in `App.tsx`
- Updated `Header.tsx` with new navigation option
- Cross-linking between list and map views

### 2. Coordinate Integration
The existing `MandiLocatorPage` now includes a "Get Directions" button that can send coordinates directly to the map component:

```typescript
// From MandiLocatorPage, coordinates can be passed to map component
const coordinates = {
  lat: mandi.location.coordinates.lat,
  lng: mandi.location.coordinates.lng
};
```

### 3. Seamless User Experience
- Users can start with the traditional list view
- Easily switch to the interactive map view
- Coordinates and selections are preserved across views

## 🎯 Future Enhancements

1. **Real-time Prices**: Integration with live market price APIs
2. **Weather Integration**: Weather data affecting market conditions
3. **Traffic Integration**: Real-time traffic for route optimization
4. **Offline Support**: Cache map data for offline usage
5. **Advanced Filters**: More sophisticated search criteria
6. **Social Features**: User reviews and ratings

## 🐛 Troubleshooting

### Common Issues

1. **Map Not Loading**: Check Leaflet CSS import order
2. **Location Permission**: Ensure browser location permission
3. **API Errors**: Verify backend is running or enable mock data
4. **Build Errors**: Check TypeScript types for Leaflet

### Debug Mode
Set `VITE_USE_MOCK_DATA=true` in `.env` to use mock data for development.

## 📱 Mobile Support

The map component is fully responsive and includes:
- Touch-friendly map controls
- Mobile-optimized search interface
- Swipe gestures for map navigation
- Responsive sidebar layout

This integration provides a comprehensive mapping solution while maintaining the existing functionality of the Agro Cloud Mandi application.
