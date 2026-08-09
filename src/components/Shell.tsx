import React, { useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  Table,
  Users,
  PhoneCall,
  UserCheck,
  Building2,
  Settings as SettingsIcon,
  MessageSquare,
  Search,
  Plus,
  Bell,
  ChevronDown,
  Building,
  Menu,
  X,
  Sparkles,
  LogOut,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { Branch } from '../types';
import { MOCK_BRANCHES } from '../data/mockData';

export type ActiveNavTab =
  | 'dashboard'
  | 'pipeline'
  | 'list'
  | 'whatsapp'
  | 'contacts'
  | 'call-logs'
  | 'team'
  | 'branches'
  | 'settings';

interface ShellProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  onOpenNewLeadModal: () => void;
  onOpenGlobalSearch: () => void;
  children: React.ReactNode;
  unreadNotificationsCount?: number;
}

export const Shell: React.FC<ShellProps> = ({
  activeTab,
  onTabChange,
  selectedBranch,
  onBranchChange,
  onOpenNewLeadModal,
  onOpenGlobalSearch,
  children,
  unreadNotificationsCount = 3,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline Board', icon: Kanban, badge: '9 Stages' },
    { id: 'list', label: 'Leads Table', icon: Table },
    { id: 'whatsapp', label: 'Whatsapp', icon: MessageSquare, badge: 'AI Chat' },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'call-logs', label: 'Call Logs & AI', icon: PhoneCall, badge: 'Audio' },
    { id: 'team', label: 'Team / Counselors', icon: UserCheck },
    { id: 'branches', label: 'Branches', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white text-slate-900 border-b border-slate-200 shadow-2xs px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left Side: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900">Jeevi Edu</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md tracking-wider">
                  CRM
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 font-medium">Coaching & Admissions Engine</p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs transition cursor-pointer group"
          >
            <span className="flex items-center gap-2 text-slate-600">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              <span>Quick Search (Cmd + K)</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Actions, Branch Switcher, Notifications, New Lead */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Branch Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span className="max-w-[100px] sm:max-w-[140px] truncate">{selectedBranch}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isBranchMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Branch
                </div>
                <button
                  onClick={() => {
                    onBranchChange('All Branches');
                    setIsBranchMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    selectedBranch === 'All Branches' ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>All Branches</span>
                  <span className="text-[10px] text-slate-400">Pan-India</span>
                </button>
                {MOCK_BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onBranchChange(b.name);
                      setIsBranchMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      selectedBranch === b.name ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] text-slate-400">{b.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger Icon for mobile */}
          <button
            onClick={onOpenGlobalSearch}
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-900">Recent Alerts & Reminders</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                    3 New
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-blue-700">Demo Scheduled in 30 mins</p>
                    <p className="text-slate-600 text-[11px]">Aarav Sharma - Full Stack Web Dev</p>
                    <span className="text-[9px] text-slate-400 mt-1 block">10:30 AM • Counselor Priya</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-emerald-700">Payment Received: ₹20,000</p>
                    <p className="text-slate-600 text-[11px]">Ananya Patel - Data Science Token</p>
                    <span className="text-[9px] text-slate-400 mt-1 block">11:10 AM • Rajesh Kumar</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-amber-700">AI Call Summary Ready</p>
                    <p className="text-slate-600 text-[11px]">Sneha Reddy - 3 objections highlighted</p>
                    <span className="text-[9px] text-slate-400 mt-1 block">4:45 PM • Audio Logged</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* "+ New Lead" Button */}
          <button
            onClick={onOpenNewLeadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Lead</span>
            <span className="sm:hidden">Lead</span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80"
                alt="Rajesh Kumar"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="hidden lg:inline text-xs font-semibold text-slate-700">Rajesh K.</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">Rajesh Kumar</p>
                  <p className="text-[10px] text-slate-500">Admissions Lead • Main Campus</p>
                </div>
                <button
                  onClick={() => {
                    onTabChange('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Collapsible Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside
          className={`bg-white text-slate-700 border-r border-slate-200 flex flex-col transition-all duration-200 z-20 shrink-0 ${
            isSidebarOpen ? 'w-60' : 'w-16'
          }`}
        >
          {/* Navigation Links */}
          <div className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as ActiveNavTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={item.label}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  {isSidebarOpen && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            isActive
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Banner / Footer Info */}
          {isSidebarOpen && (
            <div className="p-3 m-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Call Intelligence</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Automatically extracts counselor objections & recommendations.
              </p>
            </div>
          )}

          {/* Collapse Footer */}
          <div className="p-2.5 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 font-mono">{isSidebarOpen ? 'Jeevi CRM v2.4' : 'v2.4'}</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC] text-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
};
