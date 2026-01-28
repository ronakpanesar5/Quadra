import React, { useState } from 'react';
import { UserState, AppView } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { generateStudentInsight } from '../../services/geminiService';

interface DashboardProps {
  data: UserState;
  onChangeView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onChangeView }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const text = await generateStudentInsight(data);
    setInsight(text);
    setLoading(false);
  };

  const pendingAssignments = data.assignments.filter(a => !a.completed).length;

  return (
    <div className="pb-24 pt-6 px-6 max-w-5xl mx-auto min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hi, {data.name}</h1>
          <p className="text-gray-500">Let's make today productive.</p>
        </div>
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
          {data.name[0]}
        </div>
      </header>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 mb-10 relative overflow-hidden transition-all hover:shadow-2xl">
        <Sparkles className="absolute top-4 right-4 text-white/30" size={80} />
        <h3 className="font-semibold text-xl mb-3 relative z-10">Daily Insight</h3>
        <p className="text-indigo-100 text-base leading-relaxed relative z-10 min-h-[3rem] max-w-2xl">
          {loading ? "Analyzing your schedule..." : insight || "Tap the button for a personalized tip based on your studies and spending."}
        </p>
        <button 
          onClick={getInsight}
          disabled={loading}
          className="mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-colors relative z-10"
        >
          {insight ? "Refresh" : "Get Insight"}
        </button>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Study Summary */}
        <div 
          onClick={() => onChangeView(AppView.STUDY)}
          className="bg-blue-50 p-6 rounded-3xl cursor-pointer hover:bg-blue-100 transition-colors group aspect-square md:aspect-auto flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <span className="font-bold text-sm">{pendingAssignments}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Assignments</h3>
            <p className="text-xs text-gray-500 mt-1">Due soon</p>
          </div>
        </div>

        {/* Time Summary */}
         <div 
          onClick={() => onChangeView(AppView.TIME)}
          className="bg-amber-50 p-6 rounded-3xl cursor-pointer hover:bg-amber-100 transition-colors group aspect-square md:aspect-auto flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <span className="font-bold text-sm">25</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Focus</h3>
            <p className="text-xs text-gray-500 mt-1">Minutes / Session</p>
          </div>
        </div>

        {/* Money Summary */}
        <div 
          onClick={() => onChangeView(AppView.MONEY)}
          className="bg-emerald-50 p-6 rounded-3xl cursor-pointer hover:bg-emerald-100 transition-colors group aspect-square md:aspect-auto flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <span className="font-bold text-sm">$</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Budget</h3>
            <p className="text-xs text-gray-500 mt-1">${data.budget} limit</p>
          </div>
        </div>

         {/* Mind Summary */}
         <div 
          onClick={() => onChangeView(AppView.MIND)}
          className="bg-rose-50 p-6 rounded-3xl cursor-pointer hover:bg-rose-100 transition-colors group aspect-square md:aspect-auto flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <span className="font-bold text-sm">:)</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Mind</h3>
            <p className="text-xs text-gray-500 mt-1">Track Mood</p>
          </div>
        </div>
      </div>
      
      {/* Quick Action */}
      {!data.isPremium && (
        <div 
          className="mt-10 bg-gray-900 rounded-3xl p-6 flex items-center justify-between text-white cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <div>
            <h4 className="font-bold text-lg">Go Premium</h4>
            <p className="text-sm text-gray-400">Unlock unlimited features & backups</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
            <ArrowRight size={20} />
          </div>
        </div>
      )}
    </div>
  );
};
