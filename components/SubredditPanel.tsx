
import React, { useState } from 'react';
import { SubredditInsight } from '../types';
import { Users, ChevronRight } from 'lucide-react';
import { SubredditDetailModal } from './SubredditDetailModal';

interface Props {
  subreddits: SubredditInsight[];
}

export const SubredditPanel: React.FC<Props> = ({ subreddits }) => {
  const [selectedSub, setSelectedSub] = useState<SubredditInsight | null>(null);

  return (
    <>
      <div className="glass-panel p-0 rounded-xl overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
             <Users size={16} className="text-orange-400"/> 主要讨论社区
          </h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
          {subreddits.map((sub, i) => (
            <div 
              key={i}
              onClick={() => setSelectedSub(sub)}
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-orange-500/30 cursor-pointer transition-all group"
            >
               <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-200 text-sm group-hover:text-orange-300">{sub.name}</h4>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-orange-400" />
               </div>
               <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                      <div className="text-slate-500 scale-90 origin-left">社区人数</div>
                      <div className="text-slate-300">{sub.memberCount >= 1000000 ? (sub.memberCount/1000000).toFixed(1)+'M' : (sub.memberCount/1000).toFixed(0)+'k'}</div>
                  </div>
                  <div>
                      <div className="text-slate-500 scale-90 origin-left">帖子量</div>
                      <div className="text-slate-300 font-mono">{sub.postVolume}</div>
                  </div>
                  <div className="text-right">
                      <div className="text-slate-500 scale-90 origin-right">占比</div>
                      <div className="text-orange-400 font-bold">{sub.percentage}%</div>
                  </div>
               </div>
               {/* Simple bar visualization */}
               <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-orange-500/50" style={{ width: `${sub.percentage}%` }}></div>
               </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedSub && (
        <SubredditDetailModal subreddit={selectedSub} onClose={() => setSelectedSub(null)} />
      )}
    </>
  );
};
