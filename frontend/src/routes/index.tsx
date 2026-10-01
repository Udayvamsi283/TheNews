import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ArticlePage } from '../pages/ArticlePage';
import { SearchPage } from '../pages/SearchPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminPlaceholderPage } from '../pages/AdminPlaceholderPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // Public Editorial Shell
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'article/:slug', element: <ArticlePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  },

  // Admin CMS Shell
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      {
        path: 'posts',
        element: <AdminPlaceholderPage title="Articles & Dispatches" description="Manage all published, draft, and scheduled reporting." />
      },
      {
        path: 'posts/new',
        element: <AdminPlaceholderPage title="Compose New Article" description="Article editor (TipTap) and publishing pipeline." />
      },
      {
        path: 'posts/bulk',
        element: <AdminPlaceholderPage title="Bulk Import / Ingestion" description="Batch upload editorial dispatches and wire syndication." />
      },
      {
        path: 'media',
        element: <AdminPlaceholderPage title="Media Asset Library" description="Cloudinary media management, photos, and infographics." />
      },
      {
        path: 'categories',
        element: <AdminPlaceholderPage title="Category Taxonomies" description="Manage desks, parent categories, and slug structures." />
      },
      {
        path: 'tags',
        element: <AdminPlaceholderPage title="Editorial Tags" description="Manage tagging metadata and indexing tags." />
      },
      {
        path: 'languages',
        element: <AdminPlaceholderPage title="Multilingual Locales" description="Configure translation workflows and language switcher." />
      },
      {
        path: 'comments',
        element: <AdminPlaceholderPage title="Comment Moderation" description="Review reader discussions and community flagged remarks." />
      },
      {
        path: 'polls',
        element: <AdminPlaceholderPage title="Editorial Polls" description="Reader sentiment polls and civic questions." />
      },
      {
        path: 'users',
        element: <AdminPlaceholderPage title="User & Journalist Accounts" description="Manage staff authors, editors, and subscribers." />
      },
      {
        path: 'homepage',
        element: <AdminPlaceholderPage title="Homepage Layout Curation" description="Hero lead selection and wire curation." />
      },
      {
        path: 'homepage/featured',
        element: <AdminPlaceholderPage title="Featured Stories Curation" description="Top lead stories pinned to the front page." />
      },
      {
        path: 'homepage/breaking',
        element: <AdminPlaceholderPage title="Breaking News Ticker" description="Urgent alerts published across the continuous wire." />
      },
      {
        path: 'homepage/sections',
        element: <AdminPlaceholderPage title="Homepage Section Ordering" description="Reorder editorial blocks on the index." />
      },
      {
        path: 'analytics',
        element: <AdminPlaceholderPage title="Audience & Reading Analytics" description="Pageviews, reader retention, and search performance." />
      },
      {
        path: 'settings',
        element: <Navigate to="/admin/settings/general" replace />
      },
      {
        path: 'settings/general',
        element: <AdminPlaceholderPage title="General CMS Settings" description="Site name, masthead, and default parameters." />
      },
      {
        path: 'settings/seo',
        element: <AdminPlaceholderPage title="Search Engine Optimization" description="Meta tags, schema.org JSON-LD, and sitemaps." />
      },
      {
        path: 'settings/navigation',
        element: <AdminPlaceholderPage title="Navigation Architecture" description="Configure desktop and mobile navigation hierarchies." />
      },
      {
        path: 'settings/social',
        element: <AdminPlaceholderPage title="Syndication & Social Links" description="External social profiles and RSS feeds." />
      },
      {
        path: 'settings/account',
        element: <AdminPlaceholderPage title="Staff Profile Settings" description="Your journalist profile, avatar, and credentials." />
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);
