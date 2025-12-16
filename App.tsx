import React, { useState, useEffect } from 'react';
import { Course, TARGET_ATTENDANCE } from './types';
import CourseCard from './components/CourseCard';
import AddCourseForm from './components/AddCourseForm';
import GeminiAdvisor from './components/GeminiAdvisor';
import { Plus, GraduationCap, Sparkles, AlertCircle } from 'lucide-react';
import { getOverallPercentage } from './utils/calculations';

const App: React.FC = () => {
  // Load initial state from local storage or default
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('nit-attendance-courses');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Engineering Math', totalClasses: 20, absentClasses: 2 },
      { id: '2', name: 'Data Structures', totalClasses: 18, absentClasses: 5 },
      { id: '3', name: 'Digital Logic', totalClasses: 15, absentClasses: 0 },
    ];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('nit-attendance-courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (name: string, total: number, absent: number) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name,
      totalClasses: total,
      absentClasses: absent,
    };
    setCourses([...courses, newCourse]);
    setIsAddModalOpen(false);
  };

  const updateCourse = (updated: Course) => {
    setCourses(courses.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const overallPercentage = getOverallPercentage(courses);
  const isOverallCritical = overallPercentage < TARGET_ATTENDANCE;

  return (
    <div className="min-h-screen pb-24 bg-slate-50 text-slate-900">
      
      {/* Header / Hero Section */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none text-slate-900">NIT Tracker</h1>
              <p className="text-xs text-slate-500 font-medium">Keep your attendance green</p>
            </div>
          </div>
          
          {/* Overall Stats Pill */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${isOverallCritical ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Overall</p>
            </div>
            <div className={`text-xl font-bold font-mono ${isOverallCritical ? 'text-red-600' : 'text-emerald-600'}`}>
              {overallPercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Warning Banner */}
        {isOverallCritical && (
          <div className="mb-8 bg-red-600 text-white p-4 rounded-xl shadow-lg shadow-red-500/20 flex items-start gap-3 animate-pulse">
            <AlertCircle className="shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg">Attendance Alert!</h3>
              <p className="text-red-100 text-sm">Your overall attendance is below {TARGET_ATTENDANCE}%. You risk detention in upcoming exams. Check the AI Advisor for recovery steps.</p>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-700">My Courses ({courses.length})</h2>
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 font-medium"
          >
            <Sparkles size={18} />
            <span>AI Insights</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onUpdate={updateCourse} 
              onDelete={deleteCourse} 
            />
          ))}
          
          {/* Add New Card (Inline Style for Empty States) */}
          {courses.length === 0 && (
            <div 
              onClick={() => setIsAddModalOpen(true)}
              className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Plus size={32} />
              </div>
              <p className="font-semibold text-lg">Add your first course</p>
              <p className="text-sm opacity-70">Start tracking your attendance now</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/40 flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all z-40"
        aria-label="Add Course"
      >
        <Plus size={28} />
      </button>

      {/* Mobile AI Button (Floating Left) */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-600/40 flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-all sm:hidden z-40"
        aria-label="AI Advice"
      >
        <Sparkles size={24} />
      </button>

      {/* Modals */}
      {isAddModalOpen && (
        <AddCourseForm 
          onAdd={addCourse} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      {isAiModalOpen && (
        <GeminiAdvisor 
          courses={courses} 
          onClose={() => setIsAiModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
