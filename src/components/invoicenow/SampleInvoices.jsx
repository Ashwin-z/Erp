/**
 * Sample Invoice Payloads for Testing
 * 
 * These samples comply with Singapore Peppol BIS Billing 3.0
 * Use these for:
 * - Unit testing UBL generation
 * - Validation rule testing
 * - Integration testing with AP sandbox
 * 
 * Reference: IMDA InvoiceNow Sample Files
 */

/**
 * Sample 1: Basic GST Invoice
 * Standard commercial invoice with GST
 */
export const SAMPLE_BASIC_GST_INVOICE = {
  // Document identifiers
  invoice_number: 'INV-2024-001234',
  invoice_type_code: '380', // Commercial Invoice
  issue_date: '2024-01-15',
  due_date: '2024-02-14',
  tax_point_date: '2024-01-15',
  currency_code: 'SGD',
  
  // Buyer reference (PO number)
  buyer_reference: 'PO-2024-5678',
  
  // Seller (Supplier) details
  seller_peppol_id: '0195:T08GB0001A',
  seller_uen: 'T08GB0001A',
  seller_name: 'ACME Solutions Pte Ltd',
  seller_trading_name: 'ACME Solutions',
  seller_gst_number: 'M2-1234567-8',
  seller_gst_registered: true,
  seller_address: {
    street: '123 Business Park Drive',
    building: 'Tower A #05-01',
    city: 'Singapore',
    postal_code: '123456',
    country_code: 'SG'
  },
  seller_contact: {
    name: 'Accounts Receivable',
    phone: '+65 6789 0123',
    email: 'ar@acme.com.sg'
  },
  
  // Buyer (Customer) details
  buyer_peppol_id: '0195:T08GB0002B',
  buyer_uen: 'T08GB0002B',
  buyer_name: 'XYZ Corporation Pte Ltd',
  buyer_trading_name: 'XYZ Corp',
  buyer_gst_number: 'M2-7654321-0',
  buyer_address: {
    street: '456 Commerce Street',
    building: 'Level 10',
    city: 'Singapore',
    postal_code: '654321',
    country_code: 'SG'
  },
  buyer_contact: {
    name: 'Accounts Payable',
    email: 'ap@xyz.com.sg'
  },
  
  // Payment details
  payment_means_code: '30', // Credit Transfer
  payment_terms: 'Net 30 days from invoice date',
  payee_bank: {
    account_name: 'ACME Solutions Pte Ltd',
    account_number: '123-456789-0',
    bank_code: 'DBS',
    swift_code: 'DBSSSGSG'
  },
  
  // Line items (2 items with GST)
  line_items: [
    {
      line_id: '1',
      description: 'Professional Consulting Services - January 2024',
      quantity: 40,
      unit_code: 'HUR', // Hours
      unit_price: 150.00,
      line_amount: 6000.00,
      tax_category: 'SR', // Standard Rate
      tax_rate: 9,
      tax_amount: 540.00,
      seller_item_id: 'SVC-CONSULT'
    },
    {
      line_id: '2',
      description: 'Software License - Annual Subscription',
      quantity: 5,
      unit_code: 'EA', // Each
      unit_price: 200.00,
      line_amount: 1000.00,
      tax_category: 'SR',
      tax_rate: 9,
      tax_amount: 90.00,
      seller_item_id: 'LIC-ANNUAL'
    }
  ],
  
  // Tax breakdown
  tax_subtotals: [
    {
      tax_category: 'SR',
      tax_rate: 9,
      taxable_amount: 7000.00,
      tax_amount: 630.00
    }
  ],
  
  // Totals
  subtotal: 7000.00,
  total_allowances: 0,
  total_charges: 0,
  tax_exclusive_amount: 7000.00,
  tax_amount: 630.00,
  tax_inclusive_amount: 7630.00,
  prepaid_amount: 0,
  rounding_amount: 0,
  payable_amount: 7630.00,
  
  // Notes
  notes: [
    'Thank you for your business.',
    'Payment is due within 30 days.'
  ]
};

