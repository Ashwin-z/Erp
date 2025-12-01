/**
 * InvoiceNow Validation Rules
 * 
 * Implements validation rules for Singapore Peppol BIS Billing 3.0
 * References:
 * - IMDA InvoiceNow Technical Playbook
 * - Peppol BIS Billing 3.0 Business Rules
 * - IRAS GST Requirements
 * 
 * Rule Prefixes:
 * - BR-*: Peppol Business Rules
 * - BR-CO-*: Peppol Calculation Rules
 * - SG-*: Singapore-specific Rules
 * - SG-GST-*: IRAS GST Rules
 */

// Validation severity levels
export const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Singapore GST Rate (as of 2024)
const CURRENT_GST_RATE = 9;

/**
 * Validate invoice mandatory fields (Peppol BR rules)
 */
export function validateMandatoryFields(invoice) {
  const errors = [];
  
  // BR-01: Invoice number
  if (!invoice.invoice_number?.trim()) {
    errors.push({
      code: 'BR-01',
      field: 'invoice_number',
      message: 'An Invoice shall have an Invoice number (BT-1).',
      severity: SEVERITY.ERROR
    });
  }
  
  // BR-02: Invoice issue date
  if (!invoice.issue_date) {
    errors.push({
      code: 'BR-02',
      field: 'issue_date',
      message: 'An Invoice shall have an Invoice issue date (BT-2).',
      severity: SEVERITY.ERROR
    });
  }
  
  // BR-03: Invoice type code
  if (!invoice.invoice_type_code) {
    errors.push({
      code: 'BR-03',
      field: 'invoice_type_code',
      message: 'An Invoice shall have an Invoice type code (BT-3).',
      severity: SEVERITY.ERROR
    });
  } else if (!['380', '381', '383', '384'].includes(invoice.invoice_type_code)) {
    errors.push({
      code: 'BR-03',
      field: 'invoice_type_code',
      message: 'Invoice type code must be 380 (Invoice), 381 (Credit Note), 383 (Debit Note), or 384 (Corrected Invoice).',
      severity: SEVERITY.ERROR
    });
  }
  
  // BR-05: Document currency code
  if (!invoice.currency_code?.trim()) {
    errors.push({
      code: 'BR-05',
      field: 'currency_code',
      message: 'An Invoice shall have an Invoice currency code (BT-5).',
      severity: SEVERITY.ERROR
    });
  }
  
  // BR-06: Seller name
  if (!invoice.seller_name?.trim()) {
    errors.push({
      code: 'BR-06',
      field: 'seller_name',
      message: 'An Invoice shall contain the Seller name (BT-27).',
      severity: SEVERITY.ERROR
    });
  }
  
  // BR-07: Buyer name
  if (!invoice.buyer_name?.trim()) {
    errors.push({
      code: 'BR-07',
      field: 'buyer_name',
      message: 'An Invoice shall contain the Buyer name (BT-44).',
      severity: SEVERITY.ERROR
    });
  }
  
  // BR-16: At least one invoice line
  if (!invoice.line_items || invoice.line_items.length === 0) {
    errors.push({
      code: 'BR-16',
      field: 'line_items',
      message: 'An Invoice shall have at least one Invoice line (BG-25).',
      severity: SEVERITY.ERROR
    });
  }
  
  return errors;
}

/**
 * Validate invoice line items
 */
