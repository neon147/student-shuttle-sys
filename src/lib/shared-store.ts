// Simple localStorage-based shared store for cross-role communication

export interface EmergencyReport {
  id: string;
  driverName: string;
  busNumber: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AssignmentNotification {
  id: string;
  recipientEmail: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface TempPassRequest {
  id: string;
  name: string;
  email: string;
  institution: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SeatAttendance {
  id: string;
  busNumber: string;
  driverName: string;
  date: string;
  seats: { seatNumber: number; studentName: string }[];
  timestamp: string;
}

const REPORTS_KEY = 'bustrack_reports';
const NOTIFICATIONS_KEY = 'bustrack_notifications';
const TEMP_PASS_KEY = 'bustrack_temp_pass';
const ATTENDANCE_KEY = 'bustrack_attendance';

// Emergency reports (driver → manager)
export function getReports(): EmergencyReport[] {
  try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]'); } catch { return []; }
}

export function addReport(report: Omit<EmergencyReport, 'id' | 'timestamp' | 'read'>) {
  const reports = getReports();
  reports.unshift({ ...report, id: crypto.randomUUID(), timestamp: new Date().toISOString(), read: false });
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function markReportRead(id: string) {
  const reports = getReports().map(r => r.id === id ? { ...r, read: true } : r);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

// Assignment notifications (manager → student/driver)
export function getNotifications(email: string): AssignmentNotification[] {
  try {
    const all: AssignmentNotification[] = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    return all.filter(n => n.recipientEmail === email);
  } catch { return []; }
}

export function addNotification(recipientEmail: string, message: string) {
  try {
    const all: AssignmentNotification[] = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    all.unshift({ id: crypto.randomUUID(), recipientEmail, message, timestamp: new Date().toISOString(), read: false });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
  } catch {}
}

// Temporary pass requests
export function getTempPassRequests(): TempPassRequest[] {
  try { return JSON.parse(localStorage.getItem(TEMP_PASS_KEY) || '[]'); } catch { return []; }
}

export function addTempPassRequest(req: Omit<TempPassRequest, 'id' | 'timestamp' | 'status'>) {
  const all = getTempPassRequests();
  all.unshift({ ...req, id: crypto.randomUUID(), timestamp: new Date().toISOString(), status: 'pending' });
  localStorage.setItem(TEMP_PASS_KEY, JSON.stringify(all));
}

export function updateTempPassStatus(id: string, status: 'approved' | 'rejected') {
  const all = getTempPassRequests().map(r => r.id === id ? { ...r, status } : r);
  localStorage.setItem(TEMP_PASS_KEY, JSON.stringify(all));
}

// Seat attendance records
export function getAttendanceRecords(): SeatAttendance[] {
  try { return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]'); } catch { return []; }
}

export function addAttendanceRecord(record: Omit<SeatAttendance, 'id' | 'timestamp'>) {
  const all = getAttendanceRecords();
  all.unshift({ ...record, id: crypto.randomUUID(), timestamp: new Date().toISOString() });
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(all));
}
