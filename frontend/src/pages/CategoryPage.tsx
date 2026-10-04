import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { Layers, Clock, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleImagePlaceholder } from '../components/common/ArticleImagePlaceholder';
import { NotFoundPage } from './NotFoundPage';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'category', slug, page],
    queryFn: () => apiClient.getCategoryPosts(slug!, { page, limit: 12 }),
    enabled: !!slug
  });

  if (isError) {
    return <NotFoundPage />;
  }

  const category = data?.category;
  const posts = data?.posts || [];
  const pagination = data?.pagination;

  const leadStory = posts[0];
  const gridStories = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Category Header */}
      <div className="border-b-4 border-primary-600 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">
          <Layers className="w-4 h-4" />
          <span>Journalistic Beat</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-gray-950 dark:text-white capitalize">
              {category?.name || slug}
            </h1>
            {category?.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
          {pagination && (
            <div className="text-xs font-mono text-gray-400">
              {pagination.total} Total Published Dispatches
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-gray-400 font-medium">
          No articles in this category yet.
        </div>
      ) : (
        <>
          {/* Lead Story for this Beat */}
          {leadStory && (
            <article className="group rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  {(leadStory.featuredImage?.url || leadStory.images?.[0]?.url) ? (
                    <img
                      src={leadStory.featuredImage?.url || leadStory.images?.[0]?.url}
                      alt={leadStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ArticleImagePlaceholder category={category?.name} className="h-full aspect-[16/10]" />
                  )}
                  {leadStory.registeredOnly && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-900/85 backdrop-blur text-amber-300">
                      <Lock className="w-3 h-3 inline mr-1" /> Exclusive
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      Top Story
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                      <Link to={`/article/${leadStory.slug}`}>{leadStory.title}</Link>
                    </h2>
                    {leadStory.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {leadStory.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex items-center justify-between">
                    <span>{leadStory.author?.name || 'The News'}</span>
                    {leadStory.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(leadStory.publishedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Additional Beat Stories */}
          {gridStories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridStories.map((post) => {
                const imgUrl = post.featuredImage?.url || post.images?.[0]?.url;
                return (
                  <article
                    key={post._id}
                    className="group flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <ArticleImagePlaceholder category={category?.name} className="h-full aspect-[16/10]" />
                        )}
                        {post.registeredOnly && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-900/80 text-amber-300">
                            <Lock className="w-2.5 h-2.5 inline mr-1" /> Exclusive
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-base sm:text-lg font-bold font-serif text-gray-950 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                          <Link to={`/article/${post.slug}`}>{post.title}</Link>
                        </h3>
                        {post.summary && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {post.summary}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-4 pt-0 text-xs text-gray-400 flex items-center justify-between border-t border-gray-50 dark:border-gray-800/40">
                      <span>{post.author?.name || 'The News'}</span>
                      {post.publishedAt && (
                        <span>{new Date(post.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && typeof pagination.pages === 'number' && pagination.pages > 1 && (
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-gray-500 font-medium">
                Page {page} of {pagination.pages}
              </span>
              <button
                type="button"
                disabled={page >= (pagination.pages || 1)}
                onClick={() => setPage((p) => Math.min(pagination.pages || 1, p + 1))}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 disabled:opacity-40 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
