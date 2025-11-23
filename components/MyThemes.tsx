import React, { useState } from 'react';
import { Theme } from '../types';
import { generateRelatedKeywords } from '../services/geminiService';
import { Plus, Trash2, Power, Loader2, LayoutDashboard } from 'lucide-react';

interface Props {
  themes: Theme[];
  setThemes: (themes: Theme[]) => void;
  onAnalyzeTheme: (themeName: string) => void;
}

export const MyThemes: React.FC<Props> = ({ themes, setThemes, onAnalyzeTheme }) => {
  const [newThemeName, setNewThemeName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTheme = async () => {
    if (!newThemeName.trim()) return;
    setLoading(true);
    try {
      const keywords = await generateRelatedKeywords(newThemeName);
      const newTheme: Theme = {
        id: Date.now().toString(),
        name: newThemeName,
        keywords,
        isActive: true,
      };
      setThemes([...themes, newTheme]);
      setNewThemeName('');
    } catch (error) {
      console.error("Failed to generate keywords", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setThemes(themes.filter(t => t.id !== id));
  };

  const handleToggle = (id: string) => {
    setThemes(themes.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">兴趣主题</h2>
          <p className="text-slate-400">管理你关注的主题与关键词。</p>
        </div>
      </div>

      {/* Add Theme Panel */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">添加新主题</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              placeholder="请输入要追踪的主题…"
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTheme()}
            />
            <button
              onClick={handleAddTheme}
              disabled={loading || !newThemeName.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
              添加主题
            </button>
          </div>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map(theme => (
          <div key={theme.id} className={`glass-panel rounded-xl p-6 border transition-all ${theme.isActive ? 'border-white/5 opacity-100' : 'border-transparent opacity-60 grayscale'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{theme.name}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleToggle(theme.id)}
                  className={`p-2 rounded-lg transition-colors ${theme.isActive ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-600 bg-slate-800'}`}
                  title={theme.isActive ? "停用" : "启用"}
                >
                  <Power size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(theme.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="删除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">关键词</span>
              <div className="flex flex-wrap gap-2">
                {theme.keywords.map((kw, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300 border border-white/5">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
               <div className="text-xs text-slate-500">
                  上次更新：{theme.lastAnalyzed || '从未'}
               </div>
               <button
                 onClick={() => onAnalyzeTheme(theme.name)}
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-sm font-medium"
               >
                 <LayoutDashboard size={16} />
                 查看概览
               </button>
            </div>
          </div>
        ))}

        {themes.length === 0 && !loading && (
           <div className="col-span-full text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
              <p className="text-slate-500">暂无兴趣主题，请在上方添加。</p>
           </div>
        )}
      </div>
    </div>
  );
};