import express from 'express';
const router = express.Router();

// Mock mandi data (replace with database calls)
const mockMandis = [
  {
    id: 1,
    name: "Delhi Azadpur Mandi",
    location: { lat: 28.7041, lng: 77.1025 },
    address: "Azadpur, Delhi",
    state: "Delhi",
    commodities: ["Wheat", "Rice", "Onion", "Potato"],
    contact: "+91-11-27676767",
    rating: 4.2,
    isOpen: true,
    workingHours: "6:00 AM - 8:00 PM"
  },
  {
    id: 2,
    name: "Mumbai Vashi APMC",
    location: { lat: 19.0760, lng: 73.0192 },
    address: "Vashi, Navi Mumbai",
    state: "Maharashtra",
    commodities: ["Tomato", "Onion", "Cabbage", "Cauliflower"],
    contact: "+91-22-27816054",
    rating: 4.0,
    isOpen: true,
    workingHours: "5:00 AM - 9:00 PM"
  }
];

// GET /api/mandi - Get all mandis
router.get('/', (req, res) => {
  try {
    const { state, commodity, search } = req.query;
    let filteredMandis = [...mockMandis];

    if (state) {
      filteredMandis = filteredMandis.filter(mandi => 
        mandi.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    if (commodity) {
      filteredMandis = filteredMandis.filter(mandi =>
        mandi.commodities.some(c => 
          c.toLowerCase().includes(commodity.toLowerCase())
        )
      );
    }

    if (search) {
      filteredMandis = filteredMandis.filter(mandi =>
        mandi.name.toLowerCase().includes(search.toLowerCase()) ||
        mandi.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredMandis,
      total: filteredMandis.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mandis'
    });
  }
});

// GET /api/mandi/:id - Get single mandi
router.get('/:id', (req, res) => {
  try {
    const mandi = mockMandis.find(m => m.id === parseInt(req.params.id));
    
    if (!mandi) {
      return res.status(404).json({
        success: false,
        error: 'Mandi not found'
      });
    }

    res.json({
      success: true,
      data: mandi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mandi'
    });
  }
});

// GET /api/mandi/nearby - Get nearby mandis
router.get('/nearby/:lat/:lng', (req, res) => {
  try {
    const { lat, lng } = req.params;
    const radius = req.query.radius || 50; // km

    // Simple distance calculation (replace with proper geospatial query)
    const nearbyMandis = mockMandis.filter(mandi => {
      const distance = calculateDistance(
        parseFloat(lat), 
        parseFloat(lng), 
        mandi.location.lat, 
        mandi.location.lng
      );
      return distance <= radius;
    });

    res.json({
      success: true,
      data: nearbyMandis,
      total: nearbyMandis.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby mandis'
    });
  }
});

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;