export function validateLineItems(invoice) {
  const errors = [];
  
  if (!invoice.line_items) return errors;
  
  invoice.line_items.forEach((line, index) => {
    const lineNum = index + 1;
    const prefix = `line_items[${index}]`;
    
    // BR-21: Line identifier
    if (!line.line_id && line.line_id !== 0) {
      errors.push({
        code: `BR-21`,
        field: `${prefix}.line_id`,
        message: `Line ${lineNum}: Invoice line identifier is required (BT-126).`,
        severity: SEVERITY.ERROR
      });
    }
    
    // BR-22: Invoiced quantity
    if (line.quantity === undefined || line.quantity === null) {
      errors.push({
        code: `BR-22`,
        field: `${prefix}.quantity`,
        message: `Line ${lineNum}: Invoiced quantity is required (BT-129).`,
        severity: SEVERITY.ERROR
      });
    }
    
    // BR-23: Invoiced quantity unit
    if (!line.unit_code?.trim()) {
      errors.push({
        code: `BR-23`,
        field: `${prefix}.unit_code`,
        message: `Line ${lineNum}: Invoiced quantity unit of measure code is required (BT-130).`,
        severity: SEVERITY.WARNING
      });
    }
    
    // BR-24: Line net amount
    if (line.line_amount === undefined || line.line_amount === null) {
      errors.push({
        code: `BR-24`,
        field: `${prefix}.line_amount`,
        message: `Line ${lineNum}: Invoice line net amount is required (BT-131).`,
        severity: SEVERITY.ERROR
      });
    }
    
    // BR-25: Item description
    if (!line.description?.trim()) {
      errors.push({
        code: `BR-25`,
        field: `${prefix}.description`,
        message: `Line ${lineNum}: Item description is required (BT-154).`,
        severity: SEVERITY.ERROR
      });
    }
    
    // BR-26: Item price
    if (line.unit_price === undefined || line.unit_price === null) {
      errors.push({
        code: `BR-26`,
        field: `${prefix}.unit_price`,
        message: `Line ${lineNum}: Item net price is required (BT-146).`,
        severity: SEVERITY.ERROR
      });
    }
    
    // Validate line calculation
    if (line.quantity !== undefined && line.unit_price !== undefined && line.line_amount !== undefined) {
      const calculated = Number(line.quantity) * Number(line.unit_price);
      const declared = Number(line.line_amount);
      if (Math.abs(calculated - declared) > 0.01) {
        errors.push({
          code: `BR-CO-04`,
          field: `${prefix}.line_amount`,
          message: `Line ${lineNum}: Line amount (${declared.toFixed(2)}) does not match quantity × price (${calculated.toFixed(2)}).`,
          severity: SEVERITY.ERROR
        });
      }
    }
  });
  
  return errors;
}

/**
 * Validate monetary totals and calculations
 */
export function validateCalculations(invoice) {
  const errors = [];
  
  // Calculate line totals
  if (invoice.line_items && invoice.line_items.length > 0) {
    const calculatedSubtotal = invoice.line_items.reduce((sum, line) => 
      sum + (Number(line.line_amount) || 0), 0);
    
    // BR-CO-10: Sum of line amounts
    if (invoice.subtotal !== undefined) {
      if (Math.abs(calculatedSubtotal - Number(invoice.subtotal)) > 0.01) {
        errors.push({
          code: 'BR-CO-10',
          field: 'subtotal',
          message: `Line extension amount (${invoice.subtotal}) must equal sum of line amounts (${calculatedSubtotal.toFixed(2)}).`,
          severity: SEVERITY.ERROR
        });
      }
    }
    
    // Calculate tax from lines
    const calculatedTax = invoice.line_items.reduce((sum, line) => 
      sum + (Number(line.tax_amount) || 0), 0);
    
    // BR-CO-14: Tax amount validation
    if (invoice.tax_amount !== undefined && invoice.tax_subtotals) {
      const subtotalTax = invoice.tax_subtotals.reduce((sum, st) => 
        sum + (Number(st.tax_amount) || 0), 0);
      if (Math.abs(subtotalTax - Number(invoice.tax_amount)) > 0.01) {
        errors.push({
          code: 'BR-CO-14',
          field: 'tax_amount',
          message: `Invoice total VAT amount (${invoice.tax_amount}) must equal sum of category amounts (${subtotalTax.toFixed(2)}).`,
          severity: SEVERITY.ERROR
        });
      }
    }
  }
  
  // BR-CO-15: Invoice total with VAT = Invoice total without VAT + Invoice total VAT
  if (invoice.tax_exclusive_amount !== undefined && 
      invoice.tax_amount !== undefined && 
      invoice.tax_inclusive_amount !== undefined) {
    const calculated = Number(invoice.tax_exclusive_amount) + Number(invoice.tax_amount);
    if (Math.abs(calculated - Number(invoice.tax_inclusive_amount)) > 0.01) {
      errors.push({
        code: 'BR-CO-15',
        field: 'tax_inclusive_amount',
        message: `Tax inclusive amount (${invoice.tax_inclusive_amount}) must equal tax exclusive (${invoice.tax_exclusive_amount}) + tax (${invoice.tax_amount}).`,
        severity: SEVERITY.ERROR
      });
    }
  }
  
  // BR-CO-16: Amount due for payment
  if (invoice.payable_amount !== undefined) {
    const expected = (Number(invoice.tax_inclusive_amount) || 0) - 
                     (Number(invoice.prepaid_amount) || 0) + 
                     (Number(invoice.rounding_amount) || 0);
    if (Math.abs(expected - Number(invoice.payable_amount)) > 0.01) {
      errors.push({
        code: 'BR-CO-16',
        field: 'payable_amount',
        message: `Payable amount (${invoice.payable_amount}) calculation mismatch. Expected: ${expected.toFixed(2)}.`,
        severity: SEVERITY.ERROR
      });
    }
  }
  
  return errors;
}

