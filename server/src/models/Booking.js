import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  stayId: { type: String, required: true },
  hotelName: { type: String, required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, required: true },
  roomType: { type: String, required: true },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  guests: { type: Number, default: 2 },
  rooms: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Confirmed", enum: ["Pending", "Confirmed", "Cancelled"] },
  specialRequests: { type: String },
  userId: { type: String }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

