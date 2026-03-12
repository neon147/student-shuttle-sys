import { motion } from 'framer-motion';
import { Bus, Clock, Bell, MapPin, Calendar } from 'lucide-react';

const schedule = [
  { day: 'Monday - Friday', pickup: '7:15 AM', dropoff: '3:30 PM', stop: 'Main Gate - Stop A' },
  { day: 'Saturday', pickup: '8:00 AM', dropoff: '12:00 PM', stop: 'Main Gate - Stop A' },
];

const notifications = [
  { id: 1, message: 'Bus 01 is arriving in 5 minutes', time: '2 min ago', type: 'info' as const },
  { id: 2, message: 'Schedule change: Saturday pickup moved to 8:30 AM', time: '1 hour ago', type: 'warning' as const },
  { id: 3, message: 'Route change due to road construction on Oak Street', time: '3 hours ago', type: 'warning' as const },
  { id: 4, message: 'Welcome to BusTrack! Your bus assignment: Bus 01', time: '1 day ago', type: 'info' as const },
];

const typeStyles = {
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
};

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Student Dashboard</h2>
        <p className="text-muted-foreground">Your bus information at a glance</p>
      </div>

      {/* Bus info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
            <Bus className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Bus 01</h3>
            <p className="text-sm text-muted-foreground">Plate: ABC-1234 • Driver: Ahmed K.</p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-sm text-success">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
            Active
          </span>
        </div>
        <div className="h-40 rounded-lg bg-muted flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto text-accent animate-pulse-soft" />
            <p className="text-sm text-muted-foreground mt-2">Live tracking available when driver shares location</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Schedule */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Bus Schedule</h3>
          </div>
          <div className="space-y-4">
            {schedule.map(s => (
              <div key={s.day} className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium text-sm text-foreground mb-2">{s.day}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">Pickup: <span className="text-foreground font-medium">{s.pickup}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-info" />
                    <span className="text-muted-foreground">Drop-off: <span className="text-foreground font-medium">{s.dropoff}</span></span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {s.stop}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-warning" />
            <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${typeStyles[n.type]}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
