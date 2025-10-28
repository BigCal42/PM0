import React from 'react';
import { Section } from '../../components/Section';

const checklistCategories = [
  {
    id: 'governance',
    label: 'Governance & Alignment',
    items: [
      {
        id: 'program-governance',
        title: 'Program Governance Established',
        description: 'Steering committee, cadence, and decision logs are documented.',
      },
      {
        id: 'kpi-alignment',
        title: 'KPI Alignment',
        description: 'Executive sponsors have validated success metrics and budget guardrails.',
      },
    ],
  },
  {
    id: 'delivery-readiness',
    label: 'Delivery Readiness',
    items: [
      {
        id: 'vendor-readiness',
        title: 'Vendor Readiness',
        description: 'Vendor partner scopes, SLAs, and rate cards negotiated and stored.',
      },
      {
        id: 'training-plan',
        title: 'Training & Change Plan',
        description: 'Training cohorts, LMS assets, and comms calendar approved.',
      },
    ],
  },
];

export const ReadinessChecklist: React.FC = () => {
  return (
    <Section title="Readiness Checklist" actions={<span className="text-xs text-slate-500">Operational milestones</span>}>
      <div data-testid="readiness-list" className="space-y-4 text-sm">
        {checklistCategories.map((category) => (
          <div
            key={category.id}
            role="group"
            aria-label={category.label}
            className="space-y-3 rounded-md border border-slate-200 p-4"
          >
            <h3 className="text-sm font-semibold text-slate-900">{category.label}</h3>
            <ul className="space-y-3">
              {category.items.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-md border border-slate-200 p-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
      <ul className="space-y-3 text-sm" data-testid="readiness-list">
        {checklistItems.map((item) => (
          <li key={item.id} className="flex items-start gap-3 rounded-md border border-slate-200 p-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
              ✓
            </span>
            <div>
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
            </div>
          </li>
        ))}
      </div>
    </Section>
  );
};
