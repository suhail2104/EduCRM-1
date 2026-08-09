import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  Sparkles,
  User,
  Clock,
  Send,
  Plus,
  CheckCircle,
  AlertTriangle,
  FileText,
  PhoneCall,
  Video,
  Award,
  CreditCard,
  Edit2,
  Trash2,
  Mic,
  MicOff,
  Upload,
  Link,
  Bot,
  Globe,
  Radio,
  History,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Lead, LeadStage, ActivityHistory, FollowUpCallStatus, StudyMode, AudioRecording, PaymentInstallment, AIHistoryLog } from '../types';
import { STAGE_LIST, STAGE_CONFIG } from '../data/stageMetadata';
import { AudioPlayerWidget } from './AudioPlayerWidget';
import { EditLeadModal } from './EditLeadModal';

interface LeadDetailProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
  onDeleteLead?: (leadId: string) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  onClose,
  onUpdateLead,
  onDeleteLead,
}) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<'note' | 'call' | 'payment' | 'recording' | 'ai_history'>('note');
  const [noteInput, setNoteInput] = useState('');
  const [callDuration, setCallDuration] = useState('03:45');
  const [selectedCallStatus, setSelectedCallStatus] = useState<FollowUpCallStatus>('Connected');
  const [paymentAmount, setPaymentAmount] = useState<number>(20000);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappTemplate, setWhatsappTemplate] = useState('fee');
  const [showEditModal, setShowEditModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Audio Recording State inside Person
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTitle, setRecordingTitle] = useState('Counselor Follow-up Discussion');

  // Custom Installments State
  const [newInstallmentTitle, setNewInstallmentTitle] = useState('');
  const [newInstallmentAmount, setNewInstallmentAmount] = useState<number>(15000);
  const [newInstallmentDueDate, setNewInstallmentDueDate] = useState('');

  const currentStageMeta = STAGE_CONFIG[lead.stage];
  const pendingBalance = Math.max(0, lead.feeQuoted - lead.feePaid);
  const jeevisoftPayUrl = `https://pay.jeevisoft.com/pay?leadId=${lead.id}&amount=${pendingBalance > 0 ? pendingBalance : 10000}&student=${encodeURIComponent(lead.studentName)}`;

  // Update stage handler
  const handleStageChange = (newStage: LeadStage) => {
    const updatedHistory: ActivityHistory = {
      id: `h-${Date.now()}`,
      type: 'stage_change',
      content: `Stage updated from ${lead.stage} to ${newStage}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: 'Counselor',
      meta: { fromStage: lead.stage, toStage: newStage },
    };

    onUpdateLead({
      ...lead,
      stage: newStage,
      history: [updatedHistory, ...lead.history],
    });
  };

  // Study Mode Change
  const handleStudyModeChange = (mode: StudyMode) => {
    const updatedHistory: ActivityHistory = {
      id: `h-${Date.now()}`,
      type: 'note',
      content: `Mode of Study updated to ${mode}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: 'Counselor',
    };

    onUpdateLead({
      ...lead,
      studyMode: mode,
      history: [updatedHistory, ...lead.history],
    });
  };

  // Delete History Item
  const handleDeleteHistoryItem = (historyId: string) => {
    const updatedHistory = lead.history.filter((h) => h.id !== historyId);
    onUpdateLead({
      ...lead,
      history: updatedHistory,
    });
  };

  // AI Call Back Schedule Handler (Interrelated with Follow-Up Schedule)
  const handleScheduleAICallBack = (daysFromNow: number = 2, customDateTime?: string) => {
    let targetDateStr = customDateTime;
    if (!targetDateStr) {
      const d = new Date();
      d.setDate(d.getDate() + daysFromNow);
      d.setHours(11, 0, 0, 0);
      targetDateStr = `${d.toLocaleDateString()} 11:00 AM`;
    }

    const aiHistoryEntry: AIHistoryLog = {
      id: `ai-log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      summary: `AI Call Back scheduled for ${targetDateStr}. System will auto-initiate voice agent outreach.`,
      interestLevel: lead.aiSummary.interestLevel,
      callOutcome: 'Ringing',
    };

    const newHistoryItem: ActivityHistory = {
      id: `h-${Date.now()}`,
      type: 'ai_callback',
      content: `🤖 AI Call Back Scheduled for ${targetDateStr}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: 'AI Agent System',
    };

    onUpdateLead({
      ...lead,
      aiCallBackSchedule: targetDateStr,
      scheduledFollowUp: targetDateStr, // Interrelated with follow-up
      aiCallBackEnabled: true,
      aiHistoryLogs: [aiHistoryEntry, ...(lead.aiHistoryLogs || [])],
      history: [newHistoryItem, ...lead.history],
    });
  };

  // Toggle AI Call Back
  const handleToggleAICallBack = (enabled: boolean) => {
    onUpdateLead({
      ...lead,
      aiCallBackEnabled: enabled,
    });
  };

  // Call Outcome Logging (Ringing, Not Picked, Picked, No Time, Connected, Disconnected, Again Discuss, Again Summarise)
  const handleLogCallStatus = (status: FollowUpCallStatus) => {
    setSelectedCallStatus(status);

    let summaryUpdate = lead.aiSummary.summaryText;
    if (status === 'Again Discuss' || status === 'Again Summarise') {
      summaryUpdate += ` [Updated: Re-discussed student queries. Counselors requested follow-up summary refresh.]`;
    }

    const newHistoryItem: ActivityHistory = {
      id: `h-${Date.now()}`,
      type: 'call',
      content: `Call Outcome Status: [${status}] - ${noteInput || 'Follow-up status recorded'}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: lead.assignedCounselor,
      meta: { duration: callDuration, callStatus: status },
    };

    const newAILog: AIHistoryLog = {
      id: `ai-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      summary: `Call Outcome: ${status}. ${noteInput || 'Counselor completed outreach.'}`,
      interestLevel: status === 'Connected' || status === 'Again Discuss' ? 'High' : 'Medium',
      callOutcome: status,
    };

    onUpdateLead({
      ...lead,
      lastCallStatus: status,
      history: [newHistoryItem, ...lead.history],
      aiHistoryLogs: [newAILog, ...(lead.aiHistoryLogs || [])],
      aiSummary: {
        ...lead.aiSummary,
        summaryText: summaryUpdate,
      },
    });

    setNoteInput('');
  };

  // Add new activity note or payment
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput && activeTab !== 'payment') return;

    let newHistoryItem: ActivityHistory;

    if (activeTab === 'note') {
      newHistoryItem = {
        id: `h-${Date.now()}`,
        type: 'note',
        content: noteInput,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: lead.assignedCounselor,
      };
    } else if (activeTab === 'call') {
      newHistoryItem = {
        id: `h-${Date.now()}`,
        type: 'call',
        content: `Call Logged [${selectedCallStatus}]: ${noteInput || 'Outbound call completed'}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: lead.assignedCounselor,
        meta: { duration: callDuration, callStatus: selectedCallStatus },
      };
    } else {
      newHistoryItem = {
        id: `h-${Date.now()}`,
        type: 'payment',
        content: `Payment recorded via JeeviSoft Payment: ₹${paymentAmount.toLocaleString()} INR`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: lead.assignedCounselor,
        meta: { amount: paymentAmount },
      };
    }

    const updatedLead: Lead = {
      ...lead,
      feePaid: activeTab === 'payment' ? lead.feePaid + paymentAmount : lead.feePaid,
      stage: activeTab === 'payment' && lead.feePaid + paymentAmount >= lead.feeQuoted ? 'CONVERTED' : lead.stage,
      notes: activeTab === 'note' ? `${noteInput}\n---\n${lead.notes}` : lead.notes,
      history: [newHistoryItem, ...lead.history],
    };

    onUpdateLead(updatedLead);
    setNoteInput('');
  };

  // Microphone Audio Recording inside Lead
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newRec: AudioRecording = {
          id: `rec-live-${Date.now()}`,
          title: recordingTitle || 'Live Microphone Call Recording',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          duration: '02:15',
          durationSeconds: 135,
          counselorName: lead.assignedCounselor,
          audioWaveform: [30, 50, 70, 90, 80, 60, 45, 65, 85, 95, 75, 50, 60, 80, 90, 40, 30],
          transcript: [
            { speaker: 'Counselor', text: 'Live counselor call recording logged inside CRM.', timestamp: '00:05' },
            { speaker: 'Student', text: 'Confirmed batch timing and fee structure details.', timestamp: '00:20' },
          ],
          aiObjections: ['Asked for fee installment schedule'],
          audioBlobUrl: audioUrl,
        };

        onUpdateLead({
          ...lead,
          audioRecordings: [newRec, ...lead.audioRecordings],
          history: [
            {
              id: `h-${Date.now()}`,
              type: 'call',
              content: `🎙️ New audio recording captured: ${recordingTitle}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              author: lead.assignedCounselor,
            },
            ...lead.history,
          ],
        });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      // Fallback simulation if mic permission is blocked in browser
      const newRec: AudioRecording = {
        id: `rec-sim-${Date.now()}`,
        title: `${recordingTitle} (Simulated Voice Capture)`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        duration: '01:45',
        durationSeconds: 105,
        counselorName: lead.assignedCounselor,
        audioWaveform: [25, 45, 65, 85, 95, 70, 50, 60, 80, 90, 65, 40, 30],
        transcript: [
          { speaker: 'Counselor', text: 'Hello! Calling regarding Jeevi Edu course admissions.', timestamp: '00:02' },
          { speaker: 'Student', text: 'Yes, I requested details for JeeviSoft payment installment plan.', timestamp: '00:15' },
        ],
        aiObjections: ['Requested JeeviSoft payment gateway link'],
      };

      onUpdateLead({
        ...lead,
        audioRecordings: [newRec, ...lead.audioRecordings],
        history: [
          {
            id: `h-${Date.now()}`,
            type: 'call',
            content: `🎙️ Audio recording logged: ${recordingTitle}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            author: lead.assignedCounselor,
          },
          ...lead.history,
        ],
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Custom Fee Installment Management
  const handleAddInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstallmentTitle || !newInstallmentAmount) return;

    const newInst: PaymentInstallment = {
      id: `inst-${Date.now()}`,
      title: newInstallmentTitle,
      amount: Number(newInstallmentAmount),
      dueDate: newInstallmentDueDate || 'In 15 Days',
      paid: false,
      jeevisoftPayUrl: `https://pay.jeevisoft.com/pay?leadId=${lead.id}&inst=${Date.now()}&amount=${newInstallmentAmount}`,
    };

    onUpdateLead({
      ...lead,
      customInstallments: [...(lead.customInstallments || []), newInst],
    });

    setNewInstallmentTitle('');
    setNewInstallmentAmount(15000);
    setNewInstallmentDueDate('');
  };

  const handleDeleteInstallment = (instId: string) => {
    onUpdateLead({
      ...lead,
      customInstallments: (lead.customInstallments || []).filter((i) => i.id !== instId),
    });
  };

  const handleToggleInstallmentPaid = (instId: string) => {
    const updated = (lead.customInstallments || []).map((i) => {
      if (i.id === instId) {
        return { ...i, paid: !i.paid };
      }
      return i;
    });

    onUpdateLead({
      ...lead,
      customInstallments: updated,
    });
  };

  const handleCopyPayUrl = () => {
    navigator.clipboard.writeText(jeevisoftPayUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden my-auto text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
              {lead.studentName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-lg text-white truncate">{lead.studentName}</h2>
                <span className="text-xs text-slate-400 font-mono">({lead.id})</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${currentStageMeta.badgeBg}`}>
                  {currentStageMeta.emoji} {lead.stage}
                </span>

                {/* Mode of Study Badge */}
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  📚 {lead.studyMode || 'Online'}
                </span>

                {/* Source Badge */}
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  📍 {lead.leadSource}
                </span>

                {/* Long Term 3M Badge */}
                {lead.isLongTermFollowUp && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>3 Months Reminder</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{lead.courseInterest}</span> • <span>Assigned: {lead.assignedCounselor}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Lead Details Button */}
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Person</span>
            </button>

            {/* Delete Lead Button */}
            {onDeleteLead && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete lead ${lead.studentName}?`)) {
                    onDeleteLead(lead.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-red-400 hover:text-red-200 hover:bg-red-900/50 transition cursor-pointer border border-red-800/50"
                title="Delete Lead"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main 3-Column Layout */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: Student Profile & Mode of Study & Actions (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Profile Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Student Contact</span>
                <span className="text-[10px] font-mono text-slate-400">ID: {lead.id}</span>
              </h3>

              {/* Mode of Study Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Mode of Study (Inside Person)
                </label>
                <select
                  value={lead.studyMode || 'Online'}
                  onChange={(e) => handleStudyModeChange(e.target.value as StudyMode)}
                  className="w-full px-3 py-1.5 text-xs font-bold bg-purple-50 border border-purple-200 rounded-xl text-purple-900 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="Online">Online Mode</option>
                  <option value="Offline">Offline Classroom</option>
                  <option value="Hybrid">Hybrid (Classroom + Online)</option>
                </select>
              </div>

              {/* Pipeline Stage Switcher */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Pipeline Stage
                </label>
                <select
                  value={lead.stage}
                  onChange={(e) => handleStageChange(e.target.value as LeadStage)}
                  className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-1 focus:ring-blue-500"
                >
                  {STAGE_LIST.map((st) => (
                    <option key={st} value={st}>
                      {STAGE_CONFIG[st].emoji} {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    Mobile Phone
                  </span>
                  <span className="font-mono font-bold text-slate-900">{lead.phone}</span>
                </div>

                {lead.parentPhone && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-purple-500" />
                      Parent Phone
                    </span>
                    <span className="font-mono font-medium">{lead.parentPhone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    Email
                  </span>
                  <span className="font-mono text-[11px] truncate max-w-[140px]">{lead.email}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <User className="w-3.5 h-3.5 text-emerald-500" />
                    Counselor
                  </span>
                  <span className="font-medium text-slate-900">{lead.assignedCounselor}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    Source Portal
                  </span>
                  <span className="font-bold text-indigo-700 text-[11px]">{lead.leadSource}</span>
                </div>
              </div>

              {/* Quick Outreach Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Student</span>
                  </a>

                  <button
                    onClick={() => setShowWhatsAppModal(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-2xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* JeeviSoft Payment Link Generator & Installments */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider flex items-center justify-between">
                <span>JeeviSoft Payment Mode</span>
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </h4>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>Pending Fee:</span>
                  <span className="font-mono text-sm text-emerald-700">₹{pendingBalance.toLocaleString()}</span>
                </div>

                <p className="text-[10px] text-emerald-700">Direct integration with pay.jeevisoft.com gateway</p>

                <div className="flex items-center gap-1 pt-1">
                  <button
                    onClick={handleCopyPayUrl}
                    className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copySuccess ? 'Link Copied!' : 'Copy Payment Link'}</span>
                  </button>
                  <a
                    href={jeevisoftPayUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 bg-white border border-emerald-300 rounded-lg text-emerald-700 hover:bg-emerald-100"
                    title="Open JeeviSoft Payment Gateway"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Custom Installments List & Customization */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Custom Fee Installments</span>

                {lead.customInstallments && lead.customInstallments.length > 0 ? (
                  <div className="space-y-1.5">
                    {lead.customInstallments.map((inst) => (
                      <div
                        key={inst.id}
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          inst.paid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-[11px]">{inst.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Due: {inst.dueDate} • ₹{inst.amount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleInstallmentPaid(inst.id)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              inst.paid ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {inst.paid ? 'Paid' : 'Unpaid'}
                          </button>
                          <button
                            onClick={() => handleDeleteInstallment(inst.id)}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No custom installments added.</p>
                )}

                {/* Add Installment Form */}
                <form onSubmit={handleAddInstallment} className="space-y-1.5 pt-2">
                  <input
                    type="text"
                    placeholder="Installment name (e.g. 2nd Tranche)"
                    value={newInstallmentTitle}
                    onChange={(e) => setNewInstallmentTitle(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px]"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      placeholder="Amount (₹)"
                      value={newInstallmentAmount}
                      onChange={(e) => setNewInstallmentAmount(Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-mono"
                    />
                    <button
                      type="submit"
                      className="py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Fee</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Call Outcomes, Audio Recorder, AI Summary & Timeline (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Quick Outreach Logger & Call Status Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('note')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                      activeTab === 'note' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    📝 Note
                  </button>
                  <button
                    onClick={() => setActiveTab('call')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                      activeTab === 'call' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    📞 Call Outcome
                  </button>
                  <button
                    onClick={() => setActiveTab('recording')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                      activeTab === 'recording' ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    🎙️ Record Audio
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                      activeTab === 'payment' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    💰 JeeviSoft Pay
                  </button>
                </div>
              </div>

              {/* Call Status Option Selector Buttons */}
              {activeTab === 'call' && (
                <div className="space-y-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Select Follow-Up Call Ringing / Outcome Status:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        'Ringing',
                        'Not Picked',
                        'Picked',
                        'No Time',
                        'Connected',
                        'Disconnected',
                        'Again Discuss',
                        'Again Summarise',
                      ] as FollowUpCallStatus[]
                    ).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleLogCallStatus(st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                          selectedCallStatus === st
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Microphone Audio Recorder */}
              {activeTab === 'recording' ? (
                <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-red-600 animate-pulse" />
                      <span>Record Audio Discussion inside Person</span>
                    </span>
                    {isRecording && <span className="text-xs font-mono font-bold text-red-600 animate-pulse">● RECORDING</span>}
                  </div>

                  <input
                    type="text"
                    placeholder="Recording Title (e.g., Fee Objection Call)"
                    value={recordingTitle}
                    onChange={(e) => setRecordingTitle(e.target.value)}
                    className="w-full p-2 bg-white border border-red-200 rounded-lg text-xs"
                  />

                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Microphone Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer animate-bounce"
                      >
                        <MicOff className="w-4 h-4 text-red-400" />
                        <span>Stop & Save Recording</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddActivity} className="space-y-3">
                  {activeTab === 'payment' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Amount Received (₹)
                        </label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Payment Gateway
                        </label>
                        <select className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold">
                          <option>JeeviSoft Payment Gateway</option>
                          <option>UPI / PhonePe / GPay</option>
                          <option>Net Banking / Card</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        rows={2}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Type student inquiry notes, call summary, or discussion details..."
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 text-slate-900"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Save {activeTab === 'payment' ? 'Payment' : 'Log'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* AI Summary Box & AI Call Back Control */}
            {lead.aiSummary && (
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 rounded-2xl border border-indigo-800 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                    <h3 className="font-bold text-sm text-white">AI Conversation Intelligence Summary</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Interest: {lead.aiSummary.interestLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{lead.aiSummary.summaryText}</p>

                {/* AI Call Back Scheduler Bar */}
                <div className="pt-2 border-t border-indigo-800/60 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">AI Call Back Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lead.aiCallBackEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {lead.aiCallBackEnabled ? `Enabled (${lead.aiCallBackSchedule || 'In 2 Days'})` : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleScheduleAICallBack(2)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Schedule AI Call Back (After 2 Days)</span>
                    </button>

                    <button
                      onClick={() => handleToggleAICallBack(!lead.aiCallBackEnabled)}
                      className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      {lead.aiCallBackEnabled ? 'Turn Off AI' : 'Enable AI'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Recordings List */}
            {lead.audioRecordings && lead.audioRecordings.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Call Recordings Inside Person</span>
                  <span className="text-[10px] text-slate-400 font-mono">({lead.audioRecordings.length})</span>
                </h3>

                {lead.audioRecordings.map((rec) => (
                  <AudioPlayerWidget key={rec.id} recording={rec} compact={false} />
                ))}
              </div>
            )}

            {/* Activity Timeline Feed with DELETE OPTION */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Activity Timeline Feed</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Hover to delete entries</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {lead.history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                      {item.type === 'note' && <FileText className="w-3.5 h-3.5" />}
                      {item.type === 'call' && <Phone className="w-3.5 h-3.5" />}
                      {item.type === 'stage_change' && <Award className="w-3.5 h-3.5" />}
                      {item.type === 'payment' && <DollarSign className="w-3.5 h-3.5 text-emerald-600" />}
                      {item.type === 'ai_callback' && <Bot className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                        <span className="font-bold text-slate-700">{item.author}</span>
                        <span>{item.timestamp}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{item.content}</p>
                    </div>

                    {/* Timeline Feed Delete Option */}
                    <button
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                      title="Delete Activity Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Follow-up & AI History (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Interrelated Schedule Follow-Up & AI Call Back */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>Interrelated Follow-Up Schedule</span>
              </h3>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-900">
                <p className="font-bold text-sm">{lead.scheduledFollowUp || lead.aiCallBackSchedule || 'In 2 Days (11:00 AM)'}</p>
                <p className="text-[11px] text-orange-700 mt-0.5">
                  Interrelated with AI Call Back schedule & counselor alert.
                </p>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => handleScheduleAICallBack(2)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Reschedule AI Call Back (+2 Days)</span>
                </button>
              </div>
            </div>

            {/* AI Conversation Summary History */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <History className="w-4 h-4 text-blue-600" />
                <span>AI Conversation History</span>
              </h3>

              {lead.aiHistoryLogs && lead.aiHistoryLogs.length > 0 ? (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {lead.aiHistoryLogs.map((log) => (
                    <div key={log.id} className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{log.timestamp}</span>
                        {log.callOutcome && <span className="font-bold text-blue-600">[{log.callOutcome}]</span>}
                      </div>
                      <p className="text-slate-800 font-medium">{log.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No prior AI call back history logs recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Lead Modal */}
      {showEditModal && (
        <EditLeadModal
          lead={lead}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSaveLead={(updated) => {
            onUpdateLead(updated);
            setShowEditModal(false);
          }}
        />
      )}

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-md space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Send WhatsApp Template</span>
              </h3>
              <button onClick={() => setShowWhatsAppModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block font-bold">Select WhatsApp Message Template</label>
              <select
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="fee">Fee Structure & JeeviSoft Payment Link</option>
                <option value="demo">Demo Class Registration Invite</option>
                <option value="followup">Payment Follow-up Reminder</option>
              </select>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-mono text-[11px] leading-relaxed">
                {whatsappTemplate === 'fee' && (
                  `Hi ${lead.studentName}! Fee for Jeevi Edu ${lead.courseInterest}: Total ₹${lead.feeQuoted.toLocaleString()}. Pay via JeeviSoft: ${jeevisoftPayUrl}`
                )}
                {whatsappTemplate === 'demo' && (
                  `Hi ${lead.studentName}! Your Demo seat for ${lead.courseInterest} is reserved. Meeting link: https://meet.jeevi.edu/demo-class`
                )}
                {whatsappTemplate === 'followup' && (
                  `Hi ${lead.studentName}, friendly reminder regarding pending balance of ₹${pendingBalance.toLocaleString()}. Pay now: ${jeevisoftPayUrl}`
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowWhatsAppModal(false)} className="px-3 py-1.5 text-slate-500 font-semibold">
                Cancel
              </button>
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${lead.studentName}! Fee for ${lead.courseInterest}: ₹${lead.feeQuoted.toLocaleString()}. Pay securely via JeeviSoft: ${jeevisoftPayUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
