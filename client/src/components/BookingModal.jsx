import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, User, Phone, Mail, CheckCircle2, BedDouble, ShieldCheck, Download } from 'lucide-react';

export function BookingModal({ hotel, isOpen, onClose }) {
  const { user } = useAuth();

  const [selectedRoom, setSelectedRoom] = useState(hotel?.roomTypes?.[0] || {
    name: 'Standard Room',
    price: hotel?.pricePerNight || 5000
  });

  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('+91 98480 12345');
  const [specialRequests, setSpecialRequests] = useState('High floor ocean view room please');

  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  if (!isOpen || !hotel) return null;

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(d2 - d1, 86400000);
  const nights = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

  const roomRate = selectedRoom?.price || hotel.pricePerNight;
  const subtotal = roomRate * nights * rooms;
  const taxes = Math.round(subtotal * 0.12); // 12% GST
  const grandTotal = subtotal + taxes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      stayId: hotel.id,
      hotelName: hotel.name,
      guestName,
      guestEmail,
      guestPhone,
      roomType: selectedRoom.name,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      rooms,
      totalPrice: grandTotal,
      specialRequests,
      userId: user?.id || null
    };

    try {
      const res = await api.createBooking(payload);
      if (res.success) {
        setBookingConfirmed(res.data || { id: res.bookingReference, ...payload });
        try {
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-ocean-900/80 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingConfirmed ? (
          /* Confirmation Success Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Reservation Confirmed
              </span>
              <h3 className="text-2xl font-bold text-white mt-3 font-serif-luxury">
                Pack Your Bags for Vizag!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your luxury stay has been officially reserved. A confirmation voucher has been sent to{' '}
                <span className="text-turquoise font-semibold">{bookingConfirmed.guestEmail}</span>.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-5 rounded-2xl bg-ocean-900/80 border border-white/10 text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Booking Reference
                  </span>
                  <p className="text-base font-mono font-bold text-gold">{bookingConfirmed.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Total Amount
                  </span>
                  <p className="text-base font-bold text-white">₹{bookingConfirmed.totalPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 text-[11px]">Property</p>
                  <p className="font-semibold text-white">{bookingConfirmed.hotelName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Room Type</p>
                  <p className="font-semibold text-white">{bookingConfirmed.roomType}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Check-In</p>
                  <p className="font-semibold text-white">{bookingConfirmed.checkInDate} (2:00 PM)</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Check-Out</p>
                  <p className="font-semibold text-white">{bookingConfirmed.checkOutDate} (12:00 PM)</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Primary Guest</p>
                  <p className="font-semibold text-white">{bookingConfirmed.guestName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Guests & Rooms</p>
                  <p className="font-semibold text-white">
                    {bookingConfirmed.guests} Guests, {bookingConfirmed.rooms} Room(s)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrintVoucher}
                className="flex-1 py-3 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10"
              >
                <Download className="w-4 h-4" />
                <span>Save / Print Voucher</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-turquoise to-cyan-400 text-ocean-950 font-bold text-xs uppercase tracking-wider hover:opacity-95"
              >
                Back to Vizag Explorer
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-turquoise">
                  {hotel.category} Stay
                </span>
                <h3 className="text-xl font-bold text-white font-serif-luxury">{hotel.name}</h3>
                <p className="text-xs text-slate-400">{hotel.location}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Room */}
              {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-turquoise" />
                    <span>Select Room Category</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {hotel.roomTypes.map((rt) => (
                      <div
                        key={rt.name}
                        onClick={() => setSelectedRoom(rt)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          selectedRoom.name === rt.name
                            ? 'bg-turquoise/15 border-turquoise text-white'
                            : 'bg-ocean-900/60 border-white/10 text-slate-400 hover:border-white/30'
                        }`}
                      >
                        <p className="text-xs font-bold truncate">{rt.name}</p>
                        <p className="text-[11px] text-gold font-mono">₹{rt.price.toLocaleString()}/night</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{rt.bed}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Check-in Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Check-out Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                  />
                </div>
              </div>

              {/* Guests & Rooms */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n} className="bg-ocean-950">
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rooms</label>
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n} className="bg-ocean-950">
                        {n} {n === 1 ? 'Room' : 'Rooms'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Guest name"
                        className="w-full pl-9 pr-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Confirmation email"
                        className="w-full pl-9 pr-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 Phone"
                        className="w-full pl-9 pr-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Special Preferences</label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Quiet room, late check-in"
                      className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-ocean-900/90 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>
                    ₹{roomRate.toLocaleString()} × {nights} {nights === 1 ? 'Night' : 'Nights'} × {rooms}{' '}
                    {rooms === 1 ? 'Room' : 'Rooms'}
                  </span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes & GST (12%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-gold">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-turquoise via-cyan-400 to-teal-400 text-ocean-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-xl shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Confirming Reservation...' : `Confirm Booking • ₹${grandTotal.toLocaleString()}`}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

