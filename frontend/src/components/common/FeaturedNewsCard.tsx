import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Sparkles } from 'lucide-react';
import { Article } from '../../types';
import { formatTimeAgo, cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

export interface FeaturedNewsCardProps {
  article: Article;
  className?: string;
}

export const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({ article, className }) => {
  return (
    <article
      className={cn(
        'group bg-white dark:bg-navy-850 rounded border border-slate-200 dark:border-navy-700 overflow-hidden hover:border-slate-300 dark:hover:border-navy-600 transition-all duration-300 shadow-sm',
        className
      )}
    >
      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-slate-100 dark:bg-navy-900">
        <Link to={`/article/${article.slug}`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none md:hidden" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="primary" size="md" className="shadow">
            {article.category}
          </Badge>
          {article.isBreaking && (
            <Badge variant="breaking" size="md">
              Breaking
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 md:p-8">
        <div className="flex items-center gap-2 text-xs text-editorial-red dark:text-editorial-red-dark font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Editor's Top Dispatch</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] group-hover:text-editorial-red dark:group-hover:text-editorial-red-dark transition-colors">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {article.summary}
        </p>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-navy-750 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={article.author.avatar} name={article.author.name} size="md" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {article.author.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {article.author.role} • {formatTimeAgo(article.publishedAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {article.viewCount.toLocaleString()} views
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
