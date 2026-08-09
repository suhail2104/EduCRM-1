import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Database, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { Lead, LeadSource, StudyMode, LeadStage } from '../types';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (newLeads: Lead[]) => void;
}

export const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({
  isOpen,
  onClose,
  onImportLeads,
}) => {
  if (!isOpen) return null;

  const [selectedSource, setSelectedSource] = useState<LeadSource>('Upload existing database');
  const [selectedStudyMode, setSelectedStudyMode] = useState<StudyMode>('Online');
  const [pastedData, setPastedData] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedLeads, setParsedLeads] = useState<Partial<Lead>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample CSV template trigger
  const handleLoadSample = () => {
    const sample = `Name,Mobile,Email,Course,Fee
Ananya Sharma,919876543210,ananya@gmail.com,NEET Medical Batch,125000
Vikramaditya,919842112233,,JEE Advanced Prep,140000
Kavita Nair,,kavita.nair@jeevisoft.com,Full Stack Web Dev,65000
Rajesh Kumar,919700112233,rajesh@gmail.com,Data Science & AI,85000
Deepak Verma,919655443322,deepak@gmail.com,Python Backend,45000`;
    setPastedData(sample);
    parseTextToLeads(sample);
  };

  const parseTextToLeads = (text: string) => {
    setErrorMsg(null);
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      setParsedLeads([]);
      return;
    }

    const rows = lines.slice(1);
    const results: Partial<Lead>[] = [];
    let invalidCount = 0;

    rows.forEach((line, index) => {
      if (!line.trim()) return;
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      const studentName = cols[0] || '';
      const phone = cols[1] || '';
      const email = cols[2] || '';
      const courseInterest = cols[3] || 'General Inquiry';
      const feeQuoted = parseFloat(cols[4]) || 75000;

      // Mandatory check: Name AND (Phone OR Email)
      if (!studentName || (!phone && !email)) {
        invalidCount++;
        return;
      }

      results.push({
        id: `LEAD-IMP-${Date.now()}-${index}`,
        studentName,
        phone: phone || 'N/A',
        email: email || 'No Email',
        courseInterest,
        studyMode: selectedStudyMode,
        leadSource: selectedSource,
        stage: 'NEW' as LeadStage,
        assignedCounselor: 'Anitha Ramesh',
        branch: 'Main Campus',
        feeQuoted,
        feePaid: 0,
        notes: `Imported from ${selectedSource} on ${new Date().toLocaleDateString()}`,
        history: [
          {
            id: `h-${Date.now()}-${index}`,
            type: 'note',
            content: `Batch database lead imported via ${selectedSource}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            author: 'System Import',
          },
        ],
        aiSummary: {
          interestLevel: 'Medium',
          summaryText: `Database import record from ${selectedSource}. Awaiting first counselor outreach.`,
          objections: [],
          recommendedActions: ['Perform initial qualification call', 'Send WhatsApp course brochure'],
          sentimentScore: 65,
        },
        audioRecordings: [],
        createdAt: new Date().toISOString().substring(0, 10),
      });
    });

    if (invalidCount > 0) {
      setErrorMsg(`Skipped ${invalidCount} rows because Name AND (Mobile OR Email) is mandatory.`);
    }

    setParsedLeads(results);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setPastedData(text);
        parseTextToLeads(text);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedLeads.length === 0) {
      setErrorMsg('No valid lead records to import. Please check name and mobile/email.');
      return;
    }

    const fullLeads: Lead[] = parsedLeads.map((p, idx) => ({
      id: p.id || `LEAD-IMP-${Date.now()}-${idx}`,
      studentName: p.studentName!,
      phone: p.phone!,
      email: p.email!,
      courseInterest: p.courseInterest!,
      studyMode: selectedStudyMode,
      leadSource: selectedSource,
      stage: 'NEW',
      assignedCounselor: p.assignedCounselor || 'Anitha Ramesh',
      branch: 'Main Campus',
      feeQuoted: p.feeQuoted || 75000,
      feePaid: 0,
      notes: p.notes || '',
      history: p.history || [],
      aiSummary: p.aiSummary!,
      audioRecordings: [],
      createdAt: new Date().toISOString().substring(0, 10),
    }));

    onImportLeads(fullLeads);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-bold text-base text-white">Import Existing Database / Leads</h2>
              <p className="text-[11px] text-slate-400">
                Bulk upload from internship.jeevisoft.com, invoice.jeevisoft.com, Google Ads or CSV
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Source and Study Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Lead Source Portal</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as LeadSource)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900"
              >
                <option value="internship.jeevisoft.com">internship.jeevisoft.com</option>
                <option value="invoice.jeevisoft.com">invoice.jeevisoft.com</option>
                <option value="Upload existing database">Upload existing database (CSV/Excel)</option>
                <option value="Phone call lead">Phone Call Lead</option>
                <option value="Organic website">Organic Website</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Social media platform">Social Media Platform</option>
                <option value="WhatsApp message">WhatsApp Message</option>
                <option value="Agent from Deena">Agent from Deena</option>
                <option value="Blog">Blog Article</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Mode of Study</label>
              <select
                value={selectedStudyMode}
                onChange={(e) => setSelectedStudyMode(e.target.value as StudyMode)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900"
              >
                <option value="Online">Online Mode</option>
                <option value="Offline">Offline Classroom Mode</option>
                <option value="Hybrid">Hybrid (Classroom + Online)</option>
              </select>
            </div>
          </div>

          {/* Validation Banner Notice */}
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Mandatory Fields: Lead <strong>Name</strong> AND (<strong>Mobile Number</strong> OR <strong>Email Address</strong>).</span>
            </span>
            <button
              onClick={handleLoadSample}
              className="text-blue-700 font-bold underline hover:text-blue-900 cursor-pointer"
            >
              Paste Sample CSV
            </button>
          </div>

          {/* File Drag and Drop & Paste Text */}
          <div className="space-y-2">
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/50 transition">
              <input
                type="file"
                accept=".csv,.txt,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer space-y-1 block">
                <Upload className="w-6 h-6 text-blue-600 mx-auto" />
                <p className="font-bold text-slate-800">
                  {fileName ? `File Loaded: ${fileName}` : 'Click to Upload CSV / Database File'}
                </p>
                <p className="text-[10px] text-slate-500">Supports .csv, .txt with headers: Name, Mobile, Email, Course, Fee</p>
              </label>
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase text-center">OR Paste Raw CSV Data Below</p>

            <textarea
              rows={4}
              value={pastedData}
              onChange={(e) => {
                setPastedData(e.target.value);
                parseTextToLeads(e.target.value);
              }}
              placeholder="Name, Mobile, Email, Course, Fee&#10;Suhail, 919876543210, suhail@jeevisoft.com, Full Stack Python, 75000"
              className="w-full p-3 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedLeads.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Preview ({parsedLeads.length} valid leads ready to import)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Will be inserted into Pipeline Board</span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                {parsedLeads.map((lead, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-900">{lead.studentName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        📞 {lead.phone} • ✉️ {lead.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-600 block">{lead.courseInterest}</span>
                      <span className="text-[10px] text-slate-400 font-mono">₹{lead.feeQuoted?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={parsedLeads.length === 0}
            className={`px-5 py-2 font-bold text-white rounded-lg transition flex items-center gap-2 ${
              parsedLeads.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-2xs'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <span>Batch Import {parsedLeads.length} Leads</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
