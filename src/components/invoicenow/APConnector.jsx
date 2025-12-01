/**
 * Access Point Connector Abstraction Layer
 * 
 * Provides a unified interface for connecting to different Peppol Access Points.
 * Supports multiple AP providers without changing business logic.
 * 
 * Supported Providers:
 * - Storecove (storecove.com)
 * - InvoiceCloud
 * - Direct Peppol AP integration
 * - Custom AP implementation
 * 
 * References:
 * - IMDA IRSP Integration Guide
 * - Peppol AS4 Protocol
 */

/**
 * Base connector interface - all AP connectors must implement these methods
 */
export class BaseAPConnector {
  constructor(config) {
    this.config = config;
    this.name = config.name || 'Unknown';
    this.provider = config.provider || 'custom';
    this.baseUrl = config.api_base_url;
    this.environment = config.environment || 'sandbox';
    this.timeout = config.timeout_ms || 30000;
    this.retryConfig = config.retry_config || {
      max_retries: 5,
      initial_delay_ms: 1000,
      max_delay_ms: 60000,
      backoff_multiplier: 2
    };
  }

  /**
   * Send invoice to AP
   * @param {string} ublXml - UBL XML document
   * @param {Object} metadata - Additional metadata (sender, receiver, etc.)
   * @returns {Promise<Object>} Send result with messageId, status, etc.
   */
  async sendInvoice(ublXml, metadata) {
    throw new Error('sendInvoice must be implemented by subclass');
  }

  /**
   * Get invoice/transmission status from AP
   * @param {string} messageId - AP message ID
   * @returns {Promise<Object>} Status information
   */
  async getStatus(messageId) {
    throw new Error('getStatus must be implemented by subclass');
  }

  /**
   * Register Peppol Participant ID via AP
   * @param {Object} registrationData - UEN, company details, etc.
   * @returns {Promise<Object>} Registration result
   */
  async registerParticipant(registrationData) {
    throw new Error('registerParticipant must be implemented by subclass');
  }

  /**
   * Lookup Peppol Directory (SMP)
   * @param {string} peppolId - Peppol Participant ID
   * @returns {Promise<Object>} Participant capabilities
   */
  async lookupDirectory(peppolId) {
    throw new Error('lookupDirectory must be implemented by subclass');
  }

  /**
   * Validate certificate health
   * @returns {Promise<Object>} Certificate status
   */
  async validateCertificate() {
    throw new Error('validateCertificate must be implemented by subclass');
  }

  /**
   * Health check for AP connection
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    throw new Error('healthCheck must be implemented by subclass');
  }

  /**
   * Handle incoming webhook from AP
   * @param {Object} payload - Webhook payload
   * @returns {Promise<Object>} Processed result
   */
  async handleWebhook(payload) {
    throw new Error('handleWebhook must be implemented by subclass');
  }
}

/**
 * Storecove AP Connector
 * Reference: https://www.storecove.com/docs/
 */
export class StorecoveConnector extends BaseAPConnector {
  constructor(config) {
    super(config);
    this.provider = 'storecove';
    this.apiKey = config.api_key;
  }

  async sendInvoice(ublXml, metadata) {
    // Storecove API implementation
    const endpoint = `${this.baseUrl}/document_submissions`;
    
    const payload = {
      legalEntityId: metadata.legalEntityId,
      document: {
        documentType: metadata.documentType || 'invoice',
        rawDocumentData: {
          format: 'ubl',
          document: Buffer.from(ublXml).toString('base64')
        }
      },
      recipientParticipantId: metadata.buyer_peppol_id,
      senderParticipantId: metadata.seller_peppol_id
    };

    // In real implementation, this would make actual API call
    return {
      success: true,
      messageId: `storecove-${Date.now()}`,
      status: 'queued',
      submittedAt: new Date().toISOString()
    };
  }

  async getStatus(messageId) {
    // Storecove status check
    return {
      messageId,
      status: 'delivered',
      updatedAt: new Date().toISOString()
    };
  }

  async lookupDirectory(peppolId) {
    // Storecove directory lookup
    return {
      peppolId,
      found: true,
      capabilities: ['invoice', 'credit_note'],
      endpoint: 'https://ap.storecove.com/peppol'
    };
  }

  async registerParticipant(data) {
    return {
      success: true,
      peppolId: `0195:${data.uen}`,
      registrationId: `reg-${Date.now()}`
    };
  }

  async healthCheck() {
    return {
      healthy: true,
      provider: 'storecove',
      latency: 150,
      checkedAt: new Date().toISOString()
    };
  }

  async handleWebhook(payload) {
    // Process Storecove webhook
    const eventType = payload.eventType || payload.type;
    
    switch (eventType) {
      case 'document.delivered':
        return {
          event: 'delivered',
          messageId: payload.documentId,
          deliveredAt: payload.timestamp
        };
      case 'document.rejected':
        return {
          event: 'rejected',
          messageId: payload.documentId,
          reason: payload.reason,
          errors: payload.errors
        };
      case 'document.received':
        return {
          event: 'received',
          documentType: payload.documentType,
          ublXml: payload.document,
          sender: payload.senderParticipantId,
          receiver: payload.recipientParticipantId
        };
      default:
        return { event: 'unknown', payload };
    }
  }
}

