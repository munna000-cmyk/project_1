import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import {
  Hotel,
  Search,
  Star,
  MapPin,
  Check,
  ShieldCheck,
  BedDouble,
  DollarSign,
  ChevronRight,
  Wifi,
  Sparkles
} from 'lucide-react';

export function StayGuide({ onSelectStay }) {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);

  useEffect(() => {
    const loadStays = async () => {
      setLoading(true);
      const res = await api.getStays();
      if (res.data) setStays(res.data);
      setLoading(false);
    };
    loadStays();
  }, []);

  const categories = ['All', 'Luxury', 'Resorts', 'Hill Resorts', 'City Hotel'];

  const filteredStays = useMemo(() => {
    return stays.filter((s) => {
      if (selectedCategory !== 'All' && !s.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
      if (s.pricePerNight && s.pricePerNight > maxPrice) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchLoc = s.location?.toLowerCase().includes(q);
        const matchDesc = s.description?.toLowerCase().includes(q);
        const matchTagline = s.tagline?.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchDesc && !matchTagline) return false;
      }
      return true;
    });
  }, [stays, selectedCategory, maxPrice, search]);

  return (
    <div className="min-h-screen bg-ocean-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-turquoise/40 text-xs text-turquoise font-bold uppercase tracking-wider">
            <Hotel className="w-3.5 h-3.5" />
            <span>Luxury & Nature Accommodation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif-luxury text-glow">
            Vizag Stay & Resort Guide
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            From 5-star Bay of Bengal oceanfront suites at Novotel and Radisson Blu to serene hilltop cottages nestled in the mist of Araku Valley. Instant booking reservations with confirmed vouchers.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Novotel, Taj, Bheemili Resort, Araku Haritha..."
                className="w-full pl-10 pr-4 py-2.5 bg-ocean-900 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-turquoise"
              />
            </div>

            {/* Price Slider */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-ocean-900 border border-white/10">
              <span className="text-xs text-slate-400 whitespace-nowrap">Max Price / Night:</span>
              <span className="text-xs font-bold text-gold font-mono">Up to ₹{maxPrice.toLocaleString()}</span>
              <input
                type="range"
                min="3000"
                max="15000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-turquoise w-32 cursor-pointer"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-turquoise text-ocean-950 shadow-md font-bold'
                    : 'bg-ocean-900/60 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stay Listings Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading hotel & resort properties...</div>
        ) : filteredStays.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Hotel className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No accommodations match your filter</h3>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setMaxPrice(15000);
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-turquoise text-ocean-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStays.map((stay) => (
              <div
                key={stay.id}
                className="group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-turquoise/50 transition-all shadow-xl flex flex-col justify-between"
              >
                {/* Photo & Badge */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent" />

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-ocean-950/85 text-turquoise text-[10px] font-bold border border-turquoise/30 backdrop-blur-md">
                    {stay.category}
                  </span>

                  <span className="absolute bottom-3 right-3.5 px-3 py-1.5 rounded-full bg-ocean-950/90 text-gold text-xs font-mono font-bold shadow-lg">
                    {stay.startingPrice}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gold font-bold">
                        <Star className="w-3.5 h-3.5 fill-gold" />
                        <span>{stay.rating}</span>
                        <span className="text-slate-400 font-normal">({stay.reviewsCount} reviews)</span>
                      </div>
                      <span className="text-slate-400 flex items-center gap-1 truncate max-w-[170px]">
                        <MapPin className="w-3.5 h-3.5 text-turquoise shrink-0" />
                        <span className="truncate">{stay.location}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-turquoise transition-colors font-serif-luxury">
                      {stay.name}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {stay.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400">Featured Amenities:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {stay.amenities?.slice(0, 3).map((am, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-ocean-900 border border-white/5 text-[10px] text-cyan-200 flex items-center gap-1"
                        >
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{am}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Room Options & Book CTA */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Check-in / Out</p>
                      <p className="text-xs text-white font-medium">{stay.checkIn} / {stay.checkOut}</p>
                    </div>

                    <button
                      onClick={() => onSelectStay(stay)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-turquoise via-cyan-400 to-teal-400 text-ocean-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>Book Room</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

