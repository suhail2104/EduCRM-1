import { LeadStage, StageMetadata } from '../types';

export const STAGE_CONFIG: Record<LeadStage, StageMetadata> = {
  NEW: {
    id: 'NEW',
    label: 'NEW',
    emoji: '🆕',
    color: '#3B82F6', // blue
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500',
    progressPct: 10,
  },
  'YET TO CALL': {
    id: 'YET TO CALL',
    label: 'YET TO CALL',
    emoji: '📋',
    color: '#8B5CF6', // purple
    badgeBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500',
    progressPct: 20,
  },
  'IN PROGRESS': {
    id: 'IN PROGRESS',
    label: 'IN PROGRESS',
    emoji: '🔄',
    color: '#06B6D4', // cyan
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-500',
    progressPct: 35,
  },
  CONTACTED: {
    id: 'CONTACTED',
    label: 'CONTACTED',
    emoji: '📞',
    color: '#EAB308', // amber
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500',
    progressPct: 45,
  },
  DEMO: {
    id: 'DEMO',
    label: 'DEMO',
    emoji: '🎓',
    color: '#6366F1', // indigo
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-500',
    progressPct: 60,
  },
  'FOLLOW UP': {
    id: 'FOLLOW UP',
    label: 'FOLLOW UP',
    emoji: '⏰',
    color: '#F97316', // orange
    badgeBg: 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500',
    progressPct: 75,
  },
  PAID: {
    id: 'PAID',
    label: 'PAID',
    emoji: '💰',
    color: '#10B981', // emerald
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500',
    progressPct: 90,
  },
  CONVERTED: {
    id: 'CONVERTED',
    label: 'CONVERTED',
    emoji: '✅',
    color: '#16A34A', // green
    badgeBg: 'bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700 font-semibold',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-600',
    progressPct: 100,
  },
  CHURN: {
    id: 'CHURN',
    label: 'CHURN',
    emoji: '❌',
    color: '#EF4444', // red
    badgeBg: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500',
    progressPct: 0,
  },
};

export const STAGE_LIST: LeadStage[] = [
  'NEW',
  'YET TO CALL',
  'IN PROGRESS',
  'CONTACTED',
  'DEMO',
  'FOLLOW UP',
  'PAID',
  'CONVERTED',
  'CHURN',
];
