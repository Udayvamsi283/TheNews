import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { formatTimeAgo, cn } from '../../lib/utils';

export interface CompactNewsCardProps {
  article: Article;
  rank?: number;
  className?: string;
}

export const CompactNewsCard: React.FC<CompactNewsCardProps> = ({ article, rank, className }) => {
  return (
    <article className={cn('flex items-start gap-3.5 group py-3 border-b border-slate-100 dark:border-navy-750 last:border-none', className)}>
      {typeof rank === 'number' && (
        <span className="text-2xl font-black text-slate-300 dark:text-navy-700 leading-none shrink-0 w-6 tabular-nums">
          0{rank}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] text-editorial-red dark:text-editorial-red-dark font-bold uppercase tracking-wider mb-1">
          <span>{article.category}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-slate-400 dark:text-slate-400 font-normal">{formatTimeAgo(article.publishedAt)}</span>
        </div>

        <h4 className="font-semibold text-xs sm:text-sm leading-snug text-slate-800 dark:text-slate-100 group-hover:text-editorial-red dark:group-hover:text-editorial-red-dark transition-colors line-clamp-2">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h4>
      </div>

      <Link
        to={`/article/${article.slug}`}
        className="shrink-0 w-16 h-16 rounded overflow-hidden bg-slate-100 dark:bg-navy-800"
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
    </article>
  );
};
