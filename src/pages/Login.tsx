import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
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

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