/**
 * Validate Singapore-specific Peppol ID requirements
 */
export function validatePeppolIds(invoice) {
  const errors = [];
  
  // SG-01: Seller Peppol ID required
  if (!invoice.seller_peppol_id?.trim()) {
    errors.push({
      code: 'SG-01',
      field: 'seller_peppol_id',
      message: 'Seller Peppol Participant ID is required for InvoiceNow.',
      severity: SEVERITY.ERROR
    });
  } else {
    // Validate Peppol ID format (0195:UEN format for Singapore)
    const peppolIdPattern = /^0195:[A-Z0-9]+$/i;
    if (!peppolIdPattern.test(invoice.seller_peppol_id)) {
      errors.push({
        code: 'SG-01',
        field: 'seller_peppol_id',
        message: 'Seller Peppol ID must be in format 0195:UEN (e.g., 0195:T08GB0001A).',
        severity: SEVERITY.WARNING
      });
    }
  }
  
  // SG-02: Buyer Peppol ID required
  if (!invoice.buyer_peppol_id?.trim()) {
    errors.push({
      code: 'SG-02',
      field: 'buyer_peppol_id',
      message: 'Buyer Peppol Participant ID is required for InvoiceNow.',
      severity: SEVERITY.ERROR
    });
  } else {
    const peppolIdPattern = /^0195:[A-Z0-9]+$/i;
    if (!peppolIdPattern.test(invoice.buyer_peppol_id)) {
      errors.push({
        code: 'SG-02',
        field: 'buyer_peppol_id',
        message: 'Buyer Peppol ID must be in format 0195:UEN (e.g., 0195:T08GB0002B).',
        severity: SEVERITY.WARNING
      });
    }
  }
  
  // SG-03: Seller UEN
  if (!invoice.seller_uen?.trim()) {
    errors.push({
      code: 'SG-03',
      field: 'seller_uen',
      message: 'Seller UEN (Singapore Business Registration Number) is recommended.',
      severity: SEVERITY.WARNING
    });
  } else {
    // Basic UEN validation
    const uenPattern = /^[A-Z0-9]{9,10}[A-Z]$/i;
    if (!uenPattern.test(invoice.seller_uen)) {
      errors.push({
        code: 'SG-03',
        field: 'seller_uen',
        message: 'Seller UEN format appears invalid.',
        severity: SEVERITY.WARNING
      });
    }
  }
  
  return errors;
}

/**
 * Validate IRAS GST requirements
 * Reference: IRAS e-Tax Guide on GST
 */
export function validateGSTRequirements(invoice) {
  const errors = [];
  
  // Calculate total GST from lines
  const hasTaxableLines = invoice.line_items?.some(line => 
    line.tax_category === 'SR' && (line.tax_amount > 0 || line.tax_rate > 0)
  );
  
  const totalTax = invoice.line_items?.reduce((sum, line) => 
    sum + (Number(line.tax_amount) || 0), 0) || 0;
  
  // SG-GST-01: Only GST-registered sellers can charge GST
  if (totalTax > 0 || hasTaxableLines) {
    if (!invoice.seller_gst_registered) {
      errors.push({
        code: 'SG-GST-01',
        field: 'seller_gst_registered',
        message: 'Only GST-registered sellers can charge GST. Please remove GST from line items or update seller GST registration status.',
        severity: SEVERITY.ERROR
      });
    }
    
    if (!invoice.seller_gst_number?.trim()) {
      errors.push({
        code: 'SG-GST-02',
        field: 'seller_gst_number',
        message: 'GST Registration Number is required when charging GST.',
        severity: SEVERITY.ERROR
      });
    }
  }
  
  // SG-GST-03: Validate GST rate
  invoice.line_items?.forEach((line, index) => {
    if (line.tax_category === 'SR') {
      if (line.tax_rate !== undefined && line.tax_rate !== CURRENT_GST_RATE) {
        errors.push({
          code: 'SG-GST-03',
          field: `line_items[${index}].tax_rate`,
          message: `Line ${index + 1}: GST rate (${line.tax_rate}%) does not match current rate (${CURRENT_GST_RATE}%).`,
          severity: SEVERITY.WARNING
        });
      }
    }
  });
  
  // SG-GST-04: Validate GST calculation
  invoice.line_items?.forEach((line, index) => {
    if (line.tax_category === 'SR' && line.line_amount && line.tax_rate) {
      const expectedTax = (Number(line.line_amount) * Number(line.tax_rate)) / 100;
      if (line.tax_amount !== undefined && Math.abs(expectedTax - Number(line.tax_amount)) > 0.01) {
        errors.push({
          code: 'SG-GST-04',
          field: `line_items[${index}].tax_amount`,
          message: `Line ${index + 1}: GST amount (${line.tax_amount}) does not match calculated (${expectedTax.toFixed(2)}).`,
          severity: SEVERITY.WARNING
        });
      }
    }
  });
  
  return errors;
}

