import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_ARTICLES, MOCK_CATEGORIES } from '../services/mockData';
import { NewsCard } from '../components/common/NewsCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Search as SearchIcon, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Filter mock articles based on query & category
  const filteredResults = MOCK_ARTICLES.filter((article) => {
    const matchesQuery =
      !query.trim() ||
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.summary.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || article.categorySlug === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Search Bar Form */}
      <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded border border-slate-200 dark:border-navy-700 shadow-sm space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Editorial Archive Search
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search our complete digital archives, investigative dossiers, and public dispatches.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, author, topic, or sovereign region..."
              leftIcon={<SearchIcon className="w-4 h-4" />}
              rightIcon={
                query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSearchParams({});
                    }}
                    className="hover:text-slate-700 dark:hover:text-slate-200"
                    aria-label="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : undefined
              }
            />
          </div>
          <Button type="submit" size="md">
            Search
          </Button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-navy-750 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-950 font-bold'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Desks
            </button>
            {MOCK_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-950 font-bold'
                    : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{filteredResults.length}</strong> matching dispatches
            {query && (
              <>
                {' '}
                for <span className="italic font-serif text-slate-800 dark:text-slate-200">"{query}"</span>
              </>
            )}
          </div>
          <div className="font-mono text-[11px]">Phase 1 Search Prototype</div>
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching dispatches found"
            description="We couldn't locate any stories matching your exact keywords. Try broader terminology, checking desk categories, or inspecting spelling."
            actionLabel="Reset Search Filter"
            onAction={() => {
              setQuery('');
              setSelectedCategory('all');
              setSearchParams({});
            }}
          />
        )}
      </div>

      {/* Pagination UI Foundation */}
      {filteredResults.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-navy-700 flex items-center justify-between">
          <Button variant="outline" size="sm" disabled leftIcon={<ChevronLeft className="w-4 h-4" />}>
            Previous
          </Button>
          <span className="text-xs text-slate-500 font-mono">Page 1 of 1</span>
          <Button variant="outline" size="sm" disabled rightIcon={<ChevronRight className="w-4 h-4" />}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
