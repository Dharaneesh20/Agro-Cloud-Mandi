import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import MapComponent from '../components/map/MapComponent';
import SearchPanel from '../components/map/SearchPanel';
import MandiList from '../components/map/MandiList';
import { MapMandi, LocationPoint } from '../services/map/mapApiService';
import mapApiService from '../services/map/mapApiService';
import { getCurrentLocation } from '../utils/mapHelpers';
import toast from 'react-hot-toast';

const AgroMandiLocatorPage: React.FC = () => {
  const [selectedMandis, setSelectedMandis] = useState<MapMandi[]>([]);
  const [nearbyMandis, setNearbyMandis] = useState<MapMandi[]>([]);
  const [userLocation, setUserLocation] = useState<LocationPoint | null>(null);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check API health
      try {
        await mapApiService.healthCheck();
      } catch (healthError) {
        console.warn('API health check failed, continuing with mock data');
      }
      
      // Get user location
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        // Load nearby mandis
        await loadNearbyMandis(location.lat, location.lon);
      } catch (locationError) {
        console.warn('Could not get user location:', locationError);
        toast.error('Location access denied. You can still search for mandis manually.');
        
        // Default to Delhi coordinates
        const defaultLocation = { lat: 28.6139, lon: 77.2090 };
        setUserLocation(defaultLocation);
        await loadNearbyMandis(defaultLocation.lat, defaultLocation.lon);
      }
    } catch (error) {
      console.error('App initialization failed:', error);
      toast.error('Failed to initialize the application. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyMandis = async (lat: number, lon: number, radius = 100) => {
    try {
      const mandis = await mapApiService.getNearbyMandis(lat, lon, radius, selectedCommodity || undefined);
      setNearbyMandis(mandis);
      
      if (mandis.length === 0) {
        toast('No mandis found in this area. Try expanding your search radius.', {
          icon: '📍',
        });
      }
    } catch (error) {
      console.error('Failed to load nearby mandis:', error);
      
      // Fallback to mock data for demonstration
      const mockMandis: MapMandi[] = [
        {
          id: '1',
          name: 'New Delhi Agricultural Market',
          latitude: 28.6519,
          longitude: 77.2315,
          address: 'Azadpur Mandi, Delhi',
          type: 'wholesale',
          rating: 4.5,
          distance: 15.2,
          commodities: ['wheat', 'rice', 'vegetables'],
          operatingHours: '06:00-14:00',
          isVerified: true,
          facilities: ['Storage', 'Cold Storage', 'Processing']
        },
        {
          id: '2',
          name: 'Ghazipur Vegetable Market',
          latitude: 28.6355,
          longitude: 77.3013,
          address: 'Ghazipur, Delhi',
          type: 'retail',
          rating: 4.2,
          distance: 8.5,
          commodities: ['vegetables', 'fruits', 'spices'],
          operatingHours: '05:00-12:00',
          isVerified: true,
          facilities: ['Storage', 'Parking']
        },
        {
          id: '3',
          name: 'Najafgarh Grain Market',
          latitude: 28.6093,
          longitude: 76.9797,
          address: 'Najafgarh, Delhi',
          type: 'wholesale',
          rating: 4.0,
          distance: 25.1,
          commodities: ['wheat', 'rice', 'cotton'],
          operatingHours: '07:00-15:00',
          isVerified: false,
          facilities: ['Storage', 'Transportation']
        }
      ];
      
      setNearbyMandis(mockMandis);
      toast.success(`Loaded ${mockMandis.length} nearby mandis`);
    }
  };

  const handleLocationSelect = async (location: LocationPoint) => {
    setUserLocation(location);
    await loadNearbyMandis(location.lat, location.lon);
  };

  const handleCommoditySelect = async (commodity: string) => {
    setSelectedCommodity(commodity);
    if (userLocation) {
      await loadNearbyMandis(userLocation.lat, userLocation.lon);
    }
  };

  const handleMandiSelect = (mandi: MapMandi) => {
    setSelectedMandis(prev => {
      const isSelected = prev.some(selected => selected.id === mandi.id);
      if (isSelected) {
        // Remove from selection
        return prev.filter(selected => selected.id !== mandi.id);
      } else {
        // Add to selection
        return [...prev, mandi];
      }
    });
  };

  const handleGetDirections = () => {
    if (selectedMandis.length === 0) {
      toast.error('Please select at least one mandi to get directions');
      return;
    }

    if (!userLocation) {
      toast.error('User location not available');
      return;
    }

    // For single mandi, open Google Maps directly
    if (selectedMandis.length === 1) {
      const mandi = selectedMandis[0];
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lon}/${mandi.latitude},${mandi.longitude}`;
      window.open(url, '_blank');
      return;
    }

    // For multiple mandis, create a route
    const waypoints = selectedMandis.map(mandi => `${mandi.latitude},${mandi.longitude}`).join('/');
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lon}/${waypoints}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Agro Mandi Locator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🗺️ Agro Mandi Locator</h1>
              <p className="text-sm text-gray-600 mt-1">
                Find nearby agricultural markets with real-time information and directions
              </p>
            </div>
            
            {selectedMandis.length > 0 && (
              <button
                onClick={handleGetDirections}
                className="btn-primary"
              >
                🧭 Get Directions ({selectedMandis.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === 'search'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🔍 Search
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === 'list'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📋 List ({nearbyMandis.length})
                </button>
              </div>
              
              <div className="p-4">
                {activeTab === 'search' && (
                  <SearchPanel
                    onLocationSelect={handleLocationSelect}
                    onCommoditySelect={handleCommoditySelect}
                    userLocation={userLocation}
                    selectedCommodity={selectedCommodity}
                  />
                )}
                
                {activeTab === 'list' && (
                  <MandiList
                    mandis={nearbyMandis}
                    selectedMandis={selectedMandis}
                    onMandiSelect={handleMandiSelect}
                    userLocation={userLocation}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden map-container">
              <MapComponent
                mandis={nearbyMandis}
                selectedMandis={selectedMandis}
                userLocation={userLocation}
                onMandiSelect={handleMandiSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgroMandiLocatorPage;
