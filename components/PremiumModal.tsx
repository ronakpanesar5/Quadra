import React from 'react';
import { X, Check, Lock } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
            <Lock size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Quadra+</h2>
          <p className="text-indigo-100 text-sm">Unlock your full potential</p>
        </div>

        <div className="p-6 space-y-4">
          <ul className="space-y-3">
            {[
              'Unlimited Subjects',
              'Exam Countdown',
              'Detailed Spending Reports',
              'Unlimited Journaling',
              'Cloud Backup'
            ].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <button
              onClick={onUpgrade}
              className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              Upgrade for $2.99/mo
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Cancel anytime. Student discount available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
