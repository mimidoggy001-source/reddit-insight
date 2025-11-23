
import React from 'react';
import { SubredditInsight } from '../types';
import { X, ExternalLink, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';
import { TrendChart, PainRadarChart } from './Charts';

interface Props {
  subreddit: SubredditInsight;
  onClose: () => void;
}

export const SubredditDetailModal: React.FC<Props> = ({ subreddit, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0B1120] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn custom-scrollbar">
        <div className="sticky top-0 bg-[#0B1120]/95 backdrop-blur z-10 border-b border-white/5 p-6 flex justify-between items-center">
          <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               社区详情：{subreddit.name}
             </h2>
             <p className="text-slate-400 text-sm mt-1">
                成员: {subreddit.memberCount.toLocaleString()} • 样本占比: {subreddit.percentage}%
             </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-4 rounded-xl">
                    <h3 className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} /> 12 个月发帖趋势
                    </h3>
                    <div className="h-48">
                        <TrendChart data={subreddit.history} color="#f97316" />
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl">
                    <h3 className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                        <MessageSquare size={16} /> 用户痛点雷达图
                    </h3>
                    <div className="h-48">
                        <PainRadarChart data={subreddit.painPoints} />
                    </div>
                </div>
            </div>

            {/* Topics & Brands */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">主要话题 (Topics)</h3>
                    <div className="flex flex-wrap gap-2">
                        {subreddit.topTopics.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-slate-300 text-sm border border-white/5">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">品牌提及</h3>
                    <div className="flex flex-wrap gap-2">
                        {subreddit.brands.map((b, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20">
                                {b}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Posts */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">代表性帖子 (前 5 条)</h3>
                <div className="space-y-3">
                    {subreddit.topPosts && subreddit.topPosts.slice(0, 5).map((post, i) => (
                        <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-medium line-clamp-1">{post.title}</h4>
                                <a href={post.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400">
                                    <ExternalLink size={14} />
                                </a>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-2">
                                 <div className="text-slate-400 text-xs">
                                     <span className="block text-slate-600 mb-1">英文原帖:</span>
                                     {post.snippet}
                                 </div>
                                 <div className="text-slate-300 text-xs">
                                     <span className="block text-blue-500/70 mb-1">中文摘要:</span>
                                     {post.summary_cn}
                                 </div>
                             </div>
                             <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-white/5 pt-2">
                                 <span className="flex items-center gap-1"><ThumbsUp size={12}/> {post.upvotes}</span>
                                 <span className="flex items-center gap-1"><MessageSquare size={12}/> {post.comments}</span>
                                 <span>{post.date}</span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
