import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String },
  category: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  priceNote: { type: String },
  isFree: { type: Boolean, default: true },
  timing: { type: String },
  openingHours: {
    open: String,
    close: String
  },
  bestTimeToVisit: { type: String },
  estimatedDuration: { type: String },
  distanceFromCityCenter: { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  heroImage: { type: String, required: true },
  gallery: [{ type: String }],
  description: { type: String, required: true },
  highlights: [{ type: String }],
  transportation: {
    bus: String,
    auto: String,
    cab: String,
    parking: String,
    train: String,
    trek: String
  },
  facilities: [{ type: String }],
  travelTips: [{ type: String }],
  nearbyAttractions: [{
    name: String,
    distance: String
  }],
  verification: {
    status: { type: String, default: "Verified Official" },
    lastVerifiedDate: { type: String, default: "November 2026" },
    sourceLink: { type: String }
  }
}, { timestamps: true });

export default mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

