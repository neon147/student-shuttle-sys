import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MapPin, Clock, CheckCircle, Send, Bell, Armchair, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { addReport, getNotifications, AssignmentNotification, addAttendanceRecord, getAttendanceRecords, SeatAttendance } from '@/lib/shared-store';

const TOTAL_SEATS = 50;

const pastRoutes = [
  { date: 'Mar 11, 2026', from: 'Central University', to: 'Downtown Hub', students: 12, time: '7:30 AM' },
  { date: 'Mar 10, 2026', from: 'Central University', to: 'North Station', students: 8, time: '7:30 AM' },
  { date: 'Mar 9, 2026', from: 'Central University', to: 'Downtown Hub', students: 15, time: '7:30 AM' },
];

export default function DriverDashboard() {
  const { user } = useAuth();
  const [sharing, setSharing] = useState(false);
  const [emergency, setEmergency] = useState('');
  const [myNotifications] = useState<AssignmentNotification[]>(() =>
    user ? getNotifications(user.email) : []
  );

  // Seat management
  const [seats, setSeats] = useState<Record<number, string>>({});
  const [editingSeat, setEditingSeat] = useState<number | null>(null);
  const [seatInput, setSeatInput] = useState('');
  const [showAttendanceReport, setShowAttendanceReport] = useState(false);
  const [attendanceRecords] = useState<SeatAttendance[]>(() => getAttendanceRecords());

  const assignSeat = (seatNum: number) => {
    if (seatInput.trim()) {
      setSeats(prev => ({ ...prev, [seatNum]: seatInput.trim() }));
      setSeatInput('');
      setEditingSeat(null);
      toast.success(`Seat ${seatNum} assigned to ${seatInput.trim()}`);
    }
  };

  const clearSeat = (seatNum: number) => {
    setSeats(prev => {
      const copy = { ...prev };
      delete copy[seatNum];
      return copy;
    });
  };

  const saveAttendance = () => {
    const occupied = Object.entries(seats).map(([num, name]) => ({ seatNumber: parseInt(num), studentName: name }));
    if (occupied.length === 0) { toast.error('No students seated'); return; }
    addAttendanceRecord({
      busNumber: 'Bus 01',
      driverName: user?.name || 'Unknown',
      date: new Date().toLocaleDateString(),
      seats: occupied,
    });
    toast.success(`Attendance saved: ${occupied.length} students recorded`);
  };

  const occupiedCount = Object.keys(seats).length;

  const submitEmergency = () => {
    if (!emergency.trim()) { toast.error('Please describe the emergency'); return; }
    addReport({
      driverName: user?.name || 'Unknown',
      busNumber: 'Bus 01',
      message: emergency.trim(),
    });
    toast.success('Emergency report submitted to management');
    setEmergency('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Driver Dashboard</h2>
        <p className="text-muted-foreground">Bus 01 • ABC-1234</p>
      </div>

      {/* Assignment notifications */}
      {myNotifications.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-warning" />
            <h3 className="font-heading font-semibold text-foreground">Assignment Notifications</h3>
            <span className="ml-auto text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">{myNotifications.length} new</span>
          </div>
          <div className="space-y-2">
            {myNotifications.map(n => (
              <div key={n.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-success/10 text-success">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 50-Seat Bus Layout */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Armchair className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Bus Seats ({occupiedCount}/{TOTAL_SEATS})</h3>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowAttendanceReport(!showAttendanceReport)}>
              <FileText className="h-4 w-4 mr-1" /> {showAttendanceReport ? 'Hide' : 'View'} Report
            </Button>
            <Button size="sm" onClick={saveAttendance}>Save Attendance</Button>
          </div>
        </div>

        {/* Seat legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted border border-border" /> Empty</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-success/20 border border-success/40" /> Occupied</span>
        </div>

        {/* Seat grid - 10 rows × 5 columns */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map(seatNum => {
            const student = seats[seatNum];
            const isEditing = editingSeat === seatNum;
            return (
              <div key={seatNum} className="relative">
                <button
                  onClick={() => {
                    if (student) {
                      clearSeat(seatNum);
                    } else {
                      setEditingSeat(seatNum);
                      setSeatInput('');
                    }
                  }}
                  title={student ? `${student} — click to remove` : `Seat ${seatNum} — click to assign`}
                  className={`w-full aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs transition-all ${
                    student
                      ? 'border-success/40 bg-success/10 text-success hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive'
                      : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  <span className="font-bold">{seatNum}</span>
                  {student && <span className="truncate w-full px-0.5 text-[10px] leading-tight mt-0.5">{student.split(' ')[0]}</span>}
                </button>
                {isEditing && (
                  <div className="absolute z-20 top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-elevated p-2 w-40">
                    <Input
                      autoFocus
                      placeholder="Student name"
                      value={seatInput}
                      onChange={e => setSeatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') assignSeat(seatNum); if (e.key === 'Escape') setEditingSeat(null); }}
                      className="text-xs h-8 mb-1"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 text-xs flex-1" onClick={() => assignSeat(seatNum)}>Assign</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingSeat(null)}>✕</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Attendance Report */}
      {showAttendanceReport && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-info" />
            <h3 className="font-heading font-semibold text-foreground">Attendance Reports</h3>
          </div>

          {/* Current session */}
          {occupiedCount > 0 && (
            <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium text-foreground mb-2">Current Session — {occupiedCount} students</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(seats).map(([num, name]) => (
                  <div key={num} className="flex items-center gap-2 text-xs bg-card rounded p-2">
                    <span className="font-bold text-primary">#{num}</span>
                    <span className="text-foreground truncate">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past records */}
          <div className="space-y-3">
            {attendanceRecords.length === 0 && occupiedCount === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No attendance records yet</p>
            )}
            {attendanceRecords.map(rec => (
              <div key={rec.id} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{rec.busNumber} • {rec.date}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{rec.seats.length} students</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {rec.seats.map(s => (
                    <span key={s.seatNumber} className="text-xs text-muted-foreground">
                      Seat #{s.seatNumber}: {s.studentName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Location sharing */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-accent" />
            <h3 className="font-heading font-semibold text-foreground">Live Location</h3>
          </div>
          <div className="h-36 rounded-lg bg-muted flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className={`h-8 w-8 mx-auto ${sharing ? 'text-success animate-pulse-soft' : 'text-muted-foreground'}`} />
              <p className="text-sm text-muted-foreground mt-2">{sharing ? 'Sharing location...' : 'Location not shared'}</p>
            </div>
          </div>
          <Button
            className="w-full"
            variant={sharing ? 'destructive' : 'default'}
            onClick={() => { setSharing(!sharing); toast.success(sharing ? 'Location sharing stopped' : 'Location sharing started'); }}
          >
            {sharing ? 'Stop Sharing' : 'Start Sharing Location'}
          </Button>
        </motion.div>

        {/* Emergency */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-heading font-semibold text-foreground">Emergency Report</h3>
          </div>
          <Textarea
            placeholder="Describe the incident in detail..."
            value={emergency}
            onChange={e => setEmergency(e.target.value)}
            className="mb-3"
            rows={3}
          />
          <Button variant="destructive" onClick={submitEmergency} className="w-full">
            <Send className="h-4 w-4 mr-2" /> Submit Report
          </Button>
        </motion.div>
      </div>

      {/* Past routes */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-info" />
          <h3 className="font-heading font-semibold text-foreground">Past Routes</h3>
        </div>
        <div className="space-y-3">
          {pastRoutes.map(r => (
            <div key={r.date} className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-muted/50 gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">{r.from} → {r.to}</p>
                <p className="text-xs text-muted-foreground">{r.date} at {r.time}</p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{r.students} students</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
