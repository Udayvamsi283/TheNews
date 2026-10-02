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
import { ProfilePage } from '../pages/ProfilePage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminTagsPage } from '../pages/admin/AdminTagsPage';
import { AdminLanguagesPage } from '../pages/admin/AdminLanguagesPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminPostsPage } from '../pages/admin/AdminPostsPage';
import { AdminNewPostPage } from '../pages/admin/AdminNewPostPage';
import { AdminEditPostPage } from '../pages/admin/AdminEditPostPage';
import { AdminPostPreviewPage } from '../pages/admin/AdminPostPreviewPage';
import { AdminMediaPage } from '../pages/admin/AdminMediaPage';
import { AdminBulkUploadPage } from '../pages/admin/AdminBulkUploadPage';
import { AdminPlaceholderPage } from '../pages/AdminPlaceholderPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { AdminRoute } from '../components/common/AdminRoute';

export const router = createBrowserRouter([
  // Public Editorial Shell
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'article/:slug', element: <ArticlePage /> },
      { path: 'preview/:id', element: <AdminPostPreviewPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> }
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
      { index: true, element: <AdminDashboardPage /> },
      {
        path: 'posts',
        element: <AdminPostsPage />
      },
      {
        path: 'posts/new',
        element: <AdminNewPostPage />
      },
      {
        path: 'posts/:id/edit',
        element: <AdminEditPostPage />
      },
      {
        path: 'posts/:id/preview',
        element: <AdminPostPreviewPage />
      },
      {
        path: 'bulk-upload',
        element: <AdminBulkUploadPage />
      },
      {
        path: 'posts/bulk',
        element: <AdminBulkUploadPage />
      },
      {
        path: 'media',
        element: <AdminMediaPage />
      },
      {
        path: 'categories',
        element: <AdminCategoriesPage />
      },
      {
        path: 'tags',
        element: <AdminTagsPage />
      },
      {
        path: 'languages',
        element: <AdminLanguagesPage />
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
        element: <AdminUsersPage />
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