/**
 * Validate credit note specific requirements
 */
export function validateCreditNote(invoice) {
  const errors = [];
  
  if (invoice.invoice_type_code !== '381') return errors;
  
  // BR-55: Credit note must reference original invoice
  if (!invoice.preceding_invoice_ref?.trim()) {
    errors.push({
      code: 'BR-55',
      field: 'preceding_invoice_ref',
      message: 'A Credit Note shall have a Preceding Invoice reference (BT-25).',
      severity: SEVERITY.ERROR
    });
  }
  
  return errors;
}

/**
 * Validate payment information
 */
export function validatePaymentInfo(invoice) {
  const errors = [];
  
  // BR-61: Payment means code
  if (!invoice.payment_means_code) {
    errors.push({
      code: 'BR-61',
      field: 'payment_means_code',
      message: 'Payment means code is recommended.',
      severity: SEVERITY.WARNING
    });
  }
  
  // SG-PAY-01: Bank account for credit transfer
  if (invoice.payment_means_code === '30' || invoice.payment_means_code === '42') {
    if (!invoice.payee_bank?.account_number) {
      errors.push({
        code: 'SG-PAY-01',
        field: 'payee_bank.account_number',
        message: 'Bank account number is recommended for credit transfer payments.',
        severity: SEVERITY.WARNING
      });
    }
  }
  
  return errors;
}

/**
 * Run all validation rules
 * @param {Object} invoice - Invoice data object
 * @returns {Object} Validation result with errors and summary
 */
export function validateInvoice(invoice) {
  const allErrors = [
    ...validateMandatoryFields(invoice),
    ...validateLineItems(invoice),
    ...validateCalculations(invoice),
    ...validatePeppolIds(invoice),
    ...validateGSTRequirements(invoice),
    ...validateCreditNote(invoice),
    ...validatePaymentInfo(invoice)
  ];
  
  const errorCount = allErrors.filter(e => e.severity === SEVERITY.ERROR).length;
  const warningCount = allErrors.filter(e => e.severity === SEVERITY.WARNING).length;
  
  return {
    isValid: errorCount === 0,
    canSend: errorCount === 0,
    errors: allErrors,
    errorCount,
    warningCount,
    summary: errorCount === 0 
      ? (warningCount > 0 ? `Valid with ${warningCount} warning(s)` : 'Valid')
      : `${errorCount} error(s), ${warningCount} warning(s)`
  };
}

/**
 * Pre-send validation (additional checks before sending to AP)
 */
export async function preSendValidation(invoice, { checkDirectory = true, checkGSTStatus = true } = {}) {
  const basicValidation = validateInvoice(invoice);
  const additionalErrors = [];
  
  // These would be async checks in real implementation
  if (checkDirectory) {
    // TODO: Check Peppol Directory for buyer capability
    // const canReceive = await checkPeppolDirectory(invoice.buyer_peppol_id, 'invoice');
  }
  
  if (checkGSTStatus && invoice.seller_gst_number) {
    // TODO: Verify GST registration with IRAS
    // const gstValid = await verifyGSTRegistration(invoice.seller_gst_number);
  }
  
  return {
    ...basicValidation,
    errors: [...basicValidation.errors, ...additionalErrors],
    isValid: basicValidation.isValid && additionalErrors.filter(e => e.severity === SEVERITY.ERROR).length === 0
  };
}

export default {
  validateInvoice,
  validateMandatoryFields,
  validateLineItems,
  validateCalculations,
  validatePeppolIds,
  validateGSTRequirements,
  validateCreditNote,
  validatePaymentInfo,
  preSendValidation,
  SEVERITY,
  CURRENT_GST_RATE
};