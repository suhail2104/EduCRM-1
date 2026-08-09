import React, { useState } from 'react';
import { Search, Phone, User, BookOpen, Trash2, Download, Upload, Plus, Clock, Bot, Globe } from 'lucide-react';
import { Lead, LeadStage } from '../types';
import { STAGE_LIST, STAGE_CONFIG } from '../data/stageMetadata';
import { MOCK_COURSES, MOCK_COUNSELORS } from '../data/mockData';

interface LeadsTableViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onDeleteLead?: (leadId: string) => void;
  onOpenImportModal?: () => void;
  onOpenNewLeadModal?: () => void;
}

export const LeadsTableView: React.FC<LeadsTableViewProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStage,
  onDeleteLead,
  onOpenImportModal,
  onOpenNewLeadModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('ALL');

  const filtered = leads.filter((l) => {
    if (query) {
      const q = query.toLowerCase();
      const match =
        l.studentName.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.courseInterest.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedStage !== 'ALL' && l.stage !== selectedStage) return false;
    if (selectedCourse !== 'ALL' && l.courseInterest !== selectedCourse) return false;
    if (selectedCounselor !== 'ALL' && l.assignedCounselor !== selectedCounselor) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Leads Table & Database</span>
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-200 font-mono font-bold">
              {filtered.length} Leads
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Filtered directory of student leads, study modes, APK counselor assignments & sources.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenImportModal && (
            <button
              onClick={onOpenImportModal}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import Existing Database</span>
            </button>
          )}

          {onOpenNewLeadModal && (
            <button
              onClick={onOpenNewLeadModal}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name, phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Lead Table Course Filter */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
        >
          <option value="ALL">All Courses (Course Filter)</option>
          {MOCK_COURSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Counselor Filter */}
        <select
          value={selectedCounselor}
          onChange={(e) => setSelectedCounselor(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
        >
          <option value="ALL">All Counselors</option>
          {MOCK_COUNSELORS.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stage Filter */}
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
        >
          <option value="ALL">All Pipeline Stages</option>
          {STAGE_LIST.map((st) => (
            <option key={st} value={st}>
              {STAGE_CONFIG[st].emoji} {st}
            </option>
          ))}
        </select>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3 rounded-l-xl">Student Lead</th>
              <th className="p-3">Course & Mode</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Source Portal</th>
              <th className="p-3">Counselor (APK #)</th>
              <th className="p-3">Pipeline Stage</th>
              <th className="p-3">Fee Quoted</th>
              <th className="p-3 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((lead) => {
              const meta = STAGE_CONFIG[lead.stage];
              const counselorObj = MOCK_COUNSELORS.find((c) => c.name === lead.assignedCounselor);
              const apkInfo = counselorObj?.apkNumber || 'APK #101';

              return (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {lead.studentName.charAt(0)}
                      </span>
                      <div>
                        <p className="text-slate-900">{lead.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{lead.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <p className="text-slate-800 font-medium">{lead.courseInterest}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      📚 {lead.studyMode || 'Online'}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-slate-600">
                    <p className="font-semibold text-slate-900">{lead.phone}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{lead.email}</p>
                  </td>

                  <td className="p-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {lead.leadSource}
                    </span>
                  </td>

                  <td className="p-3 text-slate-700">
                    <p className="font-medium">{lead.assignedCounselor}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{apkInfo}</p>
                  </td>

                  <td className="p-3">
                    <select
                      value={lead.stage}
                      onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as LeadStage)}
                      className={`text-xs px-2 py-1 rounded-lg border font-semibold ${meta.badgeBg} cursor-pointer`}
                    >
                      {STAGE_LIST.map((st) => (
                        <option key={st} value={st}>
                          {STAGE_CONFIG[st].emoji} {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 font-mono font-bold text-slate-900">₹{lead.feeQuoted.toLocaleString()}</td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        View
                      </button>

                      {onDeleteLead && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete lead ${lead.studentName}?`)) {
                              onDeleteLead(lead.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
