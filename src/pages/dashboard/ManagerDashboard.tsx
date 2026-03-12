import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Users, UserCheck, Plus, Hash, CreditCard, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getReports, markReportRead, addNotification, EmergencyReport } from '@/lib/shared-store';

interface BusData {
  id: string;
  number: string;
  plate: string;
  driver: string;
  driverEmail: string;
  students: string[];
  studentEmails: string[];
}

const initialBuses: BusData[] = [
  { id: '1', number: 'Bus 01', plate: 'ABC-1234', driver: 'Ahmed K.', driverEmail: '', students: ['Sara M.', 'Omar T.', 'Lina H.'], studentEmails: [] },
  { id: '2', number: 'Bus 02', plate: 'XYZ-5678', driver: 'Fatima R.', driverEmail: '', students: ['Khalid A.', 'Noor S.'], studentEmails: [] },
  { id: '3', number: 'Bus 03', plate: 'DEF-9012', driver: '', driverEmail: '', students: [], studentEmails: [] },
];

export default function ManagerDashboard() {
  const [buses, setBuses] = useState(initialBuses);
  const [showAdd, setShowAdd] = useState(false);
  const [newBus, setNewBus] = useState({ number: '', plate: '' });
  const [newStudent, setNewStudent] = useState<Record<string, { name: string; email: string }>>({});
  const [newDriver, setNewDriver] = useState<Record<string, { name: string; email: string }>>({});
  const [reports, setReports] = useState<EmergencyReport[]>(() => getReports());
  const [showReports, setShowReports] = useState(false);

  const stats = [
    { label: 'Total Buses', value: buses.length, icon: Bus, color: 'bg-primary/10 text-primary' },
    { label: 'Active Drivers', value: buses.filter(b => b.driver).length, icon: UserCheck, color: 'bg-success/10 text-success' },
    { label: 'Students Assigned', value: buses.reduce((a, b) => a + b.students.length, 0), icon: Users, color: 'bg-secondary/80 text-secondary-foreground' },
    { label: 'Emergency Reports', value: reports.filter(r => !r.read).length, icon: AlertTriangle, color: 'bg-destructive/10 text-destructive' },
  ];

  const addBus = () => {
    if (!newBus.number || !newBus.plate) { toast.error('Fill in all fields'); return; }
    setBuses(prev => [...prev, { id: crypto.randomUUID(), ...newBus, driver: '', driverEmail: '', students: [], studentEmails: [] }]);
    setNewBus({ number: '', plate: '' });
    setShowAdd(false);
    toast.success('Bus added!');
  };

  const assignStudent = (busId: string) => {
    const data = newStudent[busId];
    if (!data?.name?.trim()) return;
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;

    setBuses(prev => prev.map(b => b.id === busId ? { ...b, students: [...b.students, data.name.trim()], studentEmails: [...b.studentEmails, data.email?.trim() || ''] } : b));

    // Notify student if email provided
    if (data.email?.trim()) {
      addNotification(data.email.trim(), `You have been assigned to ${bus.number} (${bus.plate}). Your driver is ${bus.driver || 'TBD'}.`);
    }

    setNewStudent(prev => ({ ...prev, [busId]: { name: '', email: '' } }));
    toast.success(`${data.name} assigned and notified!`);
  };

  const assignDriver = (busId: string) => {
    const data = newDriver[busId];
    if (!data?.name?.trim()) return;
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;

    setBuses(prev => prev.map(b => b.id === busId ? { ...b, driver: data.name.trim(), driverEmail: data.email?.trim() || '' } : b));

    // Notify driver if email provided
    if (data.email?.trim()) {
      addNotification(data.email.trim(), `You have been assigned as the driver for ${bus.number} (${bus.plate}) with ${bus.students.length} students.`);
    }

    setNewDriver(prev => ({ ...prev, [busId]: { name: '', email: '' } }));
    toast.success(`Driver assigned and notified!`);
  };

  const handleMarkRead = (id: string) => {
    markReportRead(id);
    setReports(getReports());
  };

  const refreshReports = () => {
    setReports(getReports());
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Manager Dashboard</h2>
        <p className="text-muted-foreground">Manage buses, drivers and student assignments</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-5 shadow-card flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Emergency Reports from Drivers */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="font-heading font-semibold text-foreground">Driver Emergency Reports</h3>
          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full ml-1">
            {reports.filter(r => !r.read).length} unread
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={refreshReports}>Refresh</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowReports(!showReports)}>
              {showReports ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
        {showReports && (
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No emergency reports</p>
            ) : (
              reports.map(r => (
                <div key={r.id} className={`p-4 rounded-lg border ${r.read ? 'bg-muted/30 border-border' : 'bg-destructive/5 border-destructive/20'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{r.driverName}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{r.busNumber}</span>
                        {!r.read && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">New</span>}
                      </div>
                      <p className="text-sm text-foreground">{r.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(r.timestamp).toLocaleString()}</p>
                    </div>
                    {!r.read && (
                      <Button size="sm" variant="ghost" onClick={() => handleMarkRead(r.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Add bus */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-2" /> Add Bus
        </Button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card rounded-xl p-6 shadow-card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-1"><Hash className="h-4 w-4 text-muted-foreground" /> Bus Number</Label>
              <Input value={newBus.number} onChange={e => setNewBus(p => ({ ...p, number: e.target.value }))} placeholder="Bus 04" />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-1"><CreditCard className="h-4 w-4 text-muted-foreground" /> License Plate</Label>
              <Input value={newBus.plate} onChange={e => setNewBus(p => ({ ...p, plate: e.target.value }))} placeholder="GHI-3456" />
            </div>
          </div>
          <Button onClick={addBus}>Save Bus</Button>
        </motion.div>
      )}

      {/* Bus list */}
      <div className="space-y-4">
        {buses.map(bus => (
          <motion.div
            key={bus.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl p-6 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{bus.number}</h3>
                  <p className="text-xs text-muted-foreground">{bus.plate}</p>
                </div>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${bus.driver ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {bus.driver ? `Driver: ${bus.driver}` : 'No driver'}
              </span>
            </div>

            {/* Assign driver */}
            {!bus.driver && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Input
                  placeholder="Driver name"
                  value={newDriver[bus.id]?.name || ''}
                  onChange={e => setNewDriver(p => ({ ...p, [bus.id]: { ...p[bus.id], name: e.target.value } }))}
                  className="max-w-[180px]"
                />
                <Input
                  placeholder="Driver email (for notification)"
                  value={newDriver[bus.id]?.email || ''}
                  onChange={e => setNewDriver(p => ({ ...p, [bus.id]: { ...p[bus.id], email: e.target.value } }))}
                  className="max-w-[220px]"
                />
                <Button size="sm" onClick={() => assignDriver(bus.id)}>Assign Driver</Button>
              </div>
            )}

            {/* Students */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Students ({bus.students.length})</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {bus.students.map(s => (
                  <span key={s} className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
                {bus.students.length === 0 && <span className="text-xs text-muted-foreground">No students assigned</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Input
                  placeholder="Student name"
                  value={newStudent[bus.id]?.name || ''}
                  onChange={e => setNewStudent(p => ({ ...p, [bus.id]: { ...p[bus.id], name: e.target.value } }))}
                  className="max-w-[180px]"
                />
                <Input
                  placeholder="Student email (for notification)"
                  value={newStudent[bus.id]?.email || ''}
                  onChange={e => setNewStudent(p => ({ ...p, [bus.id]: { ...p[bus.id], email: e.target.value } }))}
                  className="max-w-[220px]"
                />
                <Button size="sm" variant="secondary" onClick={() => assignStudent(bus.id)}>Add Student</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
