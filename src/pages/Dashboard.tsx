import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Bus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ManagerDashboard from './dashboard/ManagerDashboard';
import DriverDashboard from './dashboard/DriverDashboard';
import StudentDashboard from './dashboard/StudentDashboard';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const roleLabels = { manager: 'Manager', driver: 'Driver', student: 'Student' };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Bus className="h-4 w-4 text-secondary" />
            </div>
            <span className="font-heading font-bold text-foreground">BusTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{user.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {roleLabels[user.role]}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {user.role === 'manager' && <ManagerDashboard />}
        {user.role === 'driver' && <DriverDashboard />}
        {user.role === 'student' && <StudentDashboard />}
      </main>
    </div>
  );
}
