import React from 'react';
import { NavLink } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../../services/mockData';
import { cn } from '../../lib/utils';

export interface NavbarProps {
  className?: string;
  onItemClick?: () => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Navbar: React.FC<NavbarProps> = ({
  className,
  onItemClick,
  orientation = 'horizontal'
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <nav
      aria-label="Main Navigation"
      className={cn(
        isHorizontal
          ? 'overflow-x-auto no-scrollbar flex items-center justify-start md:justify-center py-2.5 px-4 max-w-7xl mx-auto'
          : 'flex flex-col space-y-1',
        className
      )}
    >
      <div className={cn(isHorizontal ? 'flex items-center space-x-1 sm:space-x-2' : 'flex flex-col space-y-1')}>
        <NavLink
          to="/"
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              'text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors whitespace-nowrap',
              isActive
                ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-950'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-navy-800'
            )
          }
        >
          Home
        </NavLink>

        {MOCK_CATEGORIES.map((category) => (
          <NavLink
            key={category.id}
            to={`/category/${category.slug}`}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-950'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-navy-800'
              )
            }
          >
            {category.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
