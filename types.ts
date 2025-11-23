
export interface RedditPost {
  title: string; // Original English Title
  url: string;
  snippet: string; // Original English Snippet
  summary_cn: string; // Chinese Summary
  subreddit: string;
  upvotes: number;
  comments: number;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface HistoryPoint {
  month: string;
  value: number;
}

export interface UserPersona {
  type: string;       // 用户类型
  motivation: string; // 典型动机
  complaints: string; // 主要抱怨点
  scenario: string;   // 使用场景
  severity: string;   // 痛点严重程度 description
  tone: string;       // 典型语气特点
}

export interface PainRadarData {
  subject: string; // Axis name
  A: number; // Value
  fullMark: number;
}

export interface Topic {
  title: string; // English
  growth: number; // percentage
  volume: number;
  sentiment: number; // 0-100 score
  history: HistoryPoint[];
  painPoints?: PainPoint[]; 
  brands?: string[]; 
  userPersona?: UserPersona; 
  topPosts?: RedditPost[];   
}

export interface PainPoint {
  id: string;
  title: string; // Chinese
  severity: number; // 0-25
  frequency: number; // 0-25
  recency: number; // 0-25
  unmetNeed: number; // 0-25
  totalScore: number; // 0-100
  quotes: string[]; // Chinese or English
}

export interface BrandSentiment {
  pos: number;
  neu: number;
  neg: number;
}

export interface BrandInsight {
  name: string;
  mentions: number;
  yoyGrowth: number;
  sentiment: BrandSentiment;
  topComplaints: string[];
  topPraises: string[];
  examplePosts: RedditPost[];
}

export interface SubredditInsight {
  name: string; // English, e.g. r/Parenting
  memberCount: number; // Estimated
  postVolume: number; // Out of the 100 sampled
  percentage: number; // % share
  history: HistoryPoint[];
  topTopics: string[]; // English
  brands: string[];
  painPoints: PainRadarData[];
  topPosts: RedditPost[];
}

export interface DashboardMetrics {
  totalPostsGrowth: number; // Percentage growth
  totalPostsVolume: number; // Numeric volume (e.g. 12500)
  activeTrends: number;     // Count of topics with >0 growth
  engagementRate: number;   // Percentage (e.g. 8.5)
  activeUsers: number;      // Estimated active users
}

export interface AnalysisResult {
  meta: {
    fetchedPostCount: number;
    fetchMode: string;
    lastUpdated?: number;
  };
  metrics: DashboardMetrics;
  topics: Topic[];
  subreddits: SubredditInsight[];
  painPoints: PainPoint[];
  brands: BrandInsight[];
}

export interface Theme {
  id: string;
  name: string;
  keywords: string[];
  isActive: boolean;
  lastAnalyzed?: string;
}

export type Page = 'dashboard' | 'themes' | 'competitors' | 'smart-search';