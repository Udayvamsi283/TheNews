import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ShieldCheck, Layers, Plus } from 'lucide-react';

interface AdminPlaceholderProps {
  title?: string;
  description?: string;
  phase?: string;
}

export const AdminPlaceholderPage: React.FC<AdminPlaceholderProps> = ({
  title,
  description,
  phase = 'Phase 2'
}) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const derivedTitle = title || pathParts[pathParts.length - 1]?.replace(/-/g, ' ').toUpperCase() || 'SECTION';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-750">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              {derivedTitle}
            </h1>
            <Badge variant="outline" size="sm">
              {phase} Shell
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {description || `Administrative module foundation for ${derivedTitle.toLowerCase()} management.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin">
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Overview
            </Button>
          </Link>
          <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />} disabled>
            Action (Preview)
          </Button>
        </div>
      </div>

      {/* Scope Card */}
      <Card className="bg-white dark:bg-navy-850">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-bold text-editorial-red dark:text-editorial-red-dark uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Architecture Specification</span>
          </div>
          <CardTitle className="text-base sm:text-lg">Module Placeholder & Schema Reservation</CardTitle>
          <CardDescription>
            This section represents the dedicated administrative shell for {derivedTitle.toLowerCase()}.
            Full database models, validation controllers, and CRUD endpoints will be connected in {phase}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded border border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-900/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Phase 1 Acceptance: UI Shell & Route Registration Complete</span>
            </div>
            <p>
              In accordance with project guidelines, all business logic, MongoDB collections, and API mutating controllers remain strictly isolated until their designated development phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
