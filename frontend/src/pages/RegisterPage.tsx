import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const RegisterPage: React.FC = () => {
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      showToast('Please accept the editorial code of ethics to proceed', 'error');
      return;
    }
    showToast(
      'Account registration backend will be introduced in Phase 2.',
      'info',
      'Phase 1 Notice'
    );
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded border border-slate-200 dark:border-navy-700 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-baseline gap-1 focus:outline-none">
            <span className="text-2xl font-black uppercase tracking-tight text-navy-900 dark:text-white">
              THE NEWS
            </span>
            <span className="w-2 h-2 rounded-full bg-editorial-red inline-block" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Reader Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join a global community supporting independent investigative journalism.
          </p>
        </div>

        <div className="p-3 rounded bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-editorial-red shrink-0 mt-0.5" />
          <div>
            <strong>Phase 1 Scope:</strong> User registration backend is scheduled for Phase 2.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            leftIcon={<Lock className="w-4 h-4" />}
            helperText="Must contain a combination of letters, numbers, and symbols."
          />

          <div className="pt-1">
            <Checkbox
              label="I agree to the Terms of Service & Editorial Code"
              description="We respect your privacy and never sell reading history."
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          </div>

          <Button type="submit" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Create Account (Preview)
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-navy-750 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-navy-900 dark:text-white font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
