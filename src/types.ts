export type LeadStage =
  | 'NEW'
  | 'YET TO CALL'
  | 'IN PROGRESS'
  | 'CONTACTED'
  | 'DEMO'
  | 'FOLLOW UP'
  | 'PAID'
  | 'CONVERTED'
  | 'CHURN';

export interface StageMetadata {
  id: LeadStage;
  label: string;
  emoji: string;
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  progressPct: number;
}

export type LeadSource =
  | 'internship.jeevisoft.com'
  | 'invoice.jeevisoft.com'
  | 'Phone call lead'
  | 'Upload existing database'
  | 'Organic website'
  | 'Google Ads'
  | 'Social media platform'
  | 'WhatsApp message'
  | 'Agent from Deena'
  | 'Blog'
  | 'Walk-In'
  | 'Direct Call'
  | 'Website Form'
  | 'Social Ads'
  | 'Referral';

export type StudyMode = 'Online' | 'Offline' | 'Hybrid';

export type FollowUpCallStatus =
  | 'Ringing'
  | 'Not Picked'
  | 'Picked'
  | 'No Time'
  | 'Connected'
  | 'Disconnected'
  | 'Again Discuss'
  | 'Again Summarise';

export interface AISummary {
  interestLevel: 'High' | 'Medium' | 'Low';
  summaryText: string;
  objections: string[];
  recommendedActions: string[];
  sentimentScore: number; // 0 to 100
}

export interface PaymentInstallment {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  jeevisoftPayUrl?: string;
}

export interface AIHistoryLog {
  id: string;
  timestamp: string;
  summary: string;
  interestLevel: 'High' | 'Medium' | 'Low';
  callOutcome?: FollowUpCallStatus;
  objectionsRecorded?: string[];
}

export interface AudioRecording {
  id: string;
  title: string;
  date: string;
  duration: string;
  durationSeconds: number;
  counselorName: string;
  audioWaveform: number[]; // relative bar heights for visual waveform
  transcript: Array<{
    speaker: 'Counselor' | 'Student';
    text: string;
    timestamp: string;
    isObjection?: boolean;
  }>;
  aiObjections: string[];
  audioBlobUrl?: string;
}

export interface ActivityHistory {
  id: string;
  type: 'note' | 'call' | 'stage_change' | 'payment' | 'demo' | 'email' | 'whatsapp' | 'ai_callback';
  content: string;
  timestamp: string;
  author: string;
  meta?: {
    fromStage?: LeadStage;
    toStage?: LeadStage;
    amount?: number;
    duration?: string;
    callStatus?: FollowUpCallStatus;
  };
}

export interface Lead {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  parentPhone?: string;
  courseInterest: string;
  studyMode?: StudyMode;
  leadSource: LeadSource;
  stage: LeadStage;
  assignedCounselor: string;
  branch: string;
  feeQuoted: number;
  feePaid: number;
  customInstallments?: PaymentInstallment[];
  notes: string;
  aiSummary: AISummary;
  aiHistoryLogs?: AIHistoryLog[];
  audioRecordings: AudioRecording[];
  history: ActivityHistory[];
  scheduledFollowUp?: string; // ISO date string or formatted date
  aiCallBackSchedule?: string; // Scheduled AI callback date/time
  aiCallBackEnabled?: boolean; // Enable/Disable AI callback
  lastCallStatus?: FollowUpCallStatus;
  isLongTermFollowUp?: boolean; // 3 months reminder flag
  createdAt: string;
  city?: string;
  educationBg?: string;
  targetBatch?: string;
}

export interface Counselor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  branch: string;
  apkNumber?: string; // Device / APK phone binding
  callsMade: number;
  demosConducted: number;
  conversionRate: number; // percentage e.g. 28.5
  dealsClosed: number;
  revenueGenerated: number;
  activeLeadsCount: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  manager: string;
  totalLeads: number;
  activeCounselors: number;
  monthlyRevenue: number;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'student' | 'ai' | 'counselor';
  text?: string;
  imageUrl?: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface WhatsAppChat {
  id: string;
  leadId?: string;
  studentName: string;
  phone: string;
  email?: string;
  avatarLetter: string;
  avatarColor: string;
  stage: LeadStage;
  lastMessage: string;
  lastMessageTime: string;
  lastActive: string;
  statusFlag?: 'green' | 'yellow' | 'red';
  unreadCount?: number;
  messages: WhatsAppMessage[];
  role?: string;
  studyNotes?: string;
}

export interface FilterState {
  searchQuery: string;
  counselor: string;
  branch: string;
  course: string;
  source: string;
  stage?: LeadStage | 'ALL';
  dateRange: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH';
}
