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

const REPORTS_KEY = 'bustrack_reports';
const NOTIFICATIONS_KEY = 'bustrack_notifications';

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
