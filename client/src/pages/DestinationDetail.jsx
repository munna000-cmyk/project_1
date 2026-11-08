import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Ticket,
  Calendar,
  Hourglass,
  Car,
  Bus,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Heart,
  Send,
  Navigation,
  Sparkles,
  Info
} from 'lucide-react';

export function DestinationDetail({ destinationId, onBack, onNavigateToDestination }) {
  const { user, isFavorite, toggleFavorite, openLogin } = useAuth();
  const [destination, setDestination] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      const [destRes, revRes] = await Promise.all([
        api.getDestinationById(destinationId),
        api.getReviews(destinationId)
      ]);
      if (destRes.data) {
        setDestination(destRes.data);
        setSelectedPhoto(destRes.data.heroImage);
      }
      if (revRes.data) setReviews(revRes.data);
      setLoading(false);
    };
    loadDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [destinationId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openLogin();
      return;
    }

    setSubmittingReview(true);
    const payload = {
      targetId: destination.id,
      userName: user.name,
      rating: newRating,
      title: newTitle || 'Great Experience',
      comment: newComment
    };

    const res = await api.postReview(payload);
    if (res.success) {
      setReviews([res.data, ...reviews]);
      setNewComment('');
      setNewTitle('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-950 pt-28 pb-16 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-turquoise border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading verified destination details...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-ocean-950 pt-28 pb-16 text-center text-slate-300">
        <h2 className="text-xl font-bold">Destination not found</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-turquoise text-ocean-950 font-bold rounded-xl text-xs">
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Back Button & Top Action */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white hover:border-turquoise transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(destination.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isFavorite(destination.id)
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'glass-panel text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite(destination.id) ? 'fill-white' : ''}`} />
              <span>{isFavorite(destination.id) ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* 1. HERO PHOTO GALLERY & MAIN DISPLAY */}
        <div className="space-y-4">
          <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
            <img
              src={selectedPhoto || destination.heroImage}
              alt={destination.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/30 to-transparent" />

            {/* Verified Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-ocean-950/85 text-turquoise text-xs font-bold border border-turquoise/40 backdrop-blur-md">
                {destination.category}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950/85 text-emerald-300 text-xs font-bold border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{destination.verification?.status} • {destination.verification?.lastVerifiedDate}</span>
              </span>
            </div>

            {/* Bottom Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 text-gold text-sm font-bold mb-1">
                <Star className="w-4 h-4 fill-gold" />
                <span>{destination.rating}</span>
                <span className="text-slate-400 font-normal">({destination.reviewsCount} verified reviews)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif-luxury text-glow">
                {destination.name}
              </h1>
              <p className="text-sm sm:text-base text-cyan-200 mt-1 max-w-2xl font-light">
                {destination.tagline}
              </p>
            </div>
          </div>

          {/* Photo Gallery Thumbnails */}
          {destination.gallery && destination.gallery.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[destination.heroImage, ...destination.gallery].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(img)}
                  className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedPhoto === img ? 'border-turquoise scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. OFFICIAL VERIFIED TICKETS & ESSENTIAL METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-gold" /> Official Ticket
            </span>
            <p className="text-xl font-bold text-white">
              {destination.isFree ? 'Free Admission' : `₹${destination.price}`}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{destination.priceNote}</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-turquoise" /> Visiting Timings
            </span>
            <p className="text-sm font-bold text-white line-clamp-1">
              {destination.timing}
            </p>
            <p className="text-[11px] text-emerald-400">Open 7 Days a week</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" /> Best Season
            </span>
            <p className="text-sm font-bold text-white line-clamp-1">
              {destination.bestTimeToVisit}
            </p>
            <p className="text-[11px] text-slate-400">Peak tourist months</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-amber-400" /> Visit Duration
            </span>
            <p className="text-xl font-bold text-white">
              {destination.estimatedDuration}
            </p>
            <p className="text-[11px] text-slate-400">{destination.distanceFromCityCenter}</p>
          </div>
        </div>

        {/* 3. MAIN CONTENT: DESCRIPTION, HIGHLIGHTS & TRANSPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h2 className="text-2xl font-bold text-white font-serif-luxury">About This Destination</h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                {destination.description}
              </p>

              {/* Highlights */}
              {destination.highlights && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-turquoise mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Key Highlights</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {destination.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-turquoise shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Transportation Options */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white font-serif-luxury flex items-center gap-2">
                <Car className="w-5 h-5 text-turquoise" />
                <span>How to Reach & Transportation</span>
              </h2>

              <div className="space-y-3 text-xs">
                {destination.transportation?.bus && (
                  <div className="p-3 rounded-xl bg-ocean-900 border border-white/5 flex items-start gap-3">
                    <Bus className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">APSRTC City Bus</p>
                      <p className="text-slate-400 mt-0.5">{destination.transportation.bus}</p>
                    </div>
                  </div>
                )}

                {destination.transportation?.auto && (
                  <div className="p-3 rounded-xl bg-ocean-900 border border-white/5 flex items-start gap-3">
                    <Car className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Auto-Rickshaw</p>
                      <p className="text-slate-400 mt-0.5">{destination.transportation.auto}</p>
                    </div>
                  </div>
                )}

                {destination.transportation?.cab && (
                  <div className="p-3 rounded-xl bg-ocean-900 border border-white/5 flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Taxi / Cab / Uber</p>
                      <p className="text-slate-400 mt-0.5">{destination.transportation.cab}</p>
                    </div>
                  </div>
                )}

                {destination.transportation?.train && (
                  <div className="p-3 rounded-xl bg-ocean-900 border border-white/5 flex items-start gap-3">
                    <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Mountain Railway / Vistadome</p>
                      <p className="text-slate-400 mt-0.5">{destination.transportation.train}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Essential Travel Tips & Warnings */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white font-serif-luxury flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span>Important Travel Tips & Warnings</span>
              </h2>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {destination.travelTips?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-ocean-900/60 border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar: Location, Facilities & Nearby */}
          <div className="space-y-6">
            {/* GPS & Map Card */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-turquoise" />
                <span>Location & Coordinates</span>
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                {destination.coordinates?.lat}° N, {destination.coordinates?.lng}° E
              </p>
              <div className="p-3 rounded-2xl bg-ocean-900 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-white">Distance Guide:</p>
                <p>{destination.distanceFromCityCenter}</p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates?.lat},${destination.coordinates?.lng}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-turquoise text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-turquoise/30"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Facilities Available */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Facilities on Site
              </h3>
              <div className="space-y-2 text-xs">
                {destination.facilities?.map((fac, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Attractions */}
            {destination.nearbyAttractions && (
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Nearby Attractions
                </h3>
                <div className="space-y-2 text-xs">
                  {destination.nearbyAttractions.map((att, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-ocean-900/60 border border-white/5 flex items-center justify-between"
                    >
                      <span className="font-semibold text-white truncate">{att.name}</span>
                      <span className="text-turquoise font-mono text-[11px] shrink-0 ml-2">{att.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. REVIEWS & COMMUNITY RATINGS */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-serif-luxury">
                Tourist Reviews & Experiences
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real feedback from travelers who explored {destination.name}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gold text-lg font-bold">
              <Star className="w-5 h-5 fill-gold" />
              <span>{destination.rating} / 5.0</span>
            </div>
          </div>

          {/* Write a review form */}
          <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-ocean-900/80 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Share Your Experience
            </h3>

            {reviewSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
                Thank you! Your review has been submitted and posted.
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-gold hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${newRating >= star ? 'fill-gold' : 'text-slate-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Review Headline (e.g. Stunning sunrise views!)"
                className="w-full px-3 py-2 bg-ocean-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
              />
              <input
                type="text"
                disabled
                value={user ? `Posting as: ${user.name}` : 'Sign in to post under your profile'}
                className="w-full px-3 py-2 bg-ocean-950/50 border border-white/5 rounded-xl text-xs text-slate-400"
              />
            </div>

            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you love? Any advice for other travelers regarding timings, parking, or crowds?"
              className="w-full px-3 py-2 bg-ocean-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-turquoise"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-turquoise to-cyan-400 text-ocean-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? 'Submitting...' : 'Post Tourist Review'}</span>
            </button>
          </form>

          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-ocean-900/60 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${rev.userName}`}
                      alt={rev.userName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-white">{rev.userName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gold text-xs">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold" />
                    ))}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-cyan-200">{rev.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-slate-500 pt-1">{rev.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

