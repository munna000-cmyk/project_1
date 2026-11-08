import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  destinationsData,
  foodSpotsData,
  staysData,
  itinerariesData,
  weatherDataVizag,
  sampleReviews
} from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/local_db.json');

let isMongoConnected = false;

// In-memory / JSON store fallback
class MemoryStore {
  constructor() {
    this.data = {
      destinations: [...destinationsData],
      foods: [...foodSpotsData],
      stays: [...staysData],
      itineraries: [...itinerariesData],
      reviews: [...sampleReviews],
      bookings: [
        {
          id: "bk-1001",
          stayId: "novotel-varun-beach",
          hotelName: "Novotel Visakhapatnam Varun Beach",
          guestName: "Arjun Reddy",
          guestEmail: "arjun@example.com",
          guestPhone: "+91 98480 22338",
          roomType: "Superior Ocean View Room",
          checkInDate: "2026-12-10",
          checkOutDate: "2026-12-12",
          guests: 2,
          rooms: 1,
          totalPrice: 19600,
          status: "Confirmed",
          specialRequests: "High floor sea view room please",
          createdAt: new Date().toISOString()
        }
      ],
      users: [
        {
          id: "user-admin",
          name: "Vizag Admin",
          email: "admin@vizagexplorer.com",
          passwordHash: "$2a$10$wT0lHlD3ZfS8/E7a95m5Q.c8M3Q7Zc70W4K8oQ2fH7a6B1/W7S7K.", // admin123
          role: "admin",
          favorites: ["rk-beach", "rushikonda-beach", "araku-valley"]
        },
        {
          id: "user-tourist",
          name: "Priya Sharma",
          email: "priya@example.com",
          passwordHash: "$2a$10$wT0lHlD3ZfS8/E7a95m5Q.c8M3Q7Zc70W4K8oQ2fH7a6B1/W7S7K.", // admin123
          role: "user",
          favorites: ["rushikonda-beach", "kailasagiri"]
        }
      ]
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      }
    } catch (e) {
      console.warn("Could not read local_db.json, using seed defaults", e.message);
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn("Failed to persist to local_db.json", e.message);
    }
  }

  getAll(collection) {
    return this.data[collection] || [];
  }

  getById(collection, id) {
    const list = this.data[collection] || [];
    return list.find(item => item.id === id || item._id === id);
  }

  insert(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    const newItem = {
      id: item.id || `${collection.slice(0, 3)}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...item
    };
    this.data[collection].unshift(newItem);
    this.saveToFile();
    return newItem;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveToFile();
    return this.data[collection][index];
  }

  delete(collection, id) {
    if (!this.data[collection]) return false;
    const initialLen = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(item => item.id !== id && item._id !== id);
    this.saveToFile();
    return this.data[collection].length < initialLen;
  }
}

export const memoryStore = new MemoryStore();

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log(`ℹ️ MONGODB_URI not set. Running in High-Fidelity Local JSON Storage mode.`);
    return;
  }
  const uri = process.env.MONGODB_URI;
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`ℹ️ MongoDB connection not available (${error.message}). Running smoothly in High-Fidelity Local JSON Storage mode.`);
  }
};

export const getMongoStatus = () => isMongoConnected;