/**
 * Sample 2: Zero-Rated Export Invoice
 * Invoice for export services (0% GST)
 */
export const SAMPLE_ZERO_RATED_INVOICE = {
  invoice_number: 'INV-2024-001235',
  invoice_type_code: '380',
  issue_date: '2024-01-16',
  due_date: '2024-02-15',
  currency_code: 'SGD',
  
  seller_peppol_id: '0195:T08GB0001A',
  seller_uen: 'T08GB0001A',
  seller_name: 'ACME Solutions Pte Ltd',
  seller_gst_number: 'M2-1234567-8',
  seller_gst_registered: true,
  seller_address: {
    street: '123 Business Park Drive',
    city: 'Singapore',
    postal_code: '123456',
    country_code: 'SG'
  },
  
  // International buyer
  buyer_peppol_id: '0195:AUSBUSINESS1',
  buyer_uen: 'AUSBUSINESS1',
  buyer_name: 'Australian Client Pty Ltd',
  buyer_address: {
    street: '100 Collins Street',
    city: 'Melbourne',
    postal_code: '3000',
    country_code: 'AU'
  },
  
  payment_means_code: '30',
  payment_terms: 'Net 30 days',
  payee_bank: {
    account_name: 'ACME Solutions Pte Ltd',
    account_number: '123-456789-0',
    swift_code: 'DBSSSGSG'
  },
  
  line_items: [
    {
      line_id: '1',
      description: 'International Consulting Services - Exported',
      quantity: 20,
      unit_code: 'HUR',
      unit_price: 200.00,
      line_amount: 4000.00,
      tax_category: 'ZR', // Zero-Rated
      tax_rate: 0,
      tax_amount: 0
    }
  ],
  
  tax_subtotals: [
    {
      tax_category: 'ZR',
      tax_rate: 0,
      taxable_amount: 4000.00,
      tax_amount: 0
    }
  ],
  
  subtotal: 4000.00,
  tax_exclusive_amount: 4000.00,
  tax_amount: 0,
  tax_inclusive_amount: 4000.00,
  payable_amount: 4000.00,
  
  notes: [
    'Zero-rated supply - International services',
    'GST not applicable for export services'
  ]
};

/**
 * Sample 3: Credit Note
 * Credit note referencing an original invoice
 */
export const SAMPLE_CREDIT_NOTE = {
  invoice_number: 'CN-2024-000001',
  invoice_type_code: '381', // Credit Note
  issue_date: '2024-01-20',
  currency_code: 'SGD',
  
  // Reference to original invoice
  preceding_invoice_ref: 'INV-2024-001234',
  
  seller_peppol_id: '0195:T08GB0001A',
  seller_uen: 'T08GB0001A',
  seller_name: 'ACME Solutions Pte Ltd',
  seller_gst_number: 'M2-1234567-8',
  seller_gst_registered: true,
  seller_address: {
    street: '123 Business Park Drive',
    city: 'Singapore',
    postal_code: '123456',
    country_code: 'SG'
  },
  
  buyer_peppol_id: '0195:T08GB0002B',
  buyer_uen: 'T08GB0002B',
  buyer_name: 'XYZ Corporation Pte Ltd',
  buyer_address: {
    street: '456 Commerce Street',
    city: 'Singapore',
    postal_code: '654321',
    country_code: 'SG'
  },
  
  line_items: [
    {
      line_id: '1',
      description: 'Credit for overpayment - Invoice INV-2024-001234',
      quantity: 1,
      unit_code: 'EA',
      unit_price: 500.00,
      line_amount: 500.00,
      tax_category: 'SR',
      tax_rate: 9,
      tax_amount: 45.00
    }
  ],
  
  tax_subtotals: [
    {
      tax_category: 'SR',
      tax_rate: 9,
      taxable_amount: 500.00,
      tax_amount: 45.00
    }
  ],
  
  subtotal: 500.00,
  tax_exclusive_amount: 500.00,
  tax_amount: 45.00,
  tax_inclusive_amount: 545.00,
  payable_amount: 545.00,
  
  notes: [
    'Credit note for Invoice INV-2024-001234',
    'Reason: Overpayment adjustment'
  ]
};

