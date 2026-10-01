import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  viewAllLink,
  className
}) => {
  return (
    <div className={cn('flex items-end justify-between border-b-2 border-slate-900 dark:border-white pb-2.5 mb-6', className)}>
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-5 bg-editorial-red inline-block shrink-0" aria-hidden="true" />
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-editorial-red dark:text-slate-400 dark:hover:text-editorial-red-dark flex items-center gap-1 transition-colors pb-0.5"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
};
