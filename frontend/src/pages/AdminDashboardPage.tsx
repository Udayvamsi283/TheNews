import React from 'react';
import { Link } from 'react-router-dom';
import {
  MOCK_ADMIN_STATS,
  MOCK_RECENT_ARTICLES,
  MOCK_ACTIVITY_LOG,
  MOCK_ARTICLES
} from '../services/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { useHealth } from '../hooks/useHealth';
import {
  FileText,
  FilePlus,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Server,
  Database,
  ExternalLink,
  Clock
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { data: health } = useHealth();
  const mostViewed = [...MOCK_ARTICLES].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Dashboard Top Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-navy-750">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Editorial CMS Console
            </h1>
            <Badge variant="primary" size="sm">Phase 1</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global newsroom status, editorial pipeline metrics, and system diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/posts/new">
            <Button size="sm" leftIcon={<FilePlus className="w-4 h-4" />}>
              Add Dispatch
            </Button>
          </Link>
          <Link to="/" target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              View Live Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_ADMIN_STATS.map((stat, idx) => (
          <Card key={idx} className="p-4 bg-white dark:bg-navy-850">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">{stat.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  stat.isPositive
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-navy-750'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
              {stat.subtext}
            </div>
          </Card>
        ))}

        {/* Live System Health Card */}
        <Card className="p-4 bg-navy-900 text-white border-navy-800">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-editorial-red" />
              API & DB Status
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{health?.database.connected ? 'Operational' : 'Connecting'}</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1 font-mono">
            <Database className="w-3 h-3 text-slate-400" />
            <span>MongoDB: {health?.database.status || 'Checking...'}</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Articles Table & Sidebar Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Articles Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-editorial-red" />
              Recent Editorial Dispatches
            </h2>
            <Link to="/admin/posts" className="text-xs font-semibold text-editorial-red hover:underline flex items-center gap-1">
              <span>View all posts</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Headline</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RECENT_ARTICLES.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-semibold text-slate-900 dark:text-white max-w-[280px] truncate">
                    {article.title}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {article.category}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                    {article.author}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.status === 'Published'
                          ? 'success'
                          : article.status === 'Draft'
                          ? 'outline'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-slate-600 dark:text-slate-300">
                    {article.views}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right Column: Most Viewed & Recent Activity (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Most Viewed Stories */}
          <div className="bg-white dark:bg-navy-850 p-5 rounded border border-slate-200 dark:border-navy-700 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-navy-750">
              <TrendingUp className="w-4 h-4 text-editorial-red" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Most Viewed (30 Days)
              </h3>
            </div>
            <div className="space-y-3">
              {mostViewed.map((story, i) => (
                <div key={story.id} className="flex items-start gap-3">
                  <span className="text-lg font-black text-slate-300 dark:text-navy-700 leading-none shrink-0 w-4">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {story.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{story.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Eye className="w-3 h-3" />
                        {story.viewCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white dark:bg-navy-850 p-5 rounded border border-slate-200 dark:border-navy-700 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-navy-750">
              <Activity className="w-4 h-4 text-editorial-red" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Editorial Audit Trail
              </h3>
            </div>
            <div className="space-y-3">
              {MOCK_ACTIVITY_LOG.map((log) => (
                <div key={log.id} className="text-xs space-y-0.5">
                  <div className="text-slate-800 dark:text-slate-200 font-medium">
                    <strong className="text-slate-900 dark:text-white">{log.user}</strong> {log.action}{' '}
                    <span className="text-editorial-red dark:text-editorial-red-dark italic">
                      "{log.target}"
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
