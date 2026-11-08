import express from 'express';
import bcrypt from 'bcryptjs';
import { memoryStore, getMongoStatus } from '../config/db.js';
import User from '../models/User.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (getMongoStatus()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      const user = await User.create({
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        favorites: []
      });
      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, favorites: user.favorites }
      });
    } else {
      const existing = memoryStore.getAll('users').find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      const newUser = memoryStore.insert('users', {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        favorites: []
      });
      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, favorites: newUser.favorites }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    let user;
    if (getMongoStatus()) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = memoryStore.getAll('users').find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check password
    let isMatch = false;
    if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }
    // Allow master demo fallback
    if (!isMatch && (password === 'admin123' || password === 'vizag2026')) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        favorites: user.favorites || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    let user;
    if (getMongoStatus()) {
      user = await User.findOne({ id: req.user.id });
    } else {
      user = memoryStore.getById('users', req.user.id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favorites: user.favorites || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
});

// Toggle Favorite
router.post('/favorites/toggle', verifyToken, async (req, res) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'destinationId is required.' });
    }

    let user;
    if (getMongoStatus()) {
      user = await User.findOne({ id: req.user.id });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const favs = new Set(user.favorites || []);
      if (favs.has(destinationId)) {
        favs.delete(destinationId);
      } else {
        favs.add(destinationId);
      }
      user.favorites = Array.from(favs);
      await user.save();
      return res.json({ success: true, favorites: user.favorites });
    } else {
      user = memoryStore.getById('users', req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const favs = new Set(user.favorites || []);
      if (favs.has(destinationId)) {
        favs.delete(destinationId);
      } else {
        favs.add(destinationId);
      }
      const updated = memoryStore.update('users', req.user.id, { favorites: Array.from(favs) });
      return res.json({ success: true, favorites: updated.favorites });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update favorites.' });
  }
});

export default router;

