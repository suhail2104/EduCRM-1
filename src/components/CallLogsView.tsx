import React from 'react';
import { PhoneCall, Sparkles, Volume2, Search, Filter } from 'lucide-react';
import { Lead } from '../types';
import { AudioPlayerWidget } from './AudioPlayerWidget';

interface CallLogsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export const CallLogsView: React.FC<CallLogsViewProps> = ({ leads, onSelectLead }) => {
  const leadsWithAudio = leads.filter((l) => l.audioRecordings && l.audioRecordings.length > 0);

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-blue-600" />
          <span>Call Logs & Audio Transcripts</span>
        </h1>
        <p className="text-xs text-slate-500">
          Listen to counselor call recordings, AI playback controls, and sentiment analysis
        </p>
      </div>

      <div className="space-y-4">
        {leadsWithAudio.map((lead) => (
          <div
            key={lead.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">{lead.studentName}</h3>
                <p className="text-xs text-slate-500">
                  Course: {lead.courseInterest} • Phone: {lead.phone}
                </p>
              </div>

              <button
                onClick={() => onSelectLead(lead)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-2xs cursor-pointer transition"
              >
                View Profile
              </button>
            </div>

            {lead.audioRecordings.map((rec) => (
              <AudioPlayerWidget key={rec.id} recording={rec} compact={false} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
