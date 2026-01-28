export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  TIME = 'TIME',
  MONEY = 'MONEY',
  MIND = 'MIND',
  SETTINGS = 'SETTINGS'
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string; // ISO string
  completed: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Study' | 'Personal' | 'Other';
  date: string;
  description: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'Happy' | 'Calm' | 'Neutral' | 'Stressed' | 'Sad';
  note: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: 'Class' | 'Study' | 'Personal' | 'Exam';
}

export interface UserState {
  isPremium: boolean;
  name: string;
  subjects: Subject[];
  assignments: Assignment[];
  expenses: Expense[];
  moods: MoodEntry[];
  schedule: ScheduleEvent[];
  budget: number;
}

export interface SubscriptionFeature {
  label: string;
  isLocked: boolean;
}
