import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_CATEGORIES, MOCK_ARTICLES } from '../services/mockData';
import { NewsCard } from '../components/common/NewsCard';
import { FeaturedNewsCard } from '../components/common/FeaturedNewsCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { NotFoundPage } from './NotFoundPage';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return <NotFoundPage />;
  }

  // Filter articles or fallback to all mock articles for demonstration
  const categoryArticles = MOCK_ARTICLES.filter((a) => a.categorySlug === slug);
  const displayArticles = categoryArticles.length > 0 ? categoryArticles : MOCK_ARTICLES;

  const leadArticle = displayArticles[0];
  const gridArticles = displayArticles.slice(1);

  return (
    <div className="space-y-10">
      {/* Category Header */}
      <div className="border-b-4 border-slate-900 dark:border-white pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-editorial-red dark:text-editorial-red-dark mb-1">
          <Layers className="w-4 h-4" />
          <span>Editorial Desk</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
            {category.articleCount} Total Dispatches
          </div>
        </div>
      </div>

      {/* Featured Lead Story for this Category */}
      {leadArticle && (
        <section aria-labelledby="category-lead">
          <h2 id="category-lead" className="sr-only">Desk Lead Story</h2>
          <FeaturedNewsCard article={leadArticle} />
        </section>
      )}

      {/* Category Articles Grid */}
      <section aria-labelledby="desk-feed">
        <SectionHeader title={`Latest in ${category.name}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
          {/* Duplicate some for demonstrating grid flow if small list */}
          {gridArticles.length < 3 &&
            MOCK_ARTICLES.slice(0, 3).map((article) => (
              <NewsCard key={`dup-${article.id}`} article={article} />
            ))}
        </div>
      </section>

      {/* Pagination UI Foundation */}
      <nav aria-label="Pagination Navigation" className="pt-8 border-t border-slate-200 dark:border-navy-700 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                currentPage === page
                  ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-950 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-slate-400">...</span>
          <button
            onClick={() => setCurrentPage(12)}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400"
          >
            12
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => p + 1)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </nav>
    </div>
  );
};
