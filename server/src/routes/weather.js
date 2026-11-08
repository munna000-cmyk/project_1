import express from 'express';
import { weatherDataVizag } from '../data/seedData.js';

const router = express.Router();

// GET Live Vizag Weather & Coastal Tides
router.get('/vizag', (req, res) => {
  // Can calculate slight realistic dynamic variations based on current hour
  const now = new Date();
  const hour = now.getHours();
  
  let dynamicTemp = 28.5;
  if (hour >= 5 && hour < 10) dynamicTemp = 25.2;
  else if (hour >= 10 && hour < 15) dynamicTemp = 31.8;
  else if (hour >= 15 && hour < 19) dynamicTemp = 28.4;
  else dynamicTemp = 24.6;

  const responseData = {
    ...weatherDataVizag,
    temperature: dynamicTemp,
    updatedAt: now.toISOString()
  };

  res.json({
    success: true,
    data: responseData
  });
});

export default router;

