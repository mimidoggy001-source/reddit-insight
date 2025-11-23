import React, { useState } from 'react';
import { PainPoint } from '../types';
import { PainScoreBar } from './Charts';
import { AlertTriangle, MessageSquare } from 'lucide-react';

interface Props {
  data: PainPoint;
}

export const PainPointCard: React.FC<Props> = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Dynamic color for score
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-red-500';
    if (score > 50) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="glass-panel rounded-xl p-6 transition-all hover:bg-white/5 border border-white/5 hover:border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-100 leading-tight">{data.title}</h3>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(data.totalScore)}`}>
            {data.totalScore}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">痛评分</div>
        </div>
      </div>

      <div className="h-32 w-full mb-4">
        <PainScoreBar 
          severity={data.severity} 
          frequency={data.frequency} 
          recency={data.recency} 
          unmetNeed={data.unmetNeed} 
        />
      </div>

      <div className="flex gap-2 mb-4 text-xs text-slate-400">
        <span className="bg-white/5 px-2 py-1 rounded">严重: {data.severity}</span>
        <span className="bg-white/5 px-2 py-1 rounded">频率: {data.frequency}</span>
        <span className="bg-white/5 px-2 py-1 rounded">近期: {data.recency}</span>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
          <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <MessageSquare size={14} /> 代表性评论
          </h4>
          <ul className="space-y-2">
            {data.quotes.map((quote, i) => (
              <li key={i} className="text-sm text-slate-400 italic bg-black/20 p-2 rounded border-l-2 border-red-500/50">
                "{quote}"
              </li>
            ))}
          </ul>
        </div>
      )}

      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-slate-300 transition-colors"
      >
        {showDetails ? '隐藏评论' : '查看评论'}
      </button>
    </div>
  );
};