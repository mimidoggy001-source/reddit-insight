
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { HistoryPoint, BrandSentiment } from '../types';

const COLORS = ['#10b981', '#64748b', '#ef4444']; // Green, Gray, Red

interface TrendChartProps {
  data: HistoryPoint[];
  color?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, color = "#06b6d4" }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis 
          dataKey="month" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
          itemStyle={{ color: '#f1f5f9' }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }} 
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface SentimentPieProps {
  data: BrandSentiment;
}

export const SentimentPie: React.FC<SentimentPieProps> = ({ data }) => {
  const chartData = [
    { name: 'Positive', value: data.pos },
    { name: 'Neutral', value: data.neu },
    { name: 'Negative', value: data.neg },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
           contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface PainScoreBarProps {
  severity: number;
  frequency: number;
  recency: number;
  unmetNeed: number;
}

export const PainScoreBar: React.FC<PainScoreBarProps> = ({ severity, frequency, recency, unmetNeed }) => {
  const data = [
    { name: 'Sev', value: severity, fill: '#f87171' },
    { name: 'Freq', value: frequency, fill: '#fbbf24' },
    { name: 'Rec', value: recency, fill: '#60a5fa' },
    { name: 'Need', value: unmetNeed, fill: '#a78bfa' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip 
          cursor={{fill: 'rgba(255,255,255,0.05)'}}
          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface PainRadarChartProps {
  data: {
    subject: string;
    A: number; // Severity
    B: number; // Frequency
    C: number; // Recency
    D: number; // Unmet Need
    fullMark: number;
  }[];
}

export const PainRadarChart: React.FC<PainRadarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 25]} tick={false} axisLine={false} />
        <Radar
          name="Pain Profile"
          dataKey="A"
          stroke="#f87171"
          strokeWidth={2}
          fill="#f87171"
          fillOpacity={0.3}
        />
        <Tooltip 
           contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
