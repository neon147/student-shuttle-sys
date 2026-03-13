import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Mail, Lock, ArrowLeft, Ticket, Send, School, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';
import { addTempPassRequest } from '@/lib/shared-store';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showTempPass, setShowTempPass] = useState(false);
  const [tempForm, setTempForm] = useState({ name: '', email: '', institution: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
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

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-elevated p-8"
      >
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
            <Bus className="h-5 w-5 text-secondary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Welcome Back</h1>
        </div>

        {!showTempPass ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-1.5"><Mail className="h-4 w-4 text-muted-foreground" /> Email</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-1.5"><Lock className="h-4 w-4 text-muted-foreground" /> Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" />
              </div>
              <Button type="submit" className="w-full" size="lg">Sign In</Button>
            </form>

            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => setShowTempPass(true)}>
                <Ticket className="h-4 w-4 mr-2" /> Request Temporary Pass
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Create one</Link>
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
