
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  type: 'volume' | 'percentage' | 'count';
  subValue?: number | string; // Growth or status
  subLabel?: string;
  colorClass: string; // e.g. text-blue-500
  icon: React.ReactNode;
}

export const MetricCard: React.FC<Props> = ({ label, value, type, subValue, subLabel, colorClass, icon }) => {
  
  const formatValue = (val: number, type: 'volume' | 'percentage' | 'count') => {
    if (type === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    if (type === 'volume') {
      if (val < 10000) return val.toLocaleString(); // 2,850
      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
      return (val / 1000).toFixed(1) + 'k'; // 35k
    }
    // type === 'count'
    return val.toLocaleString();
  };

  const displayValue = formatValue(value, type);

  return (
    <div className={`glass-panel p-4 rounded-xl border-l-4 ${colorClass.replace('text-', 'border-')}`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
           <div className={colorClass}>{icon}</div>
        </div>
        {subValue !== undefined && (
          <div className={`text-xs font-bold flex items-center gap-1 ${
             typeof subValue === 'number' && subValue > 0 ? 'text-emerald-400' : 'text-slate-400'
          }`}>
             {typeof subValue === 'number' && subValue > 0 && <TrendingUp size={12} />}
             {typeof subValue === 'number' && subValue < 0 && <TrendingDown size={12} />}
             {typeof subValue === 'string' ? subValue : `${subValue > 0 ? '+' : ''}${subValue}%`}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{displayValue}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
};
