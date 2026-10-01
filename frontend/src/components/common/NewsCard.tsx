import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { Article } from '../../types';
import { formatTimeAgo, cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';

export interface NewsCardProps {
  article: Article;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  layout = 'vertical',
  className
}) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <article
      className={cn(
        'group flex flex-col justify-between bg-white dark:bg-navy-850 rounded border border-slate-200 dark:border-navy-700 overflow-hidden hover:border-slate-300 dark:hover:border-navy-600 transition-all duration-200 hover:shadow-sm',
        isHorizontal && 'sm:flex-row',
        className
      )}
    >
      <div className={cn('relative overflow-hidden bg-slate-100 dark:bg-navy-800', isHorizontal ? 'sm:w-2/5 shrink-0' : 'w-full')}>
        <Link to={`/article/${article.slug}`} className="block aspect-[16/10] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
        <div className="absolute top-2.5 left-2.5">
          <Badge variant="primary" size="sm" className="shadow-sm">
            {article.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            <span>{article.author.name}</span>
            <span>•</span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>

          <h3 className="font-bold text-base sm:text-lg leading-snug tracking-tight text-slate-900 dark:text-white group-hover:text-editorial-red dark:group-hover:text-editorial-red-dark transition-colors line-clamp-2">
            <Link to={`/article/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-750 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTimeMinutes} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {article.viewCount.toLocaleString()} views
          </span>
        </div>
      </div>
    </article>
  );
};
