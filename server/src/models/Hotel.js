import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String },
  category: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  pricePerNight: { type: Number, required: true },
  startingPrice: { type: String },
  location: { type: String },
  coordinates: {
    lat: Number,
    lng: Number
  },
  image: { type: String },
  gallery: [{ type: String }],
  roomTypes: [{
    name: String,
    price: Number,
    bed: String,
    size: String
  }],
  amenities: [{ type: String }],
  description: { type: String },
  checkIn: { type: String, default: "2:00 PM" },
  checkOut: { type: String, default: "12:00 PM" }
}, { timestamps: true });

export default mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);

