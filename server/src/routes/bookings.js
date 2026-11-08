import express from 'express';
import { memoryStore, getMongoStatus } from '../config/db.js';
import Booking from '../models/Booking.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all bookings or filter by email / user
router.get('/', async (req, res) => {
  try {
    const { email, userId } = req.query;
    let bookings;

    if (getMongoStatus()) {
      let q = {};
      if (email) q.guestEmail = email.toLowerCase();
      if (userId) q.userId = userId;
      bookings = await Booking.find(q).sort({ createdAt: -1 });
    } else {
      bookings = [...memoryStore.getAll('bookings')];
      if (email) {
        bookings = bookings.filter(b => b.guestEmail.toLowerCase() === email.toLowerCase());
      }
      if (userId) {
        bookings = bookings.filter(b => b.userId === userId);
      }
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
});

// CREATE booking
router.post('/', async (req, res) => {
  try {
    const {
      stayId,
      hotelName,
      guestName,
      guestEmail,
      guestPhone,
      roomType,
      checkInDate,
      checkOutDate,
      guests,
      rooms,
      totalPrice,
      specialRequests,
      userId
    } = req.body;

    if (!stayId || !guestName || !guestEmail || !checkInDate || !checkOutDate || !totalPrice) {
      return res.status(400).json({ success: false, message: 'Missing required booking details.' });
    }

    const bookingId = `VIZAG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = {
      id: bookingId,
      stayId,
      hotelName: hotelName || 'Vizag Hotel',
      guestName,
      guestEmail: guestEmail.toLowerCase(),
      guestPhone: guestPhone || 'Not provided',
      roomType: roomType || 'Standard Room',
      checkInDate,
      checkOutDate,
      guests: Number(guests) || 2,
      rooms: Number(rooms) || 1,
      totalPrice: Number(totalPrice),
      status: 'Confirmed',
      specialRequests: specialRequests || 'None',
      userId: userId || null,
      createdAt: new Date().toISOString()
    };

    let created;
    if (getMongoStatus()) {
      created = await Booking.create(newBooking);
    } else {
      created = memoryStore.insert('bookings', newBooking);
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      bookingReference: bookingId,
      data: created
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Could not complete booking reservation.' });
  }
});

// UPDATE booking status (Admin)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    let updated;
    if (getMongoStatus()) {
      updated = await Booking.findOneAndUpdate({ id }, { status }, { new: true });
    } else {
      updated = memoryStore.update('bookings', id, { status });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, message: `Booking marked as ${status}`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking.' });
  }
});

export default router;

