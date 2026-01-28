import React, { useState, useEffect } from 'react';
import { AppView, UserState } from './types';
import { INITIAL_STATE } from './constants';
import { Navigation } from './components/Navigation';
import { PremiumModal } from './components/PremiumModal';

// Views
import { Dashboard } from './components/views/Dashboard';
import { StudyView } from './components/views/StudyView';
import { TimeView } from './components/views/TimeView';
import { MoneyView } from './components/views/MoneyView';
import { MindView } from './components/views/MindView';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserState>(() => {
    // Simple local storage persistence
    const saved = localStorage.getItem('quadra_data');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('quadra_data', JSON.stringify(userData));
  }, [userData]);

  const updateData = (newData: Partial<UserState>) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const handleUpgrade = () => {
    // Simulate payment process
    setTimeout(() => {
      updateData({ isPremium: true });
      setIsPremiumModalOpen(false);
      alert("Welcome to Quadra Premium!");
    }, 1000);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard data={userData} onChangeView={setCurrentView} />;
      case AppView.STUDY:
        return <StudyView data={userData} updateData={updateData} triggerPremium={() => setIsPremiumModalOpen(true)} />;
      case AppView.TIME:
        return <TimeView data={userData} updateData={updateData} />;
      case AppView.MONEY:
        return <MoneyView data={userData} updateData={updateData} triggerPremium={() => setIsPremiumModalOpen(true)} />;
      case AppView.MIND:
        return <MindView data={userData} updateData={updateData} triggerPremium={() => setIsPremiumModalOpen(true)} />;
      default:
        return <Dashboard data={userData} onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-900 selection:bg-indigo-100 flex flex-col md:flex-row">
      
      {/* Navigation Layer */}
      <Navigation currentView={currentView} onChangeView={setCurrentView} />

      {/* Main Content Area - Adjusted for Responsive Sidebar */}
      <main className="flex-1 w-full md:pl-64 transition-all">
        {renderView()}
      </main>

      {/* Global Modals */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}

export default App;
