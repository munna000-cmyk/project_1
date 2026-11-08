import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sun, Wind, Droplets, Sunrise, Sunset, AlertTriangle, ShieldCheck, Waves } from 'lucide-react';

export function WeatherRibbon() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      const res = await api.getWeather();
      if (res.data) setWeather(res.data);
    };
    loadWeather();
    const interval = setInterval(loadWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!weather) return null;

  return (
    <div className="w-full bg-ocean-900/90 border-y border-white/10 backdrop-blur-md py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* City & Temp */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="text-base">{weather.weatherIcon}</span>
            <span>{weather.city}:</span>
            <span className="text-turquoise text-sm">{weather.temperature}°C</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">{weather.condition}</span>
        </div>

        {/* Coastal Conditions */}
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5" title="Humidity">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>{weather.humidity}% Humidity</span>
          </div>

          <div className="flex items-center gap-1.5" title="Coastal Wind">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>{weather.windSpeed} km/h {weather.windDirection}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5" title="Sunrise & Sunset">
            <Sunrise className="w-3.5 h-3.5 text-gold" />
            <span>{weather.sunSchedule?.sunrise}</span>
            <span className="text-slate-500">|</span>
            <Sunset className="w-3.5 h-3.5 text-amber-500" />
            <span>{weather.sunSchedule?.sunset}</span>
          </div>
        </div>

        {/* Surf & Beach Safety Flag Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Rushikonda: Safe Swim</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-[10px] text-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>RK Beach: No Swimming</span>
          </div>
        </div>
      </div>
    </div>
  );
}

