import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String },
  category: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  priceRange: { type: String },
  costForTwo: { type: Number },
  cuisine: { type: String },
  location: { type: String },
  coordinates: {
    lat: Number,
    lng: Number
  },
  image: { type: String },
  timing: { type: String },
  signatureDishes: [{ type: String }],
  description: { type: String },
  facilities: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Food || mongoose.model('Food', foodSchema);

