import express from 'express';
const router = express.Router();

// Mock price data
const mockPrices = [
  {
    id: 1,
    commodity: "Wheat",
    variety: "HD-2967",
    market: "Delhi Azadpur",
    minPrice: 2100,
    maxPrice: 2300,
    modalPrice: 2200,
    unit: "per quintal",
    date: new Date().toISOString().split('T')[0],
    trend: "stable"
  },
  {
    id: 2,
    commodity: "Rice",
    variety: "Basmati",
    market: "Mumbai Vashi",
    minPrice: 4500,
    maxPrice: 5200,
    modalPrice: 4800,
    unit: "per quintal",
    date: new Date().toISOString().split('T')[0],
    trend: "up"
  }
];

// GET /api/prices - Get price data
router.get('/', (req, res) => {
  try {
    const { commodity, market, date } = req.query;
    let filteredPrices = [...mockPrices];

    if (commodity) {
      filteredPrices = filteredPrices.filter(price =>
        price.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }

    if (market) {
      filteredPrices = filteredPrices.filter(price =>
        price.market.toLowerCase().includes(market.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredPrices,
      total: filteredPrices.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prices'
    });
  }
});

// GET /api/prices/recommendations - Get price recommendations
router.get('/recommendations', (req, res) => {
  try {
    const recommendations = [
      {
        commodity: "Wheat",
        currentPrice: 2200,
        predictedPrice: 2350,
        recommendation: "Hold for 2-3 weeks",
        confidence: 85,
        factors: ["Seasonal demand", "Weather conditions"]
      },
      {
        commodity: "Rice",
        currentPrice: 4800,
        predictedPrice: 4600,
        recommendation: "Sell now",
        confidence: 78,
        factors: ["Market surplus", "Export policies"]
      }
    ];

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations'
    });
  }
});

export default router;
