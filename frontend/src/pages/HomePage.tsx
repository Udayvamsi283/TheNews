import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { BreakingNewsBar } from '../components/public/BreakingNewsBar';
import { HeroStory } from '../components/public/HeroStory';
import { CategorySection } from '../components/public/CategorySection';
import { ArticleImagePlaceholder } from '../components/common/ArticleImagePlaceholder';
import { Flame, Clock, Radio, ArrowRight, Lock, Newspaper } from 'lucide-react';
import { updateSeoMetadata } from '../utils/seo';

export const HomePage: React.FC = () => {
  const [feedFilter, setFeedFilter] = useState<'for-you' | 'all'>('for-you');

  // Dynamic SEO metadata
  useEffect(() => {
    updateSeoMetadata({
      title: 'The News — Multilingual Digital Journalism',
      description: 'Authoritative, independent, and multilingual digital journalism covering global affairs, national developments, technology, and business.',
      url: window.location.origin
    });
  }, []);

  // Fetch Homepage Curation from backend
  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ['public', 'home'],
    queryFn: () => apiClient.getHomepageData()
  });

  // Fetch Continuous wire feed
  const { data: feedData } = useQuery({
    queryKey: ['public', 'feed', feedFilter],
    queryFn: () => apiClient.getFeed({ limit: 8 })
  });

  // Fetch Trending stories (7-day window)
  const { data: trendingPosts = [] } = useQuery({
    queryKey: ['public', 'trending'],
    queryFn: () => apiClient.getTrendingPosts({ limit: 5 })
  });

  if (homeLoading && !homeData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const heroStory = homeData?.heroStory;
  const breakingNews = homeData?.breakingNews || [];
  const featuredArticles = homeData?.featuredArticles || [];
  const categorySections = homeData?.categorySections || [];
  const feedPosts = feedData?.posts || [];

  const hasContent = Boolean(heroStory) || featuredArticles.length > 0 || feedPosts.length > 0;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Breaking News Alert Bar (Visible ONLY if real breaking posts exist) */}
      {breakingNews.length > 0 && <BreakingNewsBar breakingPosts={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {!hasContent ? (
          /* Empty state when 0 posts exist in database */
          <div className="py-24 text-center max-w-lg mx-auto space-y-3">
            <Newspaper className="w-12 h-12 text-slate-300 dark:text-navy-700 mx-auto" />
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              No stories have been published yet.
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Articles and breaking alerts will appear here as soon as they are published by the editorial team.
            </p>
          </div>
        ) : (
          <>
            {/* 2. Lead Hero Story */}
            {heroStory && (
              <section aria-label="Lead Story">
                <HeroStory post={heroStory} />
              </section>
            )}

            {/* 3. Secondary Featured Grid & Trending Sidebar */}
            {(featuredArticles.length > 0 || trendingPosts.length > 0) && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Column: Featured Articles */}
                <div className="lg:col-span-8 space-y-6">
                  {featuredArticles.length > 0 && (
                    <>
                      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                        <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white">
                          Featured Stories
                        </h3>
                        <Link
                          to="/latest"
                          className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                        >
                          <span>Latest News</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {featuredArticles.map((post) => {
                          const imageUrl = post.featuredImage?.url || post.images?.[0]?.url || '';

                          return (
                            <article
                              key={post._id}
                              className="group flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-all"
                            >
                              <div>
                                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={post.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <ArticleImagePlaceholder category={post.category?.name} className="h-full aspect-[16/10]" />
                                  )}
                                  {post.registeredOnly && (
                                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-900/80 backdrop-blur text-amber-300">
                                      <Lock className="w-3 h-3" /> Exclusive
                                    </div>
                                  )}
                                  {post.category && (
                                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur text-white">
                                      {post.category.name}
                                    </span>
                                  )}
                                </div>

                                <div className="p-4 sm:p-5">
                                  <h4 className="text-base sm:text-lg font-bold font-serif text-gray-900 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                    <Link to={`/article/${post.slug}`}>{post.title}</Link>
                                  </h4>

                                  {post.summary && (
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                      {post.summary}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="px-5 pb-4 pt-0 text-xs text-gray-400 flex items-center justify-between border-t border-gray-50 dark:border-gray-800/40">
                                <span>{post.author?.name || 'The News'}</span>
                                {post.publishedAt && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(post.publishedAt).toLocaleDateString([], {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Sidebar Column: Top Trending */}
                {trendingPosts.length > 0 && (
                  <div className="lg:col-span-4 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        <Flame className="w-4 h-4" />
                        <span>Trending This Week</span>
                      </div>
                      <Link
                        to="/trending"
                        className="text-xs font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Top 10 →
                      </Link>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {trendingPosts.map((post, idx) => (
                        <div key={post._id} className="py-3 flex items-baseline gap-3 group">
                          <span className="text-xl font-bold font-serif text-gray-300 dark:text-gray-700 group-hover:text-amber-500 transition-colors w-6 flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                              <Link to={`/article/${post.slug}`}>{post.title}</Link>
                            </h5>
                            {post.category && (
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                                {post.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 4. Category-Curated Sections */}
            {categorySections.map((sec) => (
              <CategorySection key={sec.category._id} category={sec.category} posts={sec.posts} />
            ))}

            {/* 5. Continuous Stream & Personalized Feed */}
            {feedPosts.length > 0 && (
              <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Radio className="w-5 h-5 text-primary-600" />
                    <h3 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                      Latest News
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setFeedFilter('for-you')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        feedFilter === 'for-you'
                          ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      For You
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        feedFilter === 'all'
                          ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Chronological
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {feedPosts.map((post) => (
                    <article
                      key={post._id}
                      className="group p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div className="space-y-2">
                        {post.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                            {post.category.name}
                          </span>
                        )}
                        <h4 className="text-sm font-bold font-serif text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          <Link to={`/article/${post.slug}`}>{post.title}</Link>
                        </h4>
                        {post.summary && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {post.summary}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
                        <span>{post.author?.name || 'The News'}</span>
                        {post.publishedAt && (
                          <span>{new Date(post.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
