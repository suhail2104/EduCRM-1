import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  CheckSquare,
  Plus,
  Trash2,
  MoreVertical,
  Paperclip,
  Zap,
  Mic,
  Send,
  Sparkles,
  Bot,
  Save,
  Phone,
  Mail,
  Share2,
  Clock,
  Flag,
  User,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Lead, LeadStage, WhatsAppChat, WhatsAppMessage } from '../types';

interface WhatsAppViewProps {
  leads: Lead[];
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onUpdateLead?: (lead: Lead) => void;
  onSelectLead?: (lead: Lead) => void;
}

// Initial Mock WhatsApp Chats matching the exact user screenshot
const INITIAL_WHATSAPP_CHATS: WhatsAppChat[] = [
  {
    id: 'wa-1',
    leadId: 'LEAD-1010',
    studentName: 'rainyha01',
    phone: '919345305261',
    email: 'No email',
    avatarLetter: 'R',
    avatarColor: 'bg-purple-600',
    stage: 'YET TO CALL',
    lastMessage: 'Hi rainyha01, this is a reminder ...',
    lastMessageTime: '07/08/2026',
    lastActive: '7/8/2026, 11:31:01 am',
    statusFlag: 'yellow',
    role: 'Unknown',
    studyNotes: '',
    messages: [
      {
        id: 'm1',
        sender: 'student',
        text: 'Hi Sir Greetings from Rainy Home Appliances',
        timestamp: '06:06 pm',
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'Hi rainyha01! 👋 Welcome to Jeevi Academy. Are you looking for a specific course or training?',
        timestamp: '06:06 pm',
        status: 'read',
      },
      {
        id: 'm3',
        sender: 'student',
        imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
        text: 'Special Offer Branded 32 Inches Smart TV / Course Inquiry Flyer',
        timestamp: '06:06 pm',
      },
      {
        id: 'm4',
        sender: 'ai',
        text: 'Could you please clarify your question? I am an AI assistant for Jeevi Academy. If you need specific help, our human expert will contact you soon!',
        timestamp: '06:06 pm',
        status: 'read',
      },
    ],
  },
  {
    id: 'wa-2',
    leadId: 'LEAD-1011',
    studentName: 'sudharsan',
    phone: '919842100987',
    email: 'sudharsan@gmail.com',
    avatarLetter: 'S',
    avatarColor: 'bg-emerald-600',
    stage: 'IN PROGRESS',
    lastMessage: '👉 Bye!',
    lastMessageTime: 'Yesterday',
    lastActive: 'Yesterday, 04:12 pm',
    statusFlag: 'green',
    role: 'Student',
    studyNotes: 'Interested in Java Full Stack. Requested syllabus PDF.',
    messages: [
      { id: 'm1', sender: 'student', text: 'Hi, can I get details for MERN stack batch?', timestamp: '03:45 pm' },
      { id: 'm2', sender: 'ai', text: 'Hello Sudharsan! Welcome to Jeevi Academy. Our MERN batch starts this Monday. Would you like to attend a free demo?', timestamp: '03:46 pm' },
      { id: 'm3', sender: 'student', text: 'Yes, please book my demo seat.', timestamp: '04:10 pm' },
      { id: 'm4', sender: 'counselor', text: 'Demo confirmed for Saturday 11 AM! Bye!', timestamp: '04:12 pm' },
    ],
  },
  {
    id: 'wa-3',
    leadId: 'LEAD-1012',
    studentName: 'Seshanthan',
    phone: '919712398450',
    email: 'seshanthan@gmail.com',
    avatarLetter: 'S',
    avatarColor: 'bg-blue-600',
    stage: 'DEMO',
    lastMessage: "You're welcome, Seshanthan!",
    lastMessageTime: 'Yesterday',
    lastActive: 'Yesterday, 02:30 pm',
    statusFlag: 'yellow',
    role: 'Working Professional',
    studyNotes: 'Looking for weekend online class.',
    messages: [
      { id: 'm1', sender: 'student', text: 'Thanks for sharing the fee structure!', timestamp: '02:25 pm' },
      { id: 'm2', sender: 'counselor', text: "You're welcome, Seshanthan! Let us know if you need installment options.", timestamp: '02:30 pm' },
    ],
  },
  {
    id: 'wa-4',
    leadId: 'LEAD-1013',
    studentName: 'Seshanthan S R',
    phone: '919876543201',
    email: 'seshanthan.sr@gmail.com',
    avatarLetter: 'S',
    avatarColor: 'bg-indigo-600',
    stage: 'NEW',
    lastMessage: 'Welcome to Jeevi Academy, Se...',
    lastMessageTime: 'Yesterday',
    lastActive: 'Yesterday, 11:15 am',
    statusFlag: 'green',
    role: 'Student',
    messages: [
      { id: 'm1', sender: 'ai', text: 'Welcome to Jeevi Academy, Seshanthan S R! How can we assist your learning today?', timestamp: '11:15 am' },
    ],
  },
  {
    id: 'wa-5',
    leadId: 'LEAD-1014',
    studentName: 'Sivaneshkumar Tha...',
    phone: '919500011223',
    email: 'sivaneshkumar@gmail.com',
    avatarLetter: 'S',
    avatarColor: 'bg-teal-600',
    stage: 'YET TO CALL',
    lastMessage: 'Welcome to Jeevi Academy, Si...',
    lastMessageTime: 'Yesterday',
    lastActive: 'Yesterday, 10:05 am',
    statusFlag: 'yellow',
    role: 'Unknown',
    messages: [
      { id: 'm1', sender: 'ai', text: 'Welcome to Jeevi Academy, Sivaneshkumar! Our academic team will call you shortly.', timestamp: '10:05 am' },
    ],
  },
  {
    id: 'wa-6',
    leadId: 'LEAD-1015',
    studentName: 'Pálåñï',
    phone: '919944012345',
    email: 'palani@gmail.com',
    avatarLetter: 'P',
    avatarColor: 'bg-amber-600',
    stage: 'FOLLOW UP',
    lastMessage: "You're welcome! We'll be in tou...",
    lastMessageTime: 'Yesterday',
    lastActive: 'Yesterday, 09:20 am',
    statusFlag: 'green',
    role: 'Parent',
    messages: [
      { id: 'm1', sender: 'student', text: 'Thank you for explaining NEET coaching plan.', timestamp: '09:18 am' },
      { id: 'm2', sender: 'counselor', text: "You're welcome! We'll be in touch regarding Sunday scholarship exam.", timestamp: '09:20 am' },
    ],
  },
  {
    id: 'wa-7',
    leadId: 'LEAD-1016',
    studentName: 'dee',
    phone: '919443322110',
    email: 'dee@gmail.com',
    avatarLetter: 'D',
    avatarColor: 'bg-pink-600',
    stage: 'NEW',
    lastMessage: 'Our courses cover all the lat...',
    lastMessageTime: '07/08/2026',
    lastActive: '07/08/2026, 05:40 pm',
    statusFlag: 'yellow',
    messages: [
      { id: 'm1', sender: 'ai', text: 'Our courses cover all the latest industry frameworks with hands-on projects!', timestamp: '05:40 pm' },
    ],
  },
  {
    id: 'wa-8',
    leadId: 'LEAD-1017',
    studentName: 'Fawaz',
    phone: '919811002233',
    email: 'fawaz@gmail.com',
    avatarLetter: 'F',
    avatarColor: 'bg-cyan-600',
    stage: 'IN PROGRESS',
    lastMessage: 'Here is the detailed syllabus for...',
    lastMessageTime: '07/08/2026',
    lastActive: '07/08/2026, 02:15 pm',
    statusFlag: 'green',
    messages: [
      { id: 'm1', sender: 'counselor', text: 'Here is the detailed syllabus for Data Science & AI Masterclass.', timestamp: '02:15 pm' },
    ],
  },
  {
    id: 'wa-9',
    leadId: 'LEAD-1018',
    studentName: 'Kee®thika Manima...',
    phone: '919888776655',
    email: 'keerthika@gmail.com',
    avatarLetter: 'K',
    avatarColor: 'bg-purple-600',
    stage: 'YET TO CALL',
    lastMessage: 'No This Unpaid internship.',
    lastMessageTime: '07/08/2026',
    lastActive: '07/08/2026, 11:30 am',
    statusFlag: 'yellow',
    messages: [
      { id: 'm1', sender: 'student', text: 'Is this a paid or unpaid internship placement program?', timestamp: '11:28 am' },
      { id: 'm2', sender: 'student', text: 'No This Unpaid internship.', timestamp: '11:30 am' },
    ],
  },
  {
    id: 'wa-10',
    leadId: 'LEAD-1019',
    studentName: 'Vijay',
    phone: '919777665544',
    email: 'vijay@gmail.com',
    avatarLetter: 'V',
    avatarColor: 'bg-emerald-600',
    stage: 'CONVERTED',
    lastMessage: 'I have already spoke with mr.sri...',
    lastMessageTime: '06/08/2026',
    lastActive: '06/08/2026, 06:10 pm',
    statusFlag: 'green',
    messages: [
      { id: 'm1', sender: 'student', text: 'I have already spoke with mr.sriram and paid initial fee.', timestamp: '06:10 pm' },
    ],
  },
];

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  leads,
  onUpdateLeadStage,
  onUpdateLead,
  onSelectLead,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'insights'>('chats');
  const [chats, setChats] = useState<WhatsAppChat[]>(INITIAL_WHATSAPP_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string>('wa-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isAiOn, setIsAiOn] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [studyNotesText, setStudyNotesText] = useState('');
  const [selectedRole, setSelectedRole] = useState('Unknown');
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Current selected chat object
  const activeChat = chats.find((c) => c.id === selectedChatId) || chats[0];

  // Sync role and study notes when active chat changes
  React.useEffect(() => {
    if (activeChat) {
      setSelectedRole(activeChat.role || 'Unknown');
      setStudyNotesText(activeChat.studyNotes || '');
    }
  }, [selectedChatId]);

  // Filtered chats list
  const filteredChats = chats.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.studentName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  // Handle sending a message in active chat
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || messageInput;
    if (!text.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: `m-${Date.now()}`,
      sender: 'counselor',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
      status: 'sent',
    };

    const updatedChats = chats.map((c) => {
      if (c.id === selectedChatId) {
        return {
          ...c,
          lastMessage: text.trim(),
          lastMessageTime: 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setChats(updatedChats);
    setMessageInput('');
    setShowQuickTemplates(false);

    // If AI is ON, trigger automated response simulation after 1.5 seconds
    if (isAiOn) {
      setTimeout(() => {
        const aiReply: WhatsAppMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `🤖 AI Tutor: Thank you for your message! Our admissions expert will assist you with "${text.slice(0, 25)}..." shortly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
          status: 'read',
        };

        setChats((prev) =>
          prev.map((c) => {
            if (c.id === selectedChatId) {
              return {
                ...c,
                lastMessage: aiReply.text || '',
                messages: [...c.messages, aiReply],
              };
            }
            return c;
          })
        );
      }, 1500);
    }
  };

  // Handle changing sales action / pipeline stage
  const handleStageClick = (newStage: LeadStage) => {
    // Update active chat state
    setChats((prev) =>
      prev.map((c) => (c.id === selectedChatId ? { ...c, stage: newStage } : c))
    );

    // Also update parent lead if leadId exists
    if (activeChat.leadId) {
      onUpdateLeadStage(activeChat.leadId, newStage);
    }

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Handle save lead details
  const handleSaveDetails = () => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? { ...c, role: selectedRole, studyNotes: studyNotesText }
          : c
      )
    );
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-2xs font-sans text-xs">
      {/* Top Header Navigation Bar */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0">
        {/* Left Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">JeeviAcademy</span>
            <span className="text-[10px] text-slate-400 font-medium">Enterprise Suite</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('chats')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                activeTab === 'chats'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                activeTab === 'insights'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Insights
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChats([...chats])}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="Refresh Chats"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="Select All"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const name = prompt('Enter new lead name for WhatsApp chat:');
              if (name) {
                const newChat: WhatsAppChat = {
                  id: `wa-${Date.now()}`,
                  studentName: name,
                  phone: '91' + Math.floor(8000000000 + Math.random() * 1000000000),
                  email: 'No email',
                  avatarLetter: name.charAt(0).toUpperCase(),
                  avatarColor: 'bg-blue-600',
                  stage: 'NEW',
                  lastMessage: 'New chat initiated',
                  lastMessageTime: 'Just now',
                  lastActive: 'Just now',
                  statusFlag: 'green',
                  role: 'Student',
                  messages: [
                    {
                      id: 'm1',
                      sender: 'ai',
                      text: `Hi ${name}! 👋 Welcome to Jeevi Academy WhatsApp support. How can we help you today?`,
                      timestamp: 'Just now',
                    },
                  ],
                };
                setChats([newChat, ...chats]);
                setSelectedChatId(newChat.id);
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="New Chat / Broadcast"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'insights' ? (
        /* INSIGHTS VIEW MODE */
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-600" />
              <span>WhatsApp CRM Insights & Automation Metrics</span>
            </h2>
            <p className="text-xs text-slate-500">Live analytics on AI auto-replies, response speed & conversion rates</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total WhatsApp Conversations</span>
              <p className="text-2xl font-bold text-slate-900 font-mono">203 Leads</p>
              <p className="text-[10px] text-emerald-600 font-semibold">+18% this month</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">AI Auto-Reply Resolution Rate</span>
              <p className="text-2xl font-bold text-purple-600 font-mono">82.4%</p>
              <p className="text-[10px] text-purple-600 font-semibold">Avg 4 sec response time</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Demos Booked via WhatsApp</span>
              <p className="text-2xl font-bold text-blue-600 font-mono">48 Students</p>
              <p className="text-[10px] text-blue-600 font-semibold">23.6% conversion rate</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Active Broadcast Campaigns</span>
              <p className="text-2xl font-bold text-amber-600 font-mono">4 Batches</p>
              <p className="text-[10px] text-amber-600 font-semibold">NEET, JEE, FullStack, Data Science</p>
            </div>
          </div>
        </div>
      ) : (
        /* CHATS VIEW MODE (3 Panels Layout) */
        <div className="flex-1 flex overflow-hidden">
          {/* PANEL 1: LEFT CHATS LIST (320px) */}
          <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
            {/* Search & Date Filters */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-center font-mono text-[10px]"
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-center font-mono text-[10px]"
                />
              </div>
            </div>

            {/* Chat Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredChats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`p-3 flex items-start gap-2.5 cursor-pointer transition-colors relative ${
                      isSelected
                        ? 'bg-purple-50/80 border-l-4 border-purple-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* WhatsApp Badge Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-9 h-9 rounded-full ${chat.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                      >
                        {chat.avatarLetter}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                        <MessageSquare className="w-2.5 h-2.5 fill-white text-emerald-500" />
                      </div>
                    </div>

                    {/* Chat Preview Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {chat.studentName}
                          </h4>
                          {chat.statusFlag === 'green' ? (
                            <Flag className="w-3 h-3 text-emerald-500 shrink-0" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {chat.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Footer */}
            <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <button className="p-1 hover:text-slate-900"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span>1 / 11 ({chats.length} leads)</span>
              <button className="p-1 hover:text-slate-900"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* PANEL 2: CENTER CHAT WINDOW (Flex-1) */}
          <div className="flex-1 flex flex-col bg-[#F8FAFC]">
            {/* Active Chat Header */}
            <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${activeChat.avatarColor} text-white font-bold flex items-center justify-center text-xs`}
                >
                  {activeChat.avatarLetter}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{activeChat.studentName}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Last active: {activeChat.lastActive}</span>
                  </p>
                </div>
              </div>

              {/* Chat Actions */}
              <div className="flex items-center gap-2 text-slate-500">
                <button className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-slate-800 transition cursor-pointer">
                  <Search className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete conversation history with ${activeChat.studentName}?`)) {
                      setChats(chats.filter((c) => c.id !== activeChat.id));
                    }
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-red-600 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-slate-800 transition cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Stream Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100/60">
              {/* Date Separator Pill */}
              <div className="flex justify-center">
                <span className="text-[10px] bg-slate-200 text-slate-600 font-mono font-semibold px-2.5 py-0.5 rounded-full border border-slate-300/60">
                  04 Aug 2026
                </span>
              </div>

              {/* Messages List */}
              {activeChat.messages.map((msg) => {
                const isStudent = msg.sender === 'student';
                const isAI = msg.sender === 'ai';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudent ? 'items-start' : 'items-end'} max-w-[85%] ${
                      isStudent ? 'mr-auto' : 'ml-auto'
                    }`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`p-3 rounded-2xl shadow-2xs space-y-1 text-xs leading-relaxed ${
                        isStudent
                          ? 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                          : isAI
                          ? 'bg-purple-100 text-purple-950 border border-purple-200 rounded-tr-none'
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}
                    >
                      {/* AI Header Badge */}
                      {isAI && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-200/60 px-2 py-0.5 rounded-md w-max mb-1">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>AI Tutor</span>
                        </div>
                      )}

                      {/* Image Attachment if exists */}
                      {msg.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 mb-1 max-w-xs">
                          <img
                            src={msg.imageUrl}
                            alt="Attachment"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}

                      {/* Message Text */}
                      {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}

                      {/* Timestamp */}
                      <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono mt-0.5">
                        <span>{msg.timestamp}</span>
                        {!isStudent && <span className="text-purple-600 font-bold">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Controls Footer */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2">
              {/* Quick Template Picker if open */}
              {showQuickTemplates && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 animate-in fade-in duration-150">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Quick Templates
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      onClick={() => handleSendMessage('Hi! Here is the detailed Jeevi Academy course syllabus & fee breakdown: https://jeevi.edu/syllabus')}
                      className="p-1.5 bg-white border rounded text-left hover:bg-purple-50 hover:border-purple-300 cursor-pointer"
                    >
                      📄 Send Syllabus Link
                    </button>
                    <button
                      onClick={() => handleSendMessage('You are invited to our live masterclass demo this Saturday at 11 AM! Click to confirm your seat.')}
                      className="p-1.5 bg-white border rounded text-left hover:bg-purple-50 hover:border-purple-300 cursor-pointer"
                    >
                      🎓 Invite to Demo
                    </button>
                    <button
                      onClick={() => handleSendMessage('Thank you for your inquiry! Our senior counselor Rajesh will call you shortly on this number.')}
                      className="p-1.5 bg-white border rounded text-left hover:bg-purple-50 hover:border-purple-300 cursor-pointer"
                    >
                      📞 Callback Confirmation
                    </button>
                    <button
                      onClick={() => handleSendMessage('We offer 0% EMI options starting at just ₹10,000/month. Let us know if you need installment details!')}
                      className="p-1.5 bg-white border rounded text-left hover:bg-purple-50 hover:border-purple-300 cursor-pointer"
                    >
                      💳 EMI Payment Info
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* AI Toggle Button */}
                <button
                  onClick={() => setIsAiOn(!isAiOn)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                    isAiOn
                      ? 'bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Toggle AI Auto Reply"
                >
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isAiOn ? '🤖 AI On' : 'Pause AI'}</span>
                </button>

                {/* Input Text Box */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={
                      isAiOn
                        ? 'Pause AI first to send manually, or type here...'
                        : 'Type message...'
                    }
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-900"
                  />
                </div>

                {/* Attachment Icons */}
                <button
                  onClick={() => {
                    const url = prompt('Enter image URL or attachment link:');
                    if (url) {
                      const msg: WhatsAppMessage = {
                        id: `m-${Date.now()}`,
                        sender: 'counselor',
                        imageUrl: url,
                        text: 'Shared attachment image',
                        timestamp: 'Just now',
                      };
                      setChats((prev) =>
                        prev.map((c) =>
                          c.id === selectedChatId
                            ? { ...c, messages: [...c.messages, msg] }
                            : c
                        )
                      );
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Attach File / Image"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowQuickTemplates(!showQuickTemplates)}
                  className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Quick Templates"
                >
                  <Zap className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    handleSendMessage('🎙️ [Voice Message: 0:14]');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Send Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-2xs transition active:scale-95 cursor-pointer"
                  title="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* PANEL 3: RIGHT LEAD DETAILS & SALES ACTIONS (320px) */}
          <div className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 p-4 space-y-4 overflow-y-auto">
            {/* Header Title & Save Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Lead Details</h3>
              <button
                onClick={handleSaveDetails}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs transition cursor-pointer flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            {/* Toast Notification */}
            {saveToast && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lead updated successfully!</span>
              </div>
            )}

            {/* Profile Avatar & Name */}
            <div className="text-center space-y-1">
              <div
                className={`w-14 h-14 rounded-full ${activeChat.avatarColor} text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-xs`}
              >
                {activeChat.avatarLetter}
              </div>
              <h4 className="font-bold text-slate-900 text-base">{activeChat.studentName}</h4>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wider">
                {activeChat.stage}
              </span>
            </div>

            {/* Contact Details List */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeChat.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeChat.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>whatsapp_direct</span>
              </div>
            </div>

            {/* Lead Profile Fields */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                LEAD PROFILE
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Role</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-900 text-xs focus:outline-none"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Parent">Parent</option>
                </select>
              </div>
            </div>

            {/* Sales Actions (Pipeline Stage Selection Buttons) */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                SALES ACTIONS
              </span>
              <div className="space-y-1.5">
                {[
                  { stage: 'IN PROGRESS' as LeadStage, label: 'In Progress' },
                  { stage: 'YET TO CALL' as LeadStage, label: 'Yet to Call' },
                  { stage: 'CONTACTED' as LeadStage, label: 'Called' },
                  { stage: 'FOLLOW UP' as LeadStage, label: 'Ask for Demo' },
                  { stage: 'DEMO' as LeadStage, label: 'Attended Demo' },
                  { stage: 'CONVERTED' as LeadStage, label: 'Converted' },
                  { stage: 'CHURN' as LeadStage, label: 'Cant converted..' },
                ].map((item) => {
                  const isCurrent = activeChat.stage === item.stage;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleStageClick(item.stage)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs text-left font-medium transition cursor-pointer border flex items-center justify-between ${
                        isCurrent
                          ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Study Notes Textarea */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                STUDY NOTES
              </span>
              <textarea
                rows={4}
                placeholder="Call history, preferences..."
                value={studyNotesText}
                onChange={(e) => setStudyNotesText(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
