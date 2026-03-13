import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bus, Users, UserCheck, Plus, Hash, CreditCard, AlertTriangle, Eye, Ticket, Check, X, Camera, Image, MapPin, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getReports, markReportRead, addNotification, EmergencyReport, getTempPassRequests, updateTempPassStatus, TempPassRequest } from '@/lib/shared-store';

interface BusData {
  id: string;
  number: string;
  plate: string;
  route: string;
  driver: string;
  driverEmail: string;
  driverPhoto: string;
  busPhoto: string;
  students: { name: string; email: string; photo: string }[];
}

const initialBuses: BusData[] = [
  { id: '1', number: 'Bus 01', plate: 'ABC-1234', route: 'Central University → Downtown Hub', driver: 'Ahmed K.', driverEmail: '', driverPhoto: '', busPhoto: '', students: [{ name: 'Sara M.', email: '', photo: '' }, { name: 'Omar T.', email: '', photo: '' }, { name: 'Lina H.', email: '', photo: '' }] },
  { id: '2', number: 'Bus 02', plate: 'XYZ-5678', route: 'Riverside Academy → North Station', driver: 'Fatima R.', driverEmail: '', driverPhoto: '', busPhoto: '', students: [{ name: 'Khalid A.', email: '', photo: '' }, { name: 'Noor S.', email: '', photo: '' }] },
  { id: '3', number: 'Bus 03', plate: 'DEF-9012', route: '', driver: '', driverEmail: '', driverPhoto: '', busPhoto: '', students: [] },
];

