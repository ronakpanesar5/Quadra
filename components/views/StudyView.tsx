import React, { useState } from 'react';
import { UserState, Subject, Assignment } from '../../types';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { LIMITS } from '../../constants';

interface StudyViewProps {
  data: UserState;
  updateData: (newData: Partial<UserState>) => void;
  triggerPremium: () => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ data, updateData, triggerPremium }) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'tasks'>('subjects');
  const [newSubject, setNewSubject] = useState('');
  const [newTask, setNewTask] = useState('');

  const handleAddSubject = () => {
    if (!data.isPremium && data.subjects.length >= LIMITS.FREE_SUBJECTS) {
      triggerPremium();
      return;
    }
    if (!newSubject.trim()) return;
    
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject,
      color: randomColor
    };

    updateData({ subjects: [...data.subjects, subject] });
    setNewSubject('');
  };

  const handleAddTask = () => {
    if (!newTask.trim() || data.subjects.length === 0) return;
    const task: Assignment = {
      id: Date.now().toString(),
      subjectId: data.subjects[0].id, // Default to first for simplicity
      title: newTask,
      dueDate: new Date().toISOString(),
      completed: false
    };
    updateData({ assignments: [...data.assignments, task] });
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    const updated = data.assignments.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    );
    updateData({ assignments: updated });
  };

  const deleteSubject = (id: string) => {
    updateData({ 
      subjects: data.subjects.filter(s => s.id !== id),
      assignments: data.assignments.filter(a => a.subjectId !== id)
    });
  };

  return (
    <div className="pb-24 pt-6 px-6 max-w-5xl mx-auto min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Study</h1>
        <p className="text-gray-500">Manage subjects and deadlines</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-8 max-w-md">
        <button 
          onClick={() => setActiveTab('subjects')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'subjects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Subjects
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'tasks' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Assignments
        </button>
      </div>

      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="flex gap-2 mb-4 max-w-md">
            <input 
              type="text" 
              placeholder="New subject name..." 
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleAddSubject}
              className="bg-indigo-600 text-white rounded-xl px-4 hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.subjects.map(subject => {
              const taskCount = data.assignments.filter(a => a.subjectId === subject.id && !a.completed).length;
              return (
                <div key={subject.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-12 rounded-full ${subject.color.split(' ')[0]}`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{subject.name}</h3>
                      <p className="text-sm text-gray-400">{taskCount} pending tasks</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteSubject(subject.id)}
                    className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
          
          {!data.isPremium && (
             <div className="text-center mt-6 text-sm text-gray-400">
               Free plan: {data.subjects.length} / {LIMITS.FREE_SUBJECTS} subjects used
             </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6 max-w-3xl">
           <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Add new assignment..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleAddTask}
              className="bg-indigo-600 text-white rounded-xl px-4 hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {data.assignments.length === 0 && (
              <div className="text-center py-10 text-gray-400">No assignments yet.</div>
            )}
            {data.assignments.map(task => {
              const subject = data.subjects.find(s => s.id === task.subjectId);
              return (
                <div key={task.id} className={`bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 transition-all duration-300 hover:shadow-sm ${task.completed ? 'opacity-50' : ''}`}>
                  <button onClick={() => toggleTask(task.id)} className="text-gray-400 hover:text-indigo-600">
                    {task.completed ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-base font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</p>
                    {subject && <span className={`text-[10px] px-2 py-0.5 rounded-full ${subject.color} mt-1 inline-block`}>{subject.name}</span>}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
