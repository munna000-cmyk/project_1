import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Destination3DCard } from '../components/3d/Destination3DCard';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  Star,
  Heart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  Filter
} from 'lucide-react';

export function Destinations({ onSelectDestination }) {
  const { toggleFavorite, isFavorite } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'free', 'under50', '50to100', '100plus'
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'rating', 'priceAsc', 'priceDesc'

  useEffect(() => {
    const loadDestinations = async () => {
      setLoading(true);
      const res = await api.getDestinations();
      if (res.data) setDestinations(res.data);
      setLoading(false);
    };
    loadDestinations();
  }, []);

  const categories = ['All', 'Beaches', 'Museums & Heritage', 'Temples', 'Nature & Waterfalls', 'Hill Stations'];

  // Filtered & Sorted items
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        // Search
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchName = dest.name.toLowerCase().includes(q);
          const matchDesc = dest.description?.toLowerCase().includes(q);
          const matchTagline = dest.tagline?.toLowerCase().includes(q);
          const matchCategory = dest.category?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchTagline && !matchCategory) return false;
        }

        // Category
        if (selectedCategory !== 'All' && dest.category !== selectedCategory) {
          return false;
        }

        // Price Filter
        if (priceFilter === 'free' && !dest.isFree) return false;
        if (priceFilter === 'under50' && (dest.price > 50 || dest.isFree)) return false;
        if (priceFilter === '50to100' && (dest.price < 50 || dest.price > 100)) return false;
        if (priceFilter === '100plus' && dest.price < 100) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        // Default popular
        return b.reviewsCount - a.reviewsCount;
      });
  }, [destinations, searchTerm, selectedCategory, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-ocean-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-turquoise/40 text-xs text-turquoise font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Visakhapatnam</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif-luxury text-glow">
            Explore All Destinations
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            All 12 landmark destinations across Visakhapatnam, the Eastern Ghats, and the Bay of Bengal. Every listing includes verified opening hours, official entry fees, and travel tips.
          </p>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search RK Beach, Submarine, Araku, Borra Caves..."
                className="w-full pl-10 pr-4 py-2.5 bg-ocean-900 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-turquoise"
              />
            </div>

            {/* Price Filter Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-3 py-2.5 bg-ocean-900 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-turquoise"
              >
                <option value="all" className="bg-ocean-950">All Ticket Prices</option>
                <option value="free" className="bg-ocean-950">Free Admission Only</option>
                <option value="under50" className="bg-ocean-950">Nominal (₹1 – ₹50)</option>
                <option value="50to100" className="bg-ocean-950">Mid-tier (₹50 – ₹100)</option>
                <option value="100plus" className="bg-ocean-950">₹100+</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 bg-ocean-900 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-turquoise"
              >
                <option value="popular" className="bg-ocean-950">Sort: Most Popular</option>
                <option value="rating" className="bg-ocean-950">Sort: Highest Rated</option>
                <option value="priceAsc" className="bg-ocean-950">Price: Low to High</option>
                <option value="priceDesc" className="bg-ocean-950">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
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

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredDestinations.length} verified destinations</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Official AP Tourism & Naval Data Verified</span>
          </span>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading verified Vizag destinations...</div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin-slow" />
            <h3 className="text-base font-bold text-white mb-1">No destinations match your criteria</h3>
            <p className="text-xs text-slate-400 mb-4">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setPriceFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-turquoise text-ocean-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <Destination3DCard
                key={dest.id}
                onClick={() => onSelectDestination(dest.id)}
                className="h-[460px]"
              >
                <div className="relative w-full h-full bg-ocean-900 rounded-3xl overflow-hidden border border-white/10 group flex flex-col justify-between">
                  {/* Image Header with Badge */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ocean-950/80 text-turquoise border border-turquoise/30 backdrop-blur-md">
                        {dest.category}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(dest.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          isFavorite(dest.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-ocean-950/70 text-white hover:text-rose-400 border border-white/10'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite(dest.id) ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Verified Official Badge */}
                    <div className="absolute bottom-3 left-3.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 backdrop-blur-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{dest.verification?.status || 'Verified Official'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1 text-gold font-bold">
                          <Star className="w-3.5 h-3.5 fill-gold" />
                          <span>{dest.rating}</span>
                          <span className="text-slate-400 font-normal">({dest.reviewsCount})</span>
                        </div>
                        <span className="text-gold font-bold font-mono">
                          {dest.isFree ? 'Free Admission' : `₹${dest.price}`}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-turquoise transition-colors font-serif-luxury leading-snug">
                        {dest.name}
                      </h3>

                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="truncate">{dest.timing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-turquoise shrink-0" />
                          <span className="truncate">{dest.distanceFromCityCenter}</span>
                        </span>
                        <span className="text-turquoise font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View Guide <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Destination3DCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

