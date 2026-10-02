import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Flame, Eye, Heart, MessageSquare, Clock } from 'lucide-react';

export const TrendingPage: React.FC = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public', 'trending'],
    queryFn: () => apiClient.getTrendingPosts({ limit: 12 }),
    staleTime: 60000
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
          <Flame className="w-4 h-4" />
          <span>Past 7 Days Highlights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif text-gray-950 dark:text-white">
          Trending Stories
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          The most engaged and widely discussed journalism published over the last week.
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
          No trending stories found in the past 7 days.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => {
            const rank = index + 1;
            const imageUrl =
              post.featuredImage?.url ||
              post.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80';

            const publishedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })
              : '';

            return (
              <article
                key={post._id}
                className="group flex flex-col sm:flex-row items-center gap-6 p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary-400/50 hover:shadow-lg transition-all"
              >
                {/* Large Rank Number */}
                <div className="flex-shrink-0 text-3xl sm:text-5xl font-black font-serif text-gray-300 dark:text-gray-700 group-hover:text-amber-500 transition-colors w-12 text-center">
                  #{rank}
                </div>

                {/* Thumbnail */}
                <div className="w-full sm:w-48 h-36 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {post.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur text-white">
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 w-full space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-gray-950 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                    <Link to={`/article/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {post.summary && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {post.author?.name || 'Editorial Desk'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {publishedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {typeof post.views === 'number' && (
                        <span className="flex items-center gap-1 font-medium">
                          <Eye className="w-3.5 h-3.5 text-blue-500" /> {post.views.toLocaleString()}
                        </span>
                      )}
                      {typeof post.likeCount === 'number' && (
                        <span className="flex items-center gap-1 font-medium">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {post.likeCount.toLocaleString()}
                        </span>
                      )}
                      {typeof post.commentCount === 'number' && (
                        <span className="flex items-center gap-1 font-medium">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> {post.commentCount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
