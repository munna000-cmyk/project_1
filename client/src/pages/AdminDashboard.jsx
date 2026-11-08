import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Compass,
  Hotel,
  Utensils,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function AdminDashboard({ onSelectDestination }) {
  const { user, token, isAdmin, openLogin } = useAuth();
  const [stats, setStats] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('destinations'); // 'destinations' | 'bookings' | 'overview'
  const [loading, setLoading] = useState(true);

  // New Destination Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Beaches');
  const [newPrice, setNewPrice] = useState(0);
  const [newTiming, setNewTiming] = useState('6:00 AM – 6:00 PM');
  const [newHeroImage, setNewHeroImage] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [newDistance, setNewDistance] = useState('10 km from Railway Station');

  const loadAdminData = async () => {
    setLoading(true);
    const [statsRes, destRes, bkRes] = await Promise.all([
      api.getAdminStats(token),
      api.getDestinations(),
      api.getBookings()
    ]);
    if (statsRes.stats) setStats(statsRes.stats);
    if (destRes.data) setDestinations(destRes.data);
    if (bkRes.data) setBookings(bkRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    await api.deleteDestination(id, token);
    loadAdminData();
  };

  const handleUpdateBookingStatus = async (id, status) => {
    await api.updateBookingStatus(id, status, token);
    loadAdminData();
  };

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    const payload = {
      name: newName,
      category: newCategory,
      price: Number(newPrice),
      isFree: Number(newPrice) === 0,
      priceNote: Number(newPrice) === 0 ? 'Free Entry' : `₹${newPrice} Entry`,
      timing: newTiming,
      heroImage: newHeroImage,
      description: newDescription,
      distanceFromCityCenter: newDistance,
      rating: 4.8,
      reviewsCount: 1,
      coordinates: { lat: 17.72, lng: 83.31 },
      verification: {
        status: 'Verified Official',
        lastVerifiedDate: 'November 2026',
        sourceLink: 'https://tourism.ap.gov.in'
      }
    };
    await api.createDestination(payload, token);
    setShowAddModal(false);
    setNewName('');
    setNewDescription('');
    loadAdminData();
  };

  return (
    <div className="min-h-screen bg-ocean-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold border border-gold/40 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white font-serif-luxury">
              Vizag Explorer Backoffice
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live system overview, destination catalog management, and tourist hotel reservation inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ocean-900 border border-white/10 text-xs text-slate-300">
              <Database className="w-3.5 h-3.5 text-turquoise" />
              <span>{stats?.databaseMode || 'Local DB Active'}</span>
            </span>
          </div>
        </div>

        {/* Real-time KPI Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-turquoise" /> Total Destinations
            </span>
            <p className="text-2xl font-bold text-white">{stats?.destinations || destinations.length}</p>
            <p className="text-[11px] text-emerald-400">12 Verified Official</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gold" /> Total Bookings
            </span>
            <p className="text-2xl font-bold text-white">{stats?.bookings || bookings.length}</p>
            <p className="text-[11px] text-slate-400">Reservations logged</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Hotel className="w-3.5 h-3.5 text-cyan-400" /> Stays & Resorts
            </span>
            <p className="text-2xl font-bold text-white">{stats?.hotels || 6}</p>
            <p className="text-[11px] text-slate-400">Luxury & Araku lodges</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Total Booked Value
            </span>
            <p className="text-2xl font-bold text-gold font-mono">
              ₹{(stats?.totalRevenue || 19600).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-400">Confirmed transactions</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 p-1 rounded-2xl glass-panel max-w-md border border-white/10">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'destinations' ? 'bg-turquoise text-ocean-950 font-bold' : 'text-slate-400'
            }`}
          >
            Manage Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings' ? 'bg-turquoise text-ocean-950 font-bold' : 'text-slate-400'
            }`}
          >
            Manage Bookings ({bookings.length})
          </button>
        </div>

        {/* Tab 1: Manage Destinations */}
        {activeTab === 'destinations' && (
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-serif-luxury">
                Tourist Destinations Catalog
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-turquoise to-cyan-400 text-ocean-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Destination</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Ticket Price</th>
                    <th className="py-3 px-3">Timings</th>
                    <th className="py-3 px-3">Verification</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {destinations.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 flex items-center gap-2">
                        <img src={d.heroImage} alt={d.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-semibold text-white truncate max-w-xs">{d.name}</span>
                      </td>
                      <td className="py-3 px-3 text-cyan-300">{d.category}</td>
                      <td className="py-3 px-3 font-mono font-bold text-gold">
                        {d.isFree ? 'Free' : `₹${d.price}`}
                      </td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-[150px]">{d.timing}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {d.verification?.status || 'Official'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteDestination(d.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete destination"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Bookings */}
        {activeTab === 'bookings' && (
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-serif-luxury pb-4 border-b border-white/10">
              Tourist Hotel Reservations
            </h3>

            {bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">No bookings logged yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Booking Ref</th>
                      <th className="py-3 px-3">Hotel & Room</th>
                      <th className="py-3 px-3">Guest Info</th>
                      <th className="py-3 px-3">Dates</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gold">{b.id}</td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-white">{b.hotelName}</p>
                          <p className="text-[11px] text-slate-400">{b.roomType}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-white">{b.guestName}</p>
                          <p className="text-[11px] text-slate-400">{b.guestEmail}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {b.checkInDate} to {b.checkOutDate}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-white">
                          ₹{b.totalPrice?.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : b.status === 'Cancelled'
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                            className="px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800 text-[10px]"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                            className="px-2 py-1 rounded bg-rose-900/60 text-rose-300 hover:bg-rose-800 text-[10px]"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Destination Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg p-6 rounded-3xl glass-panel border border-white/15 shadow-2xl">
              <h3 className="text-xl font-bold text-white font-serif-luxury mb-4">
                Add New Destination
              </h3>
              <form onSubmit={handleCreateDestination} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Yarada Beach"
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-white"
                    >
                      <option value="Beaches">Beaches</option>
                      <option value="Museums & Heritage">Museums & Heritage</option>
                      <option value="Temples">Temples</option>
                      <option value="Nature & Waterfalls">Nature & Waterfalls</option>
                      <option value="Hill Stations">Hill Stations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Ticket Price (₹)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Timings</label>
                  <input
                    type="text"
                    value={newTiming}
                    onChange={(e) => setNewTiming(e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={newHeroImage}
                    onChange={(e) => setNewHeroImage(e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-ocean-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-turquoise text-ocean-950 font-bold"
                  >
                    Save Landmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

