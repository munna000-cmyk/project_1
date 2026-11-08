import express from 'express';
import { memoryStore, getMongoStatus } from '../config/db.js';
import Food from '../models/Food.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all food spots with filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, maxCost } = req.query;

    let items;
    if (getMongoStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (maxCost) {
        query.costForTwo = { $lte: Number(maxCost) };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }
      items = await Food.find(query).sort({ rating: -1 });
    } else {
      items = [...memoryStore.getAll('foods')];
      if (category && category !== 'All') {
        items = items.filter(f => f.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (maxCost) {
        items = items.filter(f => f.costForTwo <= Number(maxCost));
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(f =>
          f.name.toLowerCase().includes(q) ||
          f.cuisine?.toLowerCase().includes(q) ||
          f.location?.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
        );
      }
      items.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving food guide.' });
  }
});

// GET single food spot
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let spot;
    if (getMongoStatus()) {
      spot = await Food.findOne({ id }) || await Food.findById(id).catch(() => null);
    } else {
      spot = memoryStore.getById('foods', id);
    }

    if (!spot) {
      return res.status(404).json({ success: false, message: 'Food spot not found.' });
    }

    res.json({ success: true, data: spot });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching food spot details.' });
  }
});

// CREATE food spot (admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body;
    const id = payload.id || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newSpot = { ...payload, id };

    let created;
    if (getMongoStatus()) {
      created = await Food.create(newSpot);
    } else {
      created = memoryStore.insert('foods', newSpot);
    }

    res.status(201).json({ success: true, message: 'Food spot added', data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add food spot.' });
  }
});

export default router;

