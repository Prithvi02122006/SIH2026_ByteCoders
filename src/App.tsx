import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { KitchenDashboard } from './pages/KitchenDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { SafetyOfficerDashboard } from './pages/SafetyOfficerDashboard';
import { AdminEsgDashboard } from './pages/AdminEsgDashboard';
import { InsightsLabPage } from './pages/InsightsLabPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';
import { api, getStoredSession, saveSession, clearSession, UserSession } from './services/api';

export function App() {
  const [session, setSession] = useState<UserSession | null>(getStoredSession());
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Sync session on mount
  useEffect(() => {
    const s = getStoredSession();
    if (s) {
      setSession(s);
    }
  }, []);

  const handleAuthSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setCurrentTab('landing');
  };

  const handleQuickDemoSwitch = async (role: string) => {
    try {
      const demoSession = await api.demoQuickLogin(role);
      saveSession(demoSession);
      setSession(demoSession);
      setCurrentTab('dashboard');
    } catch (err: any) {
      alert(`Could not load demo session: ${err.message}`);
    }
  };

  const handleEnterDemo = () => {
    handleQuickDemoSwitch('kitchen');
  };

  const renderDashboard = () => {
    if (!session) {
      return (
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onQuickDemoSwitch={handleQuickDemoSwitch}
        />
      );
    }

    switch (session.role) {
      case 'kitchen':
        return <KitchenDashboard session={session} />;
      case 'ngo':
        return <NgoDashboard session={session} />;
      case 'driver':
        return <DriverDashboard session={session} />;
      case 'safety_officer':
        return <SafetyOfficerDashboard session={session} />;
      case 'admin':
        return <AdminEsgDashboard session={session} />;
      default:
        return <KitchenDashboard session={session} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3DC] text-[#1F201C] selection:bg-[#5F7A3E] selection:text-[#FBF3DC]">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        session={session}
        onLogout={handleLogout}
        onQuickDemoSwitch={handleQuickDemoSwitch}
        onEnterDemo={handleEnterDemo}
      />

      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            setCurrentTab={setCurrentTab}
            onEnterDemo={handleEnterDemo}
            onQuickDemoSwitch={handleQuickDemoSwitch}
          />
        )}

        {currentTab === 'auth' && (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            onQuickDemoSwitch={handleQuickDemoSwitch}
          />
        )}

        {currentTab === 'dashboard' && renderDashboard()}

        {currentTab === 'insights-lab' && <InsightsLabPage />}

        {currentTab === 'methodology' && <MethodologyPage />}

        {currentTab === 'about' && <AboutPage />}

        {currentTab === 'settings' && session && (
          <SettingsPage session={session} onLogout={handleLogout} />
        )}
      </main>

      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default App;
