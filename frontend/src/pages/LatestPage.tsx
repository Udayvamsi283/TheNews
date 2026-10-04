import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { RefreshCw, Clock, ArrowRight, Radio, Lock } from 'lucide-react';

export const LatestPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['public', 'latest', page],
    queryFn: () => apiClient.getLatestPosts({ page, limit: 15 }),
    refetchInterval: 30000 // Poll every 30s as specified in plan (no WebSockets)
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Chronological News Wire</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-gray-950 dark:text-white">
            Latest News
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Continuous coverage and reporting.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-primary-600' : ''}`} />
          <span>{isFetching ? 'Updating Wire...' : 'Refresh Wire'}</span>
        </button>
      </div>

      {/* Wire List */}
      {isLoading ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex gap-4 p-5 rounded-2xl bg-gray-100 dark:bg-gray-900">
              <div className="w-16 h-4 bg-gray-300 dark:bg-gray-800 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-300 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800/60 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-gray-400 font-medium">
          No published articles yet.
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {posts.map((post) => {
            const timeStr = post.publishedAt
              ? new Date(post.publishedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '';
            const dateStr = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric'
                })
              : '';

            return (
              <article key={post._id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-950 bg-primary-600 ring-4 ring-primary-100 dark:ring-primary-950/60 group-hover:scale-125 transition-transform" />

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400 dark:text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{timeStr}</span>
                    <span>•</span>
                    <span>{dateStr}</span>
                  </div>

                  {post.category && (
                    <Link
                      to={`/category/${post.category.slug}`}
                      className="inline-block text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {post.category.name}
                    </Link>
                  )}

                  {post.registeredOnly && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <Lock className="w-3 h-3" /> Exclusive
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold font-serif text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  <Link to={`/article/${post.slug}`}>{post.title}</Link>
                </h2>

                {post.summary && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                )}

                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-3">
                  <span>By {post.author?.name || 'The News'}</span>
                  <span>•</span>
                  <Link
                    to={`/article/${post.slug}`}
                    className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700"
                  >
                    Read full story <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && typeof pagination.pages === 'number' && pagination.pages > 1 && (
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-gray-500 font-medium">
            Page {page} of {pagination.pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pagination.pages || 1, p + 1))}
            disabled={page >= (pagination.pages || 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
