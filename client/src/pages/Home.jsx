import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Hero3DScene } from '../components/3d/Hero3DScene';
import { Destination3DCard } from '../components/3d/Destination3DCard';
import { WeatherRibbon } from '../components/WeatherRibbon';
import {
  Compass,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Heart,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Waves,
  Utensils,
  Hotel,
  Calendar,
  Check
} from 'lucide-react';

export function Home({ onNavigate, onSelectDestination, onSelectStay }) {
  const { toggleFavorite, isFavorite } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [foodSpots, setFoodSpots] = useState([]);
  const [stays, setStays] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      const [destRes, foodRes, stayRes, revRes] = await Promise.all([
        api.getDestinations(),
        api.getFoodSpots(),
        api.getStays(),
        api.getReviews()
      ]);
      if (destRes.data) setDestinations(destRes.data);
      if (foodRes.data) setFoodSpots(foodRes.data);
      if (stayRes.data) setStays(stayRes.data);
      if (revRes.data) setReviews(revRes.data);
      setLoading(false);
    };
    loadHomeData();
  }, []);

  const featuredDestinations = destinations.filter((d) => d.isFeatured).slice(0, 6);
  const popularBeaches = destinations.filter((d) => d.category === 'Beaches');

  return (
    <div className="min-h-screen bg-ocean-950 text-slate-100 overflow-x-hidden">
      {/* 1. CINEMATIC 3D HERO SECTION */}
      <section className="relative w-full h-[95vh] min-h-[640px] flex items-center justify-center">
        {/* Full-Screen 3D Scene */}
        <div className="absolute inset-0 z-0">
          <Hero3DScene />
        </div>

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-ocean-950/40 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/80 via-transparent to-ocean-950/40 pointer-events-none z-10" />

        {/* Hero Foreground Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-none">
          <div className="max-w-2xl pointer-events-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-turquoise/40 mb-6 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-turquoise animate-ping" />
              <span className="text-xs font-semibold tracking-wide text-cyan-200 uppercase">
                The Jewel on the Bay of Bengal
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-serif-luxury text-glow">
              EXPLORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-turquoise to-teal-200">VIZAG</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-xl">
              Discover the beauty of Visakhapatnam. Where the Eastern Ghats roll into azure ocean waves, submarine warships rest on golden sands, and misty Araku valleys awaken in clouds.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('destinations')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-turquoise via-cyan-400 to-teal-400 text-ocean-950 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 hover:scale-105 hover:shadow-cyan-500/40 transition-all duration-300"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('itineraries')}
                className="px-6 py-3.5 rounded-2xl glass-panel text-white font-bold text-sm hover:bg-white/10 border border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>Plan Your Trip</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-400">Scroll Down</span>
          <div className="w-5 h-9 rounded-full border-2 border-slate-500/60 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 rounded-full bg-turquoise animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. LIVE COASTAL WEATHER & TIDES RIBBON */}
      <WeatherRibbon />

      {/* 3. TRAVEL STATISTICS */}
      <section className="py-12 border-b border-white/10 bg-ocean-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl glass-panel">
              <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-turquoise font-serif-luxury">
                12+
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Verified Landmarks
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel">
              <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gold font-serif-luxury">
                Blue Flag
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Certified Rushikonda Beach
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel">
              <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300 font-serif-luxury">
                1,000 m
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Araku & Lambasingi Altitude
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel">
              <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-300 font-serif-luxury">
                100%
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Official Timings & Prices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED TOURIST DESTINATIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-turquoise text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Iconic Landmarks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-luxury">
              Featured Vizag Destinations
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              From Asia's only coastal submarine museum to ancient 11th-century temples and million-year-old caverns.
            </p>
          </div>

          <button
            onClick={() => onNavigate('destinations')}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-turquoise hover:text-cyan-300 transition-colors group"
          >
            <span>View All 12+ Spots</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3D Tilt Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDestinations.map((dest) => (
            <Destination3DCard
              key={dest.id}
              onClick={() => onSelectDestination(dest.id)}
              className="h-[430px]"
            >
              <div className="relative w-full h-full bg-ocean-900 rounded-2xl overflow-hidden border border-white/10 group">
                {/* Background Image */}
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/50 to-transparent" />

                {/* Top Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-ocean-950/80 text-turquoise border border-turquoise/30 backdrop-blur-md">
                    {dest.category}
                  </span>

                  <button
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
                    <Heart
                      className={`w-4 h-4 ${isFavorite(dest.id) ? 'fill-white' : ''}`}
                    />
                  </button>
                </div>

                {/* Bottom Info Card */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gold font-bold">
                      <Star className="w-3.5 h-3.5 fill-gold" />
                      <span>{dest.rating}</span>
                    </div>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">({dest.reviewsCount} reviews)</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-semibold">
                      {dest.isFree ? 'Free Entry' : `₹${dest.price}`}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-turquoise transition-colors font-serif-luxury leading-tight">
                    {dest.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-turquoise" />
                      <span className="truncate max-w-[170px]">{dest.distanceFromCityCenter}</span>
                    </span>
                    <span className="text-turquoise font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Destination3DCard>
          ))}
        </div>
      </section>

      {/* 5. POPULAR BEACHES SHOWCASE */}
      <section className="py-20 bg-ocean-900/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-turquoise text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Waves className="w-4 h-4" />
              <span>Pristine Bay of Bengal Coast</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif-luxury">
              Visakhapatnam's Golden Beaches
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
              Every beach has its unique soul — from the bustling urban promenade of RK Beach to the certified crystal waters of Rushikonda and secluded palm groves of Yarada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularBeaches.slice(0, 3).map((beach) => (
              <div
                key={beach.id}
                onClick={() => onSelectDestination(beach.id)}
                className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-turquoise/50 transition-all cursor-pointer shadow-xl"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={beach.heroImage}
                    alt={beach.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ocean-950/80 text-turquoise text-[11px] font-bold border border-turquoise/30 backdrop-blur-md">
                    {beach.id === 'rushikonda-beach' ? '🌊 Blue Flag Certified' : '🏖️ Scenic Coast'}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-turquoise transition-colors font-serif-luxury">
                    {beach.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {beach.tagline}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>{beach.timing}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-turquoise" />
                      <span>{beach.distanceFromCityCenter}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {beach.isFree ? 'Free Access' : `Ticket: ₹${beach.price}`}
                    </span>
                    <button className="text-xs font-bold text-turquoise flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore Beach <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GASTRONOMY & COASTAL ANDHRA FOOD TEASER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Utensils className="w-4 h-4" />
              <span>Coastal Andhra Cuisine</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif-luxury">
              Iconic Food Destinations
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Savor fiery Bay of Bengal prawn fry, authentic banana-leaf Andhra thalis, and charcoal-roasted Araku bamboo chicken.
            </p>
          </div>

          <button
            onClick={() => onNavigate('food')}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-gold hover:text-amber-300 transition-colors group"
          >
            <span>Explore All Restaurants</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foodSpots.slice(0, 3).map((food) => (
            <div
              key={food.id}
              onClick={() => onNavigate('food')}
              className="group p-5 rounded-3xl glass-panel border border-white/10 hover:border-gold/50 transition-all cursor-pointer space-y-4"
            >
              <div className="h-48 rounded-2xl overflow-hidden relative">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ocean-950/80 text-gold text-[10px] font-bold border border-gold/30">
                  {food.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-ocean-950/80 text-white text-[11px] font-mono font-bold">
                  {food.priceRange}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-gold font-bold mb-1">
                  <Star className="w-3.5 h-3.5 fill-gold" />
                  <span>{food.rating}</span>
                  <span className="text-slate-400 font-normal">({food.reviewsCount} reviews)</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors font-serif-luxury">
                  {food.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {food.tagline}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/10">
                <p className="text-[11px] font-semibold text-slate-300">Signature Dish:</p>
                <p className="text-xs text-cyan-300 font-medium truncate">
                  {food.signatureDishes?.[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. RECOMMENDED LUXURY STAYS & RESORTS */}
      <section className="py-20 bg-ocean-900/40 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-turquoise text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Hotel className="w-4 h-4" />
                <span>Oceanfront Stays</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif-luxury">
                Recommended Stays & Resorts
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Wake up to the sounds of waves at 5-star beachfront hotels, cliffside infinity pools, and serene Araku hill resorts.
              </p>
            </div>

            <button
              onClick={() => onNavigate('stays')}
              className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-turquoise hover:text-cyan-300 transition-colors group"
            >
              <span>Explore All Hotels</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stays.slice(0, 3).map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => onSelectStay(hotel)}
                className="group p-5 rounded-3xl glass-panel border border-white/10 hover:border-turquoise/50 transition-all cursor-pointer space-y-4 shadow-xl"
              >
                <div className="h-52 rounded-2xl overflow-hidden relative">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ocean-950/80 text-turquoise text-[10px] font-bold border border-turquoise/30">
                    {hotel.category}
                  </span>
                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-ocean-950/85 text-gold text-xs font-bold">
                    {hotel.startingPrice}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gold font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-gold" />
                    <span>{hotel.rating}</span>
                    <span className="text-slate-400 font-normal">({hotel.reviewsCount} reviews)</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-turquoise transition-colors font-serif-luxury">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {hotel.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {hotel.amenities?.slice(0, 2).map((am, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-ocean-800/80 text-[10px] text-slate-300 flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{am}</span>
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-turquoise to-cyan-400 text-ocean-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity"
                >
                  Book Room
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE MAP PREVIEW TEASER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 p-8 sm:p-14 text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/90 via-ocean-950/80 to-ocean-900/90 z-0" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquoise/15 text-turquoise text-xs font-bold border border-turquoise/40">
              <MapPin className="w-3.5 h-3.5" />
              <span>Interactive GPS Coordinates</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-luxury">
              Navigate the Coastline & Hill Stations
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore custom pinned map locations from Rushikonda Beach to Dolphin's Nose Lighthouse and the misty mountain tracks of Araku and Lambasingi.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onNavigate('map')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-turquoise via-cyan-400 to-teal-400 text-ocean-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
              >
                <MapPin className="w-4 h-4" />
                <span>Launch Interactive 3D Map</span>
              </button>
              <button
                onClick={() => onNavigate('itineraries')}
                className="px-6 py-3 rounded-2xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs uppercase tracking-wider border border-white/10"
              >
                View 1–4 Day Itineraries
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TOURIST REVIEWS & TESTIMONIALS */}
      <section className="py-20 bg-ocean-900/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">
              Community Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif-luxury">
              Stories from Fellow Travelers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-white font-serif-luxury leading-snug">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    className="w-8 h-8 rounded-full object-cover border border-turquoise/40"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{rev.userName}</p>
                    <p className="text-[10px] text-slate-500">{rev.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

