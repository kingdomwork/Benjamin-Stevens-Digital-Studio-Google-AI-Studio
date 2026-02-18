// Follow this setup guide to integrate the SDK: https://supabase.com/docs/guides/functions

declare const Deno: any;

const CEREBRAS_API_KEY = "csk-yyht33w2n9e3cw3fmp6erktxe2w56456tr8crvdvm28tmyjc";
const SERP_API_KEY = "694175e6871350996f0a04ee41ef7c632ef94fa12aa40725a94b78e708f999bc";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight Request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Parse Request Body Safely
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse JSON body:", e);
      throw new Error("Invalid JSON payload or payload too large.");
    }

    const { action, payload } = body;
    console.log(`[API] Processing action: ${action}`);

    let result;

    switch (action) {
      case 'generate-scripts': {
        const { brand, preset, creativeDirection, sourceText, instructions } = payload;
        
        const endpoint = `https://api.cerebras.ai/v1/chat/completions`;
        
        const systemPrompt = `
          You are an expert social media scriptwriter for Benjamin Stevens Estate Agents.
          
          Your goal is to convert the user's source text into:
          1. A set of engaging, viral-style YouTube Shorts scripts.
          2. A comprehensive Long-form Video Essay script.
          
          Brand Identity: ${brand}
          Style: ${creativeDirection}
          Format: ${preset}
          
          TASK:
          1. Analyze the source text to identify key hooks, valuable information, and narrative structure.
          2. Generate ONE detailed Long-form Video Essay script. This should be written in paragraph form (spoken word style), suitable for a 3-5 minute video. It should flow naturally as a cohesive narrative.
          3. Generate exactly 5 distinct YouTube Shorts scripts based on key points from the content.
          4. Include a brief "Strategy Note" for why these scripts work.
          
          OUTPUT FORMAT:
          Return a valid JSON object with the following structure:
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
          ${sourceText}
          
          Specific Instructions:
          ${instructions}
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
          console.error(`Cerebras API Error (${response.status}):`, errorText);
          throw new Error(`Cerebras API Failed: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          throw new Error("Cerebras returned no content.");
        }
        
        try {
          result = JSON.parse(content);
        } catch (e) {
          console.error("Failed to parse JSON from Cerebras:", content);
          result = {
            strategy: "Strategy generated (raw text fallback)",
            longFormScript: "Long form generation failed in fallback mode.",
            scripts: [content]
          };
        }
        break;
      }

      case 'research-content': {
        const { query } = payload;
        
        // 1. Search with SerpApi
        const serpUrl = new URL("https://serpapi.com/search.json");
        serpUrl.searchParams.append("engine", "google");
        serpUrl.searchParams.append("q", query);
        serpUrl.searchParams.append("api_key", SERP_API_KEY);
        serpUrl.searchParams.append("num", "10"); // Top 10 results

        console.log(`[API] Fetching SerpApi for query: ${query}`);
        const serpResponse = await fetch(serpUrl.toString());
        if (!serpResponse.ok) {
           const errText = await serpResponse.text();
           throw new Error(`SerpApi Failed (${serpResponse.status}): ${errText}`);
        }
        
        const serpData = await serpResponse.json();
        if (serpData.error) {
           throw new Error(`SerpApi Error: ${serpData.error}`);
        }
        
        const organicResults = serpData.organic_results?.map((r: any) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet
        })) || [];
        
        const videoResults = serpData.video_results?.map((r: any) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet
        })) || [];

        const searchContext = JSON.stringify({ organic: organicResults, videos: videoResults });
        console.log(`[API] Search context size: ${searchContext.length} chars`);

        // 2. Analyze with Cerebras
        const endpoint = `https://api.cerebras.ai/v1/chat/completions`;
        const systemPrompt = `
          You are a Viral Content Analyst for a Digital Marketing Agency.
          
          Your Task:
          1. Review the provided search results for the topic: "${query}".
          2. Identify content that appears to be high-performing, viral, or authoritative based on the titles and snippets.
          3. Extract specific "Transferable Techniques" (hooks, formats, styles) that we can replicate.
          4. Create a Market Analysis Report.

          OUTPUT JSON FORMAT:
          {
            "candidates": [
              { 
                "title": "Title of the content found", 
                "link": "URL", 
                "platform": "YouTube/Instagram/Blog/News",
                "engagement_signals": "Why this seems popular (e.g. 'Viral keywords', 'Top ranking')", 
                "transferable_technique": "Specific technique we can copy (e.g. 'Uses shock hook', 'Listicle format')" 
              }
            ],
            "market_analysis": "A concise paragraph summarizing the current trend for this topic.",
            "strategy_suggestion": "A recommended angle for our own scripts based on this research."
          }
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
              { role: "user", content: searchContext }
            ],
            temperature: 0.7,
            max_tokens: 8192,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) throw new Error("Cerebras Analysis Failed");
        const aiData = await response.json();
        let content = aiData.choices?.[0]?.message?.content;
        
        console.log("[API] Raw AI response:", content ? content.substring(0, 100) + "..." : "null");

        // Robust JSON Extraction
        if (content) {
            // Remove markdown code blocks if present
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Try to find the first '{' and last '}'
            const firstOpen = content.indexOf('{');
            const lastClose = content.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1) {
                content = content.substring(firstOpen, lastClose + 1);
            }
        }
        
        try {
          result = {
            ...JSON.parse(content),
            query: query
          };
        } catch (e) {
          console.error("JSON Parse Error:", e);
          // Fallback
          result = {
            candidates: [],
            market_analysis: "Failed to parse AI response. Raw output available.",
            strategy_suggestion: content || "No content generated.",
            query: query
          };
        }
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // 3. Return Success Response
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    // 4. Global Error Handler
    console.error(`[API] Error:`, error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected server error occurred." 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

export {};