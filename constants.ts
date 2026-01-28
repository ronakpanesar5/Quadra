import { UserState } from './types';

export const INITIAL_STATE: UserState = {
  isPremium: false,
  name: 'Student',
  subjects: [
    { id: '1', name: 'Mathematics', color: 'bg-blue-100 text-blue-800' },
    { id: '2', name: 'History', color: 'bg-orange-100 text-orange-800' }
  ],
  assignments: [
    { id: '1', subjectId: '1', title: 'Calculus Quiz', dueDate: new Date().toISOString(), completed: false },
    { id: '2', subjectId: '2', title: 'Essay Draft', dueDate: new Date(Date.now() + 86400000).toISOString(), completed: false }
  ],
  expenses: [
    { id: '1', amount: 12.50, category: 'Food', date: new Date().toISOString(), description: 'Lunch' },
    { id: '2', amount: 45.00, category: 'Study', date: new Date().toISOString(), description: 'Textbooks' }
  ],
  moods: [],
  schedule: [
    { 
      id: '1', 
      title: 'Math Lecture', 
      startTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(), 
      endTime: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
      type: 'Class' 
    },
    { 
      id: '2', 
      title: 'Study Session', 
      startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), 
      endTime: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
      type: 'Study' 
    }
  ],
  budget: 500
};

export const LIMITS = {
  FREE_SUBJECTS: 2,
  FREE_MOODS_PER_DAY: 1,
};

export const CATEGORIES = ['Food', 'Transport', 'Study', 'Personal', 'Other'];

export const MOODS = [
  { label: 'Happy', emoji: '😊', color: 'bg-green-100 text-green-600' },
  { label: 'Calm', emoji: '😌', color: 'bg-blue-100 text-blue-600' },
  { label: 'Neutral', emoji: '😐', color: 'bg-gray-100 text-gray-600' },
  { label: 'Stressed', emoji: '😫', color: 'bg-orange-100 text-orange-600' },
  { label: 'Sad', emoji: '😢', color: 'bg-indigo-100 text-indigo-600' },
];

export const QUOTES = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "Quality is not an act, it is a habit.",
];
