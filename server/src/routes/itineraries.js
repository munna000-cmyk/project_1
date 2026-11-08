import express from 'express';
import { memoryStore } from '../config/db.js';

const router = express.Router();

// GET all curated itineraries
router.get('/', (req, res) => {
  const list = memoryStore.getAll('itineraries');
  res.json({ success: true, count: list.length, data: list });
});

// GET itinerary by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const item = memoryStore.getById('itineraries', id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Itinerary not found.' });
  }
  res.json({ success: true, data: item });
});

export default router;

