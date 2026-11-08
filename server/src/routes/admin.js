import express from 'express';
import { memoryStore, getMongoStatus } from '../config/db.js';
import Destination from '../models/Destination.js';
import Hotel from '../models/Hotel.js';
import Food from '../models/Food.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET Admin Dashboard Stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    let destCount = 0, hotelCount = 0, foodCount = 0, bookingCount = 0, reviewCount = 0, userCount = 0, totalRevenue = 0;

    if (getMongoStatus()) {
      destCount = await Destination.countDocuments();
      hotelCount = await Hotel.countDocuments();
      foodCount = await Food.countDocuments();
      bookingCount = await Booking.countDocuments();
      reviewCount = await Review.countDocuments();
      userCount = await User.countDocuments();
      const bookings = await Booking.find({ status: { $ne: 'Cancelled' } });
      totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    } else {
      destCount = memoryStore.getAll('destinations').length;
      hotelCount = memoryStore.getAll('stays').length;
      foodCount = memoryStore.getAll('foods').length;
      bookingCount = memoryStore.getAll('bookings').length;
      reviewCount = memoryStore.getAll('reviews').length;
      userCount = memoryStore.getAll('users').length;
      const bookings = memoryStore.getAll('bookings').filter(b => b.status !== 'Cancelled');
      totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    }

    res.json({
      success: true,
      stats: {
        destinations: destCount,
        hotels: hotelCount,
        foodSpots: foodCount,
        bookings: bookingCount,
        reviews: reviewCount,
        users: userCount,
        totalRevenue,
        databaseMode: getMongoStatus() ? 'MongoDB Atlas / Local' : 'High-Speed Memory & JSON Persistent Store'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
});

export default router;

