/**
 * InvoiceNow Module - Technical Documentation & Implementation Guide
 * 
 * ================================================================================
 * SINGAPORE INVOICENOW (PEPPOL) - PRODUCTION-READY MODULE
 * ================================================================================
 * 
 * This document provides comprehensive technical documentation for implementing
 * the InvoiceNow module following IMDA and Peppol specifications.
 * 
 * REFERENCES:
 * - IMDA InvoiceNow: https://www.imda.gov.sg/how-we-can-help/invoicenow
 * - Singapore Peppol Guide: https://peppolguide.sg/
 * - Peppol BIS Billing 3.0: https://docs.peppol.eu/poacc/billing/3.0/
 * - IRAS GST Guide: https://www.iras.gov.sg/taxes/goods-services-tax-(gst)
 */

// ================================================================================
// 1. ARCHITECTURE OVERVIEW
// ================================================================================

/**
 * Peppol 5-Corner Model Architecture:
 * 
 * ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 * │   Corner 1  │     │   Corner 2  │     │   Corner 3  │     │   Corner 4  │     │   Corner 5  │
 * │   Seller    │────▶│  Seller AP  │────▶│  Peppol     │────▶│  Buyer AP   │────▶│   Buyer     │
 * │   (You)     │     │  (IRSP/AP)  │     │  Network    │     │  (AP)       │     │  (Customer) │
 * └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
 *       │                   │                   │                   │                   │
 *       │                   │                   │                   │                   │
 *       ▼                   ▼                   ▼                   ▼                   ▼
 *   ERP/Invoice         UBL XML            AS4 Message          UBL XML            ERP/Invoice
 *   Module              Generation         Delivery             Parsing            Receipt
 * 
 * 
 * IRSP (InvoiceNow-Ready Solution Provider) Model:
 * - This module acts as an IRSP
 * - Connects to IMDA-accredited Access Points (APs)
 * - Does NOT act as an AP itself
 * 
 * Supported AP Integrations:
 * 1. Storecove (REST API)
 * 2. InvoiceCloud (REST API)
 * 3. Direct AS4 Integration (with PKI certificates)
 * 4. Custom AP connectors via abstraction layer
 */

// ================================================================================
// 2. DATA MODELS
// ================================================================================

export const DATA_MODELS = {
  /**
   * PeppolInvoice Entity
   * - Core invoice data model for Peppol transmission
   * - Stores all UBL-required fields
   * - Tracks transmission status and audit trail
   */
  PeppolInvoice: {
    description: 'Core invoice entity for Peppol e-invoicing',
    key_fields: [
      'invoice_number (BT-1)',
      'issue_date (BT-2)',
      'invoice_type_code (BT-3): 380=Invoice, 381=Credit Note',
      'currency_code (BT-5): SGD default',
      'seller_peppol_id (BT-29): 0195:UEN format',
      'buyer_peppol_id (BT-46)',
      'line_items[]: Description, qty, price, tax',
      'peppol_status: draft→queued→sent→delivered',
      'ubl_xml: Generated UBL document'
    ]
  },

  /**
   * PeppolCounterparty Entity
   * - Trading partners (customers/suppliers)
   * - Stores Peppol ID and capabilities from SMP
   */
  PeppolCounterparty: {
    description: 'Trading partner Peppol registration',
    key_fields: [
      'peppol_id: 0195:UEN format',
      'uen: Singapore business registration',
      'capabilities[]: From SMP lookup',
      'gst_registered: For GST validation',
      'smp_check_status: verified/not_found'
    ]
  },

  /**
   * PeppolAPConnector Entity
   * - Access Point connection configuration
   * - Supports multiple APs with abstraction layer
   */
  PeppolAPConnector: {
    description: 'Access Point connection settings',
    key_fields: [
      'provider: storecove/invoicecloud/peppol_direct',
      'api_base_url',
      'api_key/api_secret (encrypted)',
      'environment: sandbox/production',
      'retry_config: Exponential backoff settings'
    ]
  },

  /**
   * PeppolCertificate Entity
   * - PKI certificate storage (encrypted)
   * - Expiry tracking and rotation alerts
   */
  PeppolCertificate: {
    description: 'PKI certificate management',
    key_fields: [
      'certificate_type: ap_client/signing/tls',
      'certificate_pem (encrypted)',
      'private_key_pem (encrypted)',
      'valid_from/valid_to',
      'expiry_notification_days[]'
    ]
  },

  /**
   * PeppolAuditLog Entity
   * - Tamper-evident audit trail
   * - Required for compliance
   */
  PeppolAuditLog: {
    description: 'Compliance audit log',
    key_fields: [
      'event_type: invoice_sent/delivered/rejected',
      'invoice_id',
      'request_payload/response_payload',
      'hash/previous_hash: Chain integrity'
    ]
  }
};

