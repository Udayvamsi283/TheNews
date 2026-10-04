import React, { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import {
  Share2,
  ChevronRight,
  ArrowLeft,
  Lock,
  Globe,
  Tag as TagIcon,
  HelpCircle
} from 'lucide-react';
import { LikeButton } from '../components/public/engagement/LikeButton';
import { BookmarkButton } from '../components/public/engagement/BookmarkButton';
import { CommentSection } from '../components/public/engagement/CommentSection';
import { GalleryRenderer } from '../components/public/format-renderers/GalleryRenderer';
import { SortedListRenderer } from '../components/public/format-renderers/SortedListRenderer';
import { TocRenderer } from '../components/public/format-renderers/TocRenderer';
import { VideoRenderer } from '../components/public/format-renderers/VideoRenderer';
import { AudioRenderer } from '../components/public/format-renderers/AudioRenderer';
import { PollRenderer } from '../components/public/format-renderers/PollRenderer';
import { EventRenderer } from '../components/public/format-renderers/EventRenderer';
import { updateSeoMetadata } from '../utils/seo';
import { useToast } from '../components/ui/Toast';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = searchParams.get('lang') || undefined;
  const { showToast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'post', slug, lang],
    queryFn: () => apiClient.getPostBySlug(slug!, lang),
    enabled: !!slug
  });

  const post = data?.post;
  const isGated = data?.isGated ?? false;

  // Record view on mount & update dynamic SEO metadata
  useEffect(() => {
    if (post?._id) {
      apiClient.recordView(post._id);
      updateSeoMetadata({
        title: post.title,
        description: post.summary || post.seo?.metaDescription || '',
        image: post.featuredImage?.url || post.images?.[0]?.url || '',
        type: 'article'
      });
    }
  }, [post?._id, post?.title, post?.summary]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-3">
          Dispatch Not Found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The requested article could not be located or may have been unpublished.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Front Page</span>
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary || '',
          url: window.location.href
        });
      } catch {
        // Ignored if user dismissed share dialog
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'info');
    }
  };

  const handleLanguageChange = (newLangCode: string) => {
    if (!newLangCode || newLangCode === 'en') {
      searchParams.delete('lang');
      setSearchParams(searchParams);
    } else {
      searchParams.set('lang', newLangCode);
      setSearchParams(searchParams);
    }
  };

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const imageUrl =
    post.featuredImage?.url ||
    post.images?.[0]?.url ||
    (post.postFormat === 'gallery' && post.galleryItems?.[0]?.image) ||
    '';

  // Check if article has alternate translations
  const availableTranslations = post.translations || [];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Breadcrumbs & Language Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          {post.category && (
            <Link
              to={`/category/${post.category.slug}`}
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline uppercase tracking-wider"
            >
              {post.category.name}
            </Link>
          )}
        </nav>

        {/* Translation Switcher */}
        {availableTranslations.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Language:</span>
            <button
              type="button"
              onClick={() => handleLanguageChange('')}
              className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                !lang || lang === 'en'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              EN
            </button>
            {availableTranslations.map((tr) => (
              <button
                key={tr.slug || tr.languageCode}
                type="button"
                onClick={() => handleLanguageChange(tr.languageCode)}
                className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                  lang === tr.languageCode
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tr.languageCode}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
              {post.category.name}
            </span>
          )}
          {post.postFormat && post.postFormat !== 'article' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
              {post.postFormat.replace('_', ' ')}
            </span>
          )}
          {post.registeredOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              <Lock className="w-3 h-3" /> Exclusive
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-gray-950 dark:text-white leading-[1.15]">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-serif leading-relaxed italic border-l-4 border-primary-600 pl-4 py-1">
            {post.summary}
          </p>
        )}

        {/* Byline & Engagement Row */}
        <div className="pt-4 border-y border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-950"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 font-bold flex items-center justify-center text-sm">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'N'}
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                By {post.author?.name || 'The News'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {publishedDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LikeButton
              postId={post._id}
              initialLikeCount={post.likeCount || 0}
              initialIsLiked={post.isLiked || false}
            />
            <BookmarkButton
              postId={post._id}
              initialIsBookmarked={post.isBookmarked || false}
            />
            <button
              type="button"
              onClick={handleShare}
              title="Share article"
              className="p-2 rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Featured Image (when present and not audio/video embed) */}
      {imageUrl && post.postFormat !== 'video' && (
        <figure className="space-y-2">
          <div className="rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[16/9] shadow-md">
            <img
              src={imageUrl}
              alt={post.featuredImage?.alt || post.title}
              className="w-full h-full object-cover"
            />
          </div>
          {post.featuredImage?.caption && (
            <figcaption className="text-xs text-gray-500 dark:text-gray-400 px-2">
              {post.featuredImage.caption}
            </figcaption>
          )}
        </figure>
      )}

      {/* 4. Format-Specific Content & Server-Side Registered Gating */}
      <section className="article-body">
        {isGated ? (
          /* Clean Editorial Registered-Only Gating Card */
          <div className="my-8 border-t-2 border-b-2 border-editorial-red bg-slate-50 dark:bg-navy-850 p-6 md:p-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-editorial-red dark:text-editorial-red-dark font-sans font-bold text-xs uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" />
                <span>Reader Account Required</span>
              </div>

              <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                Continue reading this story with free reader access
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                This report is reserved for registered readers of The News. Create a free account or sign in to access full reporting, participate in discussions, and save stories.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded font-sans text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 dark:bg-white dark:text-navy-900 dark:hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded font-sans text-xs font-semibold text-editorial-red dark:text-editorial-red-dark border border-editorial-red dark:border-editorial-red-dark hover:bg-editorial-red/10 transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Ungated Full Content Renderers */
          <div className="space-y-8">
            {/* Format: Gallery */}
            {post.postFormat === 'gallery' && (
              <GalleryRenderer items={post.galleryItems || []} title={post.title} />
            )}

            {/* Format: Sorted List */}
            {post.postFormat === 'sorted_list' && (
              <SortedListRenderer items={post.sortedListItems || []} />
            )}

            {/* Format: Video */}
            {post.postFormat === 'video' && (
              <VideoRenderer details={post.videoDetails} title={post.title} />
            )}

            {/* Format: Audio */}
            {post.postFormat === 'audio' && (
              <AudioRenderer details={post.audioDetails} title={post.title} />
            )}

            {/* Format: Poll */}
            {post.postFormat === 'poll' && (
              <PollRenderer postId={post._id} pollDetails={post.pollDetails} />
            )}

            {/* Format: Event */}
            {post.postFormat === 'event' && (
              <EventRenderer eventDetails={post.eventDetails} />
            )}

            {/* Format: Table of Contents */}
            {post.postFormat === 'table_of_contents' && (
              <TocRenderer content={post.content || ''} />
            )}

            {/* Default Article Content / Additional Prose */}
            {post.content && post.postFormat !== 'table_of_contents' && (
              <div
                className="prose dark:prose-invert max-w-none prose-lg font-serif text-gray-800 dark:text-gray-200 leading-relaxed pt-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>
        )}
      </section>

      {/* 5. FAQ Section (when provided) */}
      {post.faq && post.faq.length > 0 && !isGated && (
        <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-6 text-xl font-bold font-serif text-gray-900 dark:text-white">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-4">
            {post.faq.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 open:bg-gray-50 dark:open:bg-gray-900/80 transition-colors"
              >
                <summary className="font-bold text-base text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                  <span>{item.question}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 6. Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <TagIcon className="w-4 h-4 text-gray-400" />
          {post.tags.map((tag: any) => (
            <span
              key={tag._id || tag}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              #{tag.name || tag}
            </span>
          ))}
        </div>
      )}

      {/* 7. Reader Comments Section */}
      <CommentSection postId={post._id} initialCommentCount={post.commentCount || 0} />
    </article>
  );
};
