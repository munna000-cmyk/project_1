import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  targetId: { type: String, required: true }, // Destination ID or Hotel ID
  userId: { type: String },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String, required: true },
  date: { type: String },
  helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);

