import React, { useState } from 'react';
import {
  Search,
  Phone,
  User,
  BookOpen,
  Sparkles,
  FileText,
  Volume2,
  Calendar,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bot,
  Edit2,
} from 'lucide-react';
import { Lead, LeadStage, LeadSource, FilterState } from '../types';
import { STAGE_LIST, STAGE_CONFIG } from '../data/stageMetadata';
import { MOCK_COURSES, MOCK_COUNSELORS } from '../data/mockData';
import { AudioPlayerWidget } from './AudioPlayerWidget';

interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onOpenNewLeadModal: () => void;
  onDeleteLead?: (leadId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onLeadClick,
  onUpdateLeadStage,
  onOpenNewLeadModal,
  onDeleteLead,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    counselor: 'ALL',
    branch: 'ALL',
    course: 'ALL',
    source: 'ALL',
    dateRange: 'ALL',
  });

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpandCard = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCards((prev) => ({ ...prev, [leadId]: !prev[leadId] }));
  };

  // Move Lead Stage Left/Right for quick rearrange
  const handleMoveStage = (lead: Lead, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = STAGE_LIST.indexOf(lead.stage);
    if (direction === 'prev' && currentIndex > 0) {
      onUpdateLeadStage(lead.id, STAGE_LIST[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < STAGE_LIST.length - 1) {
      onUpdateLeadStage(lead.id, STAGE_LIST[currentIndex + 1]);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        lead.studentName.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.courseInterest.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.counselor !== 'ALL' && lead.assignedCounselor !== filters.counselor) return false;
    if (filters.course !== 'ALL' && lead.courseInterest !== filters.course) return false;
    if (filters.source !== 'ALL' && lead.leadSource !== filters.source) return false;
    return true;
  });

  const getSourceBadgeColor = (source: LeadSource) => {
    switch (source) {
      case 'Walk-In':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Direct Call':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Website Form':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Social Ads':
      case 'Social media platform':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Referral':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'internship.jeevisoft.com':
      case 'invoice.jeevisoft.com':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'WhatsApp message':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Leads Pipeline Board</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-200 font-mono font-bold">
                {filteredLeads.length} Total Leads
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage student pipeline stages, scheduled follow-ups, and AI callbacks across all sources.
            </p>
          </div>

          <button
            onClick={onOpenNewLeadModal}
            className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student name, phone, course..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* Counselor Filter */}
          <select
            value={filters.counselor}
            onChange={(e) => setFilters({ ...filters, counselor: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
          >
            <option value="ALL">All Counselors</option>
            {MOCK_COUNSELORS.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} {c.apkNumber ? `(${c.apkNumber.split(' ')[2] || ''})` : ''}
              </option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
          >
            <option value="ALL">All Courses Filter</option>
            {MOCK_COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Lead Source Filter */}
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
          >
            <option value="ALL">All Lead Sources</option>
            <option value="internship.jeevisoft.com">internship.jeevisoft.com</option>
            <option value="invoice.jeevisoft.com">invoice.jeevisoft.com</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Social media platform">Social Media Platform</option>
            <option value="WhatsApp message">WhatsApp Message</option>
            <option value="Agent from Deena">Agent from Deena</option>
            <option value="Blog">Blog</option>
            <option value="Walk-In">Walk-In</option>
            <option value="Direct Call">Direct Call</option>
          </select>
        </div>
      </div>

      {/* 9-Stage Horizontally Scrollable Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 min-h-[calc(100vh-250px)] snap-x">
        {STAGE_LIST.map((stageId) => {
          const meta = STAGE_CONFIG[stageId];
          const stageLeads = filteredLeads.filter((l) => l.stage === stageId);
          const totalFeeVal = stageLeads.reduce((acc, curr) => acc + curr.feeQuoted, 0);

          return (
            <div
              key={stageId}
              className="w-80 shrink-0 flex flex-col bg-slate-100/80 rounded-2xl border border-slate-200 shadow-2xs max-h-[82vh] overflow-hidden snap-start"
            >
              {/* Column Header */}
              <div className="p-3 bg-white border-b border-slate-200 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-base">{meta.emoji}</span>
                  <h3 className="font-bold text-xs uppercase tracking-wide text-slate-800">
                    {meta.label}
                  </h3>
                  <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full border ${meta.badgeBg}`}>
                    {stageLeads.length}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  ₹{(totalFeeVal / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Progress indicator bar */}
              <div className="h-1 bg-slate-200 w-full">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${meta.progressPct}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>

              {/* Lead Cards List */}
              <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
                {stageLeads.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
                    No leads in {meta.label}
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const isExpanded = expandedCards[lead.id];
                    const hasAudio = lead.audioRecordings && lead.audioRecordings.length > 0;

                    return (
                      <div
                        key={lead.id}
                        onClick={() => onLeadClick(lead)}
                        className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group hover:border-blue-400 relative"
                      >
                        {/* Student Name & Source Tag */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {lead.studentName}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <BookOpen className="w-3 h-3 text-blue-500 shrink-0" />
                              <span className="font-medium truncate max-w-[150px]">{lead.courseInterest}</span>
                            </p>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getSourceBadgeColor(lead.leadSource)} shrink-0 max-w-[100px] truncate`}>
                            {lead.leadSource}
                          </span>
                        </div>

                        {/* Follow-up Schedule Banner (First data's follow up on pipeline card) */}
                        <div className="my-2 p-1.5 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between text-[10px] text-orange-900 font-medium">
                          <span className="flex items-center gap-1 font-bold">
                            <Clock className="w-3 h-3 text-orange-600" />
                            <span>Follow Up:</span>
                          </span>
                          <span className="font-mono text-orange-800">{lead.scheduledFollowUp || 'In 2 Days (11:00 AM)'}</span>
                        </div>

                        {/* Phone, Mode & Counselor */}
                        <div className="flex items-center justify-between text-xs text-slate-600 py-1 border-t border-slate-100 my-1.5 flex-wrap gap-1">
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {lead.phone}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {lead.studyMode || 'Online'}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                            <User className="w-3 h-3 text-blue-500" />
                            {lead.assignedCounselor.split(' ')[0]}
                          </span>
                        </div>

                        {/* Quick Accordion Preview */}
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <button
                            onClick={(e) => toggleExpandCard(lead.id, e)}
                            className="text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>{isExpanded ? 'Hide Notes' : 'Preview Notes & AI'}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            {lead.aiCallBackEnabled && (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 py-0.2 rounded">
                                <Bot className="w-2.5 h-2.5 text-emerald-600" />
                                <span>AI Call</span>
                              </span>
                            )}
                            {hasAudio && (
                              <span className="flex items-center gap-1 text-amber-700 font-medium text-[10px] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                <Volume2 className="w-3 h-3 text-amber-600" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Accordion Content */}
                        {isExpanded && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-2 text-xs" onClick={(e) => e.stopPropagation()}>
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                              <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                                Counselor Notes
                              </p>
                              <p className="text-[11px] italic leading-snug">{lead.notes}</p>
                            </div>

                            {lead.aiSummary && (
                              <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-200 text-slate-800">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-bold text-[10px] text-amber-800 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-600" />
                                    AI Summary
                                  </span>
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200/70 text-amber-900">
                                    {lead.aiSummary.interestLevel}
                                  </span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-amber-950">{lead.aiSummary.summaryText}</p>
                              </div>
                            )}

                            {hasAudio && (
                              <div className="pt-1">
                                <AudioPlayerWidget recording={lead.audioRecordings[0]} compact={true} />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Rearrange Pipeline Option & Delete Option */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-[10px]">Move:</span>
                            <button
                              onClick={(e) => handleMoveStage(lead, 'prev', e)}
                              className="p-1 hover:bg-slate-100 rounded border border-slate-200 text-slate-600"
                              title="Move to Previous Stage"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleMoveStage(lead, 'next', e)}
                              className="p-1 hover:bg-slate-100 rounded border border-slate-200 text-slate-600"
                              title="Move to Next Stage"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete Lead Button */}
                          {onDeleteLead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete lead ${lead.studentName}?`)) {
                                  onDeleteLead(lead.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
