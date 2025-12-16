export interface Course {
  id: string;
  name: string;
  totalClasses: number;
  absentClasses: number;
}

export interface AttendanceStats {
  percentage: number;
  classesToAttend: number; // To reach target
  classesCanMiss: number; // While staying above target
  status: 'critical' | 'warning' | 'safe' | 'excellent';
}

export const TARGET_ATTENDANCE = 80; // NIT Standard 80% (configurable via code)
