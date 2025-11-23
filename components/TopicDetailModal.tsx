
import React from 'react';
import { Topic } from '../types';
import { X, AlertTriangle, Download, Users, ExternalLink, ThumbsUp, Calendar, MessageSquare } from 'lucide-react';
import { TrendChart, SentimentPie, PainScoreBar, PainRadarChart } from './Charts';
import { exportToCSV } from '../services/geminiService';

interface Props {
  topic: Topic;
  onClose: () => void;
}

export const TopicDetailModal: React.FC<Props> = ({ topic, onClose }) => {
  const handleExport = () => {
    if (topic.painPoints) {
      exportToCSV(topic.painPoints, `${topic.title}_pain_points`);
    }
  };

  // Prepare Radar Data from top pain point (or average of top 3)
  const topPainPoint = topic.painPoints?.[0] || { severity: 0, frequency: 0, recency: 0, unmetNeed: 0, title: '无数据' };
  const radarData = [
    { subject: '严重程度', A: topPainPoint.severity, fullMark: 25 },
    { subject: '频率', A: topPainPoint.frequency, fullMark: 25 },
    { subject: '时效性', A: topPainPoint.recency, fullMark: 25 },
    { subject: '未满足度', A: topPainPoint.unmetNeed, fullMark: 25 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0B1120] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-[#0B1120]/95 backdrop-blur z-10 border-b border-white/5 p-6 flex justify-between items-center">
          <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               {topic.title}
               <span className="text-sm font-normal px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                 +{topic.growth}% 增长
               </span>
             </h2>
             <p className="text-slate-400 text-sm mt-1">该讨论集群的详细深度分析</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
             >
               <Download size={16} /> 导出 CSV
             </button>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
               <X size={24} />
             </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="glass-panel p-5 rounded-xl">
                <h3 className="text-sm text-slate-500 mb-2">趋势摘要 (12个月)</h3>
                <div className="h-32">
                   <TrendChart data={topic.history} color="#3b82f6" />
                </div>
             </div>
             <div className="glass-panel p-5 rounded-xl">
                <h3 className="text-sm text-slate-500 mb-2">情绪分析</h3>
                <div className="h-32 flex items-center justify-center">
                   <SentimentPie data={{ pos: topic.sentiment, neu: 100-topic.sentiment-10, neg: 10 }} /> 
                </div>
             </div>
             <div className="glass-panel p-5 rounded-xl flex flex-col justify-center">
                <div className="flex justify-between mb-4">
                   <span className="text-slate-400">帖子数量</span>
                   <span className="text-white font-mono">{topic.volume}</span>
                </div>
                <div className="flex justify-between mb-4">
                   <span className="text-slate-400">平均情绪分</span>
                   <span className="text-emerald-400 font-mono">{topic.sentiment}/100</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">提及品牌数</span>
                    <span className="text-blue-400 font-mono">{topic.brands?.length || 0}</span>
                </div>
             </div>
          </div>

          {/* NEW: Radar Chart & User Persona Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Pain Radar */}
             <div className="glass-panel p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-400"/> 痛点分析雷达图
                </h3>
                <div className="h-64 w-full">
                   <PainRadarChart data={radarData} />
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">显示主要痛点 ({topPainPoint.title}) 的多维特征</p>
             </div>

             {/* User Persona */}
             <div className="glass-panel p-6 rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users size={18} className="text-blue-400"/> 用户画像（谁在抱怨？）
                </h3>
                {topic.userPersona ? (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-20 text-xs text-slate-500 font-semibold uppercase mt-1">用户类型</div>
                            <div className="flex-1 text-white font-medium text-lg">{topic.userPersona.type}</div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-20 text-xs text-slate-500 font-semibold uppercase mt-1">典型动机</div>
                            <div className="flex-1 text-slate-300 text-sm">{topic.userPersona.motivation}</div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="w-20 text-xs text-slate-500 font-semibold uppercase mt-1">主要抱怨点</div>
                            <div className="flex-1 text-slate-300 text-sm">{topic.userPersona.complaints}</div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-20 text-xs text-slate-500 font-semibold uppercase mt-1">使用场景</div>
                            <div className="flex-1 text-slate-300 text-sm">{topic.userPersona.scenario}</div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="w-20 text-xs text-slate-500 font-semibold uppercase mt-1">典型语气</div>
                            <div className="flex-1 text-slate-300 text-sm italic opacity-80">"{topic.userPersona.tone}"</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-40 text-slate-500">
                        分析中未生成具体画像
                    </div>
                )}
             </div>
          </div>

          {/* Top Posts Section */}
          {topic.topPosts && topic.topPosts.length > 0 && (
             <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-400"/> 代表性帖子（前 5 条）
                </h3>
                <div className="space-y-4">
                   {topic.topPosts.map((post, i) => (
                       <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                           <div className="flex justify-between items-start mb-3">
                               <h4 className="text-base font-semibold text-white pr-4">{post.title}</h4>
                               <a 
                                 href={post.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="p-2 bg-white/5 hover:bg-blue-600 hover:text-white rounded-lg text-slate-400 transition-all flex-shrink-0"
                               >
                                 <ExternalLink size={16} />
                               </a>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                               <div className="bg-black/20 p-3 rounded-lg">
                                   <div className="text-xs text-slate-500 mb-1">英文原帖内容：</div>
                                   <p className="text-sm text-slate-300 line-clamp-3 font-mono text-xs leading-relaxed">{post.snippet}</p>
                               </div>
                               <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                                   <div className="text-xs text-blue-400 mb-1">中文摘要：</div>
                                   <p className="text-sm text-slate-200 line-clamp-3">{post.summary_cn}</p>
                               </div>
                           </div>

                           <div className="flex items-center gap-4 text-xs text-slate-500">
                               <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                                   <span className="text-orange-400">r/{post.subreddit}</span>
                               </span>
                               <span className="flex items-center gap-1">
                                   <ThumbsUp size={12} /> {post.upvotes}
                               </span>
                               <span className="flex items-center gap-1">
                                   <Calendar size={12} /> {post.date}
                               </span>
                           </div>
                       </div>
                   ))}
                </div>
             </div>
          )}

          {/* Existing Pain Points List */}
          {topic.painPoints && topic.painPoints.length > 0 && (
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-400"/> 详细用户痛点列表
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topic.painPoints.map((pp, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="font-semibold text-slate-200">{pp.title}</div>
                                <div className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 font-bold">{pp.totalScore}</div>
                            </div>
                            <div className="h-20 mb-3">
                                <PainScoreBar severity={pp.severity} frequency={pp.frequency} recency={pp.recency} unmetNeed={pp.unmetNeed} />
                            </div>
                            <div className="space-y-2">
                                {pp.quotes.slice(0, 2).map((q, idx) => (
                                    <p key={idx} className="text-xs text-slate-400 italic border-l-2 border-slate-700 pl-2">"{q}"</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
