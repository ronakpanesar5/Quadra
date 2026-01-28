import React, { useState } from 'react';
import { UserState, Expense } from '../../types';
import { CATEGORIES } from '../../constants';
import { Plus, Wallet, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MoneyViewProps {
  data: UserState;
  updateData: (newData: Partial<UserState>) => void;
  triggerPremium: () => void;
}

export const MoneyView: React.FC<MoneyViewProps> = ({ data, updateData, triggerPremium }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const totalSpent = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = data.budget - totalSpent;

  // Chart Data preparation
  const chartData = CATEGORIES.map(cat => ({
    name: cat,
    value: data.expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
  })).filter(item => item.value > 0);

  const COLORS = ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#9ca3af'];

  const handleAddExpense = () => {
    if (!amount || !description) return;
    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category: category as any,
      date: new Date().toISOString()
    };
    updateData({ expenses: [expense, ...data.expenses] });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="pb-24 pt-6 px-6 max-w-5xl mx-auto min-h-screen">
       <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Money</h1>
        <p className="text-gray-500">Track spending & budget</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Budget Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Monthly Budget</p>
                <h2 className="text-4xl font-bold mt-1">${data.budget}</h2>
              </div>
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Wallet size={28} className="text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-50">Spent: ${totalSpent.toFixed(2)}</span>
                <span className="font-semibold text-white">${remaining.toFixed(2)} Left</span>
              </div>
              <div className="w-full bg-emerald-900/30 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500" 
                  style={{ width: `${Math.min((totalSpent / data.budget) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Add Transaction */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-5">Add Expense</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-gray-400">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-50 rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                 </div>
                 <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 >
                   {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was it for?"
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  onClick={handleAddExpense}
                  className="bg-emerald-600 text-white rounded-xl px-6 hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
           {/* Analytics */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500"/> Spending Breakdown
            </h3>
            {chartData.length > 0 ? (
              <div className="h-64 w-full bg-white rounded-2xl border border-gray-50 shadow-sm p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#374151', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-32 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                No expenses yet
              </div>
            )}
          </div>

          {/* Recent List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {data.expenses.slice(0, 5).map(e => (
                <div key={e.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-emerald-700 bg-emerald-100 font-bold text-xs`}>
                      {e.category[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.description}</p>
                      <p className="text-xs text-gray-400">{e.category}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">-${e.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
