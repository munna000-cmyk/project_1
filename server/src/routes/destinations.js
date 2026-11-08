import express from 'express';
import { memoryStore, getMongoStatus } from '../config/db.js';
import Destination from '../models/Destination.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all destinations with filter, search and sort
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, freeOnly, sort } = req.query;

    let items;
    if (getMongoStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (freeOnly === 'true') {
        query.isFree = true;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } }
        ];
      }

      let mongoQuery = Destination.find(query);
      if (sort === 'rating') mongoQuery = mongoQuery.sort({ rating: -1 });
      else if (sort === 'priceAsc') mongoQuery = mongoQuery.sort({ price: 1 });
      else if (sort === 'priceDesc') mongoQuery = mongoQuery.sort({ price: -1 });
      else if (sort === 'popular') mongoQuery = mongoQuery.sort({ reviewsCount: -1 });
      else mongoQuery = mongoQuery.sort({ isFeatured: -1, rating: -1 });

      items = await mongoQuery.exec();
    } else {
      items = [...memoryStore.getAll('destinations')];

      if (category && category !== 'All') {
        items = items.filter(d => d.category.toLowerCase() === category.toLowerCase());
      }
      if (freeOnly === 'true') {
        items = items.filter(d => d.isFree);
      }
      if (minPrice) {
        items = items.filter(d => d.price >= Number(minPrice));
      }
      if (maxPrice) {
        items = items.filter(d => d.price <= Number(maxPrice));
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(d =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tagline?.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
        );
      }

      if (sort === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'priceAsc') {
        items.sort((a, b) => a.price - b.price);
      } else if (sort === 'priceDesc') {
        items.sort((a, b) => b.price - a.price);
      } else if (sort === 'popular') {
        items.sort((a, b) => b.reviewsCount - a.reviewsCount);
      } else {
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }
    }

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving destinations.' });
  }
});

// GET single destination
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let destination;

    if (getMongoStatus()) {
      destination = await Destination.findOne({ id }) || await Destination.findById(id).catch(() => null);
    } else {
      destination = memoryStore.getById('destinations', id);
    }

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving destination details.' });
  }
});

// CREATE destination (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const destinationData = req.body;
    if (!destinationData.name || !destinationData.category) {
      return res.status(400).json({ success: false, message: 'Name and Category are required.' });
    }

    const id = destinationData.id || destinationData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      ...destinationData,
      id,
      coordinates: destinationData.coordinates || { lat: 17.6868, lng: 83.2185 },
      verification: destinationData.verification || {
        status: "Verified Official",
        lastVerifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        sourceLink: "https://tourism.ap.gov.in"
      }
    };

    let created;
    if (getMongoStatus()) {
      created = await Destination.create(payload);
    } else {
      created = memoryStore.insert('destinations', payload);
    }

    res.status(201).json({ success: true, message: 'Destination added successfully', data: created });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ success: false, message: 'Could not create destination.' });
  }
});

// UPDATE destination (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let updated;

    if (getMongoStatus()) {
      updated = await Destination.findOneAndUpdate({ id }, req.body, { new: true });
    } else {
      updated = memoryStore.update('destinations', id, req.body);
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Destination not found to update.' });
    }

    res.json({ success: true, message: 'Destination updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not update destination.' });
  }
});

// DELETE destination (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let success = false;

    if (getMongoStatus()) {
      const resDel = await Destination.findOneAndDelete({ id });
      success = !!resDel;
    } else {
      success = memoryStore.delete('destinations', id);
    }

    if (!success) {
      return res.status(404).json({ success: false, message: 'Destination not found to delete.' });
    }

    res.json({ success: true, message: 'Destination deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not delete destination.' });
  }
});

export default router;

