import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ARTICLES } from '../services/mockData';
import { formatDate, formatTimeAgo } from '../lib/utils';
import {
  Clock,
  Eye,
  Share2,
  Bookmark,
  Printer,
  MessageSquare,
  ThumbsUp,
  Tag as TagIcon,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { NewsCard } from '../components/common/NewsCard';
import { useToast } from '../components/ui/Toast';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useToast();
  const [commentText, setCommentText] = useState('');

  // Find article by slug or default to first
  const article = MOCK_ARTICLES.find((a) => a.slug === slug) || MOCK_ARTICLES[0];
  const relatedArticles = MOCK_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const handleShareClick = () => {
    showToast('Link copied to clipboard (Mock Sharing UI)', 'info');
  };

  const handleBookmarkClick = () => {
    showToast('Bookmark added (Phase 2 feature preview)', 'info');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    showToast('Comment submitted for moderation (Phase 2 feature preview)', 'success');
    setCommentText('');
  };

  return (
    <article className="max-w-4xl mx-auto space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Continuous Wire</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-navy-700" />
        <Link
          to={`/category/${article.categorySlug}`}
          className="hover:text-slate-900 dark:hover:text-white font-medium uppercase tracking-wider"
        >
          {article.category}
        </Link>
      </nav>

      {/* Editorial Header Block */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            {article.category}
          </Badge>
          {article.isBreaking && (
            <Badge variant="breaking" size="md">
              Breaking Dispatch
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-serif leading-relaxed italic border-l-2 border-editorial-red pl-4 py-1">
          {article.summary}
        </p>

        {/* Byline and Metadata row */}
        <div className="pt-4 border-y border-slate-200 dark:border-navy-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={article.author.avatar} name={article.author.name} size="lg" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                By {article.author.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {article.author.role} • {formatDate(article.publishedAt)} ({formatTimeAgo(article.publishedAt)})
              </div>
            </div>
          </div>

          {/* Action Bar (Mock sharing / bookmark / print UI) */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <button
              onClick={handleShareClick}
              aria-label="Share article"
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleBookmarkClick}
              aria-label="Bookmark article"
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              aria-label="Print article"
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <span className="h-4 w-px bg-slate-300 dark:bg-navy-700 mx-1" />
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTimeMinutes}m read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.viewCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Lead Image with Caption */}
      <figure className="space-y-2">
        <div className="aspect-[16/9] w-full rounded overflow-hidden bg-slate-100 dark:bg-navy-800">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        {article.imageCaption && (
          <figcaption className="text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:justify-between px-1 gap-1">
            <span>{article.imageCaption}</span>
            {article.imageCredit && (
              <span className="font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                Credit: {article.imageCredit}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {/* Article Body Content */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg space-y-6">
        {article.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-200 dark:border-navy-700">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('"') && paragraph.includes(' Elena Rostova')) {
            return (
              <blockquote key={index} className="border-l-4 border-editorial-red pl-5 py-2 my-6 font-serif italic text-lg sm:text-xl text-slate-700 dark:text-slate-200 bg-slate-100/70 dark:bg-navy-850 rounded-r">
                {paragraph}
              </blockquote>
            );
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </div>

      {/* Tags section */}
      <div className="pt-4 border-t border-slate-200 dark:border-navy-700 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-2">
          <TagIcon className="w-3.5 h-3.5" />
          Tags:
        </span>
        {article.tags.map((tag) => (
          <Link
            key={tag}
            to={`/search?q=${encodeURIComponent(tag)}`}
            className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Author Bio Card */}
      <div className="p-6 rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 flex items-start gap-4">
        <Avatar src={article.author.avatar} name={article.author.name} size="xl" />
        <div className="space-y-1.5">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {article.author.name}
          </div>
          <div className="text-xs text-editorial-red dark:text-editorial-red-dark font-semibold">
            {article.author.role}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {article.author.bio || 'Senior investigative correspondent for The News editorial syndicate.'}
          </p>
        </div>
      </div>

      {/* Reader Engagement / Comments Placeholder (Phase 1 UI) */}
      <section aria-labelledby="comments-heading" className="pt-8 border-t border-slate-200 dark:border-navy-700 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-editorial-red" />
            <h3 id="comments-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              Discussion & Reader Contributions (24)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Civil Moderation Policy</span>
        </div>

        {/* Mock Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3 bg-white dark:bg-navy-850 p-5 rounded border border-slate-200 dark:border-navy-700">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Join the conversation as a registered subscriber
          </div>
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your perspective on this dispatch. Keep discussion constructive and substantive..."
            className="w-full p-3 text-xs sm:text-sm rounded border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-navy-900 dark:focus:ring-slate-300"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Authentication and real-time commentary enabled in Phase 2
            </span>
            <Button size="sm" type="submit">
              Post Comment (Preview)
            </Button>
          </div>
        </form>

        {/* Mock comment sample */}
        <div className="space-y-4">
          <div className="p-4 rounded border border-slate-200 dark:border-navy-750 bg-white dark:bg-navy-850 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Prof. Marcus H. Weber</span>
              <span className="text-slate-400">1 hour ago</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The clause on third-party cryptographic auditing is the game-changer here. Without that, sovereign reporting was effectively voluntary self-certification.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
              <button onClick={() => showToast('Upvoted comment', 'info')} className="flex items-center gap-1 hover:text-editorial-red">
                <ThumbsUp className="w-3 h-3" />
                <span>18 Likes</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      <section aria-labelledby="related-dispatches" className="pt-8 border-t border-slate-200 dark:border-navy-700">
        <h3 id="related-dispatches" className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6">
          Related Dispatches & Investigation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <NewsCard key={rel.id} article={rel} />
          ))}
        </div>
      </section>
    </article>
  );
};
