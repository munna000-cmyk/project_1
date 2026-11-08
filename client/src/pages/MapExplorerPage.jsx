import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { MapPin, Compass, Navigation, Star, ArrowRight, Layers, Eye } from 'lucide-react';

// Custom Marker Icons using Leaflet divIcon
const createCustomIcon = (emoji, color = '#06b6d4') => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: ${color};
        color: #030811;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.6);
        border: 2px solid #ffffff;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
  });
};

function ChangeMapView({ coords, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom, { duration: 1.5 });
    }
  }, [coords, zoom, map]);
  return null;
}

export function MapExplorerPage({ onSelectDestination }) {
  const [destinations, setDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePin, setActivePin] = useState(null);
  const [centerCoords, setCenterCoords] = useState([17.72, 83.31]); // Central Vizag Beach Road
  const [zoomLevel, setZoomLevel] = useState(11);

  useEffect(() => {
    const loadData = async () => {
      const res = await api.getDestinations();
      if (res.data) setDestinations(res.data);
    };
    loadData();
  }, []);

  const categories = ['All', 'Beaches', 'Museums & Heritage', 'Temples', 'Nature & Waterfalls', 'Hill Stations'];

  const filtered = destinations.filter((d) => {
    if (selectedCategory === 'All') return true;
    return d.category === selectedCategory;
  });

  const getMarkerEmoji = (category) => {
    switch (category) {
      case 'Beaches':
        return '🏖️';
      case 'Museums & Heritage':
        return '🏛️';
      case 'Temples':
        return '🛕';
      case 'Hill Stations':
        return '⛰️';
      case 'Nature & Waterfalls':
        return '🌊';
      default:
        return '📍';
    }
  };

  const handleSpotClick = (dest) => {
    setCenterCoords([dest.coordinates.lat, dest.coordinates.lng]);
    setZoomLevel(14);
    setActivePin(dest);
  };

  return (
    <div className="min-h-screen bg-ocean-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-slate-100 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-turquoise font-bold uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>Interactive Coastal Navigator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif-luxury">
              Visakhapatnam 3D Geographic Map
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore exact GPS coordinates for all beaches, submarine museums, temples, and Araku hill viewpoints.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl glass-panel">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-turquoise text-ocean-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Map & Sidebar Split Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[620px]">
          {/* Left Sidebar List */}
          <div className="lg:col-span-1 rounded-3xl glass-panel border border-white/10 p-4 overflow-y-auto max-h-[640px] space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              {filtered.length} Pinned Locations
            </p>
            {filtered.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleSpotClick(dest)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  activePin?.id === dest.id
                    ? 'bg-turquoise/15 border-turquoise text-white shadow-lg'
                    : 'bg-ocean-900/60 border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-turquoise">
                    {dest.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-gold font-bold">
                    <Star className="w-3 h-3 fill-gold" />
                    <span>{dest.rating}</span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{dest.name}</h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {dest.distanceFromCityCenter}
                </p>
              </div>
            ))}
          </div>

          {/* Right Interactive Leaflet Map Container */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden glass-panel border border-white/10 relative shadow-2xl">
            <MapContainer
              center={centerCoords}
              zoom={zoomLevel}
              scrollWheelZoom={true}
              className="w-full h-full min-h-[500px]"
            >
              <ChangeMapView coords={centerCoords} zoom={zoomLevel} />

              {/* CartoDB Dark Matter Tiles */}
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {filtered.map((dest) => (
                <Marker
                  key={dest.id}
                  position={[dest.coordinates.lat, dest.coordinates.lng]}
                  icon={createCustomIcon(getMarkerEmoji(dest.category))}
                >
                  <Popup>
                    <div className="w-56 space-y-2 p-1">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                          {dest.category}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {dest.name}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] pt-1 border-t border-white/10">
                          <span className="text-gold font-bold">
                            {dest.isFree ? 'Free Entry' : `₹${dest.price}`}
                          </span>
                          <span className="text-slate-400">{dest.estimatedDuration}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectDestination(dest.id)}
                        className="w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-ocean-950 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 mt-2"
                      >
                        <span>Full Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

