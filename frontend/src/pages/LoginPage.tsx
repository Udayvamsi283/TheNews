import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const LoginPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Authentication is scheduled for Phase 2 (JWT + bcrypt). This form is a UI placeholder.',
      'info',
      'Phase 1 Notice'
    );
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded border border-slate-200 dark:border-navy-700 shadow-sm space-y-6">
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-baseline gap-1 focus:outline-none">
            <span className="text-2xl font-black uppercase tracking-tight text-navy-900 dark:text-white">
              THE NEWS
            </span>
            <span className="w-2 h-2 rounded-full bg-editorial-red inline-block" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Journalist & Subscriber Sign In
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your editorial dashboard, saved reading dossiers, and newsroom workflows.
          </p>
        </div>

        {/* Phase 1 Notice Banner */}
        <div className="p-3 rounded bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-editorial-red shrink-0 mt-0.5" />
          <div>
            <strong>Phase 1 Scope:</strong> Authentication logic and backend sessions will be implemented in Phase 2.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="editor@thenews.org"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="flex items-center justify-between text-xs">
            <Checkbox
              label="Remember this workstation"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link
              to="/forgot-password"
              className="text-editorial-red hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Sign In (Preview)
          </Button>
        </form>

        {/* Register footer link */}
        <div className="pt-4 border-t border-slate-100 dark:border-navy-750 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an editorial account?{' '}
          <Link to="/register" className="text-navy-900 dark:text-white font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
