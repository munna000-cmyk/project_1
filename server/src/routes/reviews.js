import express from 'express';
import { memoryStore, getMongoStatus } from '../config/db.js';
import Review from '../models/Review.js';

const router = express.Router();

// GET reviews for a target (destination or hotel) or all
router.get('/', async (req, res) => {
  try {
    const { targetId } = req.query;
    let reviews;

    if (getMongoStatus()) {
      const query = targetId ? { targetId } : {};
      reviews = await Review.find(query).sort({ createdAt: -1 });
    } else {
      reviews = [...memoryStore.getAll('reviews')];
      if (targetId) {
        reviews = reviews.filter(r => r.targetId === targetId);
      }
      reviews.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    }

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  try {
    const { targetId, userName, rating, title, comment, userAvatar } = req.body;
    if (!targetId || !userName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide target, name, rating, and comment.' });
    }

    const reviewPayload = {
      id: `rev-${Date.now()}`,
      targetId,
      userName,
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`,
      rating: Number(rating),
      title: title || 'Tourist Review',
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      helpfulCount: 0
    };

    let created;
    if (getMongoStatus()) {
      created = await Review.create(reviewPayload);
    } else {
      created = memoryStore.insert('reviews', reviewPayload);
    }

    res.status(201).json({ success: true, message: 'Review posted successfully!', data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not post review.' });
  }
});

// UPVOTE helpful count
router.post('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoStatus()) {
      const review = await Review.findOne({ id });
      if (review) {
        review.helpfulCount = (review.helpfulCount || 0) + 1;
        await review.save();
        return res.json({ success: true, helpfulCount: review.helpfulCount });
      }
    } else {
      const review = memoryStore.getById('reviews', id);
      if (review) {
        const updated = memoryStore.update('reviews', id, { helpfulCount: (review.helpfulCount || 0) + 1 });
        return res.json({ success: true, helpfulCount: updated.helpfulCount });
      }
    }
    res.status(404).json({ success: false, message: 'Review not found.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recording vote.' });
  }
});

export default router;

