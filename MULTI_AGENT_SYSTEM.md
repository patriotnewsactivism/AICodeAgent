# Multi-Agent System Documentation

## Overview

CodeVibe V2 now features a powerful **Multi-Agent System** similar to Replit and Lovable, where specialized AI agents work together to plan, code, and review your projects with enterprise-level quality assurance.

## Architecture

The system consists of 5 specialized agents orchestrated to work together:

### 1. **Planning Agent** 📋
- **Purpose**: Analyzes user requests and creates detailed implementation plans
- **Capabilities**:
  - Task decomposition and breakdown
  - Dependency analysis
  - Risk assessment
  - Architecture planning
  - Testing strategy recommendations
  - Best practices suggestions

### 2. **Coding Agent** 💻
- **Purpose**: Generates high-quality, production-ready code
- **Capabilities**:
  - Code generation based on plans
  - File creation and modification
  - Bug fixing
  - Code refactoring
  - Feature implementation
  - Error handling
  - Performance optimization

### 3. **Architect Agent** 🔍
- **Purpose**: Reviews code quality and provides expert feedback
- **Capabilities**:
  - Comprehensive code review
  - Security audit (OWASP Top 10)
  - Performance analysis
  - Accessibility review (WCAG 2.1)
  - Best practices validation
  - Quality scoring (0-100)
  - Refactoring recommendations

### 4. **SEO Agent** 🎯
- **Purpose**: Optimizes HTML for search engines and social media
- **Capabilities**:
  - Meta tags optimization (title, description, keywords)
  - Open Graph tags (Facebook, LinkedIn)
  - Twitter Card tags
  - Schema.org JSON-LD structured data
  - Image alt tag optimization
  - Semantic HTML structure
  - Keyword optimization
  - SEO scoring and analysis

### 5. **Agent Orchestrator** 🎭
- **Purpose**: Coordinates all agents in various workflows
- **Capabilities**:
  - Multi-agent workflow coordination
  - Iterative improvement loops
  - Log aggregation
  - Error handling
  - Performance monitoring

## Workflow Modes

### 🚀 Full Workflow (Plan → Code → Review)
The complete multi-agent experience:
1. **Planning Agent** analyzes your request and creates a detailed plan
2. **Coding Agent** implements the plan with high-quality code
3. **Architect Agent** reviews the code for quality, security, and best practices
4. If issues are found, the system iterates up to 2 times to fix them
5. Final code is approved only if it meets quality standards (score ≥ 80)

**Use when**: You want comprehensive, production-ready code with quality assurance

### ⚡ Quick Workflow (Code → Review)
Faster iteration without planning phase:
1. **Coding Agent** generates code directly from your request
2. **Architect Agent** reviews the code
3. Quality score and feedback provided

**Use when**: Making simple changes or quick iterations

### 📋 Planning Only
Get a detailed implementation plan without code:
1. **Planning Agent** creates a comprehensive plan with tasks, dependencies, and recommendations

**Use when**: You want to understand the approach before implementing

### 🔍 Review Only
Review existing code:
1. **Architect Agent** analyzes current files
2. Provides quality score, issues, and recommendations

**Use when**: You want feedback on existing code

## SEO Optimization

### How to Use
1. Click **Settings** button in the AI Agent panel
2. Click **SEO Optimize HTML**
3. Fill in SEO details:
   - **Primary Key Phrase**: Main keyword phrase (e.g., "professional web development")
   - **Keywords**: Comma-separated keywords
   - **Page Title**: SEO-optimized title (50-60 characters)
   - **Meta Description**: Compelling description (150-160 characters)
   - **Author**: Content author name
   - **Site Name**: Website or brand name
   - **Featured Image URL**: Social media image (1200x630px recommended)
   - **Canonical URL**: Page URL
   - **Twitter Handle**: Your Twitter @username
4. Click **Optimize**

### What Gets Optimized

#### Meta Tags
- `<title>` - SEO-optimized with keywords
- `<meta name="description">` - Compelling, keyword-rich
- `<meta name="keywords">` - Relevant keywords
- `<meta name="robots">` - Search engine directives
- `<meta name="author">` - Content author
- `<link rel="canonical">` - Canonical URL

#### Open Graph (Social Media)
- `og:title` - Social sharing title
- `og:description` - Social sharing description
- `og:image` - Featured image for social posts
- `og:url` - Canonical URL
- `og:type` - Content type (website/article)
- `og:site_name` - Brand name

#### Twitter Cards
- `twitter:card` - Card type (summary_large_image)
- `twitter:title` - Twitter-specific title
- `twitter:description` - Twitter-specific description
- `twitter:image` - Featured image
- `twitter:site` - Website Twitter handle
- `twitter:creator` - Author Twitter handle

