import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MapPin, Clock, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { addReport, getNotifications, AssignmentNotification } from '@/lib/shared-store';
import { Bell } from 'lucide-react';

const mockStudents = ['Sara M.', 'Omar T.', 'Lina H.', 'Khalid A.', 'Noor S.'];

const pastRoutes = [
  { date: 'Mar 11, 2026', from: 'Central University', to: 'Downtown Hub', students: 12, time: '7:30 AM' },
  { date: 'Mar 10, 2026', from: 'Central University', to: 'North Station', students: 8, time: '7:30 AM' },
  { date: 'Mar 9, 2026', from: 'Central University', to: 'Downtown Hub', students: 15, time: '7:30 AM' },
];

export default function DriverDashboard() {
  const { user } = useAuth();
  const [onboard, setOnboard] = useState<string[]>([]);
  const [sharing, setSharing] = useState(false);
  const [emergency, setEmergency] = useState('');
  const [myNotifications] = useState<AssignmentNotification[]>(() =>
    user ? getNotifications(user.email) : []
  );

  const toggleStudent = (name: string) => {
    setOnboard(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Record students */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Students On Board</h3>
            <span className="ml-auto text-sm font-medium text-muted-foreground">{onboard.length}/{mockStudents.length}</span>
          </div>
          <div className="space-y-2">
            {mockStudents.map(s => (
              <button
                key={s}
                onClick={() => toggleStudent(s)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  onboard.includes(s) ? 'border-success bg-success/5' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <CheckCircle className={`h-5 w-5 ${onboard.includes(s) ? 'text-success' : 'text-muted'}`} />
                <span className="text-sm text-foreground">{s}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Location sharing & emergency */}
        <div className="space-y-6">
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
