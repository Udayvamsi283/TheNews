import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Mail, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      'Password recovery emails will be integrated with Resend in a future phase.',
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
            Reset Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your verified journalist or subscriber email to receive a secure recovery link.
          </p>
        </div>

        <div className="p-3 rounded bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-editorial-red shrink-0 mt-0.5" />
          <div>
            <strong>Phase 1 Scope:</strong> Email recovery services (Resend) will be integrated in later phases.
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Workstation Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="journalist@thenews.org"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button type="submit" className="w-full" rightIcon={<Send className="w-4 h-4" />}>
              Send Recovery Link (Preview)
            </Button>
          </form>
        ) : (
          <div className="p-4 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-2">
            <div className="font-semibold text-sm">Recovery dispatch initiated</div>
            <div>
              In future phases, an encrypted recovery dispatch will be delivered to <strong>{email}</strong>.
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-navy-750 text-center text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-navy-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
