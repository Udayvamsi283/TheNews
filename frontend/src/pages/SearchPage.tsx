import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { Search as SearchIcon, X, Clock, Lock, ArrowRight } from 'lucide-react';
import { ArticleImagePlaceholder } from '../components/common/ArticleImagePlaceholder';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [page, setPage] = useState(1);

  // Sync state if URL query param changes
  useEffect(() => {
    setQuery(queryParam);
    setPage(1);
  }, [queryParam]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['public', 'search', queryParam, page],
    queryFn: () => apiClient.searchPosts(queryParam, { page, limit: 12 }),
    enabled: queryParam.trim().length > 0
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
  };

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Search Box */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-950 dark:text-white">
            Archive Search
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Search our global journalism, breaking dispatches, investigations, and multimedia archive.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, headlines, topics, or names..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search query"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      {queryParam.trim().length === 0 ? (
        <div className="py-16 text-center text-gray-400 font-medium">
          Enter search terms above to explore the news archive.
        </div>
      ) : isLoading || isFetching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-28 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
            No articles found.
          </h2>
          <p className="text-xs text-gray-400">
            Try refining your keywords or checking for spelling errors.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-xs text-gray-400 font-medium">
            Found {pagination?.total || posts.length} article(s) matching &quot;{queryParam}&quot;
          </div>

          <div className="space-y-4">
            {posts.map((post) => {
              const imageUrl = post.featuredImage?.url || post.images?.[0]?.url || '';

              const publishedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : '';

              return (
                <article
                  key={post._id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <ArticleImagePlaceholder category={post.category?.name} className="h-full aspect-square" />
                      )}
                      {post.registeredOnly && (
                        <div className="absolute top-1 left-1 p-0.5 rounded bg-gray-900/80 text-amber-300">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {post.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                          {post.category.name}
                        </span>
                      )}
                      <h2 className="text-base sm:text-lg font-bold font-serif text-gray-950 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        <Link to={`/article/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.summary && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {post.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                        <span>{post.author?.name || 'The News'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {publishedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/article/${post.slug}`}
                    className="self-end sm:self-center inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && typeof pagination.pages === 'number' && pagination.pages > 1 && (
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-medium">
                Page {page} of {pagination.pages}
              </span>
              <button
                type="button"
                disabled={page >= (pagination.pages || 1)}
                onClick={() => setPage((p) => Math.min(pagination.pages || 1, p + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
