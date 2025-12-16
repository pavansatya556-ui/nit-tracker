import React from 'react';
import { Course, TARGET_ATTENDANCE } from '../types';
import { getCourseStats } from '../utils/calculations';
import { Trash2, AlertTriangle, CheckCircle, Plus, Minus } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onUpdate: (updatedCourse: Course) => void;
  onDelete: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onUpdate, onDelete }) => {
  const stats = getCourseStats(course);
  
  const handleTotalChange = (delta: number) => {
    const newTotal = Math.max(0, course.totalClasses + delta);
    // Ensure absent doesn't exceed total
    const newAbsent = Math.min(course.absentClasses, newTotal);
    onUpdate({ ...course, totalClasses: newTotal, absentClasses: newAbsent });
  };

  const handleAbsentChange = (delta: number) => {
    const newAbsent = Math.max(0, Math.min(course.totalClasses, course.absentClasses + delta));
    onUpdate({ ...course, absentClasses: newAbsent });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'excellent': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      default: return 'bg-white border-slate-200 text-slate-800';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'excellent': return 'bg-emerald-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={`rounded-xl border shadow-sm p-5 transition-all hover:shadow-md ${getStatusColor(stats.status)} bg-opacity-50`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{course.name}</h3>
          <div className="flex items-center gap-2 text-sm opacity-80 mt-1">
             {stats.status === 'critical' && <AlertTriangle size={16} className="text-red-600" />}
             {stats.status === 'excellent' && <CheckCircle size={16} className="text-emerald-600" />}
             <span>
               {stats.status === 'critical' ? 'Attendance Critical!' : 
                stats.status === 'warning' ? 'Warning: Low Attendance' : 'On Track'}
             </span>
          </div>
        </div>
        <button 
          onClick={() => onDelete(course.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete course"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${getProgressBarColor(stats.status)}`}
          style={{ width: `${stats.percentage}%` }}
        />
        {/* Marker for Target */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-black/30 z-10" 
          style={{ left: `${TARGET_ATTENDANCE}%` }}
          title={`Target: ${TARGET_ATTENDANCE}%`}
        />
      </div>
      <div className="flex justify-between text-xs font-semibold mb-6">
        <span>Current: {stats.percentage.toFixed(1)}%</span>
        <span className="text-slate-500">Target: {TARGET_ATTENDANCE}%</span>
      </div>

      {/* Advice Text */}
      <div className="mb-6 text-sm">
        {stats.classesToAttend > 0 ? (
          <p className="font-medium text-red-700">
            ⚠️ Attend next <span className="font-bold">{stats.classesToAttend}</span> classes to reach 80%.
          </p>
        ) : (
          <p className="font-medium text-emerald-700">
             ✅ You can safely miss <span className="font-bold">{stats.classesCanMiss}</span> classes.
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase font-bold tracking-wider text-slate-500">Total Held</label>
          <div className="flex items-center gap-2 bg-white rounded-lg border p-1 shadow-sm">
            <button 
              onClick={() => handleTotalChange(-1)} 
              className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-50"
              disabled={course.totalClasses <= 0}
            >
              <Minus size={14} />
            </button>
            <span className="flex-1 text-center font-mono font-bold">{course.totalClasses}</span>
            <button 
              onClick={() => handleTotalChange(1)}
              className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase font-bold tracking-wider text-slate-500">Absent</label>
          <div className="flex items-center gap-2 bg-white rounded-lg border p-1 shadow-sm">
            <button 
              onClick={() => handleAbsentChange(-1)}
              className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded text-red-700 disabled:opacity-50"
              disabled={course.absentClasses <= 0}
            >
              <Minus size={14} />
            </button>
            <span className="flex-1 text-center font-mono font-bold text-red-600">{course.absentClasses}</span>
            <button 
              onClick={() => handleAbsentChange(1)}
              className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded text-red-700 disabled:opacity-50"
              disabled={course.absentClasses >= course.totalClasses}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
