import React from 'react';
import {
  Users,
  PhoneCall,
  Video,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Award,
  Volume2,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  BookOpen,
  Calendar,
  Building
} from 'lucide-react';
import { Lead, Counselor } from '../types';
import { STAGE_LIST, STAGE_CONFIG } from '../data/stageMetadata';
import { MOCK_COUNSELORS } from '../data/mockData';
import { AudioPlayerWidget } from './AudioPlayerWidget';

interface DashboardProps {
  leads: Lead[];
  counselors: Counselor[];
  onSelectLead: (lead: Lead) => void;
  onNavigateTab: (tab: 'pipeline' | 'list' | 'call-logs') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  leads,
  counselors,
  onSelectLead,
  onNavigateTab,
}) => {
  // KPI Calculations
  const totalLeads = leads.length;
  const callsMadeToday = 482; // Aggregate across system today
  const demosScheduled = leads.filter((l) => l.stage === 'DEMO').length;
  const convertedLeads = leads.filter((l) => l.stage === 'CONVERTED' || l.stage === 'PAID').length;
  const conversionRatePct = ((convertedLeads / (totalLeads || 1)) * 100).toFixed(1);
  const totalRevenueGenerated = leads.reduce((acc, curr) => acc + curr.feePaid, 0);

  // Stage distribution funnel counts
  const stageCounts = STAGE_LIST.map((stageId) => ({
    stageId,
    meta: STAGE_CONFIG[stageId],
    count: leads.filter((l) => l.stage === stageId).length,
  }));

  // Lead Source Distribution
  const sources = ['Website Form', 'Direct Call', 'Walk-In', 'Social Ads', 'Referral'] as const;
  const sourceStats = sources.map((src) => {
    const count = leads.filter((l) => l.leadSource === src).length;
    const pct = ((count / (totalLeads || 1)) * 100).toFixed(0);
    return { name: src, count, pct };
  });

  // Recent Audio Calls
  const leadsWithRecordings = leads.filter((l) => l.audioRecordings && l.audioRecordings.length > 0);

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Executive Admissions Dashboard</span>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md border border-blue-200">
              Jeevi Edu Analytics
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time pipeline overview, conversion rates, counselor metrics & AI call sentiment
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('pipeline')}
          className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Pipeline Board</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Top KPI Cards (5 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Leads */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Leads</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{totalLeads}</p>
          <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +14% vs last week
          </p>
        </div>

        {/* KPI 2: Calls Made Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Calls Made Today</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{callsMadeToday}</p>
          <p className="text-[10px] text-purple-600 font-semibold">
            Avg 4.2 mins per call
          </p>
        </div>

        {/* KPI 3: Demos Scheduled */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Demos Scheduled</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{demosScheduled}</p>
          <p className="text-[10px] text-blue-600 font-semibold">
            78% Demo attendance rate
          </p>
        </div>

        {/* KPI 4: Conversion Rate % */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{conversionRatePct}%</p>
          <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +3.2% higher than Q2
          </p>
        </div>

        {/* KPI 5: Revenue Generated */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Revenue Generated</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono">
            ₹{(totalRevenueGenerated / 100000).toFixed(2)} Lakhs
          </p>
          <p className="text-[10px] text-amber-600 font-semibold">
            Collected Token & Fees
          </p>
        </div>
      </div>

      {/* 2. Visual Pipeline Funnel (9 Stages Breakdown) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Visual Pipeline Funnel Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500">Live count and percentage drop-off across all 9 stages</p>
          </div>
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            View Stage Kanban
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2">
          {stageCounts.map(({ stageId, meta, count }) => {
            const pct = Math.round((count / (totalLeads || 1)) * 100);
            return (
              <div
                key={stageId}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1.5 flex flex-col justify-between"
              >
                <div className="text-xl">{meta.emoji}</div>
                <div className="font-bold text-[10px] text-slate-600 uppercase tracking-tight truncate">
                  {meta.label}
                </div>
                <div className="font-bold text-lg text-slate-900 font-mono">{count}</div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.max(10, pct)}%`, backgroundColor: meta.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Lead Source Distribution & Counselor Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Lead Source Distribution (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-500" />
            <span>Lead Source Distribution</span>
          </h3>

          <div className="space-y-3">
            {sourceStats.map((src) => (
              <div key={src.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>{src.name}</span>
                  <span className="font-mono text-slate-500">
                    {src.count} leads ({src.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${src.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counselor Performance Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Counselor Performance Leaderboard</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Aug 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Counselor</th>
                  <th className="p-2.5">Branch</th>
                  <th className="p-2.5">Calls</th>
                  <th className="p-2.5">Demos</th>
                  <th className="p-2.5">Conv. Rate</th>
                  <th className="p-2.5">Deals</th>
                  <th className="p-2.5 rounded-r-lg">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {counselors.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-2.5 font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                      <span>{c.name}</span>
                    </td>
                    <td className="p-2.5 text-slate-500">{c.branch}</td>
                    <td className="p-2.5 font-mono">{c.callsMade}</td>
                    <td className="p-2.5 font-mono">{c.demosConducted}</td>
                    <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {c.conversionRate}%
                    </td>
                    <td className="p-2.5 font-mono font-semibold">{c.dealsClosed}</td>
                    <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{(c.revenueGenerated / 100000).toFixed(1)}L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Recent Call Logs List with Audio Player & Instant AI Summary */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              <span>Recent Audio Call Recordings & Instant AI Summaries</span>
            </h3>
            <p className="text-xs text-slate-500">
              Listen to actual counselor calls and view automatically highlighted objections
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('call-logs')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            All Call Recordings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leadsWithRecordings.slice(0, 2).map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{lead.studentName}</h4>
                  <p className="text-xs text-slate-500">{lead.courseInterest}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {lead.stage}
                </span>
              </div>

              {lead.audioRecordings.length > 0 && (
                <AudioPlayerWidget recording={lead.audioRecordings[0]} compact={true} />
              )}

              {lead.aiSummary && (
                <div className="p-2.5 bg-indigo-950/40 text-indigo-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-[10px] text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Summary
                  </span>
                  <p className="text-[11px] leading-tight text-slate-300">{lead.aiSummary.summaryText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
