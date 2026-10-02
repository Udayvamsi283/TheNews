import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Play, Clock, Film } from 'lucide-react';

export const VideosPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['public', 'videos', page],
    queryFn: () => apiClient.getVideoPosts({ page, limit: 12 })
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
          <Film className="w-4 h-4" />
          <span>Visual Journalism</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif text-gray-950 dark:text-white">
          Video Reports & Documentaries
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          In-depth video dispatches, investigations, and field broadcasts from our journalists.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse h-64 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center text-gray-400 font-medium">
          No published video reports currently available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const imageUrl =
              post.featuredImage?.url ||
              post.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1579245486065-224c6e737da9?w=800&q=80';

            return (
              <article
                key={post._id}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
              >
                <div>
                  {/* Video Thumbnail with play icon */}
                  <Link to={`/article/${post.slug}`} className="relative block aspect-video overflow-hidden bg-black">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-primary-600 group-hover:scale-110 group-hover:bg-white transition-all flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 fill-primary-600 ml-0.5" />
                      </div>
                    </div>

                    {post.videoDetails?.duration && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-black/80 text-white">
                        {formatDuration(post.videoDetails.duration)}
                      </span>
                    )}

                    {post.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur text-white">
                        {post.category.name}
                      </span>
                    )}
                  </Link>

                  <div className="p-5">
                    <h2 className="text-lg font-bold font-serif text-gray-950 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      <Link to={`/article/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.summary && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800/60 pt-3">
                  <span>{post.author?.name || 'Video Desk'}</span>
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
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
