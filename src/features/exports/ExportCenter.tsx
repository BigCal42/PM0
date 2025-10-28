import React, { useEffect, useRef, useState } from 'react';
import { Section } from '../../components/Section';
import { useProjectStore } from '../../store/useProjectStore';

const triggerDownload = (filename: string, content: BlobPart, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const ExportCenter: React.FC = () => {
  const { roles, resources, heatmap, scenarios } = useProjectStore((state) => ({
    roles: state.roles,
    resources: state.resources,
    heatmap: state.heatmap,
    scenarios: state.scenarios,
  }));
  const heatmapRef = useRef<HTMLDivElement | null>(null);
  const statusTimeoutRef = useRef<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        window.clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  const notifyDownloadStarted = () => {
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
    }
    setStatusMessage('Download started');
    statusTimeoutRef.current = window.setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleExportCsv = () => {
    const headers = ['Type', 'Identifier', 'Details'];
    const rows = [
      ...roles.map((role) => ['Role', role.id, `${role.name} (${role.monthlyCapacity} hrs)`]),
      ...resources.map((resource) => ['Resource', resource.id, `${resource.name} (${resource.availability} FTE)`]),
      ...heatmap.map((cell) => ['Heatmap', cell.id, `${cell.month}:${cell.gap}`]),
      ...scenarios.map((scenario) => ['Scenario', scenario.id, `${scenario.name}:${scenario.results.totalCost}`]),
    ];
    const csv = [headers.join(','), ...rows.map((row) => row.map((col) => `"${String(col).replace(/"/g, '""')}"`).join(','))].join('\n');
    triggerDownload('pm0-data-export.csv', csv, 'text/csv');
    notifyDownloadStarted();
  };

  const handleExportPdf = () => {
    const summary = scenarios
      .map((scenario) => `${scenario.name}\nCost: ${scenario.results.totalCost}\nRisk: ${scenario.results.riskScore}`)
      .join('\n\n');
    const pdfContent = `PM0 Scenario Summary\n\n${summary}`;
    triggerDownload('pm0-scenarios.pdf', pdfContent, 'application/pdf');
    notifyDownloadStarted();
  };

  const handleExportPng = () => {
    const heatmapText = heatmap
      .map((cell) => `${cell.roleId} ${cell.month} gap=${Math.round(cell.gap * 100)}%`)
      .join('\n');
    const pngContent = `PM0 Heatmap Snapshot\n${heatmapText}`;
    triggerDownload('pm0-heatmap.png', pngContent, 'image/png');
    notifyDownloadStarted();
  };

  return (
    <Section title="Export Center" actions={<span className="text-xs text-slate-500">CSV • PDF • PNG</span>}>
      <div ref={heatmapRef} className="space-y-3 text-sm text-slate-600">
        <p>Download structured outputs for executive reporting and offline planning reviews.</p>
        {statusMessage && (
          <div
            role="status"
            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
          >
            {statusMessage}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={handleExportCsv}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={handleExportPdf}
          >
            Export PDF
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={handleExportPng}
          >
            Export Heatmap PNG
          </button>
        </div>
      </div>
    </Section>
  );
};
