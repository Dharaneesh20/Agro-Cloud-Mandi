import express from 'express';
const router = express.Router();

// Mock authentication routes
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock validation (replace with real authentication)
  if (email === 'admin@agromandi.com' && password === 'password') {
    res.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: 'Admin User',
        email: email,
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Mock registration
  res.json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: Date.now(),
      name,
      email,
      role: role || 'farmer'
    }
  });
});

export default router;