// ================================================================================
// 3. API SPECIFICATION (OpenAPI-style)
// ================================================================================

export const API_SPECIFICATION = {
  /**
   * Send Invoice Endpoint
   * POST /api/invoicenow/send
   */
  sendInvoice: {
    method: 'POST',
    path: '/api/invoicenow/send',
    description: 'Validate, generate UBL, and queue invoice for transmission',
    request: {
      invoice_id: 'string - PeppolInvoice ID',
      connector_id: 'string? - Optional specific AP connector',
      async: 'boolean - Return immediately or wait for result'
    },
    response: {
      success: 'boolean',
      message_id: 'string - AP message ID',
      status: 'string - queued/sent/failed',
      validation_errors: 'array - If validation failed'
    },
    flow: [
      '1. Validate invoice data (mandatory fields, GST rules)',
      '2. Check buyer Peppol ID in directory',
      '3. Generate UBL XML (SG Peppol BIS 3.0)',
      '4. Queue for transmission',
      '5. Send via AP connector',
      '6. Log audit entry',
      '7. Return result'
    ]
  },

  /**
   * Receive Invoice Webhook
   * POST /api/invoicenow/webhook/receive
   */
  receiveWebhook: {
    method: 'POST',
    path: '/api/invoicenow/webhook/receive',
    description: 'Handle incoming invoices from AP',
    request: {
      payload: 'AP-specific webhook payload',
      signature: 'HMAC signature for verification'
    },
    response: {
      acknowledged: 'boolean'
    },
    flow: [
      '1. Verify webhook signature',
      '2. Parse UBL XML from payload',
      '3. Map to internal invoice format',
      '4. Create PeppolInvoice record',
      '5. Notify relevant users',
      '6. Log audit entry'
    ]
  },

  /**
   * Directory Lookup
   * GET /api/invoicenow/directory/lookup
   */
  directoryLookup: {
    method: 'GET',
    path: '/api/invoicenow/directory/lookup',
    description: 'Query Peppol SMP for participant capabilities',
    request: {
      peppol_id: 'string - 0195:UEN format'
    },
    response: {
      found: 'boolean',
      participant: {
        peppol_id: 'string',
        legal_name: 'string',
        capabilities: 'array - Supported document types'
      }
    }
  },

  /**
   * Retry Failed Invoice
   * POST /api/invoicenow/retry/:invoice_id
   */
  retryInvoice: {
    method: 'POST',
    path: '/api/invoicenow/retry/:invoice_id',
    description: 'Retry sending a failed invoice'
  },

  /**
   * Cancel Invoice
   * POST /api/invoicenow/cancel/:invoice_id
   */
  cancelInvoice: {
    method: 'POST',
    path: '/api/invoicenow/cancel/:invoice_id',
    description: 'Cancel a queued invoice before transmission'
  }
};

// ================================================================================
// 4. UBL MAPPING TABLE (ERP → UBL)
// ================================================================================

