import React, { useEffect, useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Course } from '../types';
import { getAttendanceInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { getCourseStats } from '../utils/calculations';

interface GeminiAdvisorProps {
  courses: Course[];
  onClose: () => void;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ courses, onClose }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAdvice = async () => {
      const result = await getAttendanceInsights(courses);
      if (isMounted) {
        setAdvice(result);
        setLoading(false);
      }
    };
    fetchAdvice();
    return () => { isMounted = false; };
  }, [courses]);

  const chartData = courses.map(c => ({
    name: c.name.length > 10 ? c.name.substring(0, 10) + '...' : c.name,
    percentage: getCourseStats(c).percentage
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Sparkles className="text-yellow-300" size={24} />
            </div>
            <div>
              <h2 className="font-bold text-xl">AI Attendance Strategist</h2>
              <p className="text-indigo-100 text-sm">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Chart Section */}
          <div className="h-64 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
             <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Attendance Overview</h3>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
                 <YAxis domain={[0, 100]} hide />
                 <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                 />
                 <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target 80%', position: 'insideBottomRight', fill: '#ef4444', fontSize: 10 }} />
                 <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.percentage < 80 ? '#ef4444' : '#10b981'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>

          {/* AI Text Section */}
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-indigo-400">
                <Loader2 size={32} className="animate-spin mb-3" />
                <p className="text-sm font-medium animate-pulse">Analyzing your attendance patterns...</p>
              </div>
            ) : (
              <div className="prose prose-indigo prose-sm max-w-none">
                 <h3 className="text-indigo-900 font-bold text-lg mb-2 flex items-center gap-2">
                   <span className="text-2xl">🎓</span> Strategy Report
                 </h3>
                 <div className="whitespace-pre-line text-slate-700 leading-relaxed font-medium">
                   {advice}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 text-center shrink-0">
          <p className="text-xs text-slate-400">
            AI advice is estimated based on current data. Always cross-check with official records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiAdvisor;
