/**
 * PlanningAgent - Analyzes user requests and creates detailed implementation plans
 * Similar to Replit's planning capabilities
 */

import { BaseAgent } from './BaseAgent.js';

export class PlanningAgent extends BaseAgent {
  constructor() {
    const systemPrompt = `
You are an expert software planning agent. Your job is to analyze user requests and break them down into clear, actionable implementation plans.

IMPORTANT: You MUST respond with a single JSON object. Do not include markdown or any text outside the JSON.

Your response MUST have this exact structure:
{
  "understanding": "Your understanding of the user's request",
  "approach": "High-level approach to solve the problem",
  "tasks": [
    {
      "id": 1,
      "title": "Task title",
      "description": "Detailed description",
      "type": "create_file|update_file|delete_file|refactor|test",
      "files": ["list of files involved"],
      "priority": "high|medium|low",
      "estimatedComplexity": "simple|moderate|complex",
      "dependencies": [2, 3]
    }
  ],
  "fileStructure": {
    "new": ["files to create"],
    "modify": ["files to modify"],
    "delete": ["files to delete"]
  },
  "techStack": ["technologies/libraries to use"],
  "considerations": ["important considerations"],
  "risks": ["potential risks or challenges"],
  "testingStrategy": "How to test the implementation"
}

PLANNING RULES:

1. **Break Down Complexity:**
   - Decompose large tasks into smaller, manageable subtasks
   - Order tasks logically based on dependencies
   - Identify which tasks can be done in parallel

2. **File Organization:**
   - Suggest proper folder structure
   - Follow best practices for project organization
   - Consider separation of concerns

3. **Technical Considerations:**
   - Identify required technologies and libraries
   - Consider performance implications
   - Think about scalability and maintainability
   - Address security concerns

4. **Dependencies:**
   - Map out task dependencies clearly
   - Identify which tasks must be completed before others
   - Suggest parallel execution where possible

5. **Best Practices:**
   - Follow industry best practices
   - Consider accessibility (WCAG compliance)
   - Ensure responsive design
   - Think about error handling
   - Consider edge cases

6. **Testing:**
   - Suggest appropriate testing strategies
   - Identify what needs to be tested
   - Recommend test cases

7. **Risk Assessment:**
   - Identify potential challenges
   - Suggest mitigation strategies
   - Flag breaking changes

Be thorough, practical, and think like a senior software architect.
`;

    super('Planning Agent', systemPrompt);
  }

  getCapabilities() {
    return [
      'Task decomposition',
      'Dependency analysis',
      'Architecture planning',
      'Risk assessment',
      'Testing strategy',
      'Best practices recommendations'
    ];
  }

  /**
   * Create an implementation plan from user request
   */
  async process(userRequest, context = {}) {
    try {
      this.log('Creating implementation plan...');

      const { files = [], activeFile = null, projectType = 'web' } = context;

      const prompt = `
**User Request:**
${userRequest}

**Current Project Context:**
- Project Type: ${projectType}
- Existing Files: ${files.map(f => f.path).join(', ') || 'None'}
- Active File: ${activeFile?.path || 'None'}

${activeFile ? `
**Active File Content:**
\`\`\`
${activeFile.content.substring(0, 1000)}${activeFile.content.length > 1000 ? '...' : ''}
\`\`\`
` : ''}

Please create a detailed implementation plan that breaks down this request into actionable tasks. Consider the existing project structure and provide specific, step-by-step guidance.
`;

      const responseText = await this.callModel(prompt);
      const result = this.parseJsonResponse(responseText, 'PlanningAgent.process');

      this.log(`Plan created with ${result.tasks.length} tasks`, 'success');
      this.log(`Files to modify: ${result.fileStructure.modify.length}, create: ${result.fileStructure.new.length}`, 'info');

      return {
        success: true,
        ...result,
        timestamp: new Date().toISOString(),
        totalTasks: result.tasks.length
      };

    } catch (error) {
      this.log(`Planning failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Refine an existing plan based on feedback
   */
  async refinePlan(originalPlan, feedback) {
    try {
      this.log('Refining implementation plan...');

      const prompt = `
**Original Plan:**
${JSON.stringify(originalPlan, null, 2)}

**Feedback/Changes Requested:**
${feedback}

Please refine the plan based on this feedback. Maintain the same JSON structure but update tasks, priorities, or approach as needed.
`;

      const responseText = await this.callModel(prompt);
      const result = this.parseJsonResponse(responseText, 'PlanningAgent.refinePlan');

      this.log('Plan refined successfully', 'success');
      return result;

    } catch (error) {
      this.log(`Plan refinement failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Validate if a task from the plan is complete
   */
  async validateTaskCompletion(task, implementation) {
    try {
      const prompt = `
**Task:**
${JSON.stringify(task, null, 2)}

**Implementation:**
${implementation}

Is this task completed successfully? Return JSON:
{
  "isComplete": true/false,
  "completionPercentage": 0-100,
  "issues": ["any issues found"],
  "suggestions": ["suggestions for improvement"]
}
`;

      const responseText = await this.callModel(prompt);
      return this.parseJsonResponse(responseText, 'PlanningAgent.validateTaskCompletion');

    } catch (error) {
      this.log(`Task validation failed: ${error.message}`, 'error');
      throw error;
    }
  }
}
