import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Building, Phone, Mail, BookOpen, User, DollarSign, FileText, AlertTriangle } from 'lucide-react';
import { Lead, LeadSource, LeadStage, StudyMode } from '../types';
import { STAGE_LIST, STAGE_CONFIG } from '../data/stageMetadata';
import { MOCK_COURSES, MOCK_COUNSELORS, MOCK_BRANCHES } from '../data/mockData';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onAddLead }) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [courseInterest, setCourseInterest] = useState(MOCK_COURSES[0]);
  const [studyMode, setStudyMode] = useState<StudyMode>('Online');
  const [leadSource, setLeadSource] = useState<LeadSource>('internship.jeevisoft.com');
  const [stage, setStage] = useState<LeadStage>('NEW');
  const [assignedCounselor, setAssignedCounselor] = useState(MOCK_COUNSELORS[0].name);
  const [feeQuoted, setFeeQuoted] = useState<number>(120000);
  const [notes, setNotes] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Mandatory check: Name AND (Phone OR Email)
    if (!studentName.trim()) {
      setErrorMsg('Student Full Name is mandatory!');
      return;
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanPhone && !cleanEmail) {
      setErrorMsg('Mandatory: Please provide either Mobile Phone OR Email Address!');
      return;
    }

    const newLead: Lead = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName.trim(),
      email: cleanEmail || 'No Email',
      phone: cleanPhone || 'N/A',
      parentPhone: parentPhone.trim(),
      courseInterest,
      studyMode,
      leadSource,
      stage,
      assignedCounselor,
      branch: 'Main Campus',
      feeQuoted: Number(feeQuoted) || 100000,
      feePaid: 0,
      notes: notes || 'New lead added via CRM system.',
      aiSummary: {
        interestLevel: 'High',
        summaryText: `Lead created for ${courseInterest} (${studyMode}). Source: ${leadSource}. Initial counselor notes captured.`,
        objections: [],
        recommendedActions: ['Initiate first call', 'Share curriculum PDF on WhatsApp'],
        sentimentScore: 85,
      },
      audioRecordings: [],
      history: [
        {
          id: `h-${Date.now()}`,
          type: 'note',
          content: `Lead added to Jeevi Edu CRM database from source: ${leadSource}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: 'System',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      city,
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Add New Lead</h3>
              <p className="text-xs text-slate-400">Capture new student inquiry for Jeevi Edu CRM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Varma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Phone (Mobile OR Email mandatory)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Parent Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="rohan@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent / Guardian Contact
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="+91 98765 11223"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Course & Mode of Study */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Interest
              </label>
              <select
                value={courseInterest}
                onChange={(e) => setCourseInterest(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
              >
                {MOCK_COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mode of Study
              </label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value as StudyMode)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
              >
                <option value="Online">Online Mode</option>
                <option value="Offline">Offline Classroom</option>
                <option value="Hybrid">Hybrid (Classroom + Online)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Lead Source Portal & Initial Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Source Portal
              </label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
              >
                <option value="internship.jeevisoft.com">internship.jeevisoft.com</option>
                <option value="invoice.jeevisoft.com">invoice.jeevisoft.com</option>
                <option value="Phone call lead">Phone call lead</option>
                <option value="Upload existing database">Upload existing database</option>
                <option value="Organic website">Organic website</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Social media platform">Social media platform</option>
                <option value="WhatsApp message">WhatsApp message</option>
                <option value="Agent from Deena">Agent from Deena</option>
                <option value="Blog">Blog</option>
                <option value="Walk-In">Walk-In</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
              >
                {STAGE_LIST.map((st) => (
                  <option key={st} value={st}>
                    {STAGE_CONFIG[st].emoji} {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Fee & Assigned Counselor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fee Quoted (₹)
              </label>
              <input
                type="number"
                value={feeQuoted}
                onChange={(e) => setFeeQuoted(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Counselor
              </label>
              <select
                value={assignedCounselor}
                onChange={(e) => setAssignedCounselor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              >
                {MOCK_COUNSELORS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.role} - {c.apkNumber || 'APK #101'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Counselor Notes
            </label>
            <textarea
              rows={3}
              placeholder="Key requirements, budget preference, preferred batch timing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Create Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