export const UBL_MAPPING = {
  // Document Level
  'invoice_number': { ubl: 'cbc:ID', bt: 'BT-1', required: true },
  'issue_date': { ubl: 'cbc:IssueDate', bt: 'BT-2', required: true, format: 'YYYY-MM-DD' },
  'due_date': { ubl: 'cbc:DueDate', bt: 'BT-9', required: false },
  'invoice_type_code': { ubl: 'cbc:InvoiceTypeCode', bt: 'BT-3', required: true, values: ['380', '381', '383', '384'] },
  'currency_code': { ubl: 'cbc:DocumentCurrencyCode', bt: 'BT-5', required: true, default: 'SGD' },
  'buyer_reference': { ubl: 'cbc:BuyerReference', bt: 'BT-10', required: false },
  
  // Seller (BG-4)
  'seller_peppol_id': { ubl: 'cac:AccountingSupplierParty/cac:Party/cbc:EndpointID', bt: 'BT-29', required: true, scheme: '0195' },
  'seller_name': { ubl: 'cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName', bt: 'BT-27', required: true },
  'seller_uen': { ubl: 'cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity/cbc:CompanyID', bt: 'BT-30', scheme: '0195' },
  'seller_gst_number': { ubl: 'cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID', bt: 'BT-31' },
  'seller_address.street': { ubl: 'cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cbc:StreetName', bt: 'BT-35' },
  'seller_address.postal_code': { ubl: 'cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cbc:PostalZone', bt: 'BT-38' },
  'seller_address.country_code': { ubl: 'cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cac:Country/cbc:IdentificationCode', bt: 'BT-40', default: 'SG' },
  
  // Buyer (BG-7)
  'buyer_peppol_id': { ubl: 'cac:AccountingCustomerParty/cac:Party/cbc:EndpointID', bt: 'BT-46', required: true, scheme: '0195' },
  'buyer_name': { ubl: 'cac:AccountingCustomerParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName', bt: 'BT-44', required: true },
  'buyer_uen': { ubl: 'cac:AccountingCustomerParty/cac:Party/cac:PartyLegalEntity/cbc:CompanyID', bt: 'BT-47', scheme: '0195' },
  
  // Payment (BG-16)
  'payment_means_code': { ubl: 'cac:PaymentMeans/cbc:PaymentMeansCode', bt: 'BT-81', default: '30' },
  'payee_bank.account_number': { ubl: 'cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:ID', bt: 'BT-84' },
  'payee_bank.swift_code': { ubl: 'cac:PaymentMeans/cac:PayeeFinancialAccount/cac:FinancialInstitutionBranch/cbc:ID', bt: 'BT-86' },
  
  // Monetary Totals (BG-22)
  'subtotal': { ubl: 'cac:LegalMonetaryTotal/cbc:LineExtensionAmount', bt: 'BT-106', required: true },
  'tax_exclusive_amount': { ubl: 'cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount', bt: 'BT-109', required: true },
  'tax_amount': { ubl: 'cac:TaxTotal/cbc:TaxAmount', bt: 'BT-110', required: true },
  'tax_inclusive_amount': { ubl: 'cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount', bt: 'BT-112', required: true },
  'payable_amount': { ubl: 'cac:LegalMonetaryTotal/cbc:PayableAmount', bt: 'BT-115', required: true },
  
  // Invoice Lines (BG-25)
  'line_items[].line_id': { ubl: 'cac:InvoiceLine/cbc:ID', bt: 'BT-126', required: true },
  'line_items[].quantity': { ubl: 'cac:InvoiceLine/cbc:InvoicedQuantity', bt: 'BT-129', required: true },
  'line_items[].unit_code': { ubl: 'cac:InvoiceLine/cbc:InvoicedQuantity/@unitCode', bt: 'BT-130', default: 'EA' },
  'line_items[].line_amount': { ubl: 'cac:InvoiceLine/cbc:LineExtensionAmount', bt: 'BT-131', required: true },
  'line_items[].description': { ubl: 'cac:InvoiceLine/cac:Item/cbc:Description', bt: 'BT-154', required: true },
  'line_items[].unit_price': { ubl: 'cac:InvoiceLine/cac:Price/cbc:PriceAmount', bt: 'BT-146', required: true },
  'line_items[].tax_category': { ubl: 'cac:InvoiceLine/cac:Item/cac:ClassifiedTaxCategory/cbc:ID', bt: 'BT-151' },
  'line_items[].tax_rate': { ubl: 'cac:InvoiceLine/cac:Item/cac:ClassifiedTaxCategory/cbc:Percent', bt: 'BT-152' }
};

// ================================================================================
// 5. GST TAX CATEGORIES (SINGAPORE)
// ================================================================================

export const GST_CATEGORIES = {
  SR: {
    code: 'S',
    name: 'Standard Rate',
    rate: 9, // As of 2024
    description: 'Standard-rated supply (9% GST)',
    requirements: 'Seller must be GST-registered'
  },
  ZR: {
    code: 'Z',
    name: 'Zero Rate',
    rate: 0,
    description: 'Zero-rated supply (exports, international services)',
    requirements: 'Seller must be GST-registered'
  },
  ES: {
    code: 'E',
    name: 'Exempt Supply',
    rate: 0,
    description: 'Exempt supply (financial services, residential property)',
    requirements: 'Seller may or may not be GST-registered'
  },
  OS: {
    code: 'O',
    name: 'Out of Scope',
    rate: 0,
    description: 'Supply outside scope of GST',
    requirements: 'None'
  },
  NG: {
    code: 'O',
    name: 'Not GST Registered',
    rate: 0,
    description: 'Seller is not GST-registered',
    requirements: 'Seller must NOT charge GST'
  }
};

// ================================================================================
// 6. VALIDATION RULES SUMMARY
// ================================================================================

