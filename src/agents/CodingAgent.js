/**
 * CodingAgent - Generates high-quality code based on plans and requirements
 * Similar to Replit's code generation capabilities
 */

import { BaseAgent } from './BaseAgent.js';

export class CodingAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `
You are an expert coding agent. Your job is to write clean, efficient, and well-documented code based on implementation plans and requirements.

IMPORTANT: You MUST respond with a single JSON object. Do not include markdown or any text outside the JSON.

Your response MUST have this exact structure:
{
  "thought": "Brief explanation of your implementation approach",
  "operations": [
    {
      "action": "create_file|update_file|delete_file",
      "path": "file/path.ext",
      "content": "full file content",
      "reasoning": "why this change is needed"
    }
  ],
  "summary": "Summary of what was implemented",
  "testingSuggestions": ["how to test this code"],
  "nextSteps": ["what should be done next"]
}

CODING RULES:

1. **Code Quality:**
   - Write clean, readable, maintainable code
   - Follow DRY (Don't Repeat Yourself) principle
   - Use meaningful variable and function names
   - Add helpful comments for complex logic
   - Follow language-specific best practices

2. **Modern Patterns:**
   - Use modern JavaScript (ES6+) features
   - Implement proper error handling
   - Use async/await for asynchronous operations
   - Follow component-based architecture for UI

3. **Web Development:**
   - Use Tailwind CSS for styling (CDN included)
   - Ensure responsive design (mobile-first)
   - Follow accessibility guidelines (WCAG)
   - Optimize for performance
   - Include proper HTML5 semantic tags

4. **File Organization:**
   - Create logical folder structure
   - Separate concerns (components, utils, styles)
   - Keep files focused and single-purpose
   - Use index files for clean imports

5. **Security:**
   - Sanitize user inputs
   - Avoid XSS vulnerabilities
   - Use secure coding practices
   - Validate data before processing

6. **Testing:**
   - Write testable code
   - Include error handling
   - Provide clear test suggestions
   - Consider edge cases

7. **Documentation:**
   - Add JSDoc comments for functions
   - Include usage examples
   - Document complex algorithms
   - Explain non-obvious decisions

8. **HTML Files:**
   - Include full <!DOCTYPE html> declaration
   - Add proper meta tags
   - Include Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
   - Use semantic HTML5 elements
   - Ensure mobile responsiveness
   - Add accessibility attributes

9. **Error Handling:**
   - Wrap risky operations in try-catch
   - Provide meaningful error messages
   - Gracefully handle failures
   - Log errors appropriately

10. **Performance:**
    - Minimize DOM manipulations
    - Use event delegation where appropriate
    - Lazy load resources when possible
    - Optimize images and assets

Be practical, thorough, and write production-quality code.
`;

    super('Coding Agent', systemPrompt);
  }

  getCapabilities() {
    return [
      'Code generation',
      'File creation and modification',
      'Refactoring',
      'Bug fixing',
      'Feature implementation',
      'HTML/CSS/JavaScript',
      'React components',
      'API integration',
      'Error handling',
      'Performance optimization'
    ];
  }

  /**
   * Generate code based on requirements
   */
  async process(requirements, context = {}) {
    try {
      this.log('Generating code...');

      const {
        plan = null,
        files = [],
        activeFile = null,
        specificTask = null
      } = context;

      let prompt = `
**Requirements:**
${requirements}

**Current Project Context:**
- Existing Files: ${files.map(f => f.path).join(', ') || 'None'}
- Active File: ${activeFile?.path || 'None'}
`;

      if (plan) {
        prompt += `
**Implementation Plan:**
${typeof plan === 'string' ? plan : JSON.stringify(plan, null, 2)}
`;
      }

      if (specificTask) {
        prompt += `
**Current Task:**
${typeof specificTask === 'string' ? specificTask : JSON.stringify(specificTask, null, 2)}
`;
      }

      if (activeFile) {
        prompt += `
**Active File Content:**
\`\`\`${activeFile.path.split('.').pop()}
${activeFile.content}
\`\`\`
`;
      }

      prompt += `
Please generate the necessary code to fulfill these requirements. Create or modify files as needed. Ensure all code is production-quality with proper error handling, comments, and follows best practices.
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log(`Code generated: ${result.operations.length} file operations`, 'success');
      this.log(`Summary: ${result.summary}`, 'info');

      return {
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.log(`Code generation failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Fix bugs in existing code
   */
  async fixBug(bugDescription, code, filePath) {
    try {
      this.log(`Fixing bug in ${filePath}...`);

      const prompt = `
**Bug Description:**
${bugDescription}

**File:** ${filePath}

**Current Code:**
\`\`\`
${code}
\`\`\`

Please identify the bug and provide the fixed code. Return the standard JSON format with the corrected file.
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log('Bug fixed successfully', 'success');
      return result;

    } catch (error) {
      this.log(`Bug fix failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Refactor code for better quality
   */
  async refactor(code, filePath, goals = []) {
    try {
      this.log(`Refactoring ${filePath}...`);

      const prompt = `
**File:** ${filePath}

**Current Code:**
\`\`\`
${code}
\`\`\`

**Refactoring Goals:**
${goals.length > 0 ? goals.join('\n') : 'Improve code quality, readability, and maintainability'}

Please refactor this code following best practices. Return the standard JSON format with the improved code.
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log('Refactoring completed', 'success');
      return result;

    } catch (error) {
      this.log(`Refactoring failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Add feature to existing code
   */
  async addFeature(featureDescription, files = []) {
    try {
      this.log('Adding new feature...');

      const prompt = `
**Feature Request:**
${featureDescription}

**Existing Files:**
${files.map(f => `
File: ${f.path}
\`\`\`
${f.content.substring(0, 500)}${f.content.length > 500 ? '...' : ''}
\`\`\`
`).join('\n')}

Please implement this feature. Create new files if needed or modify existing ones. Return the standard JSON format.
`;

      const responseText = await this.callModel(prompt);
      const result = JSON.parse(responseText);

      this.log('Feature added successfully', 'success');
      return result;

    } catch (error) {
      this.log(`Feature addition failed: ${error.message}`, 'error');
      throw error;
    }
  }
}
