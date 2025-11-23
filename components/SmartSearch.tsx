import React, { useState } from 'react';
import { smartSearchQuery, exportToCSV } from '../services/geminiService';
import { Bot, Link as LinkIcon, Loader2, ArrowRight, Download } from 'lucide-react';

export const SmartSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string, sources: { title: string, url: string }[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await smartSearchQuery(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const data = [
        { Question: query, Answer: result.summary, Sources: result.sources.map(s => s.url).join('; ') }
    ];
    exportToCSV(data, 'smart_search_results');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-4">智能搜索</h2>
        <p className="text-slate-400">输入产品问题、品牌争议或痛点问题，AI 将整合 Reddit 用户观点。</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="请输入你的问题，例如：‘为什么家长抱怨 Momcozy 吸奶器？’"
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-14 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xl shadow-black/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        </button>
      </form>

      {result && (
        <div className="animate-fadeIn space-y-8">
          <div className="flex justify-end">
             <button 
               onClick={handleExport} 
               className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
             >
               <Download size={16} /> 导出 CSV
             </button>
          </div>
          
          <div className="glass-panel p-8 rounded-2xl border border-blue-500/20 shadow-blue-900/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Bot size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">总结回答</h3>
            </div>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                {result.summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">{line}</p>
                ))}
            </div>
          </div>

          {result.sources.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 pl-1">参考来源</h4>
                <div className="grid gap-3 md:grid-cols-2">
                    {result.sources.map((source, idx) => (
                        <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="p-2 bg-black/30 rounded text-slate-400 group-hover:text-blue-400 transition-colors">
                                <LinkIcon size={16} />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-slate-200 truncate group-hover:text-blue-300 transition-colors">{source.title}</div>
                                <div className="text-xs text-slate-500 truncate">{source.url}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};