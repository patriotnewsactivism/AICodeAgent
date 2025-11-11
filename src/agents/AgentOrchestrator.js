/**
 * AgentOrchestrator - Coordinates multiple agents to work together
 * Similar to Replit and Lovable's multi-agent workflows
 */

import { PlanningAgent } from './PlanningAgent.js';
import { CodingAgent } from './CodingAgent.js';
import { ArchitectAgent } from './ArchitectAgent.js';
import { SEOAgent } from './SEOAgent.js';

export class AgentOrchestrator {
  constructor() {
    this.planningAgent = new PlanningAgent();
    this.codingAgent = new CodingAgent();
    this.architectAgent = new ArchitectAgent();
    this.seoAgent = new SEOAgent();

    this.logs = [];
    this.currentWorkflow = null;
  }

  /**
   * Log orchestrator activity
   */
  log(message, type = 'info', agent = 'Orchestrator') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      agent,
      type,
      message
    };
    this.logs.push(logEntry);
    console.log(`[${agent}] [${type.toUpperCase()}] ${message}`);
    return logEntry;
  }

  /**
   * Get all logs as formatted string
   */
  getLogsAsString() {
    return this.logs.map(log =>
      `[${log.timestamp}] [${log.agent}] ${log.message}`
    ).join('\n');
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Execute full multi-agent workflow (Plan → Code → Review)
   */
  async executeFullWorkflow(userRequest, files = [], activeFile = null, options = {}) {
    try {
      this.log('🚀 Starting full multi-agent workflow...', 'info');
      this.currentWorkflow = 'full';

      const workflow = {
        startTime: Date.now(),
        userRequest,
        plan: null,
        code: null,
        review: null,
        iterations: 0,
        maxIterations: options.maxIterations || 2
      };

      // PHASE 1: Planning
      this.log('📋 PHASE 1: Planning', 'info');
      workflow.plan = await this.planningAgent.process(userRequest, {
        files,
        activeFile,
        projectType: options.projectType || 'web'
      });
      this.log(`✓ Plan created with ${workflow.plan.tasks.length} tasks`, 'success');

      // PHASE 2: Coding
      this.log('💻 PHASE 2: Coding', 'info');
      workflow.code = await this.codingAgent.process(userRequest, {
        plan: workflow.plan,
        files,
        activeFile
      });
      this.log(`✓ Generated ${workflow.code.operations.length} file operations`, 'success');

      // PHASE 3: Architecture Review
      this.log('🔍 PHASE 3: Architecture Review', 'info');

      // Simulate the files after applying operations
      const simulatedFiles = this.simulateFileOperations(files, workflow.code.operations);

      workflow.review = await this.architectAgent.process(simulatedFiles, {
        strictMode: options.strictMode || false
      });
      this.log(`✓ Review completed. Score: ${workflow.review.overallScore}/100`, 'success');

      // PHASE 4: Iteration (if needed)
      workflow.iterations = 0;
      while (!workflow.review.approved && workflow.iterations < workflow.maxIterations) {
        workflow.iterations++;
        this.log(`🔄 Iteration ${workflow.iterations}: Fixing issues...`, 'info');

        // Use architect feedback to improve code
        const improvements = await this.codingAgent.process(
          `Fix these issues:\n${workflow.review.requiredChanges.join('\n')}`,
          {
            files: simulatedFiles,
            specificTask: 'Fix code review issues'
          }
        );

        // Apply improvements
        const improvedFiles = this.simulateFileOperations(simulatedFiles, improvements.operations);

        // Review again
        workflow.review = await this.architectAgent.process(improvedFiles, {
          strictMode: options.strictMode || false
        });

        this.log(`✓ Iteration ${workflow.iterations} review: ${workflow.review.overallScore}/100`, 'success');

        if (workflow.review.approved) {
          workflow.code = improvements;
          this.log('✓ Code approved after improvements!', 'success');
        }
      }

      workflow.endTime = Date.now();
      workflow.duration = workflow.endTime - workflow.startTime;

      this.log(`✅ Workflow completed in ${(workflow.duration / 1000).toFixed(2)}s`, 'success');
      this.log(`Final approval: ${workflow.review.approved ? 'APPROVED ✓' : 'NEEDS WORK ⚠'}`, workflow.review.approved ? 'success' : 'warning');

      return {
        success: true,
        workflow,
        operations: workflow.code.operations,
        plan: workflow.plan,
        review: workflow.review,
        logs: this.logs
      };

    } catch (error) {
      this.log(`❌ Workflow failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Execute quick workflow (Code → Review, no planning)
   */
  async executeQuickWorkflow(userRequest, files = [], activeFile = null) {
    try {
      this.log('⚡ Starting quick workflow...', 'info');
      this.currentWorkflow = 'quick';

      // Just code and review, skip planning
      const code = await this.codingAgent.process(userRequest, { files, activeFile });
      this.log(`✓ Code generated: ${code.operations.length} operations`, 'success');

      const simulatedFiles = this.simulateFileOperations(files, code.operations);
      const review = await this.architectAgent.process(simulatedFiles);
      this.log(`✓ Review: ${review.overallScore}/100, Approved: ${review.approved}`, 'success');

      return {
        success: true,
        operations: code.operations,
        review,
        logs: this.logs
      };

    } catch (error) {
      this.log(`❌ Quick workflow failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Execute SEO optimization workflow
   */
  async executeSEOWorkflow(html, seoOptions = {}) {
    try {
      this.log('🎯 Starting SEO optimization workflow...', 'info');
      this.currentWorkflow = 'seo';

      // Optimize HTML
      const optimized = await this.seoAgent.process(html, seoOptions);
      this.log(`✓ SEO optimization completed. Score: ${optimized.seoScore}/100`, 'success');
      this.log(`Applied ${optimized.changes.length} SEO improvements`, 'info');

      return {
        success: true,
        optimized,
        logs: this.logs
      };

    } catch (error) {
      this.log(`❌ SEO workflow failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Execute planning-only workflow
   */
  async executePlanningWorkflow(userRequest, files = [], activeFile = null) {
    try {
      this.log('📋 Creating implementation plan...', 'info');
      this.currentWorkflow = 'planning';

      const plan = await this.planningAgent.process(userRequest, { files, activeFile });
      this.log(`✓ Plan created with ${plan.tasks.length} tasks`, 'success');

      return {
        success: true,
        plan,
        logs: this.logs
      };

    } catch (error) {
      this.log(`❌ Planning failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Execute review-only workflow
   */
  async executeReviewWorkflow(files, options = {}) {
    try {
      this.log('🔍 Reviewing code...', 'info');
      this.currentWorkflow = 'review';

      const review = await this.architectAgent.process(files, options);
      this.log(`✓ Review completed. Score: ${review.overallScore}/100`, 'success');

      return {
        success: true,
        review,
        logs: this.logs
      };

    } catch (error) {
      this.log(`❌ Review failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Execute security audit workflow
   */
  async executeSecurityAudit(files) {
    try {
      this.log('🔒 Starting security audit...', 'info');
      this.currentWorkflow = 'security';

      const audit = await this.architectAgent.securityAudit(files);
      this.log(`✓ Security audit completed. Score: ${audit.securityScore}/100`, 'success');

      return {
        success: true,
        audit,
        logs: this.logs
      };

    } catch (error) {
      this.log(`❌ Security audit failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Execute performance analysis workflow
   */
  async executePerformanceAnalysis(files) {
    try {
      this.log('⚡ Analyzing performance...', 'info');
      this.currentWorkflow = 'performance';

      const analysis = await this.architectAgent.performanceAnalysis(files);
      this.log(`✓ Performance analysis completed. Score: ${analysis.performanceScore}/100`, 'success');

      return {
        success: true,
        analysis,
        logs: this.logs
      };

    } catch (error) {
      this.log(`❌ Performance analysis failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Simulate file operations to predict the resulting file state
   */
  simulateFileOperations(currentFiles, operations) {
    let simulatedFiles = [...currentFiles];

    for (const op of operations) {
      switch (op.action) {
        case 'create_file':
          if (!simulatedFiles.find(f => f.path === op.path)) {
            simulatedFiles.push({ path: op.path, content: op.content });
          } else {
            simulatedFiles = simulatedFiles.map(f =>
              f.path === op.path ? { ...f, content: op.content } : f
            );
          }
          break;

        case 'update_file':
          simulatedFiles = simulatedFiles.map(f =>
            f.path === op.path ? { ...f, content: op.content } : f
          );
          break;

        case 'delete_file':
          simulatedFiles = simulatedFiles.filter(f => f.path !== op.path);
          break;
      }
    }

    return simulatedFiles;
  }

  /**
   * Get workflow statistics
   */
  getStats() {
    return {
      totalLogs: this.logs.length,
      currentWorkflow: this.currentWorkflow,
      agents: {
        planning: this.planningAgent.getInfo(),
        coding: this.codingAgent.getInfo(),
        architect: this.architectAgent.getInfo(),
        seo: this.seoAgent.getInfo()
      }
    };
  }

  /**
   * Get agent by name
   */
  getAgent(name) {
    const agents = {
      planning: this.planningAgent,
      coding: this.codingAgent,
      architect: this.architectAgent,
      seo: this.seoAgent
    };
    return agents[name.toLowerCase()] || null;
  }

  /**
   * Check if agents are ready
   */
  isReady() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    return apiKey.length > 0;
  }
}
