import React, { useState, useEffect } from 'react';
import { analyzeMarketData } from '../services/geminiService';
import { AnalysisResult, Topic, Theme } from '../types';
import { TrendChart } from './Charts';
import { TopicDetailModal } from './TopicDetailModal';
import { MetricCard } from './MetricCard';
import { SubredditPanel } from './SubredditPanel';
import { RefreshButton } from './RefreshButton';
import { Search, MessageCircle, TrendingUp, Activity, Users, Loader2, ChevronRight, Bookmark, Clock } from 'lucide-react';

interface Props {
  data: AnalysisResult | null;
  setData: (data: AnalysisResult) => void;
  initialQuery?: string;
  themes: Theme[];
}

export const Dashboard: React.FC<Props> = ({ data, setData, initialQuery = '', themes }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleAnalyze = async (e?: React.FormEvent, overrideQuery?: string, forceRefresh = false) => {
    if (e) e.preventDefault();
    const q = overrideQuery || query;
    if (!q) return;
    
    if (overrideQuery) setQuery(overrideQuery);
    
    setLoading(true);
    try {
      // Pass forceRefresh to service
      const result = await analyzeMarketData(q, forceRefresh);
      setData(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("分析失败，请检查您的 API 密钥或稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const formatLastUpdated = (timestamp?: number) => {
    if (!timestamp) return '从未';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days === 1) return '昨天';
    if (days < 7) return `${days} 天前`;
    
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header & Search */}
      <div className="flex flex-col flex-shrink-0 gap-6">
         <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
             <div>
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   趋势洞察
                   {data && (
                      <span className="text-xs font-normal px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> 上次更新：{formatLastUpdated(data.meta.lastUpdated)}
                      </span>
                   )}
                 </h2>
                 <p className="text-slate-400 text-sm">Reddit 市场趋势与用户洞察（稳定数据模式）</p>
             </div>
             
             <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Refresh Button - Only visible if we have data or a query to refresh */}
                {data && (
                   <RefreshButton onClick={() => handleAnalyze(undefined, query, true)} loading={loading} />
                )}

                <form onSubmit={(e) => handleAnalyze(e)} className="relative flex-1 md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="输入主题或问题，例如：‘婴儿监视器过热’…"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-24 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm h-[42px]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={14} /> : '分析'}
                    </button>
                </form>
             </div>
         </div>

         {/* Theme Quick Buttons */}
         <div className="space-y-2">
             <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                 <Bookmark size={12} /> 你的兴趣主题
             </h3>
             <div className="flex flex-wrap gap-2">
                 {themes.filter(t => t.isActive).map(theme => (
                     <button
                         key={theme.id}
                         onClick={() => handleAnalyze(undefined, theme.name)}
                         disabled={loading}
                         className="px-4 py-2 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/5 hover:border-blue-500/30 text-sm text-slate-300 hover:text-white transition-all"
                     >
                         {theme.name}
                     </button>
                 ))}
                 {themes.filter(t => t.isActive).length === 0 && (
                     <span className="text-xs text-slate-600 italic py-2">暂无兴趣主题，请前往左侧‘兴趣主题’页面添加。</span>
                 )}
             </div>
         </div>
      </div>

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
            <p className="text-lg animate-pulse">正在从 Reddit 提取 100 条样本数据...</p>
            <p className="text-xs text-slate-500 mt-2">模式: Fixed Stable Retrieval</p>
        </div>
      )}

      {!data && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                 <Activity size={32} />
             </div>
             <p>在上方输入主题开始您的研究。</p>
        </div>
      )}

      {data && !loading && (
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-10 animate-fadeIn custom-scrollbar">
            {/* Top Metrics Cards - Using Strict MetricCard Logic */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard 
                    label="追踪帖子总量（近一年）"
                    value={data.metrics.totalPostsVolume}
                    type="volume"
                    subValue={data.metrics.totalPostsGrowth}
                    colorClass="text-blue-500"
                    icon={<MessageCircle size={18} />}
                />
                <MetricCard 
                    label="活跃话题数量"
                    value={data.metrics.activeTrends}
                    type="count"
                    subValue="Active"
                    colorClass="text-purple-500"
                    icon={<TrendingUp size={18} />}
                />
                <MetricCard 
                    label="互动率"
                    value={data.metrics.engagementRate}
                    type="percentage"
                    colorClass="text-orange-500"
                    icon={<Activity size={18} />}
                />
                <MetricCard 
                    label="当前监控用户数"
                    value={data.metrics.activeUsers}
                    type="volume"
                    colorClass="text-emerald-500"
                    icon={<Users size={18} />}
                />
            </div>

            {/* Main Content Grid - Adjusted for new layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                
                {/* Column 1: Chart & Trends (2 cols wide) */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                    <div className="glass-panel p-6 rounded-xl flex-1 min-h-0 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-6">帖子趋势（近 12 个月）</h3>
                        <div className="flex-1 w-full min-h-0">
                            <TrendChart data={data.topics[0]?.history || []} />
                        </div>
                    </div>
                </div>

                {/* Column 2: Topics List (1 col wide) */}
                <div className="glass-panel p-0 rounded-xl overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <h3 className="font-bold text-white">热门话题</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                        {data.topics.map((topic, i) => (
                            <div 
                                key={i}
                                onClick={() => setSelectedTopic(topic)} 
                                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-blue-500/30 cursor-pointer transition-all group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-slate-200 group-hover:text-blue-300 transition-colors line-clamp-2 text-sm">{topic.title}</h4>
                                    <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 flex-shrink-0 ml-2" />
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                                    <span className="text-emerald-400">+{topic.growth}% 增长</span>
                                    <span className="font-mono bg-black/20 px-1.5 py-0.5 rounded">{topic.volume} posts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 3: Subreddits Panel (1 col wide) - NEW */}
                <div className="h-full">
                     <SubredditPanel subreddits={data.subreddits || []} />
                </div>

            </div>
        </div>
      )}

      {selectedTopic && (
        <TopicDetailModal topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
      )}
    </div>
  );
};