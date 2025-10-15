// Vercel serverless endpoint for AI chat: /api/chat
// Groq API integration with API key stored securely on backend

let cache = {
  messages: new Map(),
  ts: new Map()
};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache per conversation

module.exports = async function (req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Chat API called:', { 
      body: req.body, 
      env: process.env.GROQ_API_KEY ? 'KEY_EXISTS' : 'NO_KEY',
      keyLength: process.env.GROQ_API_KEY?.length || 0
    });
    const { message, conversationId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check cache
    const cacheKey = conversationId || 'default';
    const now = Date.now();
    const cachedTs = cache.ts.get(cacheKey);
    
    if (cachedTs && now - cachedTs < CACHE_TTL_MS) {
      const cachedMessages = cache.messages.get(cacheKey);
      if (cachedMessages && cachedMessages.length > 0) {
        // Return cached response for same question
        const lastResponse = cachedMessages[cachedMessages.length - 1];
        if (lastResponse.role === 'assistant') {
          return res.json({ 
            cached: true, 
            response: lastResponse.content 
          });
        }
      }
    }

    // Call Groq API
    const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.EXPO_PUBLIC_GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.error('API key missing!');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Calling Groq API with message:', message.substring(0, 50));
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Sen Kurmatik finans platformunun AI asistanısın. Hisse senedi, döviz, kripto ve finans konularında yardımcı oluyorsun. Kısa ve öz yanıtlar ver. Türkçe konuş.' 
          },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });
      return res.status(response.status).json({ 
        error: 'AI service error', 
        details: errorText 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Üzgünüm, yanıt alamadım.';

    // Update cache
    const messages = cache.messages.get(cacheKey) || [];
    messages.push({ role: 'user', content: message });
    messages.push({ role: 'assistant', content: aiResponse });
    cache.messages.set(cacheKey, messages.slice(-10)); // Keep last 10 messages
    cache.ts.set(cacheKey, now);

    return res.json({ 
      cached: false, 
      response: aiResponse,
      model: 'llama-3.1-70b-versatile'
    });

  } catch (err) {
    console.error('api/chat error:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
      raw: String(err)
    });
    return res.status(500).json({ 
      error: 'internal_error', 
      message: err?.message || String(err),
      type: err?.name
    });
  }
};
