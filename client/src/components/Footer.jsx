import React, { useState } from 'react';
import { Mail, PhoneCall, Shield, Heart, Send, CheckCircle2 } from 'lucide-react';

export function Footer({ setActivePage }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-ocean-950 border-t border-white/10 pt-16 pb-8 text-slate-400">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-radial from-turquoise/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌊</span>
              <div>
                <span className="text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-turquoise font-serif-luxury">
                  VIZAG
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block -mt-1 font-sans">
                  Explorer
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              The premier interactive 3D travel platform for Visakhapatnam, Andhra Pradesh. From the golden sands of Blue Flag Rushikonda and ancient submarine museums to the misty heights of Araku and Lambasingi.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Subscribe for Curated Travel Guides & Seasonal Deals
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed! Check your inbox for the Vizag Insider Guide.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-ocean-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-turquoise"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-turquoise to-cyan-400 text-ocean-950 font-bold rounded-xl text-xs hover:scale-105 transition-transform flex items-center gap-1.5"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Explore Vizag
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('destinations')} className="hover:text-turquoise transition-colors">
                  All Destinations (12+)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('destinations')} className="hover:text-turquoise transition-colors">
                  Blue Flag Rushikonda
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('destinations')} className="hover:text-turquoise transition-colors">
                  INS Kursura Submarine
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('destinations')} className="hover:text-turquoise transition-colors">
                  Araku Valley & Borra Caves
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('destinations')} className="hover:text-turquoise transition-colors">
                  Lambasingi Mist Valley
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('map')} className="hover:text-turquoise transition-colors">
                  Interactive 3D Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Gastronomy & Stays */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Food & Stays
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('food')} className="hover:text-turquoise transition-colors">
                  Andhra Coastal Thalis
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('food')} className="hover:text-turquoise transition-colors">
                  Fresh Seafood (Sea Inn)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('food')} className="hover:text-turquoise transition-colors">
                  Araku Bamboo Chicken
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('stays')} className="hover:text-turquoise transition-colors">
                  Novotel Varun Beach
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('stays')} className="hover:text-turquoise transition-colors">
                  The Gateway Hotel Taj
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('stays')} className="hover:text-turquoise transition-colors">
                  Radisson Blu Resort
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Tourist Safety & Emergency Helplines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Tourist Helplines</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-ocean-900/60 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Emergency SOS</p>
                <p className="font-bold text-white flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-red-400" /> 112 / 100 (Police)
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-ocean-900/60 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Beach & Coastal Guard</p>
                <p className="font-bold text-white">0891-2565454</p>
              </div>

              <div className="p-2.5 rounded-xl bg-ocean-900/60 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">AP Tourism Toll-Free</p>
                <p className="font-bold text-turquoise">1800-425-45454</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 VIZAG EXPLORER. Built with precision for Andhra Pradesh Tourism.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Visakhapatnam
            </span>
            <span>•</span>
            <button onClick={() => setActivePage('admin')} className="text-slate-400 hover:text-gold transition-colors">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

