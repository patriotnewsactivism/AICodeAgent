/**
 * ArchitectAgent - Reviews code quality, architecture, and provides improvements
 * Similar to Lovable's quality assurance capabilities
 */

import { BaseAgent } from './BaseAgent.js';

export class ArchitectAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `
You are an expert software architect and code reviewer. Your job is to review code for quality, best practices, security, performance, and architecture.

IMPORTANT: You MUST respond with a single JSON object. Do not include markdown or any text outside the JSON.

Your response MUST have this exact structure:
{
  "overallScore": 85,
  "summary": "Overall assessment of the code quality",
  "strengths": ["list of strengths"],
  "issues": [
    {
      "severity": "critical|high|medium|low",
      "category": "security|performance|maintainability|accessibility|bestPractices",
      "file": "file path",
      "line": 42,
      "issue": "Description of the issue",
      "recommendation": "How to fix it",
      "example": "Code example of the fix (optional)"
    }
  ],
  "architecture": {
    "score": 80,
    "assessment": "Architecture assessment",
    "suggestions": ["architectural improvements"]
  },
  "security": {
    "score": 90,
    "vulnerabilities": ["list of security issues"],
    "recommendations": ["security improvements"]
  },
  "performance": {
    "score": 85,
    "bottlenecks": ["performance issues"],
    "optimizations": ["suggested optimizations"]
  },
  "maintainability": {
    "score": 88,
    "concerns": ["maintainability issues"],
    "improvements": ["suggested improvements"]
  },
  "accessibility": {
    "score": 75,
    "issues": ["accessibility problems"],
    "fixes": ["how to improve accessibility"]
  },
  "bestPractices": {
    "score": 90,
    "violations": ["best practice violations"],
    "recommendations": ["follow these practices"]
  },
  "refactoringPriorities": [
    "Priority 1: Critical issues to fix immediately",
    "Priority 2: Important improvements",
    "Priority 3: Nice-to-have enhancements"
  ],
  "approved": true,
  "requiredChanges": ["must fix before deployment"]
}

REVIEW CRITERIA:

1. **Security (Weight: 25%):**
   - XSS vulnerabilities
   - SQL injection risks
   - CSRF protection
   - Input validation
   - Output encoding
   - Authentication/authorization
   - Sensitive data exposure
   - Insecure dependencies
   - OWASP Top 10 compliance

2. **Performance (Weight: 20%):**
   - Algorithm efficiency (time complexity)
   - Memory usage
   - Network requests optimization
   - Lazy loading
   - Caching strategies
   - Bundle size
   - Render performance
   - Database query optimization

3. **Code Quality (Weight: 20%):**
   - Readability and clarity
   - Naming conventions
   - Code duplication (DRY)
   - Function/method length
   - Cyclomatic complexity
   - Comment quality
   - Error handling
   - Type safety

4. **Architecture (Weight: 15%):**
   - Separation of concerns
   - Component structure
   - Module organization
   - Dependency management
   - Scalability
   - Extensibility
   - Design patterns usage
   - SOLID principles

5. **Maintainability (Weight: 10%):**
   - Code organization
   - Documentation
   - Test coverage
   - Configuration management
   - Dependency versions
   - Tech debt indicators

6. **Accessibility (Weight: 5%):**
   - WCAG 2.1 compliance
   - Semantic HTML
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support
   - Color contrast
   - Focus management

7. **Best Practices (Weight: 5%):**
   - Language-specific conventions
   - Framework best practices
   - Industry standards
   - Code style consistency
   - Version control practices

SCORING:
- 90-100: Excellent - Production ready
- 80-89: Good - Minor improvements needed
- 70-79: Fair - Moderate improvements needed
- 60-69: Poor - Significant improvements needed
- Below 60: Critical - Major refactoring required

APPROVAL:
- Set "approved": true only if overallScore >= 80 and no critical/high severity issues
- Set "approved": false if there are critical issues or score < 80
- List all required changes before deployment

Be thorough, constructive, and provide actionable feedback.
`;

    super('Architect Agent', systemPrompt);
  }

  getCapabilities() {
    return [
      'Code review',
      'Architecture assessment',
      'Security audit',
      'Performance analysis',
      'Accessibility review',
      'Best practices validation',
      'Quality scoring',
      'Refactoring recommendations'
    ];
  }

  /**
   * Review code quality and architecture
   */
  async process(files, options = {}) {
    try {
      this.log('Starting code review...');

      const { focusAreas = [], strictMode = false } = options;

      const filesContent = files.map(f => `
**File: ${f.path}**
\`\`\`
${f.content}
\`\`\`
`).join('\n\n');

      const prompt = `
Review the following code for quality, security, performance, and best practices.

${focusAreas.length > 0 ? `
**Focus Areas:**
${focusAreas.join('\n')}
` : ''}

${strictMode ? '**Mode:** STRICT - Be very thorough and critical.' : '**Mode:** BALANCED - Be constructive but practical.'}

**Code to Review:**
${filesContent}

Provide a comprehensive code review with scores, issues, and actionable recommendations.
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log(`Code review completed. Overall score: ${result.overallScore}/100`, 'success');
      this.log(`Found ${result.issues.length} issues`, 'info');
      this.log(`Approved for deployment: ${result.approved ? 'YES' : 'NO'}`, result.approved ? 'success' : 'warning');

      return {
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.log(`Code review failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Quick security audit
   */
  async securityAudit(files) {
    try {
      this.log('Performing security audit...');

      const filesContent = files.map(f => `
**File: ${f.path}**
\`\`\`
${f.content}
\`\`\`
`).join('\n\n');

      const prompt = `
Perform a security audit on this code. Focus on:
- XSS vulnerabilities
- SQL injection
- CSRF protection
- Input validation
- Authentication issues
- Sensitive data exposure
- Insecure dependencies

**Code:**
${filesContent}

Return JSON with:
{
  "securityScore": 0-100,
  "vulnerabilities": [
    {
      "severity": "critical|high|medium|low",
      "type": "XSS|SQL|CSRF|etc",
      "file": "path",
      "description": "issue description",
      "fix": "how to fix it"
    }
  ],
  "passed": true/false
}
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log(`Security audit completed. Score: ${result.securityScore}/100`, 'success');
      return result;

    } catch (error) {
      this.log(`Security audit failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Performance analysis
   */
  async performanceAnalysis(files) {
    try {
      this.log('Analyzing performance...');

      const filesContent = files.map(f => `
**File: ${f.path}**
\`\`\`
${f.content}
\`\`\`
`).join('\n\n');

      const prompt = `
Analyze this code for performance issues and optimization opportunities.

**Code:**
${filesContent}

Return JSON with:
{
  "performanceScore": 0-100,
  "bottlenecks": [
    {
      "file": "path",
      "issue": "description",
      "impact": "high|medium|low",
      "optimization": "suggested fix"
    }
  ],
  "optimizations": ["list of general optimizations"]
}
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log(`Performance analysis completed. Score: ${result.performanceScore}/100`, 'success');
      return result;

    } catch (error) {
      this.log(`Performance analysis failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Accessibility review
   */
  async accessibilityReview(files) {
    try {
      this.log('Reviewing accessibility...');

      const htmlFiles = files.filter(f => f.path.endsWith('.html'));

      if (htmlFiles.length === 0) {
        return {
          accessibilityScore: 100,
          issues: [],
          message: 'No HTML files to review for accessibility'
        };
      }

      const filesContent = htmlFiles.map(f => `
**File: ${f.path}**
\`\`\`html
${f.content}
\`\`\`
`).join('\n\n');

      const prompt = `
Review this HTML for WCAG 2.1 accessibility compliance.

**HTML Files:**
${filesContent}

Return JSON with:
{
  "accessibilityScore": 0-100,
  "issues": [
    {
      "severity": "critical|high|medium|low",
      "wcagLevel": "A|AA|AAA",
      "criterion": "WCAG criterion",
      "file": "path",
      "issue": "description",
      "fix": "how to fix it"
    }
  ],
  "passed": true/false
}
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log(`Accessibility review completed. Score: ${result.accessibilityScore}/100`, 'success');
      return result;

    } catch (error) {
      this.log(`Accessibility review failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Generate refactoring suggestions
   */
  async suggestRefactoring(file) {
    try {
      this.log(`Generating refactoring suggestions for ${file.path}...`);

      const prompt = `
Analyze this code and suggest refactoring improvements.

**File: ${file.path}**
\`\`\`
${file.content}
\`\`\`

Return JSON with:
{
  "currentIssues": ["issues with current code"],
  "refactoringPlan": [
    {
      "title": "refactoring title",
      "description": "what to refactor",
      "benefit": "why refactor this",
      "difficulty": "easy|medium|hard"
    }
  ],
  "refactoredCode": "the refactored version (if applicable)"
}
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log('Refactoring suggestions generated', 'success');
      return result;

    } catch (error) {
      this.log(`Refactoring suggestion failed: ${error.message}`, 'error');
      throw error;
    }
  }
}
