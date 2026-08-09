import React, { useState } from 'react';
import { Shell, ActiveNavTab } from './components/Shell';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadDetail } from './components/LeadDetail';
import { NewLeadModal } from './components/NewLeadModal';
import { ImportLeadsModal } from './components/ImportLeadsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LeadsTableView } from './components/LeadsTableView';
import { CallLogsView } from './components/CallLogsView';
import { ContactsView } from './components/ContactsView';
import { TeamView } from './components/TeamView';
import { BranchesView } from './components/BranchesView';
import { SettingsView } from './components/SettingsView';
import { WhatsAppView } from './components/WhatsAppView';

import { Lead, LeadStage } from './types';
import { MOCK_LEADS, MOCK_COUNSELORS, MOCK_BRANCHES } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('pipeline');
  const [selectedBranch, setSelectedBranch] = useState<string>('All Branches');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [counselors] = useState(MOCK_COUNSELORS);
  const [branches] = useState(MOCK_BRANCHES);

  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Branch filtered leads
  const branchLeads = leads.filter((l) => {
    if (selectedBranch === 'All Branches') return true;
    return l.branch === selectedBranch;
  });

  // Handler to update stage
  const handleUpdateLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const newHistoryItem = {
          id: `h-${Date.now()}`,
          type: 'stage_change' as const,
          content: `Moved stage from ${lead.stage} to ${newStage}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: 'Counselor',
          meta: { fromStage: lead.stage, toStage: newStage },
        };
        const updated = {
          ...lead,
          stage: newStage,
          history: [newHistoryItem, ...lead.history],
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        return updated;
      })
    );
  };

  // Handler to update lead object completely
  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    if (selectedLeadForDetail?.id === updatedLead.id) {
      setSelectedLeadForDetail(updatedLead);
    }
  };

  // Handler to add new single lead
  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  // Handler to import batch leads
  const handleImportLeads = (newLeads: Lead[]) => {
    setLeads((prev) => [...newLeads, ...prev]);
  };

  // Handler to delete lead
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLeadForDetail?.id === leadId) {
      setSelectedLeadForDetail(null);
    }
  };

  return (
    <Shell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      selectedBranch={selectedBranch}
      onBranchChange={setSelectedBranch}
      onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
      onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
    >
      {/* 1. Executive Dashboard View */}
      {activeTab === 'dashboard' && (
        <Dashboard
          leads={branchLeads}
          counselors={counselors}
          onSelectLead={(l) => setSelectedLeadForDetail(l)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* 2. Pipeline Kanban Board View (9 Stages) */}
      {activeTab === 'pipeline' && (
        <KanbanBoard
          leads={branchLeads}
          onLeadClick={(l) => setSelectedLeadForDetail(l)}
          onUpdateLeadStage={handleUpdateLeadStage}
          onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {/* 3. Leads Table View */}
      {activeTab === 'list' && (
        <LeadsTableView
          leads={branchLeads}
          onSelectLead={(l) => setSelectedLeadForDetail(l)}
          onUpdateLeadStage={handleUpdateLeadStage}
          onDeleteLead={handleDeleteLead}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
        />
      )}

      {/* 3.5. WhatsApp CRM View */}
      {activeTab === 'whatsapp' && (
        <WhatsAppView
          leads={branchLeads}
          onUpdateLeadStage={handleUpdateLeadStage}
          onUpdateLead={handleUpdateLead}
          onSelectLead={(l) => setSelectedLeadForDetail(l)}
        />
      )}

      {/* 4. Contacts Directory View */}
      {activeTab === 'contacts' && (
        <ContactsView leads={branchLeads} onSelectLead={(l) => setSelectedLeadForDetail(l)} />
      )}

      {/* 5. Call Logs & AI Transcripts View */}
      {activeTab === 'call-logs' && (
        <CallLogsView leads={branchLeads} onSelectLead={(l) => setSelectedLeadForDetail(l)} />
      )}

      {/* 6. Team & Counselors View */}
      {activeTab === 'team' && <TeamView counselors={counselors} />}

      {/* 7. Branches View */}
      {activeTab === 'branches' && <BranchesView branches={branches} />}

      {/* 8. Settings View */}
      {activeTab === 'settings' && <SettingsView />}

      {/* Rich 3-Column Lead Detail Modal / Drawer */}
      <LeadDetail
        lead={selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        onUpdateLead={handleUpdateLead}
        onDeleteLead={handleDeleteLead}
      />

      {/* Add New Lead Modal */}
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {/* Batch Import Existing Database Modal */}
      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportLeads={handleImportLeads}
      />

      {/* Cmd + K Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        leads={leads}
        onSelectLead={(l) => setSelectedLeadForDetail(l)}
      />
    </Shell>
  );
}
