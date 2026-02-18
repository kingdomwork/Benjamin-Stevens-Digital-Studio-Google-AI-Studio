
export type ContentType = "Video" | "Carousel" | "Static Post";

export type ScriptPreset = 
  | "Educational"
  | "Controversial / Hot Take"
  | "Storytelling"
  | "Listicle"
  | "Behind the Scenes"
  | "Q&A"
  | "Direct Sales";

export type CreativeDirection = 
  | "Professional & Corporate"
  | "Viral & High Energy"
  | "Warm & Community Focused"
  | "Witty & Edgy"
  | "Minimalist";

export interface Brand {
  id: number;
  name: string;
}

export interface BrandKnowledge {
  id: number;
  brand_id: number;
  content: string;
  created_at: string;
}

export interface ScriptRequestData {
  brand: string;
  preset: ScriptPreset;
  creativeDirection: CreativeDirection;
  sourceText: string;
  instructions: string;
}

export interface ScriptResult {
  strategy: string;
  longFormScript: string;
  scripts: string[]; // List of shorts/captions
}

export interface GenerationState {
  status: 'idle' | 'generating' | 'completed' | 'error';
  message?: string;
  result?: ScriptResult;
  error?: string;
}

export interface ScriptHistoryItem {
  id: number;
  created_at: string;
  brand: string;
  source_text: string;
  result: ScriptResult;
  is_used: boolean;
}

export interface ResearchCandidate {
  title: string;
  link: string;
  platform: string;
  engagement_signals: string;
  transferable_technique: string;
}

export interface ResearchResult {
  query: string;
  contentType: ContentType;
  generated_prompt?: string;
  candidates?: ResearchCandidate[];
  market_analysis?: string;
  strategy_suggestion?: string;
}