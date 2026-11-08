import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, getMongoStatus } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../../client/dist');

// Route Imports
import destinationsRouter from './routes/destinations.js';
import foodRouter from './routes/food.js';
import staysRouter from './routes/stays.js';
import reviewsRouter from './routes/reviews.js';
import bookingsRouter from './routes/bookings.js';
import authRouter from './routes/auth.js';
import weatherRouter from './routes/weather.js';
import itinerariesRouter from './routes/itineraries.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'VIZAG EXPLORER REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mongoConnected: getMongoStatus(),
    storageEngine: getMongoStatus() ? 'MongoDB' : 'Local JSON Persisted Engine'
  });
});

// API Routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/food', foodRouter);
app.use('/api/stays', staysRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/itineraries', itinerariesRouter);
app.use('/api/admin', adminRouter);

// Serve frontend if built
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 VIZAG EXPLORER API Server running on port ${PORT}`);
    console.log(`🌊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
};

startServer();
