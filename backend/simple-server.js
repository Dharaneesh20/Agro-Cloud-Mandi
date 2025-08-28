import { createServer } from 'http';
import { parse } from 'url';

const PORT = process.env.PORT || 5000;

// Mock data
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

const server = createServer((req, res) => {
  const { pathname, query } = parse(req.url, true);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'Agro Mandi API is running',
      timestamp: new Date().toISOString()
    }));
  } else if (pathname === '/api/mandi') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockMandis,
      total: mockMandis.length
    }));
  } else if (pathname.startsWith('/api/mandi/')) {
    const id = parseInt(pathname.split('/')[3]);
    const mandi = mockMandis.find(m => m.id === id);
    
    if (mandi) {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: mandi
      }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        error: 'Mandi not found'
      }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Route not found'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏪 Mandis API: http://localhost:${PORT}/api/mandi`);
});
