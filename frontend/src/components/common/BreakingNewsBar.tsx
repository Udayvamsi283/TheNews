import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { MOCK_BREAKING_NEWS } from '../../services/mockData';

export const BreakingNewsBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = MOCK_BREAKING_NEWS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="bg-navy-950 text-white border-b border-navy-800 py-1.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-editorial-red text-white font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-sm shrink-0">
            <Zap className="w-3 h-3 fill-current" />
            Breaking
          </span>
          <Link
            to="/article/multilateral-diplomatic-breakthrough-climate-accord"
            className="truncate hover:text-slate-200 transition-colors font-medium text-slate-100"
          >
            {items[currentIndex]}
          </Link>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          <button
            onClick={prevItem}
            aria-label="Previous breaking headline"
            className="p-1 hover:text-white hover:bg-navy-800 rounded transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] tabular-nums font-mono px-1">
            {currentIndex + 1}/{items.length}
          </span>
          <button
            onClick={nextItem}
            aria-label="Next breaking headline"
            className="p-1 hover:text-white hover:bg-navy-800 rounded transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