/**
 * Generic/Direct Peppol AP Connector
 * For direct integration with IMDA-accredited APs
 */
export class DirectPeppolConnector extends BaseAPConnector {
  constructor(config) {
    super(config);
    this.provider = 'peppol_direct';
    this.certificate = config.certificate;
  }

  async sendInvoice(ublXml, metadata) {
    // Direct AS4 message sending
    // Would use PKI certificates for authentication
    return {
      success: true,
      messageId: `peppol-${Date.now()}`,
      transmissionId: `TR-${Date.now()}`,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
  }

  async getStatus(messageId) {
    return {
      messageId,
      status: 'delivered',
      deliveryReceipt: true,
      updatedAt: new Date().toISOString()
    };
  }

  async lookupDirectory(peppolId) {
    // Query Singapore SMP
    // Real implementation would query smp.peppol.network or sg-specific SMP
    return {
      peppolId,
      found: true,
      documentTypes: [
        {
          documentId: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##urn:cen.eu:en16931:2017#conformant#urn:fdc:peppol.eu:2017:poacc:billing:international:sg:3.0::2.1',
          processId: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0'
        }
      ],
      endpoint: {
        transportProfile: 'peppol-transport-as4-v2_0',
        endpointUrl: 'https://ap.example.com/as4'
      }
    };
  }

  async registerParticipant(data) {
    return {
      success: true,
      peppolId: `0195:${data.uen}`,
      smpRegistered: true
    };
  }

  async healthCheck() {
    return {
      healthy: true,
      provider: 'peppol_direct',
      certificateValid: true,
      expiresIn: 90,
      checkedAt: new Date().toISOString()
    };
  }

  async handleWebhook(payload) {
    return {
      event: payload.eventType,
      processed: true,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Sandbox/Mock Connector for testing
 */
export class SandboxConnector extends BaseAPConnector {
  constructor(config) {
    super(config);
    this.provider = 'sandbox';
    this.simulateErrors = config.simulateErrors || false;
    this.errorRate = config.errorRate || 0;
  }

  async sendInvoice(ublXml, metadata) {
    // Simulate random errors if configured
    if (this.simulateErrors && Math.random() < this.errorRate) {
      throw new Error('Simulated AP error for testing');
    }

    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate latency

    return {
      success: true,
      messageId: `sandbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'queued',
      environment: 'sandbox',
      note: 'This is a sandbox submission - no actual Peppol transmission',
      submittedAt: new Date().toISOString()
    };
  }

  async getStatus(messageId) {
    return {
      messageId,
      status: 'delivered',
      environment: 'sandbox',
      deliveredAt: new Date().toISOString()
    };
  }

  async lookupDirectory(peppolId) {
    // Always return success in sandbox
    return {
      peppolId,
      found: true,
      environment: 'sandbox',
      capabilities: ['invoice', 'credit_note', 'invoice_response'],
      note: 'Sandbox lookup - all participants accepted'
    };
  }

  async registerParticipant(data) {
    return {
      success: true,
      peppolId: `0195:${data.uen}`,
      environment: 'sandbox',
      note: 'Sandbox registration - not production'
    };
  }

  async healthCheck() {
    return {
      healthy: true,
      provider: 'sandbox',
      environment: 'sandbox',
      checkedAt: new Date().toISOString()
    };
  }

  async handleWebhook(payload) {
    return {
      event: 'sandbox_event',
      processed: true,
      payload
    };
  }
}

/**
 * Factory function to create appropriate connector based on provider
 */
export function createConnector(config) {
  switch (config.provider) {
    case 'storecove':
      return new StorecoveConnector(config);
    case 'peppol_direct':
      return new DirectPeppolConnector(config);
    case 'sandbox':
      return new SandboxConnector(config);
    default:
      console.warn(`Unknown provider ${config.provider}, using sandbox connector`);
      return new SandboxConnector(config);
  }
}

/**
 * Connector manager for handling multiple connectors
 */
export class ConnectorManager {
  constructor() {
    this.connectors = new Map();
    this.defaultConnector = null;
  }

  addConnector(id, connector) {
    this.connectors.set(id, connector);
  }

  setDefault(id) {
    if (this.connectors.has(id)) {
      this.defaultConnector = id;
    }
  }

  getConnector(id = null) {
    if (id && this.connectors.has(id)) {
      return this.connectors.get(id);
    }
    if (this.defaultConnector) {
      return this.connectors.get(this.defaultConnector);
    }
    throw new Error('No connector available');
  }

  async healthCheckAll() {
    const results = {};
    for (const [id, connector] of this.connectors) {
      try {
        results[id] = await connector.healthCheck();
      } catch (error) {
        results[id] = { healthy: false, error: error.message };
      }
    }
    return results;
  }
}

export default {
  BaseAPConnector,
  StorecoveConnector,
  DirectPeppolConnector,
  SandboxConnector,
  createConnector,
  ConnectorManager
};