/**
 * BaseAgent - Base class for all AI agents
 * Provides common functionality for API calls, retry logic, and error handling
 */

export class BaseAgent {
  constructor(name, systemPrompt, modelName = null) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.modelName = modelName || import.meta.env.VITE_MODEL_NAME || "gemini-2.0-flash-exp";
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  }

  /**
   * Exponential backoff fetch with retry logic
   */
  async fetchWithBackoff(url, options, retries = 3, delay = 1000) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          await new Promise(res => setTimeout(res, delay));
          return this.fetchWithBackoff(url, options, retries - 1, delay * 2);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`${this.name} fetch error:`, error.message);
      throw error;
    }
  }

  /**
   * Call the AI model with a given prompt
   */
  async callModel(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error("⚠️ Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: this.systemPrompt }]
      },
      generationConfig: {
        responseMimeType: options.responseMimeType || "application/json",
        temperature: options.temperature || 0.7,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxOutputTokens || 8192,
      }
    };

    const result = await this.fetchWithBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const candidate = result.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from API.");
    }

    return candidate.content.parts[0].text;
  }

  /**
   * Parse JSON responses with fallback extraction.
   */
  parseJsonResponse(rawText, context = 'JSON response') {
    const text = typeof rawText === 'string' ? rawText.trim() : '';
    if (!text) {
      throw new Error(`${context}: empty response.`);
    }

    const cleaned = text.replace(/^\uFEFF/, '');
    const candidates = [cleaned];
    const fencedMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fencedMatch?.[1]) {
      candidates.push(fencedMatch[1].trim());
    }

    const extracted = this.extractJsonSubstring(cleaned);
    if (extracted) {
      candidates.push(extracted);
    }

    let lastError = null;
    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate);
      } catch (error) {
        lastError = error;
      }
    }

    const preview = cleaned.length > 500 ? `${cleaned.slice(0, 500)}...` : cleaned;
    const reason = lastError ? lastError.message : 'Unknown parse error';
    throw new Error(`${context}: failed to parse JSON response (${reason}). Response preview: ${preview}`);
  }

  /**
   * Extract the first JSON object/array from a string.
   */
  extractJsonSubstring(text) {
    const start = text.search(/[{\[]/);
    if (start === -1) {
      return null;
    }

    let depth = 0;
    let inString = false;
    let escaping = false;

    for (let i = start; i < text.length; i++) {
      const char = text[i];

      if (inString) {
        if (escaping) {
          escaping = false;
          continue;
        }
        if (char === '\\') {
          escaping = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === '{' || char === '[') {
        depth += 1;
      } else if (char === '}' || char === ']') {
        depth -= 1;
        if (depth === 0) {
          return text.slice(start, i + 1);
        }
        if (depth < 0) {
          return null;
        }
      }
    }

    return null;
  }

  /**
   * Process a task - to be overridden by subclasses
   */
  async process(input) {
    throw new Error(`${this.name}: process() method must be implemented by subclass`);
  }

  /**
   * Get agent metadata
   */
  getInfo() {
    return {
      name: this.name,
      model: this.modelName,
      capabilities: this.getCapabilities()
    };
  }

  /**
   * Get agent capabilities - to be overridden by subclasses
   */
  getCapabilities() {
    return ["Base agent functionality"];
  }

  /**
   * Log agent activity
   */
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${this.name}] [${type.toUpperCase()}]`;
    console.log(`${timestamp} ${prefix}: ${message}`);
    return `${prefix}: ${message}`;
  }
}