export default function ManagerDashboard() {
  const [buses, setBuses] = useState(initialBuses);
  const [showAdd, setShowAdd] = useState(false);
  const [newBus, setNewBus] = useState({ number: '', plate: '', route: '', photo: '' });
  const [newStudent, setNewStudent] = useState<Record<string, { name: string; email: string; photo: string }>>({});
  const [newDriver, setNewDriver] = useState<Record<string, { name: string; email: string; photo: string }>>({});
  const [reports, setReports] = useState<EmergencyReport[]>(() => getReports());
  const [showReports, setShowReports] = useState(false);
  const [tempRequests, setTempRequests] = useState<TempPassRequest[]>(() => getTempPassRequests());
  const [showTempRequests, setShowTempRequests] = useState(false);
  const busPhotoRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Total Buses', value: buses.length, icon: Bus, color: 'bg-primary/10 text-primary' },
    { label: 'Active Drivers', value: buses.filter(b => b.driver).length, icon: UserCheck, color: 'bg-success/10 text-success' },
    { label: 'Students Assigned', value: buses.reduce((a, b) => a + b.students.length, 0), icon: Users, color: 'bg-secondary/80 text-secondary-foreground' },
    { label: 'Temp Pass Requests', value: tempRequests.filter(r => r.status === 'pending').length, icon: Ticket, color: 'bg-warning/10 text-warning' },
  ];

  const handlePhotoUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addBus = () => {
    if (!newBus.number || !newBus.plate) { toast.error('Fill in all fields'); return; }
    setBuses(prev => [...prev, { id: crypto.randomUUID(), number: newBus.number, plate: newBus.plate, route: newBus.route, driver: '', driverEmail: '', driverPhoto: '', busPhoto: newBus.photo, students: [] }]);
    setNewBus({ number: '', plate: '', route: '', photo: '' });
    setShowAdd(false);
    toast.success('Bus added!');
  };

  const removeStudent = (busId: string, studentIndex: number) => {
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, students: b.students.filter((_, i) => i !== studentIndex) } : b));
    toast.success('Student removed');
  };

  const removeDriver = (busId: string) => {
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, driver: '', driverEmail: '', driverPhoto: '' } : b));
    toast.success('Driver removed');
  };

  const assignStudent = (busId: string) => {
    const data = newStudent[busId];
    if (!data?.name?.trim()) return;
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;

    setBuses(prev => prev.map(b => b.id === busId ? { ...b, students: [...b.students, { name: data.name.trim(), email: data.email?.trim() || '', photo: data.photo || '' }] } : b));

    if (data.email?.trim()) {
      addNotification(data.email.trim(), `You have been assigned to ${bus.number} (${bus.plate}). Your driver is ${bus.driver || 'TBD'}.`);
    }

    setNewStudent(prev => ({ ...prev, [busId]: { name: '', email: '', photo: '' } }));
    toast.success(`${data.name} assigned and notified!`);
  };

  const assignDriver = (busId: string) => {
    const data = newDriver[busId];
    if (!data?.name?.trim()) return;
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;

    setBuses(prev => prev.map(b => b.id === busId ? { ...b, driver: data.name.trim(), driverEmail: data.email?.trim() || '', driverPhoto: data.photo || '' } : b));

    if (data.email?.trim()) {
      addNotification(data.email.trim(), `You have been assigned as the driver for ${bus.number} (${bus.plate}) with ${bus.students.length} students.`);
    }

    setNewDriver(prev => ({ ...prev, [busId]: { name: '', email: '', photo: '' } }));
    toast.success(`Driver assigned and notified!`);
  };

  const handleMarkRead = (id: string) => {
    markReportRead(id);
    setReports(getReports());
  };

  const refreshReports = () => setReports(getReports());

  const handleTempPass = (id: string, status: 'approved' | 'rejected') => {
    updateTempPassStatus(id, status);
    setTempRequests(getTempPassRequests());
    toast.success(`Request ${status}`);
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
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-5 shadow-card flex items-center gap-4">
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

      {/* Temporary Pass Requests */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="h-5 w-5 text-warning" />
          <h3 className="font-heading font-semibold text-foreground">Temporary Pass Requests</h3>
          <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full ml-1">
            {tempRequests.filter(r => r.status === 'pending').length} pending
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setTempRequests(getTempPassRequests())}>Refresh</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowTempRequests(!showTempRequests)}>
              {showTempRequests ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
        {showTempRequests && (
          <div className="space-y-3">
            {tempRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No temporary pass requests</p>
            ) : (
              tempRequests.map(req => (
                <div key={req.id} className={`p-4 rounded-lg border ${req.status === 'pending' ? 'bg-warning/5 border-warning/20' : req.status === 'approved' ? 'bg-success/5 border-success/20' : 'bg-muted/30 border-border'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.name}</p>
                      <p className="text-xs text-muted-foreground">{req.email} • {req.institution}</p>
                      {req.message && <p className="text-sm text-foreground mt-1">"{req.message}"</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(req.timestamp).toLocaleString()}</p>
                    </div>
                    {req.status === 'pending' ? (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="text-success hover:bg-success/10" onClick={() => handleTempPass(req.id, 'approved')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleTempPass(req.id, 'rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${req.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Emergency Reports */}
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
          <div>
            <Label className="flex items-center gap-2 mb-1"><Camera className="h-4 w-4 text-muted-foreground" /> Bus Photo</Label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" ref={busPhotoRef} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, url => setNewBus(p => ({ ...p, photo: url }))); }} />
              <Button type="button" variant="outline" size="sm" onClick={() => busPhotoRef.current?.click()}>
                <Image className="h-4 w-4 mr-1" /> Upload Photo
              </Button>
              {newBus.photo && <img src={newBus.photo} alt="Bus" className="w-12 h-12 rounded-lg object-cover border border-border" />}
            </div>
          </div>
          <Button onClick={addBus}>Save Bus</Button>
        </motion.div>
      )}

      {/* Bus list */}
      <div className="space-y-4">
        {buses.map(bus => (
          <motion.div key={bus.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                {bus.busPhoto ? (
                  <img src={bus.busPhoto} alt={bus.number} className="w-10 h-10 rounded-lg object-cover border border-border" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bus className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{bus.number}</h3>
                  <p className="text-xs text-muted-foreground">{bus.plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {bus.driverPhoto && <img src={bus.driverPhoto} alt={bus.driver} className="w-8 h-8 rounded-full object-cover border border-border" />}
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${bus.driver ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                  {bus.driver ? `Driver: ${bus.driver}` : 'No driver'}
                </span>
              </div>
            </div>

            {/* Assign driver */}
            {!bus.driver && (
              <div className="flex flex-wrap gap-2 mb-4 items-end">
                <div className="flex flex-wrap gap-2 flex-1">
                  <Input
                    placeholder="Driver name"
                    value={newDriver[bus.id]?.name || ''}
                    onChange={e => setNewDriver(p => ({ ...p, [bus.id]: { ...p[bus.id], name: e.target.value, photo: p[bus.id]?.photo || '' } }))}
                    className="max-w-[160px]"
                  />
                  <Input
                    placeholder="Driver email"
                    value={newDriver[bus.id]?.email || ''}
                    onChange={e => setNewDriver(p => ({ ...p, [bus.id]: { ...p[bus.id], email: e.target.value, photo: p[bus.id]?.photo || '' } }))}
                    className="max-w-[180px]"
                  />
                  <div className="flex items-center gap-1">
                    <input type="file" accept="image/*" className="hidden" id={`driver-photo-${bus.id}`} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, url => setNewDriver(p => ({ ...p, [bus.id]: { ...p[bus.id], photo: url } }))); }} />
                    <Button size="sm" variant="outline" onClick={() => document.getElementById(`driver-photo-${bus.id}`)?.click()}>
                      <Camera className="h-3 w-3" />
                    </Button>
                    {newDriver[bus.id]?.photo && <img src={newDriver[bus.id].photo} alt="" className="w-8 h-8 rounded-full object-cover" />}
                  </div>
                </div>
                <Button size="sm" onClick={() => assignDriver(bus.id)}>Assign Driver</Button>
              </div>
            )}

            {/* Students */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Students ({bus.students.length})</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {bus.students.map((s, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                    {s.photo && <img src={s.photo} alt={s.name} className="w-5 h-5 rounded-full object-cover" />}
                    {s.name}
                  </span>
                ))}
                {bus.students.length === 0 && <span className="text-xs text-muted-foreground">No students assigned</span>}
              </div>
              <div className="flex flex-wrap gap-2 items-end">
                <Input
                  placeholder="Student name"
                  value={newStudent[bus.id]?.name || ''}
                  onChange={e => setNewStudent(p => ({ ...p, [bus.id]: { ...p[bus.id], name: e.target.value, photo: p[bus.id]?.photo || '' } }))}
                  className="max-w-[160px]"
                />
                <Input
                  placeholder="Student email"
                  value={newStudent[bus.id]?.email || ''}
                  onChange={e => setNewStudent(p => ({ ...p, [bus.id]: { ...p[bus.id], email: e.target.value, photo: p[bus.id]?.photo || '' } }))}
                  className="max-w-[180px]"
                />
                <div className="flex items-center gap-1">
                  <input type="file" accept="image/*" className="hidden" id={`student-photo-${bus.id}`} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f, url => setNewStudent(p => ({ ...p, [bus.id]: { ...p[bus.id], photo: url } }))); }} />
                  <Button size="sm" variant="outline" onClick={() => document.getElementById(`student-photo-${bus.id}`)?.click()}>
                    <Camera className="h-3 w-3" />
                  </Button>
                  {newStudent[bus.id]?.photo && <img src={newStudent[bus.id].photo} alt="" className="w-8 h-8 rounded-full object-cover" />}
                </div>
                <Button size="sm" variant="secondary" onClick={() => assignStudent(bus.id)}>Add Student</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
