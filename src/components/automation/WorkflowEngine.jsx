import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

/**
 * Ark Automation Backend Execution Engine (Simulated)
 * Aligns with ERPNext backend processing for Workflows.
 */
export const WorkflowEngine = {

  /**
   * Executes a specific automation workflow.
   * @param {Object} automation - The ArkAutomation entity record.
   * @param {Object} context - Context data triggering the workflow (e.g., the doc causing the event).
   */
  async execute(automation, context = {}) {
    console.log(`[ArkEngine] Starting execution for: ${automation.name}`);
    const startTime = Date.now();
    const executionLog = {
      automation_id: automation.id,
      run_timestamp: new Date().toISOString(),
      status: "Running",
      trigger_context: JSON.stringify(context),
      actions_executed: [],
      error_log: ""
    };

    try {
      // 1. Evaluate Trigger Conditions (including AI)
      const shouldRun = await this.evaluateTrigger(automation.trigger, automation.nodes, context);
      if (!shouldRun) {
        console.log(`[ArkEngine] Trigger condition not met for: ${automation.name}`);
        return; // Skip execution
      }

      // 2. Sort and Execute Actions
      const actions = (automation.actions || []).sort((a, b) => a.order - b.order);
      
      for (const action of actions) {
        if (!action.enabled) continue;
        
        const result = await this.processAction(action, context);
        executionLog.actions_executed.push({
          action_type: action.action_type,
          status: result.success ? "Success" : "Failed",
          details: result.message
        });

        if (!result.success) {
          throw new Error(`Action failed: ${action.action_type} - ${result.message}`);
        }
      }

      executionLog.status = "Success";
      toast.success(`Workflow "${automation.name}" executed successfully.`);

    } catch (error) {
      console.error(`[ArkEngine] Execution Failed:`, error);
      executionLog.status = "Failed";
      executionLog.error_log = error.message;
      toast.error(`Workflow execution failed: ${error.message}`);
    } finally {
      executionLog.execution_duration_ms = Date.now() - startTime;
      // Log to Backend Entity
      await base44.entities.ArkWorkflowExecutionLog.create(executionLog);
    }
  },

  /**
   * Evaluates the trigger conditions.
   */
  async evaluateTrigger(triggerType, nodes, context) {
    // Find the trigger node configuration
    const triggerNode = nodes.find(n => n.type === 'trigger');
    const config = triggerNode?.data || {};

    if (triggerType === 'manual') return true;

    if (triggerType === 'ai_prediction') {
      // Call AI to evaluate context
      if (config.triggerType === 'project_delay') {
        const prediction = await this.predictProjectDelay(context);
        return prediction.isDelayed;
      }
      if (config.triggerType === 'lead_sentiment') {
        const sentiment = await this.analyzeSentiment(context);
        return sentiment.score < 0.3; // Threshold for low sentiment
      }
    }

    // Basic Event Triggers (Simulated)
    if (triggerType === 'event') {
      // e.g. check if context.event matches config.eventName
      return true; 
    }

    return true; // Default to true for test runs
  },

  /**
   * Processes a single action.
   */
  async processAction(action, context) {
    const params = JSON.parse(action.params || "{}");
    
    try {
      switch (action.action_type) {
        case 'SendEmail':
          await base44.integrations.Core.SendEmail({
            to: "user@example.com", // Simplified: In real app, extract from context or params
            subject: `Ark Automation: ${context.id || 'Notification'}`,
            body: `Action executed by Ark Automation Engine.\n\nDetails: ${JSON.stringify(params)}`
          });
          return { success: true, message: "Email sent" };

        case 'UpdateDoc':
          // Simulate ERPNext ORM: doc = frappe.get_doc(...); doc.update(...)
          if (params.entityType && context.id) {
             // This is a simplified simulation of UpdateDoc
             // In a real scenario we would update the specific entity passed in context
             console.log(`[ArkEngine] Updating ${params.entityType} field ${params.fieldName} to ${params.fieldValue}`);
             // Implementation would use base44.entities[Entity].update(...)
          }
          return { success: true, message: `Updated ${params.entityType || 'Document'}` };

        case 'CallAPI':
          // Simulate API call
          return { success: true, message: "API called successfully" };

        default:
          return { success: false, message: "Unknown Action Type" };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  /**
   * AI Model: Predict Project Delay
   */
  async predictProjectDelay(projectData) {
    // Simulate AI Prediction
    // In real app: base44.integrations.Core.InvokeLLM(...)
    return { isDelayed: Math.random() > 0.7, confidence: 0.85 };
  },

  /**
   * AI Model: Analyze Sentiment
   */
  async analyzeSentiment(textData) {
     // Simulate Sentiment Analysis
     return { score: Math.random(), label: "Neutral" };
  }
};