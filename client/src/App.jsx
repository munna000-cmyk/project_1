import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { BookingModal } from './components/BookingModal';

// Pages
import { Home } from './pages/Home';
import { Destinations } from './pages/Destinations';
import { DestinationDetail } from './pages/DestinationDetail';
import { FoodGuide } from './pages/FoodGuide';
import { StayGuide } from './pages/StayGuide';
import { MapExplorerPage } from './pages/MapExplorerPage';
import { ItinerariesPage } from './pages/ItinerariesPage';
import { AdminDashboard } from './pages/AdminDashboard';

export function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState('rk-beach');
  const [selectedStayForBooking, setSelectedStayForBooking] = useState(null);
  const [customPlannerItems, setCustomPlannerItems] = useState([]);

  const handleSelectDestination = (id) => {
    setSelectedDestinationId(id);
    setActivePage('destination-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanWithFavorites = (items) => {
    setCustomPlannerItems(items);
    setActivePage('itineraries');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (hotel) => {
    setSelectedStayForBooking(hotel);
  };

  return (
    <div className="relative min-h-screen bg-ocean-950 text-slate-100 flex flex-col font-sans selection:bg-turquoise selection:text-ocean-950">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Page Rendering */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDestination={handleSelectDestination}
            onSelectStay={handleOpenBooking}
          />
        )}

        {activePage === 'destinations' && (
          <Destinations onSelectDestination={handleSelectDestination} />
        )}

        {activePage === 'destination-detail' && (
          <DestinationDetail
            destinationId={selectedDestinationId}
            onBack={() => setActivePage('destinations')}
            onNavigateToDestination={handleSelectDestination}
          />
        )}

        {activePage === 'food' && <FoodGuide />}

        {activePage === 'stays' && (
          <StayGuide onSelectStay={handleOpenBooking} />
        )}

        {activePage === 'map' && (
          <MapExplorerPage onSelectDestination={handleSelectDestination} />
        )}

        {activePage === 'itineraries' && (
          <ItinerariesPage
            onSelectDestination={handleSelectDestination}
            customInitialItems={customPlannerItems}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard onSelectDestination={handleSelectDestination} />
        )}
      </main>

      {/* Interactive Booking Modal */}
      <BookingModal
        hotel={selectedStayForBooking}
        isOpen={!!selectedStayForBooking}
        onClose={() => setSelectedStayForBooking(null)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal />

      {/* Favorites / Wishlist Slide-out Drawer */}
      <FavoritesDrawer
        onSelectDestination={handleSelectDestination}
        onPlanWithFavorites={handlePlanWithFavorites}
      />

      {/* Footer */}
      <Footer
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

