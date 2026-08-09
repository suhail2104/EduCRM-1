import React from 'react';
import { Users, Phone, Mail, MapPin, BookOpen } from 'lucide-react';
import { Lead } from '../types';

interface ContactsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ leads, onSelectLead }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Student Contacts Directory</span>
        </h1>
        <p className="text-xs text-slate-500">Central directory of student contacts and parent profiles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {leads.map((l) => (
          <div
            key={l.id}
            onClick={() => onSelectLead(l)}
            className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-400 transition cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{l.studentName}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 font-semibold">
                {l.stage}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-600">
              <p className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                {l.phone}
              </p>
              <p className="flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {l.email}
              </p>
              <p className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                {l.courseInterest}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
