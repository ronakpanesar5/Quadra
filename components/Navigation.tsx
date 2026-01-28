import React from 'react';
import { LayoutGrid, BookOpen, Clock, DollarSign, Smile } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutGrid, label: 'Home' },
    { view: AppView.STUDY, icon: BookOpen, label: 'Study' },
    { view: AppView.TIME, icon: Clock, label: 'Time' },
    { view: AppView.MONEY, icon: DollarSign, label: 'Money' },
    { view: AppView.MIND, icon: Smile, label: 'Mind' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 h-20 flex justify-between items-start z-50">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onChangeView(item.view)}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              currentView === item.view ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex-col p-6 z-50">
        <div className="mb-10 pl-2">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Quadra.</h1>
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.view 
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} strokeWidth={currentView === item.view ? 2.5 : 2} />
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold text-sm mb-1">Quadra+</h3>
            <p className="text-xs text-indigo-100 mb-3">Unlock full potential</p>
            <button className="w-full bg-white/20 hover:bg-white/30 text-xs py-2 rounded-lg transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
