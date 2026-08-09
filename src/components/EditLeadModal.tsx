import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, User, Phone, Mail, BookOpen, DollarSign, Tag, Clock } from 'lucide-react';
import { Lead, LeadSource, LeadStage, StudyMode } from '../types';
import { STAGE_LIST } from '../data/stageMetadata';

interface EditLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (updatedLead: Lead) => void;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveLead,
}) => {
  if (!isOpen || !lead) return null;

  const [studentName, setStudentName] = useState(lead.studentName);
  const [phone, setPhone] = useState(lead.phone);
  const [email, setEmail] = useState(lead.email);
  const [parentPhone, setParentPhone] = useState(lead.parentPhone || '');
  const [courseInterest, setCourseInterest] = useState(lead.courseInterest);
  const [studyMode, setStudyMode] = useState<StudyMode>(lead.studyMode || 'Online');
  const [leadSource, setLeadSource] = useState<LeadSource>(lead.leadSource);
  const [stage, setStage] = useState<LeadStage>(lead.stage);
  const [assignedCounselor, setAssignedCounselor] = useState(lead.assignedCounselor);
  const [feeQuoted, setFeeQuoted] = useState<number>(lead.feeQuoted);
  const [feePaid, setFeePaid] = useState<number>(lead.feePaid);
  const [city, setCity] = useState(lead.city || '');
  const [notes, setNotes] = useState(lead.notes);
  const [isLongTermFollowUp, setIsLongTermFollowUp] = useState(lead.isLongTermFollowUp || false);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setStudentName(lead.studentName);
      setPhone(lead.phone);
      setEmail(lead.email);
      setParentPhone(lead.parentPhone || '');
      setCourseInterest(lead.courseInterest);
      setStudyMode(lead.studyMode || 'Online');
      setLeadSource(lead.leadSource);
      setStage(lead.stage);
      setAssignedCounselor(lead.assignedCounselor);
      setFeeQuoted(lead.feeQuoted);
      setFeePaid(lead.feePaid);
      setCity(lead.city || '');
      setNotes(lead.notes);
      setIsLongTermFollowUp(lead.isLongTermFollowUp || false);
    }
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Mandatory check: Name AND (Phone OR Email)
    if (!studentName.trim()) {
      setValidationError('Student Name is mandatory!');
      return;
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanPhone && !cleanEmail) {
      setValidationError('Mandatory: You MUST provide either Mobile Phone OR Email Address!');
      return;
    }

    const updated: Lead = {
      ...lead,
      studentName: studentName.trim(),
      phone: cleanPhone || 'N/A',
      email: cleanEmail || 'No Email',
      parentPhone: parentPhone.trim() || undefined,
      courseInterest: courseInterest.trim(),
      studyMode,
      leadSource,
      stage,
      assignedCounselor,
      feeQuoted: Number(feeQuoted) || 0,
      feePaid: Number(feePaid) || 0,
      city: city.trim() || undefined,
      notes: notes.trim(),
      isLongTermFollowUp,
    };

    onSaveLead(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-base text-white">Edit Lead Details ({lead.id})</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Validation Warning Banner */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 font-bold animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Student Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Student Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
            />
          </div>

          {/* Contact Details (Name + Phone or Email Mandatory) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Contact Info (At least Phone OR Email mandatory)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parent Phone (Optional)</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="Parent mobile number"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Academic & Mode of Study */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Course Interest</label>
              <input
                type="text"
                value={courseInterest}
                onChange={(e) => setCourseInterest(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mode of Study</label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value as StudyMode)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
              >
                <option value="Online">Online Mode</option>
                <option value="Offline">Offline Classroom</option>
                <option value="Hybrid">Hybrid (Offline + Online)</option>
              </select>
            </div>
          </div>

          {/* Lead Source & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lead Source Portal</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="internship.jeevisoft.com">internship.jeevisoft.com</option>
                <option value="invoice.jeevisoft.com">invoice.jeevisoft.com</option>
                <option value="Phone call lead">Phone Call Lead</option>
                <option value="Upload existing database">Upload Existing Database</option>
                <option value="Organic website">Organic Website</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Social media platform">Social Media Platform</option>
                <option value="WhatsApp message">WhatsApp Message</option>
                <option value="Agent from Deena">Agent from Deena</option>
                <option value="Blog">Blog Article</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              >
                {STAGE_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Financials & Counselor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quoted Fee (₹)</label>
              <input
                type="number"
                value={feeQuoted}
                onChange={(e) => setFeeQuoted(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Paid Fee (₹)</label>
              <input
                type="number"
                value={feePaid}
                onChange={(e) => setFeePaid(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Counselor</label>
              <select
                value={assignedCounselor}
                onChange={(e) => setAssignedCounselor(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="Anitha Ramesh">Anitha Ramesh (APK #101)</option>
                <option value="Rajesh Kumar">Rajesh Kumar (APK #102)</option>
                <option value="Priya Sharma">Priya Sharma (APK #103)</option>
                <option value="Senthil Nathan">Senthil Nathan (APK #104)</option>
              </select>
            </div>
          </div>

          {/* Long term 3-month reminder toggle */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Long Term Follow-Up (3 Months Reminder)</span>
              </span>
              <p className="text-[11px] text-amber-700">Flag this lead to trigger a 3-month follow-up alert for counselors.</p>
            </div>
            <input
              type="checkbox"
              checked={isLongTermFollowUp}
              onChange={(e) => setIsLongTermFollowUp(e.target.checked)}
              className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Counselor Notes & Remarks</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Lead Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
