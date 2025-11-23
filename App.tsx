import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Search, Users, FolderHeart, Github } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { SmartSearch } from './components/SmartSearch';
import { MyThemes } from './components/MyThemes';
import { Competitors } from './components/Competitors';
import { AnalysisResult, Page, Theme } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  // Persistent Themes State
  const [themes, setThemes] = useState<Theme[]>(() => {
    const saved = localStorage.getItem('reddit-insight-themes');
    return saved ? JSON.parse(saved) : [];
  });

  // Dashboard Initial Query State
  const [dashboardQuery, setDashboardQuery] = useState('');

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reddit-insight-themes', JSON.stringify(themes));
  }, [themes]);

  const handleAnalyzeTheme = (themeName: string) => {
    setDashboardQuery(themeName);
    setActivePage('dashboard');
  };

  const renderContent = () => {
    if (apiKeyMissing) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-2">缺少 API 密钥</h2>
            <p className="text-slate-300 mb-4">
              请将您的 Gemini API 密钥添加到 <code>.env</code> 文件或环境变量中的 <code>API_KEY</code>。
            </p>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard data={currentAnalysis} setData={setCurrentAnalysis} initialQuery={dashboardQuery} themes={themes} />;
      case 'themes':
        return <MyThemes themes={themes} setThemes={setThemes} onAnalyzeTheme={handleAnalyzeTheme} />;
      case 'smart-search':
        return <SmartSearch />;
      case 'competitors':
        return <Competitors data={currentAnalysis} />;
      default:
        return <Dashboard data={currentAnalysis} setData={setCurrentAnalysis} initialQuery={dashboardQuery} themes={themes} />;
    }
  };

  const NavItem = ({ page, icon: Icon, label }: { page: Page, icon: any, label: string }) => (
    <button
      onClick={() => setActivePage(page)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activePage === page 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0B1120] flex flex-col flex-shrink-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
             <Github size={24} />
             <span className="font-bold text-xl text-white tracking-tight">RedditInsight</span>
          </div>
          <p className="text-xs text-slate-500">Gemini 驱动的分析工具</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem page="dashboard" icon={LayoutDashboard} label="总览" />
          <NavItem page="themes" icon={FolderHeart} label="兴趣主题" />
          <NavItem page="competitors" icon={Users} label="品牌对比" />
          <NavItem page="smart-search" icon={Search} label="智能搜索" />
        </nav>

        <div className="p-6 border-t border-white/5">
            <div className="glass-panel p-4 rounded-lg border border-white/5">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">系统状态</h4>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    已连接 Gemini 2.5 Flash
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 flex-1 overflow-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;