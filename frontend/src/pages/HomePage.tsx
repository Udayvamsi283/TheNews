import React, { useState } from 'react';
import { MOCK_ARTICLES } from '../services/mockData';
import { FeaturedNewsCard } from '../components/common/FeaturedNewsCard';
import { NewsCard } from '../components/common/NewsCard';
import { CompactNewsCard } from '../components/common/CompactNewsCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { Tabs } from '../components/ui/Tabs';
import { TrendingUp, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [activeFeedTab, setActiveFeedTab] = useState('all');

  const leadStory = MOCK_ARTICLES[0];
  const secondaryFeatured = MOCK_ARTICLES.slice(1, 3);
  const latestNews = MOCK_ARTICLES.slice(1);
  const popularArticles = [...MOCK_ARTICLES].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  const feedTabs = [
    { id: 'all', label: 'All Dispatches' },
    { id: 'international', label: 'International' },
    { id: 'technology', label: 'Technology' },
    { id: 'business', label: 'Business' }
  ];

  const filteredFeed =
    activeFeedTab === 'all'
      ? latestNews
      : latestNews.filter((a) => a.categorySlug === activeFeedTab);

  return (
    <div className="space-y-12">
      {/* 1. TOP HERO SECTION */}
      <section aria-labelledby="featured-dispatch">
        <h2 id="featured-dispatch" className="sr-only">Top Featured Dispatch</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Hero Card (8 Cols) */}
          <div className="lg:col-span-8">
            <FeaturedNewsCard article={leadStory} />
          </div>

          {/* Secondary Hero Stack (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900 dark:border-white">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-editorial-red" />
                Featured Analysis
              </span>
            </div>
            {secondaryFeatured.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. LATEST NEWS FEED & SIDEBAR SECTION */}
      <section aria-labelledby="latest-news-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Categorized News Feed (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 dark:border-navy-700 pb-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-editorial-red inline-block" />
                <h2 id="latest-news-section" className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Continuous Wire
                </h2>
              </div>
              <Tabs
                tabs={feedTabs}
                activeTab={activeFeedTab}
                onChange={setActiveFeedTab}
                className="border-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredFeed.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* Right Column: Trending / Most Read Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Trending dispatches */}
            <div className="bg-white dark:bg-navy-850 rounded border border-slate-200 dark:border-navy-700 p-5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-navy-750 pb-3 mb-2">
                <TrendingUp className="w-4 h-4 text-editorial-red" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Most Read This Week
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-navy-750">
                {popularArticles.map((article, idx) => (
                  <CompactNewsCard
                    key={article.id}
                    article={article}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE SECTIONS */}
      <section aria-labelledby="technology-desk">
        <SectionHeader
          title="Technology & Silicon Frontiers"
          subtitle="Semiconductor sovereignty, machine learning governance, and cryptography"
          viewAllLink="/category/technology"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_ARTICLES.filter((a) => a.categorySlug === 'technology' || a.categorySlug === 'sports' || a.categorySlug === 'entertainment').slice(0, 3).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section aria-labelledby="governance-desk">
        <SectionHeader
          title="Governance & Public Accountability"
          subtitle="Legislative scrutiny, policy execution, and constitutional jurisprudence"
          viewAllLink="/category/politics"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_ARTICLES.filter((a) => a.categorySlug === 'politics' || a.categorySlug === 'national').slice(0, 2).map((article) => (
            <NewsCard key={article.id} article={article} layout="horizontal" />
          ))}
        </div>
      </section>
    </div>
  );
};
