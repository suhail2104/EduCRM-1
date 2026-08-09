import React from 'react';
import { UserCheck, Award, PhoneCall, TrendingUp, DollarSign } from 'lucide-react';
import { Counselor } from '../types';

interface TeamViewProps {
  counselors: Counselor[];
}

export const TeamView: React.FC<TeamViewProps> = ({ counselors }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <span>Counseling Team & Performance</span>
        </h1>
        <p className="text-xs text-slate-500">Admissions officers, active lead quotas, and conversion metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {counselors.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-3">
              <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
              <div>
                <h3 className="font-bold text-base text-slate-900">{c.name}</h3>
                <p className="text-xs text-blue-600 font-semibold">{c.role}</p>
                <p className="text-xs text-slate-500">{c.branch}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Calls Made</span>
                <span className="font-mono font-bold text-sm text-slate-900">{c.callsMade}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Conv. Rate</span>
                <span className="font-mono font-bold text-sm text-emerald-600">{c.conversionRate}%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Revenue</span>
                <span className="font-mono font-bold text-sm text-blue-600">
                  ₹{(c.revenueGenerated / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