#### Schema.org JSON-LD
Structured data for rich snippets:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Description",
  "author": {...},
  "publisher": {...}
}
```

#### Image Optimization
- Descriptive `alt` attributes for all images
- Natural keyword usage in alt text
- `title` attributes where appropriate

#### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Single h1 with primary keyword
- Semantic tags: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- ARIA labels for accessibility

## Code Quality Scoring

The Architect Agent provides a comprehensive quality score (0-100) based on:

### Score Breakdown
- **90-100**: Excellent - Production ready ✓
- **80-89**: Good - Minor improvements needed
- **70-79**: Fair - Moderate improvements needed
- **60-69**: Poor - Significant improvements needed
- **Below 60**: Critical - Major refactoring required

### Scoring Criteria
1. **Security (25%)**: XSS, SQL injection, CSRF, input validation, OWASP Top 10
2. **Performance (20%)**: Algorithm efficiency, memory usage, optimization
3. **Code Quality (20%)**: Readability, DRY principle, naming, error handling
4. **Architecture (15%)**: Separation of concerns, design patterns, SOLID principles
5. **Maintainability (10%)**: Documentation, organization, tech debt
6. **Accessibility (5%)**: WCAG 2.1 compliance, semantic HTML, ARIA
7. **Best Practices (5%)**: Language conventions, framework standards

### Approval Process
- Code is **approved** if score ≥ 80 AND no critical/high severity issues
- Code is **rejected** if score < 80 OR critical issues exist
- Required changes must be fixed before deployment

## API Integration

All agents use the Google Gemini API. Configure in `.env`:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_MODEL_NAME=gemini-2.0-flash-exp
```

Get your API key at: https://ai.google.dev

## Usage Examples

### Example 1: Build a Feature with Full Workflow
1. Select **🚀 Full (Plan → Code → Review)** mode
2. Enter prompt: "Create a responsive contact form with validation"
3. Click **Run**
4. System will:
   - Plan the implementation
   - Generate the code
   - Review for quality
   - Iterate if needed
   - Show final quality score

### Example 2: SEO Optimize Existing HTML
1. Click **Settings** → **SEO Optimize HTML**
2. Fill in:
   - Key Phrase: "professional web design services"
   - Keywords: "web design, responsive, modern, UX"
   - Title: "Professional Web Design Services | Your Company"
   - Description: "Expert web design services with modern, responsive designs..."
3. Click **Optimize**
4. Your HTML is now fully optimized with meta tags, Open Graph, Twitter Cards, and Schema.org data

### Example 3: Review Existing Code
1. Select **🔍 Review Only** mode
2. Click **Run** (no prompt needed)
3. Get comprehensive feedback:
   - Overall quality score
   - Security vulnerabilities
   - Performance bottlenecks
   - Accessibility issues
   - Refactoring recommendations

## Advanced Features

### Iterative Improvement
In Full Workflow mode, the system automatically:
1. Reviews generated code
2. Identifies issues
3. Fixes issues automatically
4. Re-reviews
5. Repeats up to 2 times until approved

### Multi-Agent Logging
All agent activities are logged in real-time:
- Which agent is working
- What actions are being taken
- Decisions being made
- Issues found and fixed

### Quality Guarantees
- Full workflow ensures code quality score ≥ 80
- Security vulnerabilities are identified and flagged
- Performance issues are highlighted
- Best practices are enforced

## Comparison with Other Platforms

### vs. Replit
✓ Similar multi-agent planning and coding workflow
✓ Real-time code generation and review
✓ Quality scoring system
+ Added SEO optimization capabilities
+ Comprehensive security auditing

### vs. Lovable
✓ Architecture review and code quality assurance
✓ Iterative improvement loops
✓ Production-ready code standards
+ Multiple workflow modes
+ Specialized SEO agent

## Technical Details

### File Structure
```
src/
├── agents/
│   ├── BaseAgent.js           # Base class for all agents
│   ├── PlanningAgent.js        # Task planning and decomposition
│   ├── CodingAgent.js          # Code generation
│   ├── ArchitectAgent.js       # Code review and quality
│   ├── SEOAgent.js             # SEO optimization
│   └── AgentOrchestrator.js    # Multi-agent coordination
└── App.jsx                     # Main UI with agent integration
```

### Agent Communication
Agents communicate through the Orchestrator using a standardized JSON format:
- Input: Task description + context
- Output: Results + metadata + logs

### Error Handling
- Retry logic with exponential backoff for API calls
- Graceful degradation if agents fail
- Detailed error messages and logging
- Recovery mechanisms for partial failures

## Troubleshooting

### "API key not found" error
Add `VITE_GEMINI_API_KEY` to your `.env` file

### Low quality scores
- Review the detailed feedback in the agent log
- Focus on fixing critical and high severity issues first
- Use the Review Only mode to understand current issues
- Iterate using Quick Workflow mode

### SEO optimization not working
- Ensure you have an `index.html` file
- Fill in at least the Primary Key Phrase field
- Check agent log for detailed error messages

## Future Enhancements

Planned features:
- [ ] Custom agent configurations
- [ ] Agent training and fine-tuning
- [ ] Workflow templates
- [ ] Performance metrics dashboard
- [ ] Collaboration features
- [ ] Version control integration
- [ ] Automated testing agent
- [ ] Deployment agent

## Support

For issues or questions:
- GitHub Issues: https://github.com/patriotnewsactivism/AICodeAgent/issues
- Documentation: This file and README.md

---

**Built with ❤️ for developers who demand quality**
