import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Heart, Trash2, ArrowRight, Compass, Sparkles } from 'lucide-react';

export function FavoritesDrawer({ onSelectDestination, onPlanWithFavorites }) {
  const { user, isFavoritesOpen, setIsFavoritesOpen, toggleFavorite } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isFavoritesOpen) return;
    const loadItems = async () => {
      setLoading(true);
      const res = await api.getDestinations();
      if (res.data) {
        const userFavSet = new Set(user?.favorites || []);
        const filtered = res.data.filter(d => userFavSet.has(d.id));
        setFavoriteItems(filtered);
      }
      setLoading(false);
    };
    loadItems();
  }, [isFavoritesOpen, user?.favorites]);

  if (!isFavoritesOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-ocean-950 border-l border-white/15 p-6 flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif-luxury">Saved Destinations</h3>
              <p className="text-xs text-slate-400">
                {favoriteItems.length} {favoriteItems.length === 1 ? 'place' : 'places'} in your wishlist
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFavoritesOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading saved spots...</div>
          ) : favoriteItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin-slow" />
              <h4 className="text-sm font-semibold text-white mb-1">Your wishlist is empty</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Tap the heart icon on any destination, beach, or viewpoint to curate your dream Vizag journey.
              </p>
            </div>
          ) : (
            favoriteItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex gap-3 p-3 rounded-2xl bg-ocean-900/60 border border-white/5 hover:border-turquoise/40 transition-all cursor-pointer"
                onClick={() => {
                  onSelectDestination(item.id);
                  setIsFavoritesOpen(false);
                }}
              >
                <img
                  src={item.heroImage}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-turquoise">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gold mt-0.5 font-medium">
                    {item.isFree ? 'Free Admission' : `From ₹${item.price}`}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    {item.distanceFromCityCenter}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  title="Remove from favorites"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Plan trip with favorites */}
        {favoriteItems.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onPlanWithFavorites(favoriteItems);
                setIsFavoritesOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-turquoise via-cyan-400 to-teal-400 text-ocean-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Custom Itinerary ({favoriteItems.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

