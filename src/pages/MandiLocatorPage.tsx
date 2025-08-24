import React, { useState, useEffect } from 'react';

interface Mandi {
  id: string;
  name: string;
  location: {
    district: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    address?: string;
  };
  distance?: number;
  activeTraders: number;
  commodities: string[];
  avgPrice: number;
  rating: number;
  facilities: string[];
  operatingHours: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  contact: {
    phone?: string;
    email?: string;
  };
}

const MandiLocatorPage: React.FC = () => {
  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchMandis();
  }, []);

  const fetchMandis = async () => {
    setLoading(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockMandis: Mandi[] = [
        {
          id: '1',
          name: 'Ludhiana Grain Market',
          location: {
            district: 'Ludhiana',
            state: 'Punjab',
            coordinates: { lat: 30.901, lng: 75.857 },
            address: 'Grain Market Road, Ludhiana, Punjab'
          },
          distance: 12,
          activeTraders: 45,
          commodities: ['Wheat', 'Rice', 'Maize'],
          avgPrice: 2200,
          rating: 4.5,
          facilities: ['Storage', 'Transport', 'Quality Testing', 'Banking'],
          operatingHours: {
            open: '06:00',
            close: '18:00',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          },
          contact: {
            phone: '+91-9876543210',
            email: 'info@ludhianamandi.com'
          }
        },
        {
          id: '2',
          name: 'Amritsar Agricultural Mandi',
          location: {
            district: 'Amritsar',
            state: 'Punjab',
            coordinates: { lat: 31.634, lng: 74.872 },
            address: 'Agricultural Market, Amritsar, Punjab'
          },
          distance: 18,
          activeTraders: 32,
          commodities: ['Rice', 'Wheat', 'Cotton'],
          avgPrice: 3500,
          rating: 4.2,
          facilities: ['Storage', 'Transport', 'Banking'],
          operatingHours: {
            open: '06:00',
            close: '17:00',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          },
          contact: {
            phone: '+91-9876543211',
            email: 'contact@amritsarmandi.com'
          }
        },
        {
          id: '3',
          name: 'Bathinda Mandi',
          location: {
            district: 'Bathinda',
            state: 'Punjab',
            coordinates: { lat: 30.211, lng: 74.945 },
            address: 'Market Yard, Bathinda, Punjab'
          },
          distance: 25,
          activeTraders: 28,
          commodities: ['Cotton', 'Wheat', 'Sugarcane'],
          avgPrice: 1800,
          rating: 4.0,
          facilities: ['Storage', 'Quality Testing'],
          operatingHours: {
            open: '06:30',
            close: '17:30',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          contact: {
            phone: '+91-9876543212'
          }
        },
        {
          id: '4',
          name: 'Jalandhar Market Complex',
          location: {
            district: 'Jalandhar',
            state: 'Punjab',
            coordinates: { lat: 31.326, lng: 75.576 },
            address: 'Central Market, Jalandhar, Punjab'
          },
          distance: 8,
          activeTraders: 38,
          commodities: ['Rice', 'Wheat', 'Barley'],
          avgPrice: 2400,
          rating: 4.3,
          facilities: ['Storage', 'Transport', 'Banking', 'Cold Storage'],
          operatingHours: {
            open: '05:30',
            close: '18:30',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          },
          contact: {
            phone: '+91-9876543213',
            email: 'contact@jalandharmandi.com'
          }
        },
        {
          id: '5',
          name: 'Patiala Agricultural Hub',
          location: {
            district: 'Patiala',
            state: 'Punjab',
            coordinates: { lat: 30.319, lng: 76.402 },
            address: 'Agriculture Complex, Patiala, Punjab'
          },
          distance: 35,
          activeTraders: 22,
          commodities: ['Wheat', 'Mustard', 'Gram'],
          avgPrice: 2100,
          rating: 3.8,
          facilities: ['Storage', 'Quality Testing', 'Banking'],
          operatingHours: {
            open: '06:00',
            close: '17:00',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          contact: {
            phone: '+91-9876543214'
          }
        }
      ];
      setMandis(mockMandis);
    } catch (error) {
      console.error('Failed to fetch mandis:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMandis = mandis.filter(mandi => {
    const matchesSearch = mandi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mandi.location.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommodity = selectedCommodity === '' || mandi.commodities.includes(selectedCommodity);
    const matchesDistance = !mandi.distance || mandi.distance <= maxDistance;
    const matchesRating = mandi.rating >= minRating;
    
    return matchesSearch && matchesCommodity && matchesDistance && matchesRating;
  });

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Finding nearby mandis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏪 Find Nearby Mandis
          </h1>
          <p className="text-gray-600">
            Discover agricultural markets near you with real-time information
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Mandis
              </label>
              <input
                type="text"
                placeholder="Search by name or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commodity
              </label>
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="form-input"
                aria-label="Select commodity"
              >
                <option value="">All Commodities</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Barley">Barley</option>
                <option value="Mustard">Mustard</option>
                <option value="Gram">Gram</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Distance: {maxDistance} km
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full"
                title={`Maximum distance: ${maxDistance} km`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="form-input"
                aria-label="Select minimum rating"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold">{filteredMandis.length}</span> mandis
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCommodity && ` trading ${selectedCommodity}`}
          </p>
        </div>

        {/* Mandis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMandis.map((mandi) => (
            <div key={mandi.id} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{mandi.name}</h3>
                  <p className="text-gray-600">{mandi.location.address}</p>
                  <p className="text-sm text-gray-500">
                    {mandi.location.district}, {mandi.location.state}
                  </p>
                </div>
                <div className="text-right">
                  {mandi.distance && (
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {mandi.distance} km
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">{getRatingStars(mandi.rating)}</span>
                    <span className="text-sm text-gray-600">({mandi.rating})</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Traders:</span>
                  <span className="text-sm font-medium">{mandi.activeTraders}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Price:</span>
                  <span className="text-sm font-medium">₹{mandi.avgPrice}/quintal</span>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Commodities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mandi.commodities.map((commodity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {commodity}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Facilities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mandi.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hours:</span>
                  <span className="text-sm">{mandi.operatingHours.open} - {mandi.operatingHours.close}</span>
                </div>

                {mandi.contact.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Contact:</span>
                    <span className="text-sm">{mandi.contact.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="btn-primary flex-1 hover:bg-green-700 transition-colors">
                  View Details
                </button>
                <button className="btn-secondary flex-1 hover:bg-blue-700 transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMandis.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No mandis found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or increasing the distance range.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCommodity('');
                setMaxDistance(50);
                setMinRating(0);
              }}
              className="mt-4 btn-primary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MandiLocatorPage;
