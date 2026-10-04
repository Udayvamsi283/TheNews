import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { Clock, Eye, Heart, MessageSquare, Lock } from 'lucide-react';
import { ArticleImagePlaceholder } from '../common/ArticleImagePlaceholder';

interface HeroStoryProps {
  post: Post;
}

export const HeroStory: React.FC<HeroStoryProps> = ({ post }) => {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const wordCount = post.content ? post.content.split(/\s+/).length : (post.summary ? post.summary.split(/\s+/).length * 4 : 200);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const imageUrl = post.featuredImage?.url || post.images?.[0]?.url || '';

  return (
    <article className="group relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Image Section */}
        <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[460px] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.featuredImage?.alt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <ArticleImagePlaceholder category={post.category?.name} className="h-full min-h-[300px] lg:min-h-[460px]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

          {post.registeredOnly && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/80 backdrop-blur text-amber-300 border border-amber-400/30">
              <Lock className="w-3.5 h-3.5" /> Subscriber Exclusive
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {post.category && (
                <Link
                  to={`/category/${post.category.slug}`}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 hover:bg-primary-100 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} min read
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 dark:text-white font-serif leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <Link to={`/article/${post.slug}`} className="focus:outline-none">
                {post.title}
              </Link>
            </h2>

            {post.summary && (
              <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {post.summary}
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
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
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {post.author?.name || 'The News'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{publishedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              {typeof post.views === 'number' && (
                <span className="flex items-center gap-1" title={`${post.views} views`}>
                  <Eye className="w-3.5 h-3.5" /> {post.views}
                </span>
              )}
              {typeof post.likeCount === 'number' && (
                <span className="flex items-center gap-1" title={`${post.likeCount} likes`}>
                  <Heart className="w-3.5 h-3.5" /> {post.likeCount}
                </span>
              )}
              {typeof post.commentCount === 'number' && (
                <span className="flex items-center gap-1" title={`${post.commentCount} comments`}>
                  <MessageSquare className="w-3.5 h-3.5" /> {post.commentCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
