import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  formatDistance, 
  getMarkerColor, 
  getRatingColor,
  isMarketOpen,
  getCommodityIcon
} from '../utils/helpers';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Custom icon for mandis
const createMandiIcon = (type, isSelected = false) => {
  const color = getMarkerColor(type);
  const opacity = isSelected ? 1 : 0.8;
  
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" opacity="${opacity}" class="w-6 h-6">
        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>
    `),
    iconSize: isSelected ? [30, 30] : [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const MapComponent = ({ 
  mandis = [], 
  selectedMandis = [], 
  userLocation, 
  optimalRoute, 
  onMandiSelect 
}) => {
  const [map, setMap] = useState(null);
  
  // Default center (Delhi)
  const defaultCenter = [28.6139, 77.2090];
  const center = userLocation ? [userLocation.lat, userLocation.lon] : defaultCenter;

  useEffect(() => {
    if (map && userLocation) {
      map.setView([userLocation.lat, userLocation.lon], 10);
    }
  }, [map, userLocation]);

  useEffect(() => {
    if (map && mandis.length > 0) {
      const group = new L.featureGroup(mandis.map(mandi => 
        L.marker([mandi.latitude, mandi.longitude])
      ));
      
      if (userLocation) {
        group.addLayer(L.marker([userLocation.lat, userLocation.lon]));
      }
      
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, mandis, userLocation]);

  const isMandiSelected = (mandi) => {
    return selectedMandis.some(selected => selected.id === mandi.id);
  };

  const renderRoutePolyline = () => {
    if (!optimalRoute || !optimalRoute.routePlan || !optimalRoute.routePlan.detailedRoutes) {
      return null;
    }

    return optimalRoute.routePlan.detailedRoutes.map((segment, index) => {
      if (segment.route && segment.route.routePoints) {
        const positions = segment.route.routePoints.map(point => [
          point.latitude, 
          point.longitude
        ]);
        
        return (
          <Polyline
            key={`route-${index}`}
            positions={positions}
            color="#22c55e"
            weight={4}
            opacity={0.7}
          />
        );
      }
      return null;
    });
  };

  const MarkerPopup = ({ mandi }) => {
    const selected = isMandiSelected(mandi);
    const marketOpen = isMarketOpen(mandi.operatingHours);
    
    return (
      <Popup>
        <div className="min-w-64 p-2">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">{mandi.name}</h3>
            <div className="flex items-center space-x-1">
              <span 
                className="px-2 py-1 text-xs rounded-full"
                style={{ 
                  backgroundColor: getRatingColor(mandi.rating) + '20',
                  color: getRatingColor(mandi.rating)
                }}
              >
                ⭐ {mandi.rating}
              </span>
              {mandi.isVerified && (
                <span className="text-green-600 text-xs">✓</span>
              )}
            </div>
          </div>
          
          <div className="space-y-1 text-xs text-gray-600 mb-3">
            <p>📍 {mandi.address}</p>
            <p>🏷️ {mandi.type} market</p>
            <p>🕒 {mandi.operatingHours} 
              <span className={`ml-1 font-medium ${marketOpen ? 'text-green-600' : 'text-red-600'}`}>
                ({marketOpen ? 'Open' : 'Closed'})
              </span>
            </p>
            {mandi.distance && (
              <p>📏 {formatDistance(mandi.distance * 1000)} away</p>
            )}
          </div>
          
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Commodities:</p>
            <div className="flex flex-wrap gap-1">
              {mandi.commodities.slice(0, 4).map((commodity, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {getCommodityIcon(commodity)} {commodity}
                </span>
              ))}
              {mandi.commodities.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{mandi.commodities.length - 4} more
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onMandiSelect(mandi)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selected
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              {selected ? '✓ Selected' : '+ Select'}
            </button>
            
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mandi.latitude},${mandi.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              🧭 Directions
            </a>
          </div>
        </div>
      </Popup>
    );
  };

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User location marker */}
      {userLocation && (
        <Marker 
          position={[userLocation.lat, userLocation.lon]} 
          icon={userLocationIcon}
        >
          <Popup>
            <div className="text-center p-2">
              <h4 className="font-medium text-gray-900">📍 Your Location</h4>
              <p className="text-xs text-gray-600 mt-1">
                {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Mandi markers */}
      {mandis.map((mandi) => (
        <Marker
          key={mandi.id}
          position={[mandi.latitude, mandi.longitude]}
          icon={createMandiIcon(mandi.type, isMandiSelected(mandi))}
          eventHandlers={{
            click: () => onMandiSelect(mandi),
          }}
        >
          <MarkerPopup mandi={mandi} />
        </Marker>
      ))}
      
      {/* Route polylines */}
      {renderRoutePolyline()}
    </MapContainer>
  );
};

export default MapComponent;
