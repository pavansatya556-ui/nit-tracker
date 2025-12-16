import { Course, AttendanceStats, TARGET_ATTENDANCE } from '../types';

export const calculatePercentage = (total: number, absent: number): number => {
  if (total === 0) return 100;
  const attended = total - absent;
  return (attended / total) * 100;
};

export const getCourseStats = (course: Course): AttendanceStats => {
  const { totalClasses, absentClasses } = course;
  const attended = totalClasses - absentClasses;
  const currentPercentage = calculatePercentage(totalClasses, absentClasses);
  const target = TARGET_ATTENDANCE / 100;

  // Calculate classes needed to attend to reach target
  // (attended + x) / (total + x) >= target
  // attended + x >= target*total + target*x
  // x(1 - target) >= target*total - attended
  // x >= (target*total - attended) / (1 - target)
  
  let classesToAttend = 0;
  if (currentPercentage < TARGET_ATTENDANCE) {
    const numerator = (target * totalClasses) - attended;
    const denominator = 1 - target;
    classesToAttend = Math.ceil(numerator / denominator);
    // Safety clamp if negative (though if logic is correct, shouldn't be for < target)
    if (classesToAttend < 0) classesToAttend = 0;
  }

  // Calculate classes can miss while staying above target
  // (attended) / (total + x) >= target
  // attended >= target*total + target*x
  // attended - target*total >= target*x
  // x <= (attended - target*total) / target
  
  let classesCanMiss = 0;
  if (currentPercentage > TARGET_ATTENDANCE) {
    const numerator = attended - (target * totalClasses);
    classesCanMiss = Math.floor(numerator / target);
  }

  let status: AttendanceStats['status'] = 'safe';
  if (currentPercentage >= 90) status = 'excellent';
  else if (currentPercentage >= TARGET_ATTENDANCE) status = 'safe';
  else if (currentPercentage >= 75) status = 'warning';
  else status = 'critical';

  return {
    percentage: currentPercentage,
    classesToAttend,
    classesCanMiss,
    status
  };
};

export const getOverallPercentage = (courses: Course[]): number => {
  if (courses.length === 0) return 100;
  const totalClasses = courses.reduce((sum, c) => sum + c.totalClasses, 0);
  const totalAbsent = courses.reduce((sum, c) => sum + c.absentClasses, 0);
  return calculatePercentage(totalClasses, totalAbsent);
};