/**
 * Sample 4: Mixed Tax Invoice
 * Invoice with both standard-rated and zero-rated items
 */
export const SAMPLE_MIXED_TAX_INVOICE = {
  invoice_number: 'INV-2024-001236',
  invoice_type_code: '380',
  issue_date: '2024-01-18',
  due_date: '2024-02-17',
  currency_code: 'SGD',
  
  seller_peppol_id: '0195:T08GB0001A',
  seller_uen: 'T08GB0001A',
  seller_name: 'ACME Solutions Pte Ltd',
  seller_gst_number: 'M2-1234567-8',
  seller_gst_registered: true,
  seller_address: {
    street: '123 Business Park Drive',
    city: 'Singapore',
    postal_code: '123456',
    country_code: 'SG'
  },
  
  buyer_peppol_id: '0195:T08GB0002B',
  buyer_uen: 'T08GB0002B',
  buyer_name: 'XYZ Corporation Pte Ltd',
  buyer_address: {
    street: '456 Commerce Street',
    city: 'Singapore',
    postal_code: '654321',
    country_code: 'SG'
  },
  
  payment_means_code: '30',
  payment_terms: 'Net 30 days',
  
  line_items: [
    {
      line_id: '1',
      description: 'Local Consulting Services',
      quantity: 10,
      unit_code: 'HUR',
      unit_price: 100.00,
      line_amount: 1000.00,
      tax_category: 'SR', // Standard Rate
      tax_rate: 9,
      tax_amount: 90.00
    },
    {
      line_id: '2',
      description: 'Exported Software Development',
      quantity: 20,
      unit_code: 'HUR',
      unit_price: 150.00,
      line_amount: 3000.00,
      tax_category: 'ZR', // Zero-Rated (export)
      tax_rate: 0,
      tax_amount: 0
    },
    {
      line_id: '3',
      description: 'Financial Advisory (Exempt)',
      quantity: 5,
      unit_code: 'HUR',
      unit_price: 200.00,
      line_amount: 1000.00,
      tax_category: 'ES', // Exempt Supply
      tax_rate: 0,
      tax_amount: 0
    }
  ],
  
  tax_subtotals: [
    {
      tax_category: 'SR',
      tax_rate: 9,
      taxable_amount: 1000.00,
      tax_amount: 90.00
    },
    {
      tax_category: 'ZR',
      tax_rate: 0,
      taxable_amount: 3000.00,
      tax_amount: 0
    },
    {
      tax_category: 'ES',
      tax_rate: 0,
      taxable_amount: 1000.00,
      tax_amount: 0
    }
  ],
  
  subtotal: 5000.00,
  tax_exclusive_amount: 5000.00,
  tax_amount: 90.00,
  tax_inclusive_amount: 5090.00,
  payable_amount: 5090.00,
  
  notes: [
    'Mixed supply invoice with multiple GST treatments'
  ]
};

/**
 * Sample 5: Non-GST Registered Seller Invoice
 * For sellers not registered for GST
 */
export const SAMPLE_NON_GST_INVOICE = {
  invoice_number: 'INV-2024-001237',
  invoice_type_code: '380',
  issue_date: '2024-01-19',
  due_date: '2024-02-18',
  currency_code: 'SGD',
  
  seller_peppol_id: '0195:T08GB0003C',
  seller_uen: 'T08GB0003C',
  seller_name: 'Small Business Pte Ltd',
  seller_gst_registered: false, // NOT GST registered
  seller_address: {
    street: '789 Small Street',
    city: 'Singapore',
    postal_code: '789012',
    country_code: 'SG'
  },
  
  buyer_peppol_id: '0195:T08GB0002B',
  buyer_uen: 'T08GB0002B',
  buyer_name: 'XYZ Corporation Pte Ltd',
  buyer_address: {
    street: '456 Commerce Street',
    city: 'Singapore',
    postal_code: '654321',
    country_code: 'SG'
  },
  
  payment_means_code: '30',
  payment_terms: 'Due on receipt',
  
  line_items: [
    {
      line_id: '1',
      description: 'Design Services',
      quantity: 1,
      unit_code: 'EA',
      unit_price: 800.00,
      line_amount: 800.00,
      tax_category: 'NG', // Not GST Registered
      tax_rate: 0,
      tax_amount: 0
    }
  ],
  
  tax_subtotals: [
    {
      tax_category: 'NG',
      tax_rate: 0,
      taxable_amount: 800.00,
      tax_amount: 0
    }
  ],
  
  subtotal: 800.00,
  tax_exclusive_amount: 800.00,
  tax_amount: 0,
  tax_inclusive_amount: 800.00,
  payable_amount: 800.00,
  
  notes: [
    'This invoice does not include GST.',
    'Seller is not GST-registered.'
  ]
};

