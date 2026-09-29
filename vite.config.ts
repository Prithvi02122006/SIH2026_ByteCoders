import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function llmProxyPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'llm-proxy-server',
    configureServer(server) {
      const provider = env.LLM_PROVIDER || 'nugen';
      const nugenKey = env.NUGEN_API_KEY;
      const nugenModel = env.NUGEN_ALIGNED_MODEL_ID || env.NUGEN_BASE_MODEL || 'qwen-v2p5-0p5b-instruct';
      const geminiKey = env.GEMINI_API_KEY;
      const xaiKey = env.XAI_API_KEY;

      console.log(
        `[llm-proxy] provider=${provider} nugenKeyPresent=${Boolean(nugenKey)} model=${nugenModel} geminiKeyPresent=${Boolean(geminiKey)}`
      );

      server.middlewares.use('/api/llm', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { task, payload } = JSON.parse(body || '{}');

            let result: any = null;
            let confidence_score: number | undefined = undefined;

            // Generate prompt based on task
            let prompt = '';
            if (task === 'natural_search') {
              prompt = `Extract search filter intentions from this user query: "${payload.query}".
Return JSON with any applicable fields:
{
  "category": "food" | "culture" | "workshops" | "nightlife" | "hidden-gems" | "markets" | "nature",
  "budgetTier": "budget" | "moderate" | "premium",
  "stepFree": true/false,
  "wheelchair": true/false,
  "seniorPaced": true/false,
  "lowSensory": true/false,
  "openNowOnly": true/false,
  "keyword": "string"
}`;
            } else if (task === 'itinerary_narration') {
              prompt = `Write a clean 3-sentence editorial narration walkthrough of this traveler's scheduled stops: ${JSON.stringify(payload.stops)}. Return JSON: {"narration": "string"}`;
            } else if (task === 'adaptation_explanation') {
              prompt = `Rewrite this disruption adaptation notice into a calm, polite, specific one-sentence explanation for the traveler: Type: ${payload.adaptationType}, Stops affected: ${JSON.stringify(payload.affectedStops)}, Default note: "${payload.defaultMessage}". Return JSON: {"explanation": "string"}`;
            } else if (task === 'swap_reasoning') {
              prompt = `Provide a concise 1-sentence reasoning for why replacing "${payload.currentTitle}" with "${payload.candidateTitle}" (${payload.candidateCategory} in ${payload.candidateNeighborhood}) is a harmonious cultural fit. Return JSON: {"reasoning": "string"}`;
            } else if (task === 'vendor_copy_assistant') {
              prompt = `You are an editorial travel editor. Based on the vendor's rough notes: "${payload.roughNotes}" for a ${payload.category} experience in ${payload.neighborhood}, draft a punchy one-line teaser and a 2-3 sentence authentic description without buzzwords or emojis. Return JSON: {"one_line_teaser": "string", "full_description": "string"}`;
            } else if (task === 'demand_insight_synthesis') {
              prompt = `Synthesize these local search demand signals into 3 concise strategic takeaways for local merchants: ${JSON.stringify(payload.signals)}. Return JSON: {"takeaways": ["point 1", "point 2", "point 3"]}`;
            } else if (task === 'digital_twin_weather_insight') {
              prompt = `You are an urban transit & cultural tourism Digital Twin simulation AI for Indian cities.
A traveler is simulating this weather scenario:
- Condition: ${payload.weatherCondition}
- Rainfall Intensity: ${payload.rainfallIntensity} mm/h
- Storm Duration: ${payload.stormDuration} h
- Temperature: ${payload.temperature}°C
- Total Itinerary Cascade Delay: ${payload.totalDelayMinutes} minutes
- Stops: ${JSON.stringify(payload.stopsSummary)}

Provide a concise 2-3 sentence strategic traveler synthesis explaining:
1. The behavioral shift and cascade impact on outdoor vs indoor artisans.
2. Direct transit/route mitigation advice.
Return JSON: {"insight": "string", "recommended_action": "string"}`;
            }

            // Call Provider if key exists
            if (provider === 'nugen' && nugenKey) {
              try {
                const response = await fetch('https://api.nugen.in/api/v3/inference/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${nugenKey}`
                  },
                  body: JSON.stringify({
                    model: nugenModel,
                    messages: [
                      {
                        role: 'system',
                        content: 'You are an intelligent domain-specialized travel concierge. Respond with ONLY valid JSON matching the requested shape. No markdown fences, no formatting notes, no commentary.'
                      },
                      { role: 'user', content: prompt }
                    ],
                    temperature: 0.2
                  })
                });

                if (response.ok) {
                  const data: any = await response.json();
                  confidence_score = data?.confidence_score ?? data?.choices?.[0]?.confidence_score ?? data?.choices?.[0]?.message?.confidence_score;
                  const rawContent = data?.choices?.[0]?.message?.content;
                  if (rawContent) {
                    let cleaned = rawContent.trim();
                    if (cleaned.startsWith('```')) {
                      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
                    }
                    result = JSON.parse(cleaned);
                  }
                } else {
                  console.warn(`[llm-proxy] Nugen returned HTTP ${response.status}:`, await response.text());
                }
              } catch (nugenErr) {
                console.warn('[llm-proxy] Nugen call error:', nugenErr);
              }
            } else if (provider === 'gemini' && geminiKey) {
              const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                  })
                }
              );
              if (response.ok) {
                const data: any = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) result = JSON.parse(text);
              }
            } else if (provider === 'grok' && xaiKey) {
              const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${xaiKey}`
                },
                body: JSON.stringify({
                  model: 'grok-beta',
                  response_format: { type: 'json_object' },
                  messages: [
                    { role: 'system', content: 'You are an intelligent travel concierge. Always output valid JSON.' },
                    { role: 'user', content: prompt }
                  ]
                })
              });
              if (response.ok) {
                const data: any = await response.json();
                const text = data?.choices?.[0]?.message?.content;
                if (text) result = JSON.parse(text);
              }
            }

            // High-quality deterministic fallback if external model threw or returned unparseable JSON
            if (!result) {
              if (task === 'natural_search') {
                const q = (payload.query || '').toLowerCase();
                result = {
                  category: q.includes('food') || q.includes('chaat') ? 'food' : q.includes('craft') || q.includes('pottery') ? 'workshops' : undefined,
                  budgetTier: q.includes('cheap') || q.includes('budget') ? 'budget' : q.includes('luxury') ? 'premium' : undefined,
                  stepFree: q.includes('step') || q.includes('ramp') ? true : undefined,
                  openNowOnly: q.includes('now') || q.includes('tonight') ? true : undefined,
                  keyword: payload.query
                };
              } else if (task === 'itinerary_narration') {
                result = {
                  narration: `Your journey brings together ${payload.stops?.length || 4} verified regional experiences, beginning with traditional morning heritage before progressing into afternoon artisan ateliers and evening cultural venues.`
                };
              } else if (task === 'adaptation_explanation') {
                result = {
                  explanation: payload.defaultMessage || 'Route recalculated in real time to adapt to current schedule constraints.'
                };
              } else if (task === 'swap_reasoning') {
                result = {
                  reasoning: `Selected for geographic proximity in ${payload.candidateNeighborhood || 'the heritage district'} and direct artisan continuity.`
                };
              } else if (task === 'vendor_copy_assistant') {
                result = {
                  one_line_teaser: `Traditional ${payload.category || 'artisan'} workshop guided by master craftspeople in ${payload.neighborhood || 'the historic district'}.`,
                  full_description: `An immersive hands-on session centered on regional tools and historic techniques. Participants work directly with natural materials in a family-run atelier.`
                };
              } else if (task === 'demand_insight_synthesis') {
                result = {
                  takeaways: [
                    'Sustained traveler volume searching for step-free heritage tours in old quarters.',
                    'Peak search activity concentrates around morning craft workshops between 09:30 and 11:30.',
                    'Direct interest in unbundled artisan tastings with low group capacity.'
                  ]
                };
              } else if (task === 'digital_twin_weather_insight') {
                const isWet = (payload.rainfallIntensity || 0) > 10;
                result = {
                  insight: isWet
                    ? `Heavy precipitation creates a cumulative +${payload.totalDelayMinutes || 35}m transit penalty across surface lanes. Open-air heritage courtyards face reduced footfall while covered tea-rooms and pottery ateliers absorb displaced travelers.`
                    : `Stable atmospheric conditions maintain planned arrival intervals across all heritage stops with minimal transit friction.`,
                  recommended_action: isWet
                    ? `Switch road auto-rickshaw segments to elevated/metro corridors and prioritize indoor artisan workshops.`
                    : `Proceed along primary timeline; outdoor stops are fully accessible.`
                };
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ provider, result, confidence_score }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal proxy error' }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL .env values (not just VITE_-prefixed ones) so the server-side
  // LLM proxy can read NUGEN_API_KEY / GEMINI_API_KEY / XAI_API_KEY / LLM_PROVIDER from .env.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 5173,
      watch: {
        ignored: ['**/*.zip', '**/*.log', '**/node_modules/**'],
      },
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        }
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      llmProxyPlugin(env)
    ],
    css: {
      postcss: {
        plugins: []
      }
    }
  };
})
