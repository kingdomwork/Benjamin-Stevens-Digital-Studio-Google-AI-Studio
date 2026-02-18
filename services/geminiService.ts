import { ScriptRequestData, ScriptResult, ResearchResult, ContentType } from "../types";

// API Keys for Personal Client-Side Use
const CEREBRAS_API_KEY = "csk-yyht33w2n9e3cw3fmp6erktxe2w56456tr8crvdvm28tmyjc";

/**
 * Helper to clean JSON strings returned by LLMs (removes markdown code blocks)
 */
const cleanJsonOutput = (content: string): string => {
  let cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstOpen = cleaned.indexOf('{');
  const lastClose = cleaned.lastIndexOf('}');
  if (firstOpen !== -1 && lastClose !== -1) {
    cleaned = cleaned.substring(firstOpen, lastClose + 1);
  }
  return cleaned;
};

// Generate Deep Research Prompt using Cerebras (Llama 3.1)
export const performDeepResearch = async (query: string, contentType: ContentType): Promise<ResearchResult> => {
  try {
    console.log(`[Research] Generating Prompt for: "${query}" [${contentType}]`);

    const systemPrompt = `
      You are a World-Class AI Prompt Engineer specializing in Digital Marketing and Real Estate.
      
      Your Goal:
      Create a highly sophisticated, deep-dive research prompt that a user can paste into Google Gemini Advanced (or another reasoning model).
      
      The user wants to research the topic: "${query}"
      For the content format: "${contentType}"
      Context: Benjamin Stevens Estate Agents (UK based).
      
      Your generated prompt must instruct the AI to:
      1. Perform a deep web search for viral trends, recent news, and high-performing content related to the topic.
      2. Analyze the psychological triggers and hooks used in successful examples.
      3. Identify specific "Transferable Techniques" that a UK Estate Agent can replicate.
      4. Provide concrete examples of video/post structures.
      5. Output a strategy for ${contentType}.

      OUTPUT JSON FORMAT (Strictly):
      {
        "generated_prompt": "The full, detailed text of the prompt to be pasted into Gemini...",
        "strategy_suggestion": "A brief explanation of why this prompt is effective."
      }
    `;

    const cerebrasResponse = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3.1-8b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a deep research prompt for: ${query}` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })
    });

    if (!cerebrasResponse.ok) throw new Error(`Cerebras API Failed`);

    const aiData = await cerebrasResponse.json();
    let content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI returned empty content");

    const result = JSON.parse(cleanJsonOutput(content));
    
    return { ...result, query, contentType };

  } catch (err: any) {
    console.error("Deep Research Prompt Generation Failed:", err);
    throw new Error(err.message || "Prompt generation failed. Please try again.");
  }
};

// Generate Scripts using Cerebras (Llama 3.1)
export const generateScripts = async (data: ScriptRequestData): Promise<ScriptResult> => {
  try {
    const endpoint = `https://api.cerebras.ai/v1/chat/completions`;
        
    const systemPrompt = `
      You are an expert social media scriptwriter for Benjamin Stevens Estate Agents.
      
      CRITICAL BRAND CONTEXT:
      - "Benjamin Stevens Estate Agents" (The Hub Model): Designed for agents who want independence but DO NOT want to handle administrative tasks. The "boss" or support team handles the admin/back-office.
      - "eXp" (The Self-Employed Model): Designed for agents who want complete independence and are happy to handle their own admin and operations.

      STRICT STRUCTURE (Must be followed for EVERY script):
      1. PROBLEM: Present an existing, relatable problem the audience faces.
      2. EXPLAIN: Agitate the pain point. Explain WHY it is a problem and the consequences of ignoring it.
      3. SOLUTION: Provide a clear, educational solution or answer. DO NOT promote the agency yet. Pure value.
      4. BACK TO COMPANY: Link the solution back to the specific brand selected (${data.brand}) and how their specific model solves the admin/independence balance.

      STRICT LENGTH REQUIREMENTS:
      - Long-form Script: MUST be approximately 1500 words. Detailed, spoken-word essay.
      - Short-form Scripts: MUST be approximately 500 words each. Fast-paced.

      Brand Identity: ${data.brand}
      Style: ${data.creativeDirection}
      Format: ${data.preset}
      
      TASK:
      1. Analyze the source text to identify key hooks, valuable information, and narrative structure.
      2. Generate ONE detailed Long-form Video Essay script (approx 1500 words). It should flow naturally as a cohesive narrative.
      3. Generate exactly 5 distinct Short-form scripts (approx 500 words each).
      4. Include a brief "Strategy Note" for why these scripts work.
      
      OUTPUT FORMAT (Strict JSON):
      {
        "strategy": "A brief paragraph explaining the strategy used.",
        "longFormScript": "The full text of the long-form video essay...",
        "scripts": [
          "Shorts Script 1 text...",
          "Shorts Script 2 text...",
          "Shorts Script 3 text...",
          "Shorts Script 4 text...",
          "Shorts Script 5 text..."
        ]
      }
    `;

    const userPrompt = `
      Source Content: 
      ${data.sourceText}
      
      Specific Instructions:
      ${data.instructions}
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3.1-8b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8192,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cerebras API Failed: ${errorText}`);
    }

    const resData = await response.json();
    const content = resData.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("Cerebras returned no content.");
    
    return JSON.parse(cleanJsonOutput(content));

  } catch (error: any) {
    console.error("Script Generation Error:", error);
    throw new Error(error.message || "Script generation failed.");
  }
};