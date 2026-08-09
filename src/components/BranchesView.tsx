import React from 'react';
import { Building2, MapPin, Users, DollarSign } from 'lucide-react';
import { Branch } from '../types';

interface BranchesViewProps {
  branches: Branch[];
}

export const BranchesView: React.FC<BranchesViewProps> = ({ branches }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Jeevi Edu Campus Branches</span>
        </h1>
        <p className="text-xs text-slate-500">Pan-India coaching center branch overview & revenue metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map((b) => (
          <div
            key={b.id}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">{b.name}</h3>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md">
                {b.code}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {b.city} • Manager: {b.manager}
            </p>

            <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Leads:</span>
                <span className="font-mono font-bold text-slate-900">{b.totalLeads}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Counselors:</span>
                <span className="font-mono font-bold text-slate-900">{b.activeCounselors}</span>
              </div>
              <div className="flex justify-between text-blue-600 font-bold pt-1 border-t border-slate-100">
                <span>Monthly Revenue:</span>
                <span className="font-mono">₹{(b.monthlyRevenue / 100000).toFixed(1)} Lakhs</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
