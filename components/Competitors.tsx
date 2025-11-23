import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { BrandCard } from './BrandCard';
import { SentimentPie } from './Charts';
import { Download, CheckSquare, Square } from 'lucide-react';
import { exportToCSV } from '../services/geminiService';

interface Props {
  data: AnalysisResult | null;
}

export const Competitors: React.FC<Props> = ({ data }) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  if (!data) {
    return (
      <div className="p-6 text-center py-20">
         <div className="inline-block p-4 rounded-full bg-white/5 mb-4 text-slate-500">
            <CheckSquare size={32} />
         </div>
         <h2 className="text-xl font-bold text-white mb-2">暂无分析数据</h2>
         <p className="text-slate-400">请先在“总览”页面进行主题分析以识别品牌。</p>
      </div>
    );
  }

  const toggleBrand = (name: string) => {
    if (selectedBrands.includes(name)) {
        setSelectedBrands(selectedBrands.filter(b => b !== name));
    } else {
        if (selectedBrands.length < 5) {
            setSelectedBrands([...selectedBrands, name]);
        }
    }
  };

  const compareList = data.brands.filter(b => selectedBrands.includes(b.name));

  const handleExport = () => {
    const exportData = data.brands.map(b => ({
        品牌: b.name,
        提及次数: b.mentions,
        同比增长: b.yoyGrowth,
        正面情绪: b.sentiment.pos,
        中性情绪: b.sentiment.neu,
        负面情绪: b.sentiment.neg,
        主要投诉: b.topComplaints[0]
    }));
    exportToCSV(exportData, 'brand_competitor_analysis');
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">品牌对比</h2>
                <p className="text-slate-400">比较品牌情绪、声量及消费者认知。</p>
            </div>
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
            >
                <Download size={18} /> 导出 CSV
            </button>
        </div>

        {/* Brand Selection List */}
        <div className="glass-panel p-4 rounded-xl overflow-x-auto flex gap-4 items-center min-h-[80px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-2">选择对比 (最多 5 个)</span>
            {data.brands.map((brand, i) => (
                <button
                    key={i}
                    onClick={() => toggleBrand(brand.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                        selectedBrands.includes(brand.name) 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                >
                    {selectedBrands.includes(brand.name) ? <CheckSquare size={14} /> : <Square size={14} />}
                    {brand.name}
                </button>
            ))}
        </div>

        {compareList.length > 0 && (
            <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-medium">品牌</th>
                            <th className="p-4 font-medium">提及次数 (近 12 个月)</th>
                            <th className="p-4 font-medium">同比增长</th>
                            <th className="p-4 font-medium">情绪分布</th>
                            <th className="p-4 font-medium">主要投诉</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                        {compareList.map((brand, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white text-lg">{brand.name}</td>
                                <td className="p-4 font-mono text-blue-300">{brand.mentions}</td>
                                <td className="p-4 text-emerald-400">+{brand.yoyGrowth}%</td>
                                <td className="p-4 w-48 h-24">
                                    <div className="h-full w-full">
                                        <SentimentPie data={brand.sentiment} />
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-red-300/80 italic truncate max-w-xs">{brand.topComplaints[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.brands.map((brand, i) => (
                <BrandCard key={i} data={brand} />
            ))}
        </div>
    </div>
  );
};