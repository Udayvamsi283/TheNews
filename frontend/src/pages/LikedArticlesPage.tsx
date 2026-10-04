import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/apiClient';
import { Heart, Clock, BookOpen } from 'lucide-react';
import { ArticleImagePlaceholder } from '../components/common/ArticleImagePlaceholder';

export const LikedArticlesPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['user', 'likes', page],
    queryFn: () => apiClient.getUserLikes({ page, limit: 12 }),
    enabled: !!user
  });

  const unlikeMutation = useMutation({
    mutationFn: (postId: string) => apiClient.unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'likes'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'post'] });
    }
  });

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading liked stories...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const posts = data?.likes || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2">
          <Heart className="w-4 h-4 fill-rose-600 dark:fill-rose-400" />
          <span>Curated Favorites</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif text-gray-950 dark:text-white">
          Liked Articles
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Articles and investigative stories you have endorsed and liked.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-28 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
            No liked articles yet.
          </h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
            Click the heart icon on any article across The News to show your support and save it here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-all"
          >
            Explore Front Page
          </Link>
        </div>
      ) : (
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
                className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <ArticleImagePlaceholder category={post.category?.name} className="h-full aspect-square" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    {post.category && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        {post.category.name}
                      </span>
                    )}
                    <h2 className="text-base sm:text-lg font-bold font-serif text-gray-950 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      <Link to={`/article/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{post.author?.name || 'The News'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {publishedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/article/${post.slug}`}
                    className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 bg-primary-50 dark:bg-primary-950 dark:text-primary-300 hover:bg-primary-100 transition-colors"
                  >
                    Read Story
                  </Link>
                  <button
                    type="button"
                    onClick={() => unlikeMutation.mutate(post._id)}
                    disabled={unlikeMutation.isPending}
                    title="Remove from liked"
                    className="p-2 text-rose-600 hover:text-gray-400 dark:text-rose-400 dark:hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Unlike post"
                  >
                    <Heart className="w-4 h-4 fill-rose-600 dark:fill-rose-400" />
                  </button>
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
