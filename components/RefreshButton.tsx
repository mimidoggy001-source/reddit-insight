import React from 'react';
import { RotateCw } from 'lucide-react';

interface Props {
  onClick: () => void;
  loading: boolean;
}

export const RefreshButton: React.FC<Props> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed group h-[42px]"
    >
      <RotateCw 
        size={16} 
        className={`transition-transform duration-700 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} 
      />
      <span>刷新数据</span>
    </button>
  );
};