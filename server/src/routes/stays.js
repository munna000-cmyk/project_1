import express from 'express';
import { memoryStore, getMongoStatus } from '../config/db.js';
import Hotel from '../models/Hotel.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all stays with filter and search
router.get('/', async (req, res) => {
  try {
    const { category, maxPrice, search } = req.query;

    let items;
    if (getMongoStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (maxPrice) {
        query.pricePerNight = { $lte: Number(maxPrice) };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      items = await Hotel.find(query).sort({ rating: -1 });
    } else {
      items = [...memoryStore.getAll('stays')];
      if (category && category !== 'All') {
        items = items.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (maxPrice) {
        items = items.filter(s => s.pricePerNight <= Number(maxPrice));
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
        );
      }
      items.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving stay accommodations.' });
  }
});

// GET single stay
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let stay;
    if (getMongoStatus()) {
      stay = await Hotel.findOne({ id }) || await Hotel.findById(id).catch(() => null);
    } else {
      stay = memoryStore.getById('stays', id);
    }

    if (!stay) {
      return res.status(404).json({ success: false, message: 'Stay accommodation not found.' });
    }

    res.json({ success: true, data: stay });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stay accommodation.' });
  }
});

// CREATE hotel (admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body;
    const id = payload.id || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newStay = { ...payload, id };

    let created;
    if (getMongoStatus()) {
      created = await Hotel.create(newStay);
    } else {
      created = memoryStore.insert('stays', newStay);
    }

    res.status(201).json({ success: true, message: 'Hotel accommodation added', data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add stay.' });
  }
});

export default router;

