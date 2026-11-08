import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Printer,
  Compass,
  CheckCircle2,
  Sun,
  Coffee,
  Train,
  Waves
} from 'lucide-react';

export function ItinerariesPage({ onSelectDestination, customInitialItems = [] }) {
  const [itineraries, setItineraries] = useState([]);
  const [activePlanId, setActivePlanId] = useState('1-day-coastal-highlights');
  const [customStops, setCustomStops] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState('');

  useEffect(() => {
    const loadPlans = async () => {
      const [itRes, destRes] = await Promise.all([
        api.getItineraries(),
        api.getDestinations()
      ]);
      if (itRes.data) setItineraries(itRes.data);
      if (destRes.data) setAvailableDestinations(destRes.data);
    };
    loadPlans();
  }, []);

  useEffect(() => {
    if (customInitialItems.length > 0) {
      setCustomStops(
        customInitialItems.map((item, idx) => ({
          id: `stop-${Date.now()}-${idx}`,
          destination: item.name,
          time: `Stop ${idx + 1} (${item.estimatedDuration || '2 Hours'})`,
          description: item.tagline || item.description
        }))
      );
      setActivePlanId('custom');
    }
  }, [customInitialItems]);

  const activePlan = itineraries.find((it) => it.id === activePlanId);

  const handleAddStop = () => {
    if (!selectedToAdd) return;
    const dest = availableDestinations.find((d) => d.id === selectedToAdd);
    if (dest) {
      setCustomStops([
        ...customStops,
        {
          id: `custom-stop-${Date.now()}`,
          destination: dest.name,
          time: `Stop ${customStops.length + 1} (${dest.estimatedDuration})`,
          description: dest.tagline
        }
      ]);
      setSelectedToAdd('');
    }
  };

  const handleRemoveStop = (id) => {
    setCustomStops(customStops.filter((s) => s.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-ocean-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-turquoise/40 text-xs text-turquoise font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Smart Trip Itinerary Architect</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif-luxury text-glow">
            Curated Vizag & Araku Itineraries
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Hand-crafted 1-day to 4-day travel plans designed to maximize your time. Seamlessly balance coastal beaches, naval museums, spiritual temples, and cloud-cloaked Araku coffee hills.
          </p>
        </div>

        {/* Plan Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl glass-panel max-w-3xl mx-auto border border-white/10">
          {itineraries.map((it) => (
            <button
              key={it.id}
              onClick={() => setActivePlanId(it.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activePlanId === it.id
                  ? 'bg-turquoise text-ocean-950 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{it.durationDays}-Day Tour</span>
            </button>
          ))}
          <button
            onClick={() => setActivePlanId('custom')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePlanId === 'custom'
                ? 'bg-gold text-ocean-950 shadow-lg'
                : 'text-slate-400 hover:text-gold hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Planner ({customStops.length})</span>
          </button>
        </div>

        {/* Plan Body */}
        {activePlanId === 'custom' ? (
          /* Custom Itinerary Builder */
          <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-gold/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-gold text-xs font-bold uppercase tracking-wider">
                  Personalized Trip Architect
                </span>
                <h2 className="text-2xl font-bold text-white mt-1 font-serif-luxury">
                  Your Custom Vizag Itinerary
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Assemble your favorite destinations into an actionable day plan.
                </p>
              </div>

              {customStops.length > 0 && (
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-white/10"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Itinerary</span>
                </button>
              )}
            </div>

            {/* Add destination input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedToAdd}
                onChange={(e) => setSelectedToAdd(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-ocean-900 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-gold"
              >
                <option value="" className="bg-ocean-950">Select a destination to add...</option>
                {availableDestinations.map((d) => (
                  <option key={d.id} value={d.id} className="bg-ocean-950">
                    {d.name} ({d.category} - {d.distanceFromCityCenter})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddStop}
                disabled={!selectedToAdd}
                className="px-5 py-2.5 rounded-2xl bg-gold text-ocean-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Plan</span>
              </button>
            </div>

            {/* Stops list */}
            {customStops.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No stops added yet. Pick landmarks from the dropdown above or save destinations from the Explorer.
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {customStops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="p-4 rounded-2xl bg-ocean-900/70 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{stop.destination}</h4>
                        <p className="text-xs text-slate-300">{stop.description}</p>
                        <p className="text-[11px] text-turquoise mt-0.5">{stop.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStop(stop.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activePlan ? (
          /* Curated Itinerary Display */
          <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-8">
            {/* Plan Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-turquoise text-xs font-bold uppercase tracking-wider">
                  {activePlan.durationDays}-Day Curated Tour
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-serif-luxury">
                  {activePlan.title}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-200 mt-1">
                  {activePlan.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 bg-ocean-900 px-3 py-1.5 rounded-xl border border-white/5">
                  Ideal for: <strong className="text-white">{activePlan.idealFor}</strong>
                </span>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-slate-300 hover:text-white border border-white/10"
                  title="Print or export itinerary"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overview */}
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {activePlan.overview}
            </p>

            {/* Timeline Stops */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-turquoise/30 space-y-8">
              {activePlan.stops?.map((stop, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-ocean-950 border-2 border-turquoise group-hover:bg-turquoise transition-colors" />

                  <div className="p-5 rounded-2xl bg-ocean-900/60 border border-white/5 hover:border-turquoise/30 transition-all space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-ocean-800 text-[10px] font-mono font-bold text-turquoise">
                      {stop.time}
                    </span>
                    <h3 className="text-base font-bold text-white font-serif-luxury">
                      {stop.destination}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {stop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

