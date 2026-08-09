import React, { useState } from 'react';
import { Settings, Sparkles, Bell, Shield, Database, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [aiModel, setAiModel] = useState('Gemini 2.0 Flash');
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>Jeevi Edu CRM Settings</span>
        </h1>
        <p className="text-xs text-slate-500">Configure AI call transcription engines, branches, and staff permissions</p>
      </div>

      <div className="space-y-4 text-xs">
        {/* AI Call Intelligence Config */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Call Intelligence & Transcription</span>
          </h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Transcription & Sentiment Model
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full sm:w-80 p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
            >
              <option>Gemini 2.0 Flash (Recommended - Realtime)</option>
              <option>Gemini 1.5 Pro (Deep Analysis)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={autoTranscribe}
              onChange={(e) => setAutoTranscribe(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
            <span>Automatically transcribe outbound counselor calls and extract objections</span>
          </label>
        </div>

        {/* Messaging & Alerts */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp & SMS Alerts</span>
          </h3>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={whatsappNotifications}
              onChange={(e) => setWhatsappNotifications(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <span>Send automated WhatsApp confirmation when student registers for Demo Class</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition flex items-center gap-2 cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4 text-blue-200" />}
          <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
};
