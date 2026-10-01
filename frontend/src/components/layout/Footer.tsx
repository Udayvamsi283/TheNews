import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../../services/mockData';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t-4 border-editorial-red mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Masthead column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group focus:outline-none">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black uppercase tracking-tight text-white font-sans">
                  THE NEWS
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-editorial-red inline-block mb-1" />
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An independent, global digital news organization committed to rigorous fact-checking, investigative depth, and multilingual accountability in modern public interest journalism.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-editorial-red" />
              <span>Signatory to the International Editorial Ethics Standards</span>
            </div>
          </div>

          {/* Editorial Desks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-b border-navy-800 pb-2">
              Desks
            </h4>
            <ul className="space-y-2 text-xs">
              {MOCK_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-b border-navy-800 pb-2">
              Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="cursor-default">Masthead & Ownership</span>
              </li>
              <li>
                <span className="cursor-default">Editorial Independence Code</span>
              </li>
              <li>
                <span className="cursor-default">Corrections Policy</span>
              </li>
              <li>
                <span className="cursor-default">Whistleblower Hotline</span>
              </li>
              <li>
                <span className="cursor-default">Syndication & Licensing</span>
              </li>
            </ul>
          </div>

          {/* Phase 1 Platform Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-b border-navy-800 pb-2">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/admin" className="text-slate-300 hover:text-white flex items-center gap-1">
                  <span>Admin CMS Shell</span>
                  <ArrowUpRight className="w-3 h-3 text-editorial-red" />
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-300 hover:text-white">
                  Archive Search
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white">
                  Journalist Login
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-navy-850 text-slate-300 border border-navy-750">
                  Release: Phase 1 Foundation
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} THE NEWS DIGITAL PUBLISHING GROUP. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Multilingual Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
