import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { AdminRoute } from '../components/common/AdminRoute';
import { Loader2 } from 'lucide-react';

// Editorial fallback spinner for route transitions
const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-slate-400 dark:text-slate-500">
    <Loader2 className="w-8 h-8 animate-spin text-editorial-red dark:text-editorial-red-dark mb-2" />
    <span className="text-xs uppercase tracking-widest font-sans font-medium">Loading Dispatch...</span>
  </div>
);

const withSuspense = (Component: React.ComponentType<any>, props: any = {}) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

// Public Pages - Code-split
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const CategoryPage = lazy(() => import('../pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const ArticlePage = lazy(() => import('../pages/ArticlePage').then((m) => ({ default: m.ArticlePage })));
const SearchPage = lazy(() => import('../pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const LatestPage = lazy(() => import('../pages/LatestPage').then((m) => ({ default: m.LatestPage })));
const TrendingPage = lazy(() => import('../pages/TrendingPage').then((m) => ({ default: m.TrendingPage })));
const VideosPage = lazy(() => import('../pages/VideosPage').then((m) => ({ default: m.VideosPage })));
const SavedArticlesPage = lazy(() => import('../pages/SavedArticlesPage').then((m) => ({ default: m.SavedArticlesPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Admin CMS Pages - Code-split away from public reader bundle
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })));
const AdminTagsPage = lazy(() => import('../pages/admin/AdminTagsPage').then((m) => ({ default: m.AdminTagsPage })));
const AdminLanguagesPage = lazy(() => import('../pages/admin/AdminLanguagesPage').then((m) => ({ default: m.AdminLanguagesPage })));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })));
const AdminPostsPage = lazy(() => import('../pages/admin/AdminPostsPage').then((m) => ({ default: m.AdminPostsPage })));
const AdminNewPostPage = lazy(() => import('../pages/admin/AdminNewPostPage').then((m) => ({ default: m.AdminNewPostPage })));
const AdminEditPostPage = lazy(() => import('../pages/admin/AdminEditPostPage').then((m) => ({ default: m.AdminEditPostPage })));
const AdminPostPreviewPage = lazy(() => import('../pages/admin/AdminPostPreviewPage').then((m) => ({ default: m.AdminPostPreviewPage })));
const AdminMediaPage = lazy(() => import('../pages/admin/AdminMediaPage').then((m) => ({ default: m.AdminMediaPage })));
const AdminBulkUploadPage = lazy(() => import('../pages/admin/AdminBulkUploadPage').then((m) => ({ default: m.AdminBulkUploadPage })));
const AdminPlaceholderPage = lazy(() => import('../pages/AdminPlaceholderPage').then((m) => ({ default: m.AdminPlaceholderPage })));

export const router = createBrowserRouter([
  // Public Editorial Shell
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'latest', element: withSuspense(LatestPage) },
      { path: 'trending', element: withSuspense(TrendingPage) },
      { path: 'videos', element: withSuspense(VideosPage) },
      { path: 'category/:slug', element: withSuspense(CategoryPage) },
      { path: 'article/:slug', element: withSuspense(ArticlePage) },
      { path: 'preview/:id', element: withSuspense(AdminPostPreviewPage) },
      { path: 'search', element: withSuspense(SearchPage) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'register', element: withSuspense(RegisterPage) },
      { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
      {
        path: 'saved',
        element: (
          <ProtectedRoute>
            {withSuspense(SavedArticlesPage)}
          </ProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            {withSuspense(SettingsPage)}
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            {withSuspense(ProfilePage)}
          </ProtectedRoute>
        )
      },
      { path: '404', element: withSuspense(NotFoundPage) },
      { path: '*', element: withSuspense(NotFoundPage) }
    ]
  },

  // Admin CMS Shell - Strictly Guarded by AdminRoute
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: withSuspense(AdminDashboardPage) },
      {
        path: 'posts',
        element: withSuspense(AdminPostsPage)
      },
      {
        path: 'posts/new',
        element: withSuspense(AdminNewPostPage)
      },
      {
        path: 'posts/:id/edit',
        element: withSuspense(AdminEditPostPage)
      },
      {
        path: 'posts/:id/preview',
        element: withSuspense(AdminPostPreviewPage)
      },
      {
        path: 'bulk-upload',
        element: withSuspense(AdminBulkUploadPage)
      },
      {
        path: 'posts/bulk',
        element: withSuspense(AdminBulkUploadPage)
      },
      {
        path: 'media',
        element: withSuspense(AdminMediaPage)
      },
      {
        path: 'categories',
        element: withSuspense(AdminCategoriesPage)
      },
      {
        path: 'tags',
        element: withSuspense(AdminTagsPage)
      },
      {
        path: 'languages',
        element: withSuspense(AdminLanguagesPage)
      },
      {
        path: 'comments',
        element: withSuspense(AdminPlaceholderPage, { title: 'Comment Moderation', description: 'Review reader discussions and community flagged remarks.' })
      },
      {
        path: 'polls',
        element: withSuspense(AdminPlaceholderPage, { title: 'Editorial Polls', description: 'Reader sentiment polls and civic questions.' })
      },
      {
        path: 'users',
        element: withSuspense(AdminUsersPage)
      },
      {
        path: 'homepage',
        element: withSuspense(AdminPlaceholderPage, { title: 'Homepage Layout Curation', description: 'Hero lead selection and wire curation.' })
      },
      {
        path: 'homepage/featured',
        element: withSuspense(AdminPlaceholderPage, { title: 'Featured Stories Curation', description: 'Top lead stories pinned to the front page.' })
      },
      {
        path: 'homepage/breaking',
        element: withSuspense(AdminPlaceholderPage, { title: 'Breaking News Ticker', description: 'Urgent alerts published across the continuous wire.' })
      },
      {
        path: 'homepage/sections',
        element: withSuspense(AdminPlaceholderPage, { title: 'Homepage Section Ordering', description: 'Reorder editorial blocks on the index.' })
      },
      {
        path: 'analytics',
        element: withSuspense(AdminPlaceholderPage, { title: 'Audience & Reading Analytics', description: 'Pageviews, reader retention, and search performance.' })
      },
      {
        path: 'settings',
        element: <Navigate to="/admin/settings/general" replace />
      },
      {
        path: 'settings/general',
        element: withSuspense(AdminPlaceholderPage, { title: 'General CMS Settings', description: 'Site name, masthead, and default parameters.' })
      },
      {
        path: 'settings/seo',
        element: withSuspense(AdminPlaceholderPage, { title: 'Search Engine Optimization', description: 'Meta tags, schema.org JSON-LD, and sitemaps.' })
      },
      {
        path: 'settings/navigation',
        element: withSuspense(AdminPlaceholderPage, { title: 'Navigation Architecture', description: 'Configure desktop and mobile navigation hierarchies.' })
      },
      {
        path: 'settings/social',
        element: withSuspense(AdminPlaceholderPage, { title: 'Syndication & Social Links', description: 'External social profiles and RSS feeds.' })
      },
      {
        path: 'settings/account',
        element: withSuspense(AdminPlaceholderPage, { title: 'Staff Profile Settings', description: 'Your journalist profile, avatar, and credentials.' })
      },
      { path: '*', element: withSuspense(NotFoundPage) }
    ]
  }
]);
