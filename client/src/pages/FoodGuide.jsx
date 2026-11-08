import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import {
  Utensils,
  Search,
  Star,
  Clock,
  MapPin,
  ExternalLink,
  Flame,
  Coffee,
  Fish,
  DollarSign,
  ChefHat
} from 'lucide-react';

export function FoodGuide() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxBudget, setMaxBudget] = useState(2500);

  useEffect(() => {
    const loadFood = async () => {
      setLoading(true);
      const res = await api.getFoodSpots();
      if (res.data) setFoods(res.data);
      setLoading(false);
    };
    loadFood();
  }, []);

  const categories = ['All', 'Andhra Cuisine', 'Seafood & Andhra', 'Street Food', 'Cafes', 'Fine Dining'];

  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      if (selectedCategory !== 'All' && !f.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
      if (f.costForTwo && f.costForTwo > maxBudget) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchCuisine = f.cuisine?.toLowerCase().includes(q);
        const matchLoc = f.location?.toLowerCase().includes(q);
        const matchDesc = f.description?.toLowerCase().includes(q);
        const matchDishes = f.signatureDishes?.some(d => d.toLowerCase().includes(q));
        if (!matchName && !matchCuisine && !matchLoc && !matchDesc && !matchDishes) return false;
      }
      return true;
    });
  }, [foods, selectedCategory, maxBudget, search]);

  return (
    <div className="min-h-screen bg-ocean-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-gold/40 text-xs text-gold font-bold uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            <span>Culinary Capital of Andhra Pradesh</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif-luxury text-glow">
            Vizag Gastronomy & Food Guide
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            From the spicy coastal seafood at Sea Inn (Raju Gari Dhaba) and traditional banana-leaf royal Andhra thalis at Dakshin, to midnight street delicacies in MVP Colony and wood-roasted Araku bamboo chicken.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Biryani, Prawn fry, Dosa, Cafes, Bamboo chicken..."
                className="w-full pl-10 pr-4 py-2.5 bg-ocean-900 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold"
              />
            </div>

            {/* Budget Slider */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-ocean-900 border border-white/10">
              <span className="text-xs text-slate-400 whitespace-nowrap">Budget for Two:</span>
              <span className="text-xs font-bold text-gold font-mono">Up to ₹{maxBudget}</span>
              <input
                type="range"
                min="300"
                max="2500"
                step="200"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="accent-gold w-28 cursor-pointer"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold text-ocean-950 shadow-md font-bold'
                    : 'bg-ocean-900/60 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Food Listings Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading Vizag food spots...</div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No restaurants match your search</h3>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setMaxBudget(2500);
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-gold text-ocean-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold/50 transition-all shadow-xl flex flex-col justify-between"
              >
                {/* Photo & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent" />

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-ocean-950/85 text-gold text-[10px] font-bold border border-gold/30 backdrop-blur-md">
                    {food.category}
                  </span>

                  <span className="absolute bottom-3 right-3.5 px-2.5 py-1 rounded-full bg-ocean-950/85 text-white text-xs font-mono font-bold">
                    {food.priceRange}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gold font-bold">
                        <Star className="w-3.5 h-3.5 fill-gold" />
                        <span>{food.rating}</span>
                        <span className="text-slate-400 font-normal">({food.reviewsCount} reviews)</span>
                      </div>
                      <span className="text-slate-300 font-semibold">{food.cuisine}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors font-serif-luxury">
                      {food.name}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {food.description}
                    </p>
                  </div>

                  {/* Signature Dishes */}
                  <div className="space-y-1.5 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Signature Dishes</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {food.signatureDishes?.map((dish, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-ocean-900 border border-white/5 text-[11px] text-cyan-200"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer & Map Directions Link */}
                  <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="truncate">{food.timing}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 truncate max-w-[190px]">
                        <MapPin className="w-3.5 h-3.5 text-turquoise shrink-0" />
                        <span className="truncate">{food.location}</span>
                      </span>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          food.name + ' ' + food.location
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold font-bold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
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

