import React, { useState } from 'react';
import { UserState, MoodEntry } from '../../types';
import { MOODS, LIMITS, QUOTES } from '../../constants';
import { BookHeart, Send } from 'lucide-react';

interface MindViewProps {
  data: UserState;
  updateData: (newData: Partial<UserState>) => void;
  triggerPremium: () => void;
}

export const MindView: React.FC<MindViewProps> = ({ data, updateData, triggerPremium }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState('');
  
  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length];

  const handleSave = () => {
    if (!selectedMood) return;

    // Check limits
    const today = new Date().toISOString().split('T')[0];
    const todaysEntries = data.moods.filter(m => m.date.startsWith(today));
    
    if (!data.isPremium && todaysEntries.length >= LIMITS.FREE_MOODS_PER_DAY) {
      triggerPremium();
      return;
    }

    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood as any,
      note: journalText
    };

    updateData({ moods: [entry, ...data.moods] });
    setJournalText('');
    setSelectedMood(null);
  };

  return (
    <div className="pb-24 pt-6 px-6 max-w-5xl mx-auto min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mind</h1>
        <p className="text-gray-500">How are you feeling?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div>
          {/* Quote Card */}
          <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl mb-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-rose-100 rounded-full opacity-50"></div>
            <p className="text-rose-800 text-lg font-medium italic relative z-10 text-center">"{todayQuote}"</p>
          </div>

          {/* Mood Selector */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Check-in</h3>
            <div className="flex justify-between gap-2 overflow-x-auto pb-2">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all w-20 flex-shrink-0 ${
                    selectedMood === m.label 
                      ? `${m.color} ring-2 ring-offset-2 ring-gray-200 scale-110 shadow-md` 
                      : 'bg-white hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[10px] font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Journaling */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookHeart size={18} className="text-rose-500"/> Journal
            </h3>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full h-40 resize-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                 <span className="text-xs text-gray-300">
                    {!data.isPremium ? '1 entry per day' : 'Unlimited entries'}
                 </span>
                 <button 
                  onClick={handleSave}
                  disabled={!selectedMood}
                  className={`p-3 rounded-full transition-colors ${
                    selectedMood ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200' : 'bg-gray-100 text-gray-300'
                  }`}
                 >
                   <Send size={18} />
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">History</h3>
          <div className="space-y-4">
            {data.moods.length === 0 && <p className="text-gray-400 text-sm text-center py-10">No entries yet.</p>}
            {data.moods.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-gray-50 shadow-sm flex gap-4 transition-transform hover:scale-[1.01]">
                <div className="text-3xl pt-1 bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  {MOODS.find(x => x.label === m.mood)?.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">{new Date(m.date).toLocaleDateString()}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{m.note || "No note added."}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
