import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  Utensils,
  Hotel,
  Calendar,
  ShieldCheck,
  LogOut,
  Waves
} from 'lucide-react';

export function Navbar({ activePage, setActivePage }) {
  const { user, isAdmin, openLogin, logout, setIsFavoritesOpen } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Waves },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'food', label: 'Food Guide', icon: Utensils },
    { id: 'stays', label: 'Stays & Resorts', icon: Hotel },
    { id: 'map', label: '3D Map', icon: MapPin },
    { id: 'itineraries', label: 'Trip Planner', icon: Calendar }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-2.5 bg-ocean-950/85 backdrop-blur-md border-b border-white/10 shadow-2xl'
          : 'py-4 bg-gradient-to-b from-ocean-950/90 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-turquoise to-ocean-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-ocean-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🌊</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-turquoise font-serif-luxury">
                VIZAG
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block -mt-1 font-sans">
                Explorer
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-ocean-900/60 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-turquoise-dark to-turquoise text-ocean-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Favorites, Auth / Profile */}
          <div className="flex items-center gap-3">
            {/* Wishlist / Favorites Pill */}
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="relative p-2 rounded-full bg-ocean-900/70 border border-white/10 text-slate-300 hover:text-white hover:border-turquoise transition-all"
              title="My Saved Places"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              {user?.favorites?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {user.favorites.length}
                </span>
              )}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-900/80 border border-turquoise/40 text-xs font-semibold text-white hover:bg-ocean-800 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-turquoise to-gold flex items-center justify-center text-ocean-950 font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl py-2 z-50 border border-white/15">
                    <div className="px-3 py-1.5 border-b border-white/10">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-gold/20 text-gold border border-gold/40">
                          Admin Portal
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-gold hover:bg-white/5 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsFavoritesOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      My Saved Places ({user.favorites?.length || 0})
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-300 hover:bg-white/5 flex items-center gap-2 border-t border-white/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-turquoise to-cyan-400 text-ocean-950 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-ocean-900 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-3 rounded-2xl glass-panel shadow-2xl border border-white/10 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-turquoise text-ocean-950 font-bold'
                        : 'bg-ocean-900/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold bg-gold/20 text-gold border border-gold/40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