/**
 * Sample 6: Invoice with Allowances and Charges
 * Demonstrates discounts and additional charges
 */
export const SAMPLE_ALLOWANCES_CHARGES_INVOICE = {
  invoice_number: 'INV-2024-001238',
  invoice_type_code: '380',
  issue_date: '2024-01-20',
  due_date: '2024-02-19',
  currency_code: 'SGD',
  
  seller_peppol_id: '0195:T08GB0001A',
  seller_uen: 'T08GB0001A',
  seller_name: 'ACME Solutions Pte Ltd',
  seller_gst_number: 'M2-1234567-8',
  seller_gst_registered: true,
  seller_address: {
    street: '123 Business Park Drive',
    city: 'Singapore',
    postal_code: '123456',
    country_code: 'SG'
  },
  
  buyer_peppol_id: '0195:T08GB0002B',
  buyer_uen: 'T08GB0002B',
  buyer_name: 'XYZ Corporation Pte Ltd',
  buyer_address: {
    street: '456 Commerce Street',
    city: 'Singapore',
    postal_code: '654321',
    country_code: 'SG'
  },
  
  payment_means_code: '30',
  payment_terms: 'Net 30 days',
  
  line_items: [
    {
      line_id: '1',
      description: 'Product A',
      quantity: 10,
      unit_code: 'EA',
      unit_price: 100.00,
      line_amount: 1000.00,
      tax_category: 'SR',
      tax_rate: 9,
      tax_amount: 90.00,
      allowance_charges: [
        {
          is_charge: false, // Discount
          reason: 'Volume Discount 10%',
          amount: 100.00
        }
      ]
    }
  ],
  
  // Document-level allowances and charges
  document_allowances: [
    {
      is_charge: false,
      reason_code: '95',
      reason: 'Early Payment Discount',
      amount: 50.00,
      tax_category: 'SR',
      tax_rate: 9
    },
    {
      is_charge: true,
      reason_code: 'FC',
      reason: 'Freight Charge',
      amount: 30.00,
      tax_category: 'SR',
      tax_rate: 9
    }
  ],
  
  tax_subtotals: [
    {
      tax_category: 'SR',
      tax_rate: 9,
      taxable_amount: 880.00, // 1000 - 100 - 50 + 30
      tax_amount: 79.20
    }
  ],
  
  subtotal: 1000.00, // Line total before allowances
  total_allowances: 150.00, // 100 + 50
  total_charges: 30.00,
  tax_exclusive_amount: 880.00,
  tax_amount: 79.20,
  tax_inclusive_amount: 959.20,
  payable_amount: 959.20,
  
  notes: [
    'Includes 10% volume discount and 5% early payment discount',
    'Freight charges apply'
  ]
};

// Export all samples for testing
export const ALL_SAMPLES = {
  SAMPLE_BASIC_GST_INVOICE,
  SAMPLE_ZERO_RATED_INVOICE,
  SAMPLE_CREDIT_NOTE,
  SAMPLE_MIXED_TAX_INVOICE,
  SAMPLE_NON_GST_INVOICE,
  SAMPLE_ALLOWANCES_CHARGES_INVOICE
};

export default ALL_SAMPLES;