export const VALIDATION_RULES = {
  peppol: [
    'BR-01: Invoice number is required',
    'BR-02: Issue date is required',
    'BR-03: Invoice type code must be valid (380/381/383/384)',
    'BR-05: Currency code is required',
    'BR-06: Seller name is required',
    'BR-07: Buyer name is required',
    'BR-16: At least one invoice line required',
    'BR-CO-10: Line extension amount = sum of line amounts',
    'BR-CO-14: Tax amount = sum of tax category amounts',
    'BR-CO-15: Tax inclusive = Tax exclusive + Tax amount',
    'BR-CO-16: Payable = Tax inclusive - Prepaid + Rounding',
    'BR-55: Credit note must reference original invoice'
  ],
  singapore: [
    'SG-01: Seller Peppol ID required (format 0195:UEN)',
    'SG-02: Buyer Peppol ID required (format 0195:UEN)',
    'SG-03: UEN format validation',
    'SG-GST-01: Only GST-registered sellers can charge GST',
    'SG-GST-02: GST number required when charging GST',
    'SG-GST-03: GST rate must match current rate (9%)',
    'SG-GST-04: GST amount calculation validation',
    'SG-DIR-01: Buyer must accept document type (SMP check)'
  ]
};

// ================================================================================
// 7. IRSP ACCREDITATION CHECKLIST
// ================================================================================

export const IRSP_ACCREDITATION = {
  title: 'IMDA IRSP Accreditation Checklist',
  description: 'Steps to become an InvoiceNow-Ready Solution Provider',
  steps: [
    {
      phase: 'Preparation',
      tasks: [
        'Review IMDA InvoiceNow documentation',
        'Select IMDA-accredited Access Point partner',
        'Implement UBL 2.1 / SG Peppol BIS 3.0 mapping',
        'Implement validation rules (Peppol + Singapore)',
        'Set up PKI certificate handling'
      ]
    },
    {
      phase: 'Integration',
      tasks: [
        'Connect to AP sandbox environment',
        'Test send/receive flows',
        'Validate UBL output against official samples',
        'Implement error handling and retry logic',
        'Set up audit logging'
      ]
    },
    {
      phase: 'Testing',
      tasks: [
        'Run IMDA test scenarios',
        'Validate against SG Peppol XSD',
        'Test with 3 official sample invoices',
        'End-to-end testing with AP sandbox',
        'Security testing (PKI, data protection)'
      ]
    },
    {
      phase: 'Certification',
      tasks: [
        'Submit application to IMDA',
        'Complete self-assessment',
        'Provide test evidence',
        'Request production PKI certificate',
        'Complete accreditation review'
      ]
    },
    {
      phase: 'Production',
      tasks: [
        'Install production PKI certificate',
        'Switch to production AP endpoint',
        'Register Peppol Participant ID in SMP',
        'Set up monitoring and alerts',
        'Go live!'
      ]
    }
  ],
  links: {
    imda_overview: 'https://www.imda.gov.sg/how-we-can-help/invoicenow',
    imda_playbook: 'https://www.imda.gov.sg/-/media/imda/files/programme/invoicenow/invoicenow-technical-playbook.pdf',
    sg_peppol_guide: 'https://peppolguide.sg/',
    iras_gst: 'https://www.iras.gov.sg/taxes/goods-services-tax-(gst)',
    peppol_bis: 'https://docs.peppol.eu/poacc/billing/3.0/'
  }
};

// ================================================================================
// 8. IMPLEMENTATION ROADMAP
// ================================================================================

export const IMPLEMENTATION_ROADMAP = {
  mvp: {
    phase: 'MVP - Send Only',
    duration: '4-6 weeks',
    features: [
      'Invoice data model and UI',
      'UBL generation for basic invoices',
      'Validation rules (mandatory + GST)',
      'Sandbox AP connector',
      'Basic audit logging'
    ]
  },
  phase2: {
    phase: 'Phase 2 - Receive Flow',
    duration: '2-3 weeks',
    features: [
      'Webhook handler for incoming invoices',
      'UBL parsing and mapping',
      'Inbound invoice management UI',
      'Notification system'
    ]
  },
  phase3: {
    phase: 'Phase 3 - Credit Notes',
    duration: '1-2 weeks',
    features: [
      'Credit note UBL generation',
      'Preceding invoice reference',
      'Credit note UI flow'
    ]
  },
  phase4: {
    phase: 'Phase 4 - Production Ready',
    duration: '2-3 weeks',
    features: [
      'Production AP integration',
      'PKI certificate management',
      'Complete audit trail',
      'Monitoring and alerts',
      'Performance optimization'
    ]
  },
  phase5: {
    phase: 'Phase 5 - Accreditation',
    duration: '2-4 weeks',
    features: [
      'IMDA testing and validation',
      'Documentation',
      'Accreditation submission',
      'Go-live support'
    ]
  }
};

export default {
  DATA_MODELS,
  API_SPECIFICATION,
  UBL_MAPPING,
  GST_CATEGORIES,
  VALIDATION_RULES,
  IRSP_ACCREDITATION,
  IMPLEMENTATION_ROADMAP
};