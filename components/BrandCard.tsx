import React from 'react';
import { BrandInsight } from '../types';
import { SentimentPie } from './Charts';
import { TrendingUp, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';

interface Props {
  data: BrandInsight;
  onCompare?: (brand: BrandInsight) => void;
}

export const BrandCard: React.FC<Props> = ({ data, onCompare }) => {
  return (
    <div className="glass-panel rounded-xl p-6 border border-white/5 hover:border-blue-500/30 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h3 className="text-xl font-bold text-white mb-1">{data.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="text-slate-500">提及次数:</span>
                <span className="font-mono text-slate-200">{data.mentions}</span>
            </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-sm font-medium">
          <TrendingUp size={14} />
          +{data.yoyGrowth}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="h-32 relative">
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="text-center">
                   <span className="text-xs text-slate-500 block">正面情绪</span>
                   <span className="text-lg font-bold text-emerald-400">{data.sentiment.pos}%</span>
                </div>
            </div>
            <SentimentPie data={data.sentiment} />
        </div>
        <div className="space-y-3 text-sm">
            <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-1 font-medium">
                    <ThumbsUp size={14} /> 热门好评
                </div>
                <p className="text-slate-400 text-xs line-clamp-2">{data.topPraises[0]}</p>
            </div>
            <div>
                <div className="flex items-center gap-2 text-red-400 mb-1 font-medium">
                    <ThumbsDown size={14} /> 主要投诉
                </div>
                <p className="text-slate-400 text-xs line-clamp-2">{data.topComplaints[0]}</p>
            </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">代表性帖子</h4>
        {data.examplePosts.slice(0, 2).map((post, idx) => (
            <a 
                key={idx} 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-2 rounded bg-black/20 hover:bg-black/40 transition-colors group/link"
            >
                <div className="flex justify-between items-start">
                    <p className="text-sm text-slate-300 line-clamp-1 font-medium group-hover/link:text-blue-400 transition-colors">{post.title}</p>
                    <ExternalLink size={12} className="text-slate-600 mt-1" />
                </div>
            </a>
        ))}
      </div>

      {onCompare && (
        <button 
            onClick={() => onCompare(data)}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
            对比品牌
        </button>
      )}
    </div>
  );
};