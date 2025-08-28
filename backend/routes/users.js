import express from 'express';
const router = express.Router();

// Mock user routes
router.get('/profile/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      name: 'John Farmer',
      email: 'john@example.com',
      role: 'farmer',
      location: 'Punjab, India',
      crops: ['Wheat', 'Rice']
    }
  });
});

export default router;
