import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Users, UserCheck, Plus, Hash, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface BusData {
  id: string;
  number: string;
  plate: string;
  driver: string;
  students: string[];
}

const initialBuses: BusData[] = [
  { id: '1', number: 'Bus 01', plate: 'ABC-1234', driver: 'Ahmed K.', students: ['Sara M.', 'Omar T.', 'Lina H.'] },
  { id: '2', number: 'Bus 02', plate: 'XYZ-5678', driver: 'Fatima R.', students: ['Khalid A.', 'Noor S.'] },
  { id: '3', number: 'Bus 03', plate: 'DEF-9012', driver: '', students: [] },
];

const stats = [
  { label: 'Total Buses', value: 3, icon: Bus, color: 'bg-primary/10 text-primary' },
  { label: 'Active Drivers', value: 2, icon: UserCheck, color: 'bg-success/10 text-success' },
  { label: 'Students Assigned', value: 5, icon: Users, color: 'bg-secondary/80 text-secondary-foreground' },
];

export default function ManagerDashboard() {
  const [buses, setBuses] = useState(initialBuses);
  const [showAdd, setShowAdd] = useState(false);
  const [newBus, setNewBus] = useState({ number: '', plate: '' });
  const [newStudent, setNewStudent] = useState<Record<string, string>>({});
  const [newDriver, setNewDriver] = useState<Record<string, string>>({});

  const addBus = () => {
    if (!newBus.number || !newBus.plate) { toast.error('Fill in all fields'); return; }
    setBuses(prev => [...prev, { id: crypto.randomUUID(), ...newBus, driver: '', students: [] }]);
    setNewBus({ number: '', plate: '' });
    setShowAdd(false);
    toast.success('Bus added!');
  };

  const assignStudent = (busId: string) => {
    const name = newStudent[busId]?.trim();
    if (!name) return;
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, students: [...b.students, name] } : b));
    setNewStudent(prev => ({ ...prev, [busId]: '' }));
    toast.success(`${name} assigned!`);
  };

  const assignDriver = (busId: string) => {
    const name = newDriver[busId]?.trim();
    if (!name) return;
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, driver: name } : b));
    setNewDriver(prev => ({ ...prev, [busId]: '' }));
    toast.success(`Driver assigned!`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Manager Dashboard</h2>
        <p className="text-muted-foreground">Manage buses, drivers and student assignments</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
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
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Driver name"
                  value={newDriver[bus.id] || ''}
                  onChange={e => setNewDriver(p => ({ ...p, [bus.id]: e.target.value }))}
                  className="max-w-xs"
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
              <div className="flex gap-2">
                <Input
                  placeholder="Student name"
                  value={newStudent[bus.id] || ''}
                  onChange={e => setNewStudent(p => ({ ...p, [bus.id]: e.target.value }))}
                  className="max-w-xs"
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
