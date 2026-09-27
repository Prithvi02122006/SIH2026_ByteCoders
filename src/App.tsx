import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RoleSelectModal } from './components/common/RoleSelectModal';
import { ExploreFeed } from './components/explore/ExploreFeed';
import { VendorStorefrontModal } from './components/explore/VendorStorefrontModal';
import { TripBuilderWizard } from './components/trip-builder/TripBuilderWizard';
import { DynamicMapView } from './components/trip-builder/DynamicMapView';
import { TimelinePanel } from './components/trip-builder/TimelinePanel';
import { AdaptationBar } from './components/trip-builder/AdaptationBar';
import { SwapStopModal } from './components/trip-builder/SwapStopModal';
import { DigitalTwinPanel } from './components/trip-builder/DigitalTwinPanel';
import { HeroSection } from './components/explore/HeroSection';
import { VendorPortal } from './components/vendor/VendorPortal';
import { TermsOfService } from './components/legal/TermsOfService';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TripProgressBar } from './components/trip-builder/TripProgressBar';
import { NearbyVendorAdPopup } from './components/explore/NearbyVendorAdPopup';
import { IconClock, IconSpark } from './components/common/Icons';
import { ItineraryStop } from './types';

const MainContent: React.FC = () => {
  const {
    currentView,
    slideDirection,
    activeRole,
    activeItinerary,
    isComputingItinerary,
    triggerAdaptation,
    setShowRoleModal,
    tripBuilderTab,
    setTripBuilderTab,
    simulatedTwin
  } = useApp();

  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [selectedSwapStop, setSelectedSwapStop] = useState<ItineraryStop | null>(null);

  const handleOpenSwapForStop = (stop: ItineraryStop) => {
    setSelectedSwapStop(stop);
    setSwapModalOpen(true);
  };

  const handleOpenSwapGeneral = () => {
    setSelectedSwapStop(null);
    setSwapModalOpen(true);
  };

  const handleMarkClosed = (stopId: string) => {
    triggerAdaptation('closed', { stopId });
  };

  // Determine slide animation class based on navigation direction
  const animationClass =
    slideDirection === 'right' ? 'view-enter-from-right' : 'view-enter-from-left';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Navbar />

      {/* Role Selection Entry Banner if user hasn't explicitly set profile */}
      <div className="bg-[#FFFFFF] border-b border-[#E2E6EC] py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#5B7A99] gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]" />
            <span>
              Operating in <strong>{activeRole === 'traveler' ? 'Traveler Discovery Domain' : 'Local Merchant Portal'}</strong>
            </span>
          </div>
          <button
            onClick={() => setShowRoleModal(true)}
            className="text-[#1B3A6B] hover:underline font-semibold text-xs"
          >
            Switch Role: I am Traveling / I am a Local Vendor
          </button>
        </div>
      </div>

      {/* Main Sliding Content View */}
      {/* For the explore view we remove horizontal constraints so HeroSection can be full-bleed.
          All other views keep max-w-7xl + gutters. */}
      <main className={`flex-1 w-full ${currentView !== 'explore' ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        <div key={currentView} className={animationClass}>

          {/* ── View 1: Sunlit Meadow Hero + Explore Feed ── */}
          {currentView === 'explore' && (
            <div>
              {/* Hero is full-bleed; it uses the 100vw / translateX(-50%) escape trick */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <HeroSection />
              </div>
              {/* Explore feed sits below in the normal constrained column */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <ExploreFeed />
              </div>
            </div>
          )}

          {/* View 2: Custom Trip Builder & Dynamic Itinerary */}
          {currentView === 'trip-builder' && (
            <div className="space-y-6">
              {/* Top Wizard Trigger Bar */}
              <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase font-bold text-[#1B3A6B] tracking-wider">
                    Personalized Dynamic Tour Engine
                  </div>
                  <h1 className="text-2xl font-serif font-bold text-[#111827]">
                    Custom Travel Plan & Adaptive Route
                  </h1>
                  <p className="text-xs text-[#5B7A99] mt-0.5">
                    Multi-parameter route optimization (TSP distance, time buffers, step-free access)
                  </p>
                </div>

                <button
                  onClick={() => setWizardOpen(!wizardOpen)}
                  className="px-4 py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] transition-colors self-start sm:self-auto"
                >
                  {wizardOpen ? 'Hide Configuration Wizard' : 'Configure New Custom Trip'}
                </button>
              </div>

              {/* Collapsible 7-Step Wizard */}
              {wizardOpen && (
                <TripBuilderWizard onComplete={() => setWizardOpen(false)} />
              )}

              {/* Live Adaptation Disruption Quick-Actions (Section 6.3) */}
              <AdaptationBar onOpenSwapModal={handleOpenSwapGeneral} />

              {/* Tab Switcher: Active Timeline vs Weather Digital Twin */}
              <div className="flex items-center space-x-2 border-b border-[#E2E6EC] pb-2">
                <button
                  type="button"
                  onClick={() => setTripBuilderTab('timeline')}
                  className={`px-4 py-2 text-xs font-bold rounded-[3px] transition-colors flex items-center space-x-2 ${
                    tripBuilderTab === 'timeline'
                      ? 'bg-[#1B3A6B] text-white shadow-sm'
                      : 'bg-white text-[#5B7A99] hover:bg-[#F1F5F9] border border-[#E2E6EC]'
                  }`}
                >
                  <IconClock size={13} />
                  <span>Scheduled Timeline & Route</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTripBuilderTab('digital-twin')}
                  className={`px-4 py-2 text-xs font-bold rounded-[3px] transition-colors flex items-center space-x-2 ${
                    tripBuilderTab === 'digital-twin'
                      ? 'bg-[#1B3A6B] text-white shadow-sm'
                      : 'bg-white text-[#5B7A99] hover:bg-[#F1F5F9] border border-[#E2E6EC]'
                  }`}
                >
                  <IconSpark size={13} />
                  <span>Weather-Driven Digital Twin</span>
                  {simulatedTwin && (
                    <span className="px-1.5 py-0.2 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded text-[10px] font-bold">
                      +{simulatedTwin.total_delay_minutes}m lag
                    </span>
                  )}
                </button>
              </div>

              {/* Split Dynamic Mapping Component + Time-Sequenced Timeline / Digital Twin */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Panel (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  {tripBuilderTab === 'timeline' ? (
                    <TimelinePanel
                      itinerary={activeItinerary}
                      isLoading={isComputingItinerary}
                      onSwapStop={handleOpenSwapForStop}
                      onMarkClosed={handleMarkClosed}
                    />
                  ) : (
                    <DigitalTwinPanel />
                  )}
                </div>

                {/* Live Dynamic Map on Right (6 cols, sticky on desktop) */}
                <div className="lg:col-span-6 lg:sticky lg:top-24">
                  <DynamicMapView
                    itinerary={activeItinerary}
                    isLoading={isComputingItinerary}
                    onSelectStop={handleOpenSwapForStop}
                  />
                </div>
              </div>
            </div>
          )}

          {/* View 3: Vendor Portal (Architecturally Separate Domain) */}
          {currentView === 'vendor-portal' && <VendorPortal />}

          {/* View 4: Terms of Service */}
          {currentView === 'terms' && <TermsOfService />}

          {/* View 5: Privacy Policy */}
          {currentView === 'privacy' && <PrivacyPolicy />}
        </div>
      </main>

      <Footer />

      {/* Docked Traveler Trip Progress Bar */}
      <TripProgressBar />

      {/* Discrete Opt-in Nearby Vendor Recommendation */}
      <NearbyVendorAdPopup />

      {/* Global Modals */}
      <RoleSelectModal />
      <VendorStorefrontModal />
      <SwapStopModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        presetStop={selectedSwapStop}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
