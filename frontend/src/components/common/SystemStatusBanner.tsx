import React, { useState } from 'react';
import { useHealth } from '../../hooks/useHealth';
import { env } from '../../config/env';
import { Activity, Database, Server, RefreshCw } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const SystemStatusBanner: React.FC = () => {
  const { data: health, isLoading, refetch, isFetching } = useHealth();
  const [showModal, setShowModal] = useState(false);

  const isHealthy = health?.success && health.database.connected;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        aria-label="System status indicator"
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer select-none bg-slate-100 hover:bg-slate-200 dark:bg-navy-850 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-navy-700"
      >
        <span className="relative flex h-2 w-2">
          {isHealthy && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isLoading
                ? 'bg-amber-400'
                : isHealthy
                ? 'bg-emerald-500'
                : 'bg-editorial-red'
            }`}
          />
        </span>
        <span className="hidden sm:inline font-sans text-xs">
          {isLoading
            ? 'Connecting...'
            : isHealthy
            ? 'API: Online (DB Connected)'
            : 'API: Disconnected'}
        </span>
        <span className="sm:hidden font-sans text-xs font-semibold">
          {isHealthy ? 'LIVE' : 'ERR'}
        </span>
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Phase 1 System Health Diagnostic"
        description="End-to-end verification: Frontend ➔ Express API ➔ MongoDB"
      >
        <div className="space-y-4 text-xs font-mono">
          <div className="p-3 rounded bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-sans">
                <Server className="w-3.5 h-3.5 text-navy-800 dark:text-slate-300" />
                Backend API:
              </span>
              <span className={health?.success ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-editorial-red'}>
                {health?.success ? 'ONLINE (200 OK)' : 'OFFLINE'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-sans">
                <Database className="w-3.5 h-3.5 text-navy-800 dark:text-slate-300" />
                MongoDB Status:
              </span>
              <span className={health?.database.connected ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-editorial-red'}>
                {health?.database.status.toUpperCase() || 'DISCONNECTED'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-sans">
                <Activity className="w-3.5 h-3.5 text-navy-800 dark:text-slate-300" />
                Environment:
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {health?.environment || 'unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Target Database:</span>
              <span className="text-slate-800 dark:text-slate-200">
                {health?.database.name || 'the_news'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">API Endpoint:</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={env.API_BASE_URL}>
                {env.API_BASE_URL}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Last Checked:</span>
              <span className="text-slate-700 dark:text-slate-400">
                {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-400 text-[11px] font-sans">
              Auto-polls every 30 seconds
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              isLoading={isFetching}
              leftIcon={<RefreshCw className="w-3 h-3" />}
            >
              Refresh Status
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
