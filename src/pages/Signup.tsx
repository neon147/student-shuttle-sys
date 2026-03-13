import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, User, Mail, Lock, School, Calendar, ArrowLeft, Ticket, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, UserRole } from '@/lib/auth-context';
import { addTempPassRequest } from '@/lib/shared-store';
import { toast } from 'sonner';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'manager', label: 'Manager', desc: 'Manage buses, drivers & students' },
  { value: 'driver', label: 'Driver', desc: 'Drive routes & report status' },
  { value: 'student', label: 'Student', desc: 'View schedules & track buses' },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', age: '', email: '', institution: '', role: '' as UserRole | '', password: '' });
  const [showTempPass, setShowTempPass] = useState(false);
  const [tempForm, setTempForm] = useState({ name: '', email: '', institution: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role) { toast.error('Please select a role'); return; }
    if (!form.institution) { toast.error('Please select an institution'); return; }
    const age = parseInt(form.age);
    if (isNaN(age) || age < 5 || age > 100) { toast.error('Please enter a valid age'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    const success = signup({
      name: form.name,
      age,
      email: form.email,
      institution: form.institution,
      role: form.role,
      password: form.password,
    });

    if (success) {
      toast.success('Account created!');
      navigate('/dashboard');
    } else {
      toast.error('Email already in use');
    }
  };

  const handleTempPassRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempForm.name || !tempForm.email || !tempForm.institution) {
      toast.error('Please fill all required fields');
      return;
    }
    addTempPassRequest({
      name: tempForm.name,
      email: tempForm.email,
      institution: tempForm.institution,
      message: tempForm.message,
    });
    toast.success('Temporary pass request sent to manager!');
    setTempForm({ name: '', email: '', institution: '', message: '' });
    setShowTempPass(false);
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-card rounded-2xl shadow-elevated p-8"
      >
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
            <Bus className="h-5 w-5 text-secondary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Create Account</h1>
        </div>

        {!showTempPass ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-1.5"><User className="h-4 w-4 text-muted-foreground" /> Full Name</Label>
                <Input id="name" required value={form.name} onChange={set('name')} placeholder="John Doe" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="flex items-center gap-2 mb-1.5"><Calendar className="h-4 w-4 text-muted-foreground" /> Age</Label>
                  <Input id="age" type="number" required min={5} max={100} value={form.age} onChange={set('age')} placeholder="18" />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-1.5"><Mail className="h-4 w-4 text-muted-foreground" /> Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={set('email')} placeholder="you@email.com" />
                </div>
              </div>

              <div>
                <Label htmlFor="institution" className="flex items-center gap-2 mb-1.5"><School className="h-4 w-4 text-muted-foreground" /> College or School</Label>
                <Input id="institution" required value={form.institution} onChange={set('institution')} placeholder="e.g. Central University" />
              </div>

              <div>
                <Label className="mb-2 block">Select Your Role</Label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, role: r.value }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        form.role === r.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <span className="block font-semibold text-sm text-foreground">{r.label}</span>
                      <span className="block text-xs text-muted-foreground mt-1">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-1.5"><Lock className="h-4 w-4 text-muted-foreground" /> Password</Label>
                <Input id="password" type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="Min 6 characters" />
              </div>

              <Button type="submit" className="w-full" size="lg">Create Account</Button>
            </form>

            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => setShowTempPass(true)}>
                <Ticket className="h-4 w-4 mr-2" /> Request Temporary Pass Instead
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                <Ticket className="h-5 w-5 text-warning" /> Request Temporary Pass
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Send a request to a manager for temporary bus access</p>
            </div>
            <form onSubmit={handleTempPassRequest} className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-1.5"><User className="h-4 w-4 text-muted-foreground" /> Full Name</Label>
                <Input required value={tempForm.name} onChange={e => setTempForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-1.5"><Mail className="h-4 w-4 text-muted-foreground" /> Email</Label>
                <Input type="email" required value={tempForm.email} onChange={e => setTempForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-1.5"><School className="h-4 w-4 text-muted-foreground" /> College or School</Label>
                <Input required value={tempForm.institution} onChange={e => setTempForm(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. Central University" />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-1.5"><MessageSquare className="h-4 w-4 text-muted-foreground" /> Message (optional)</Label>
                <Textarea value={tempForm.message} onChange={e => setTempForm(p => ({ ...p, message: e.target.value }))} placeholder="Reason for temporary pass..." rows={3} />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowTempPass(false)}>Cancel</Button>
                <Button type="submit" className="flex-1"><Send className="h-4 w-4 mr-2" /> Send Request</Button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
