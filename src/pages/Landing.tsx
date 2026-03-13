import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Shield, MapPin, Bell, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBus from '@/assets/hero-bus.png';

const steps = [
  { icon: Users, title: 'Create Account', desc: 'Sign up as a Manager, Driver, or Student in seconds.' },
  { icon: Bus, title: 'Get Assigned', desc: 'Managers assign buses to drivers and students to routes.' },
  { icon: MapPin, title: 'Track & Navigate', desc: 'Drivers share live location, students track their bus.' },
  { icon: Bell, title: 'Stay Updated', desc: 'Receive real-time notifications about schedules and alerts.' },
];

const features = [
  { icon: Shield, title: 'For Managers', desc: 'Assign students and drivers to buses, view statistics and oversee operations.' },
  { icon: MapPin, title: 'For Drivers', desc: 'Record passengers, report emergencies, share live location and view past routes.' },
  { icon: Bell, title: 'For Students', desc: 'View bus schedules, receive notifications and track your bus in real-time.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6">
              Smart Bus Transportation
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6">
              Safe Rides,<br />
              <span className="text-gradient">Smart Routes</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              BusTrack makes managing bus transportation effortless.
              Assign buses, track routes, and keep everyone informed — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate('/signup')} className="text-lg px-8 py-6">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-6">
                Sign In
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <img
              src={heroBus}
              alt="Bus illustration"
              className="w-full rounded-2xl shadow-elevated animate-float"
            />
          </motion.div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four simple steps to streamline your transportation management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow group"
              >
                <div className="w-12 h-12 rounded-lg gradient-warm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="absolute top-4 right-4 text-5xl font-heading font-bold text-muted/50">
                  {i + 1}
                </span>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features by role */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Built for Everyone
            </h2>
            <p className="text-muted-foreground text-lg">Tailored features for every role</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-xl p-8 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-6">
            Ready to Streamline Your Routes?
          </h2>
          <Button variant="hero" size="lg" onClick={() => navigate('/signup')} className="text-lg px-10 py-6">
            Create Free Account <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-primary text-primary-foreground/60 text-center text-sm">
        <p>© 2026 BusTrack — Smart Bus Transportation Management</p>
      </footer>
    </div>
  );
}
