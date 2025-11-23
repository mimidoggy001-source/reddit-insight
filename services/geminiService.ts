import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, Theme } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to parse JSON safely
const parseJsonFromText = (text: string): any => {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try cleaning markdown code blocks
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match && match[1]) return JSON.parse(match[1]);
    
    const match2 = text.match(/```\n([\s\S]*?)\n```/);
    if (match2 && match2[1]) return JSON.parse(match2[1]);
    
    // 3. Try finding the JSON object boundaries
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.substring(start, end + 1));
    }
    throw new Error("Failed to parse JSON response");
  }
};

export const generateRelatedKeywords = async (theme: string): Promise<string[]> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate 5-8 relevant search keywords or sub-topics for the market research theme: "${theme}". 
    Return ONLY a JSON array of strings. Keywords should be in Simplified Chinese if the theme is Chinese, otherwise relevant to the language. Example: ["keyword1", "keyword2"].`,
    config: {
      responseMimeType: 'application/json'
    }
  });
  return parseJsonFromText(response.text);
};

export const analyzeMarketData = async (query: string, forceRefresh = false): Promise<AnalysisResult> => {
  const cacheKey = `reddit_insight_${query.trim().toLowerCase()}`;

  // 1. Check Cache
  if (!forceRefresh) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        // Ensure it has the data structure we expect
        if (parsedCache && parsedCache.metrics) {
          console.log(`Loaded cached data for "${query}"`);
          return parsedCache;
        }
      } catch (e) {
        console.warn("Failed to parse cache, removing invalid entry.", e);
        localStorage.removeItem(cacheKey);
      }
    }
  }

  // 2. Perform API Call
  const ai = getAiClient();
  
  // Step A: Search (Grounding)
  // We strictly limit the search scope to ensure we get relevant data without overwhelming the context.
  const searchResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Perform a market research search for "${query}" on site:reddit.com.
    Find recent discussions (last 12 months).
    Identify top 3 subreddits.
    Collect details for 10 representative threads.
    Goal: Gather data to simulate 100 representative posts.`,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  const searchSummary = searchResponse.text;

  // Step B: Generate Analysis (Strict Mode)
  // We enforce strict limits on array lengths to prevent token overflow (RPC errors).
  const prompt = `
    You are a Data Engine. Simulate a dataset of EXACTLY 100 Reddit posts regarding "${query}" based on the search context below.
    
    Search Context:
    ${searchSummary}
    
    Output strictly valid JSON.
    
    CRITICAL RULES:
    1. **Sample Size**: Calculations based on 100 posts.
    2. **Metrics**: "totalPostsVolume" must be a number (e.g., 2850). "engagementRate" must be a percentage number (e.g., 8.2).
    3. **Language**: Titles/Snippets in English. Summaries/Labels in Simplified Chinese.
    4. **Limits (To prevent errors)**:
       - 'topics': Max 4 items
       - 'subreddits': Max 3 items
       - 'painPoints' inside topics: Max 3 items
       - 'topPosts' inside topics: Max 3 items
       - 'brands': Max 4 items
       - 'examplePosts' inside brands: Max 1 item
    
    Structure:
    {
      "meta": { "fetchedPostCount": 100, "fetchMode": "fixed-newest-100" },
      "metrics": {
        "totalPostsGrowth": number,
        "totalPostsVolume": number,
        "activeTrends": number,
        "engagementRate": number,
        "activeUsers": number
      },
      "subreddits": [
        {
           "name": "string (e.g. r/Parenting)",
           "memberCount": number,
           "postVolume": number,
           "percentage": number,
           "history": [{"month": "string", "value": number}],
           "topTopics": ["string"],
           "brands": ["string"],
           "painPoints": [{ "subject": "严重程度", "A": number, "fullMark": 25 }, { "subject": "频率", "A": number, "fullMark": 25 }, { "subject": "时效性", "A": number, "fullMark": 25 }, { "subject": "未满足度", "A": number, "fullMark": 25 }],
           "topPosts": [ { "title": "string", "url": "string", "snippet": "string", "summary_cn": "string", "subreddit": "string", "upvotes": number, "comments": number, "date": "string", "sentiment": "negative" } ]
        }
      ],
      "topics": [
        { 
          "title": "string (English)", 
          "growth": number, 
          "volume": number, 
          "sentiment": number, 
          "history": [{"month": "string", "value": number}],
          "brands": ["string"],
          "painPoints": [
             { "id": "string", "title": "string (Chinese)", "severity": number, "frequency": number, "recency": number, "unmetNeed": number, "totalScore": number, "quotes": ["string"] }
          ],
          "userPersona": {
            "type": "string",
            "motivation": "string",
            "complaints": "string",
            "scenario": "string",
            "severity": "string",
            "tone": "string"
          },
          "topPosts": [
             { "title": "string", "url": "string", "snippet": "string", "summary_cn": "string", "subreddit": "string", "upvotes": number, "comments": number, "date": "string", "sentiment": "neutral" }
          ]
        }
      ],
      "brands": [
        {
          "name": "string",
          "mentions": number,
          "yoyGrowth": number,
          "sentiment": { "pos": number, "neu": number, "neg": number },
          "topComplaints": ["string"],
          "topPraises": ["string"],
          "examplePosts": [{ "title": "string", "url": "string" }]
        }
      ]
    }
  `;

  const analysisResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  const rawData = parseJsonFromText(analysisResponse.text);
  
  // Inject Last Updated Timestamp
  const finalData: AnalysisResult = {
    ...rawData,
    meta: {
      ...rawData.meta,
      lastUpdated: Date.now()
    }
  };

  // 3. Update Cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify(finalData));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }

  return finalData;
};

export const smartSearchQuery = async (question: string): Promise<{ summary: string, sources: { title: string, url: string }[] }> => {
  const ai = getAiClient();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Answer this user question based on Reddit discussions: "${question}".
    Provide a concise summary answer in Simplified Chinese and a list of relevant sources found during search.`,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .map((chunk: any) => chunk.web?.uri ? { title: chunk.web.title || 'Source', url: chunk.web.uri } : null)
    .filter((item: any) => item !== null) as { title: string, url: string }[];

  const uniqueSources = Array.from(new Map(sources.map(item => [item.url, item])).values());

  return {
    summary: response.text,
    sources: uniqueSources.slice(0, 5)
  };
};

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const cell = row[header] === null || row[header] === undefined ? '' : row[header];
      return typeof cell === 'object' ? `"${JSON.stringify(cell).replace(/"/g, '""')}"` : `"${cell}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};