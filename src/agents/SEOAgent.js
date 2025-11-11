/**
 * SEOAgent - Optimizes HTML for search engines and social media
 * Handles meta tags, Open Graph, Twitter Cards, Schema.org, alt tags, and more
 */

import { BaseAgent } from './BaseAgent.js';

export class SEOAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `
You are an expert SEO optimization agent. Your job is to analyze HTML code and optimize it for search engines and social media.

IMPORTANT: You MUST respond with a single JSON object. Do not include markdown or any text outside the JSON.

Your response MUST have this exact structure:
{
  "analysis": "Brief analysis of the current SEO status",
  "optimizedHtml": "The fully optimized HTML code",
  "changes": [
    "List of specific changes made"
  ],
  "seoScore": 85,
  "recommendations": [
    "Additional recommendations for further optimization"
  ]
}

When optimizing HTML, you MUST:

1. **Meta Tags:**
   - Add or optimize <title> (50-60 characters, include primary keyword)
   - Add meta description (150-160 characters, compelling and keyword-rich)
   - Add meta keywords (comma-separated relevant keywords)
   - Add meta viewport for mobile responsiveness
   - Add meta charset UTF-8
   - Add meta robots (index, follow)
   - Add canonical URL
   - Add meta author

2. **Open Graph (Facebook/LinkedIn):**
   - og:title - Compelling title for social sharing
   - og:description - Engaging description
   - og:image - High-quality image URL (1200x630px recommended)
   - og:url - Canonical URL
   - og:type - Usually "website" or "article"
   - og:site_name - Website name

3. **Twitter Cards:**
   - twitter:card - Usually "summary_large_image"
   - twitter:title - Optimized title
   - twitter:description - Engaging description
   - twitter:image - High-quality image URL
   - twitter:site - @username if available
   - twitter:creator - @username if available

4. **Schema.org JSON-LD:**
   - Add structured data based on content type (Article, Organization, WebPage, etc.)
   - Include all relevant properties (name, description, author, datePublished, etc.)
   - Place in <script type="application/ld+json"> tag in <head>

5. **Images:**
   - Add descriptive alt attributes to ALL images
   - Use keywords naturally in alt text
   - Add title attributes where appropriate
   - Optimize image filenames in src (use hyphens, keywords)

6. **Semantic HTML:**
   - Use proper heading hierarchy (h1 → h2 → h3)
   - Only ONE h1 per page with primary keyword
   - Use semantic tags: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>
   - Add ARIA labels for accessibility

7. **Content Optimization:**
   - Ensure keyword density is natural (2-3%)
   - Use keywords in: title, h1, first paragraph, alt tags
   - Add internal/external links with descriptive anchor text
   - Optimize URL slugs (lowercase, hyphens, keywords)

8. **Performance & Technical:**
   - Add lang attribute to <html> tag
   - Add loading="lazy" to images below the fold
   - Add rel="noopener noreferrer" to external links
   - Ensure mobile-friendly viewport settings

9. **Additional Enhancements:**
   - Add theme-color meta tag
   - Add favicon link
   - Add preconnect for external resources
   - Add link rel="alternate" for multiple languages if applicable

RULES:
- Preserve all existing functionality and scripts
- Keep all Tailwind CDN and CSS intact
- Maintain the original design and layout
- Only optimize for SEO without breaking anything
- Use provided keywords naturally throughout
- Generate realistic placeholder values if specific data not provided
- SEO score should be 0-100 based on optimization completeness
`;

    super('SEO Agent', systemPrompt);
  }

  getCapabilities() {
    return [
      'HTML SEO optimization',
      'Meta tags generation',
      'Open Graph tags',
      'Twitter Cards',
      'Schema.org structured data',
      'Image alt tag optimization',
      'Semantic HTML structure',
      'Keyword optimization',
      'SEO scoring and analysis'
    ];
  }

  /**
   * Optimize HTML for SEO
   * @param {string} html - The HTML code to optimize
   * @param {Object} options - Optimization options
   * @returns {Promise<Object>} - Optimization results
   */
  async process(html, options = {}) {
    try {
      this.log('Starting SEO optimization...');

      const {
        keywords = [],
        keyPhrase = '',
        title = '',
        description = '',
        author = '',
        siteName = '',
        imageUrl = '',
        url = '',
        twitterHandle = ''
      } = options;

      const prompt = `
Optimize this HTML for SEO with the following requirements:

**HTML Code:**
\`\`\`html
${html}
\`\`\`

**SEO Requirements:**
- Primary Key Phrase: "${keyPhrase || 'website content'}"
- Keywords: ${keywords.length > 0 ? keywords.join(', ') : 'web development, modern design, user experience'}
- Title: "${title || 'Professional Web Development Services'}"
- Description: "${description || 'High-quality web development services with modern design and excellent user experience.'}"
- Author: "${author || 'Web Developer'}"
- Site Name: "${siteName || 'CodeVibe'}"
- Featured Image: "${imageUrl || 'https://example.com/images/featured.jpg'}"
- URL: "${url || 'https://example.com'}"
- Twitter Handle: "${twitterHandle || '@webdev'}"

Please optimize this HTML with all SEO best practices including meta tags, Open Graph, Twitter Cards, Schema.org JSON-LD, alt tags for images, semantic HTML, and keyword optimization.
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log(`SEO optimization completed. Score: ${result.seoScore}/100`, 'success');
      this.log(`Applied ${result.changes.length} optimizations`, 'info');

      return {
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.log(`SEO optimization failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Quick SEO analysis without optimization
   */
  async analyzeSEO(html) {
    try {
      this.log('Analyzing HTML for SEO...');

      const prompt = `
Analyze this HTML for SEO and provide a score and recommendations:

\`\`\`html
${html}
\`\`\`

Return a JSON object with:
{
  "seoScore": 0-100,
  "strengths": ["list of SEO strengths"],
  "weaknesses": ["list of SEO issues"],
  "recommendations": ["specific actionable recommendations"]
}
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log(`SEO analysis completed. Score: ${result.seoScore}/100`, 'success');
      return result;

    } catch (error) {
      this.log(`SEO analysis failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Extract keywords from content
   */
  async extractKeywords(content, count = 10) {
    try {
      const prompt = `
Extract the top ${count} most relevant keywords from this content:

${content}

Return a JSON object with:
{
  "keywords": ["keyword1", "keyword2", ...],
  "keyPhrases": ["key phrase 1", "key phrase 2", ...]
}
`;

      const responseText = await this.callModel(prompt);
      return JSON.parse(responseText);

    } catch (error) {
      this.log(`Keyword extraction failed: ${error.message}`, 'error');
      throw error;
    }
  }
}
