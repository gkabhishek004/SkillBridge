export const ROLES = {
  STUDENT: 'STUDENT',
  TRAINER: 'TRAINER',
  INSTITUTION: 'INSTITUTION',
  MANAGER: 'MANAGER',
  MONITORING: 'MONITORING',
};

export const ROLE_LABELS = {
  STUDENT: 'Student',
  TRAINER: 'Trainer',
  INSTITUTION: 'Institution Admin',
  MANAGER: 'Programme Manager',
  MONITORING: 'Monitoring Officer',
};

export const ROLE_COLORS = {
  STUDENT: '#4f46e5',
  TRAINER: '#06b6d4',
  INSTITUTION: '#10b981',
  MANAGER: '#f59e0b',
  MONITORING: '#8b5cf6',
};

export const ROLE_ICONS = {
  STUDENT: '🎓',
  TRAINER: '👨‍🏫',
  INSTITUTION: '🏛️',
  MANAGER: '📊',
  MONITORING: '👁️',
};

export const getDashboardPath = (role) => {
  const paths = {
    STUDENT: '/student',
    TRAINER: '/trainer',
    INSTITUTION: '/institution',
    MANAGER: '/manager',
    MONITORING: '/monitoring',
  };
  return paths[role] || '/dashboard';
};

export const getAttendanceBadgeClass = (status) => {
  const classes = {
    PRESENT: 'badge-success',
    ABSENT: 'badge-danger',
    LATE: 'badge-warning',
    NOT_MARKED: 'badge-gray',
  };
  return classes[status] || 'badge-gray';
};

export const getAttendanceLabel = (status) => {
  const labels = {
    PRESENT: 'Present',
    ABSENT: 'Absent',
    LATE: 'Late',
    NOT_MARKED: 'Not Marked',
  };
  return labels[status] || status;
};

export const getPercentageColor = (pct) => {
  if (pct >= 75) return '#10b981';
  if (pct >= 50) return '#f59e0b';
  return '#ef4444';
};
