import React from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { cn } from '../../lib/utils';
import { Flame, Radio, Film } from 'lucide-react';

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

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
    staleTime: 5 * 60 * 1000
  });

  const activeCategories = categories.filter((c) => c.status === 'active');

  const baseNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5',
      isActive
        ? 'bg-primary-600 text-white shadow-sm'
        : 'text-gray-700 hover:text-gray-950 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
    );

  return (
    <nav
      aria-label="Main Navigation"
      className={cn(
        isHorizontal
          ? 'overflow-x-auto no-scrollbar flex items-center justify-start md:justify-center py-2 px-4 max-w-7xl mx-auto'
          : 'flex flex-col space-y-1',
        className
      )}
    >
      <div className={cn(isHorizontal ? 'flex items-center space-x-1 sm:space-x-1.5' : 'flex flex-col space-y-1')}>
        <NavLink to="/" onClick={onItemClick} end className={baseNavLinkClass}>
          Front Page
        </NavLink>

        <NavLink to="/latest" onClick={onItemClick} className={baseNavLinkClass}>
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          <span>Latest Wire</span>
        </NavLink>

        <NavLink to="/trending" onClick={onItemClick} className={baseNavLinkClass}>
          <Flame className="w-3 h-3 text-amber-500" />
          <span>Trending</span>
        </NavLink>

        <NavLink to="/videos" onClick={onItemClick} className={baseNavLinkClass}>
          <Film className="w-3 h-3 text-blue-500" />
          <span>Videos</span>
        </NavLink>

        {activeCategories.slice(0, 6).map((category) => (
          <NavLink
            key={category._id}
            to={`/category/${category.slug}`}
            onClick={onItemClick}
            className={baseNavLinkClass}
          >
            {category.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
