/**
 * UBL Generator for Singapore Peppol BIS Billing 3.0
 * 
 * References:
 * - IMDA InvoiceNow Technical Playbook
 * - Singapore Peppol BIS Billing 3.0 Guide (peppolguide.sg)
 * - OpenPeppol BIS Billing 3.0 Specification
 * 
 * Document Type Codes:
 * - 380: Commercial Invoice
 * - 381: Credit Note
 * - 383: Debit Note
 * - 384: Corrected Invoice
 * 
 * Tax Category Codes (Singapore GST):
 * - SR: Standard Rate (9%)
 * - ZR: Zero Rated
 * - ES: Exempt Supply
 * - OS: Out of Scope
 * - NG: Not GST Registered
 */

// UBL 2.1 Namespaces
const UBL_NAMESPACES = {
  invoice: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
  creditNote: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
  cac: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  cbc: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
};

// Singapore Peppol BIS 3.0 Customization and Profile IDs
const PEPPOL_SG_CONFIG = {
  customizationID: 'urn:cen.eu:en16931:2017#conformant#urn:fdc:peppol.eu:2017:poacc:billing:international:sg:3.0',
  profileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  schemeID: '0195', // Singapore UEN scheme
  currencyCode: 'SGD',
  countryCode: 'SG'
};

// GST Tax Categories
const TAX_CATEGORIES = {
  SR: { code: 'S', name: 'Standard Rate', defaultRate: 9 },
  ZR: { code: 'Z', name: 'Zero Rated', defaultRate: 0 },
  ES: { code: 'E', name: 'Exempt', defaultRate: 0 },
  OS: { code: 'O', name: 'Out of Scope', defaultRate: 0 },
  NG: { code: 'O', name: 'Not GST Registered', defaultRate: 0 }
};

// Unit Codes (UN/ECE Recommendation 20)
const UNIT_CODES = {
  EA: 'EA',  // Each
  HUR: 'HUR', // Hour
  DAY: 'DAY', // Day
  MON: 'MON', // Month
  KGM: 'KGM', // Kilogram
  MTR: 'MTR', // Metre
  LTR: 'LTR', // Litre
  PCE: 'C62'  // Piece
};

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

/**
 * Format decimal to 2 decimal places
 */
function formatDecimal(value, decimals = 2) {
  if (value === null || value === undefined) return '0.00';
  return Number(value).toFixed(decimals);
}

/**
 * Generate Party XML block
 * Ref: BG-4 (Seller), BG-7 (Buyer)
 */
function generatePartyXml(party, isSupplier = true) {
  const partyType = isSupplier ? 'AccountingSupplierParty' : 'AccountingCustomerParty';
  const endpointScheme = party.peppol_id?.startsWith('0195:') ? '0195' : PEPPOL_SG_CONFIG.schemeID;
  const endpointId = party.peppol_id?.replace('0195:', '') || party.uen || '';
  
  return `
    <cac:${partyType}>
      <cac:Party>
        <cbc:EndpointID schemeID="${endpointScheme}">${escapeXml(endpointId)}</cbc:EndpointID>
        ${party.uen ? `
        <cac:PartyIdentification>
          <cbc:ID schemeID="0195">${escapeXml(party.uen)}</cbc:ID>
        </cac:PartyIdentification>` : ''}
        ${party.trading_name ? `
        <cac:PartyName>
          <cbc:Name>${escapeXml(party.trading_name)}</cbc:Name>
        </cac:PartyName>` : ''}
        <cac:PostalAddress>
          ${party.address?.street ? `<cbc:StreetName>${escapeXml(party.address.street)}</cbc:StreetName>` : ''}
          ${party.address?.building ? `<cbc:AdditionalStreetName>${escapeXml(party.address.building)}</cbc:AdditionalStreetName>` : ''}
          ${party.address?.city ? `<cbc:CityName>${escapeXml(party.address.city)}</cbc:CityName>` : '<cbc:CityName>Singapore</cbc:CityName>'}
          ${party.address?.postal_code ? `<cbc:PostalZone>${escapeXml(party.address.postal_code)}</cbc:PostalZone>` : ''}
          <cac:Country>
            <cbc:IdentificationCode>${party.address?.country_code || 'SG'}</cbc:IdentificationCode>
          </cac:Country>
        </cac:PostalAddress>
        ${party.gst_number && isSupplier ? `
        <cac:PartyTaxScheme>
          <cbc:CompanyID>${escapeXml(party.gst_number)}</cbc:CompanyID>
          <cac:TaxScheme>
            <cbc:ID>GST</cbc:ID>
          </cac:TaxScheme>
        </cac:PartyTaxScheme>` : ''}
        <cac:PartyLegalEntity>
          <cbc:RegistrationName>${escapeXml(party.name || party.legal_name)}</cbc:RegistrationName>
          ${party.uen ? `<cbc:CompanyID schemeID="0195">${escapeXml(party.uen)}</cbc:CompanyID>` : ''}
        </cac:PartyLegalEntity>
        ${party.contact ? `
        <cac:Contact>
          ${party.contact.name ? `<cbc:Name>${escapeXml(party.contact.name)}</cbc:Name>` : ''}
          ${party.contact.phone ? `<cbc:Telephone>${escapeXml(party.contact.phone)}</cbc:Telephone>` : ''}
          ${party.contact.email ? `<cbc:ElectronicMail>${escapeXml(party.contact.email)}</cbc:ElectronicMail>` : ''}
        </cac:Contact>` : ''}
      </cac:Party>
    </cac:${partyType}>`;
}

/**
 * Generate Payment Means XML
 * Ref: BG-16
 */
function generatePaymentMeansXml(invoice) {
  const paymentCode = invoice.payment_means_code || '30'; // 30 = Credit Transfer
  
  let xml = `
    <cac:PaymentMeans>
      <cbc:PaymentMeansCode>${paymentCode}</cbc:PaymentMeansCode>`;
  
  if (invoice.due_date) {
    xml += `
      <cbc:PaymentDueDate>${formatDate(invoice.due_date)}</cbc:PaymentDueDate>`;
  }
  
  if (invoice.payee_bank?.account_number) {
    xml += `
      <cac:PayeeFinancialAccount>
        <cbc:ID>${escapeXml(invoice.payee_bank.account_number)}</cbc:ID>
        ${invoice.payee_bank.account_name ? `<cbc:Name>${escapeXml(invoice.payee_bank.account_name)}</cbc:Name>` : ''}
        ${invoice.payee_bank.swift_code ? `
        <cac:FinancialInstitutionBranch>
          <cbc:ID>${escapeXml(invoice.payee_bank.swift_code)}</cbc:ID>
        </cac:FinancialInstitutionBranch>` : ''}
      </cac:PayeeFinancialAccount>`;
  }
  
  xml += `
    </cac:PaymentMeans>`;
  
  return xml;
}

/**
 * Generate Tax Total XML
 * Ref: BG-22, BG-23
 */
function generateTaxTotalXml(invoice) {
  const currency = invoice.currency_code || PEPPOL_SG_CONFIG.currencyCode;
  
  let subtotalsXml = '';
  if (invoice.tax_subtotals && invoice.tax_subtotals.length > 0) {
    invoice.tax_subtotals.forEach(subtotal => {
      const taxCat = TAX_CATEGORIES[subtotal.tax_category] || TAX_CATEGORIES.SR;
      subtotalsXml += `
        <cac:TaxSubtotal>
          <cbc:TaxableAmount currencyID="${currency}">${formatDecimal(subtotal.taxable_amount)}</cbc:TaxableAmount>
          <cbc:TaxAmount currencyID="${currency}">${formatDecimal(subtotal.tax_amount)}</cbc:TaxAmount>
          <cac:TaxCategory>
            <cbc:ID>${taxCat.code}</cbc:ID>
            <cbc:Percent>${formatDecimal(subtotal.tax_rate)}</cbc:Percent>
            <cac:TaxScheme>
              <cbc:ID>GST</cbc:ID>
            </cac:TaxScheme>
          </cac:TaxCategory>
        </cac:TaxSubtotal>`;
    });
  }
  
  return `
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="${currency}">${formatDecimal(invoice.tax_amount || 0)}</cbc:TaxAmount>
      ${subtotalsXml}
    </cac:TaxTotal>`;
}

/**
 * Generate Legal Monetary Total XML
 * Ref: BG-22
 */
function generateMonetaryTotalXml(invoice) {
  const currency = invoice.currency_code || PEPPOL_SG_CONFIG.currencyCode;
  
  return `
    <cac:LegalMonetaryTotal>
      <cbc:LineExtensionAmount currencyID="${currency}">${formatDecimal(invoice.subtotal || 0)}</cbc:LineExtensionAmount>
      <cbc:TaxExclusiveAmount currencyID="${currency}">${formatDecimal(invoice.tax_exclusive_amount || invoice.subtotal || 0)}</cbc:TaxExclusiveAmount>
      <cbc:TaxInclusiveAmount currencyID="${currency}">${formatDecimal(invoice.tax_inclusive_amount || 0)}</cbc:TaxInclusiveAmount>
      ${invoice.total_allowances ? `<cbc:AllowanceTotalAmount currencyID="${currency}">${formatDecimal(invoice.total_allowances)}</cbc:AllowanceTotalAmount>` : ''}
      ${invoice.total_charges ? `<cbc:ChargeTotalAmount currencyID="${currency}">${formatDecimal(invoice.total_charges)}</cbc:ChargeTotalAmount>` : ''}
      ${invoice.prepaid_amount ? `<cbc:PrepaidAmount currencyID="${currency}">${formatDecimal(invoice.prepaid_amount)}</cbc:PrepaidAmount>` : ''}
      ${invoice.rounding_amount ? `<cbc:PayableRoundingAmount currencyID="${currency}">${formatDecimal(invoice.rounding_amount)}</cbc:PayableRoundingAmount>` : ''}
      <cbc:PayableAmount currencyID="${currency}">${formatDecimal(invoice.payable_amount || 0)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>`;
}

/**
 * Generate Invoice Line XML
 * Ref: BG-25
 */
function generateInvoiceLineXml(line, index, currency) {
  const taxCat = TAX_CATEGORIES[line.tax_category] || TAX_CATEGORIES.SR;
  const unitCode = UNIT_CODES[line.unit_code] || line.unit_code || 'EA';
  
  let allowanceChargesXml = '';
  if (line.allowance_charges && line.allowance_charges.length > 0) {
    line.allowance_charges.forEach(ac => {
      allowanceChargesXml += `
        <cac:AllowanceCharge>
          <cbc:ChargeIndicator>${ac.is_charge ? 'true' : 'false'}</cbc:ChargeIndicator>
          <cbc:AllowanceChargeReason>${escapeXml(ac.reason || '')}</cbc:AllowanceChargeReason>
          <cbc:Amount currencyID="${currency}">${formatDecimal(ac.amount)}</cbc:Amount>
        </cac:AllowanceCharge>`;
    });
  }
  
  return `
    <cac:InvoiceLine>
      <cbc:ID>${line.line_id || index + 1}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="${unitCode}">${formatDecimal(line.quantity, 4)}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="${currency}">${formatDecimal(line.line_amount)}</cbc:LineExtensionAmount>
      ${allowanceChargesXml}
      <cac:Item>
        <cbc:Description>${escapeXml(line.description)}</cbc:Description>
        <cbc:Name>${escapeXml(line.description?.substring(0, 100) || 'Item')}</cbc:Name>
        ${line.seller_item_id ? `
        <cac:SellersItemIdentification>
          <cbc:ID>${escapeXml(line.seller_item_id)}</cbc:ID>
        </cac:SellersItemIdentification>` : ''}
        ${line.buyer_item_id ? `
        <cac:BuyersItemIdentification>
          <cbc:ID>${escapeXml(line.buyer_item_id)}</cbc:ID>
        </cac:BuyersItemIdentification>` : ''}
        ${line.item_code ? `
        <cac:StandardItemIdentification>
          <cbc:ID schemeID="0160">${escapeXml(line.item_code)}</cbc:ID>
        </cac:StandardItemIdentification>` : ''}
        <cac:ClassifiedTaxCategory>
          <cbc:ID>${taxCat.code}</cbc:ID>
          <cbc:Percent>${formatDecimal(line.tax_rate ?? taxCat.defaultRate)}</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>GST</cbc:ID>
          </cac:TaxScheme>
        </cac:ClassifiedTaxCategory>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="${currency}">${formatDecimal(line.unit_price, 4)}</cbc:PriceAmount>
      </cac:Price>
    </cac:InvoiceLine>`;
}

/**
 * Generate complete UBL Invoice XML
 * Compliant with Singapore Peppol BIS Billing 3.0
 * 
 * @param {Object} invoice - Invoice data object
 * @returns {string} UBL XML string
 */
export function generateInvoiceUBL(invoice) {
  const isCredit = invoice.invoice_type_code === '381';
  const rootElement = isCredit ? 'CreditNote' : 'Invoice';
  const namespace = isCredit ? UBL_NAMESPACES.creditNote : UBL_NAMESPACES.invoice;
  const currency = invoice.currency_code || PEPPOL_SG_CONFIG.currencyCode;
  
  // Build seller party object
  const sellerParty = {
    name: invoice.seller_name,
    trading_name: invoice.seller_trading_name,
    uen: invoice.seller_uen,
    peppol_id: invoice.seller_peppol_id,
    gst_number: invoice.seller_gst_number,
    address: invoice.seller_address,
    contact: invoice.seller_contact
  };
  
  // Build buyer party object
  const buyerParty = {
    name: invoice.buyer_name,
    trading_name: invoice.buyer_trading_name,
    uen: invoice.buyer_uen,
    peppol_id: invoice.buyer_peppol_id,
    gst_number: invoice.buyer_gst_number,
    address: invoice.buyer_address,
    contact: invoice.buyer_contact
  };
  
  // Generate invoice lines
  let linesXml = '';
  if (invoice.line_items && invoice.line_items.length > 0) {
    invoice.line_items.forEach((line, index) => {
      linesXml += generateInvoiceLineXml(line, index, currency);
    });
  }
  
  // Generate notes
  let notesXml = '';
  if (invoice.notes && invoice.notes.length > 0) {
    invoice.notes.forEach(note => {
      notesXml += `<cbc:Note>${escapeXml(note)}</cbc:Note>`;
    });
  }
  
  // Generate document allowances/charges
  let docAllowancesXml = '';
  if (invoice.document_allowances && invoice.document_allowances.length > 0) {
    invoice.document_allowances.forEach(ac => {
      const taxCat = TAX_CATEGORIES[ac.tax_category] || TAX_CATEGORIES.SR;
      docAllowancesXml += `
        <cac:AllowanceCharge>
          <cbc:ChargeIndicator>${ac.is_charge ? 'true' : 'false'}</cbc:ChargeIndicator>
          ${ac.reason_code ? `<cbc:AllowanceChargeReasonCode>${escapeXml(ac.reason_code)}</cbc:AllowanceChargeReasonCode>` : ''}
          <cbc:AllowanceChargeReason>${escapeXml(ac.reason || '')}</cbc:AllowanceChargeReason>
          <cbc:Amount currencyID="${currency}">${formatDecimal(ac.amount)}</cbc:Amount>
          <cac:TaxCategory>
            <cbc:ID>${taxCat.code}</cbc:ID>
            <cbc:Percent>${formatDecimal(ac.tax_rate ?? taxCat.defaultRate)}</cbc:Percent>
            <cac:TaxScheme>
              <cbc:ID>GST</cbc:ID>
            </cac:TaxScheme>
          </cac:TaxCategory>
        </cac:AllowanceCharge>`;
    });
  }
  
  // Build complete XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<${rootElement} xmlns="${namespace}"
  xmlns:cac="${UBL_NAMESPACES.cac}"
  xmlns:cbc="${UBL_NAMESPACES.cbc}">
  
  <!-- SG Peppol BIS Billing 3.0 Customization ID -->
  <cbc:CustomizationID>${PEPPOL_SG_CONFIG.customizationID}</cbc:CustomizationID>
  <cbc:ProfileID>${PEPPOL_SG_CONFIG.profileID}</cbc:ProfileID>
  
  <!-- BT-1: Invoice Number -->
  <cbc:ID>${escapeXml(invoice.invoice_number)}</cbc:ID>
  
  <!-- BT-2: Issue Date -->
  <cbc:IssueDate>${formatDate(invoice.issue_date)}</cbc:IssueDate>
  
  ${invoice.due_date ? `<!-- BT-9: Due Date -->
  <cbc:DueDate>${formatDate(invoice.due_date)}</cbc:DueDate>` : ''}
  
  <!-- BT-3: Invoice Type Code -->
  <cbc:InvoiceTypeCode>${invoice.invoice_type_code || '380'}</cbc:InvoiceTypeCode>
  
  ${invoice.tax_point_date ? `<!-- BT-7: Tax Point Date -->
  <cbc:TaxPointDate>${formatDate(invoice.tax_point_date)}</cbc:TaxPointDate>` : ''}
  
  <!-- BT-5: Document Currency -->
  <cbc:DocumentCurrencyCode>${currency}</cbc:DocumentCurrencyCode>
  
  ${invoice.buyer_reference ? `<!-- BT-10: Buyer Reference -->
  <cbc:BuyerReference>${escapeXml(invoice.buyer_reference)}</cbc:BuyerReference>` : ''}
  
  ${notesXml}
  
  ${invoice.contract_reference ? `<!-- BT-12: Contract Reference -->
  <cac:ContractDocumentReference>
    <cbc:ID>${escapeXml(invoice.contract_reference)}</cbc:ID>
  </cac:ContractDocumentReference>` : ''}
  
  ${invoice.preceding_invoice_ref ? `<!-- BT-25: Preceding Invoice Reference (for Credit Notes) -->
  <cac:BillingReference>
    <cac:InvoiceDocumentReference>
      <cbc:ID>${escapeXml(invoice.preceding_invoice_ref)}</cbc:ID>
    </cac:InvoiceDocumentReference>
  </cac:BillingReference>` : ''}
  
  <!-- BG-4: Seller -->
  ${generatePartyXml(sellerParty, true)}
  
  <!-- BG-7: Buyer -->
  ${generatePartyXml(buyerParty, false)}
  
  <!-- BG-16: Payment Means -->
  ${generatePaymentMeansXml(invoice)}
  
  ${invoice.payment_terms ? `<!-- BT-20: Payment Terms -->
  <cac:PaymentTerms>
    <cbc:Note>${escapeXml(invoice.payment_terms)}</cbc:Note>
  </cac:PaymentTerms>` : ''}
  
  ${docAllowancesXml}
  
  <!-- BG-22: Tax Total -->
  ${generateTaxTotalXml(invoice)}
  
  <!-- BG-22: Legal Monetary Total -->
  ${generateMonetaryTotalXml(invoice)}
  
  <!-- BG-25: Invoice Lines -->
  ${linesXml}
  
</${rootElement}>`;
  
  return xml.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
}

/**
 * Validate invoice data before UBL generation
 * Returns array of validation errors
 */
export function validateInvoiceForUBL(invoice) {
  const errors = [];
  
  // Required fields - BT-1
  if (!invoice.invoice_number) {
    errors.push({ code: 'BR-01', field: 'invoice_number', message: 'Invoice number is required (BT-1)', severity: 'error' });
  }
  
  // BT-2: Issue Date
  if (!invoice.issue_date) {
    errors.push({ code: 'BR-02', field: 'issue_date', message: 'Issue date is required (BT-2)', severity: 'error' });
  }
  
  // BT-5: Currency
  if (!invoice.currency_code) {
    errors.push({ code: 'BR-05', field: 'currency_code', message: 'Currency code is required (BT-5)', severity: 'warning' });
  }
  
  // Seller validation
  if (!invoice.seller_peppol_id) {
    errors.push({ code: 'SG-01', field: 'seller_peppol_id', message: 'Seller Peppol ID is required', severity: 'error' });
  }
  if (!invoice.seller_name) {
    errors.push({ code: 'BR-06', field: 'seller_name', message: 'Seller name is required (BT-27)', severity: 'error' });
  }
  
  // Buyer validation
  if (!invoice.buyer_peppol_id) {
    errors.push({ code: 'SG-02', field: 'buyer_peppol_id', message: 'Buyer Peppol ID is required', severity: 'error' });
  }
  if (!invoice.buyer_name) {
    errors.push({ code: 'BR-07', field: 'buyer_name', message: 'Buyer name is required (BT-44)', severity: 'error' });
  }
  
  // GST validation - IRAS requirement
  if (invoice.tax_amount > 0 && !invoice.seller_gst_registered) {
    errors.push({ 
      code: 'SG-GST-01', 
      field: 'seller_gst_registered', 
      message: 'Seller must be GST-registered to charge GST. Remove GST lines or update seller GST status.',
      severity: 'error' 
    });
  }
  
  // Line items validation
  if (!invoice.line_items || invoice.line_items.length === 0) {
    errors.push({ code: 'BR-16', field: 'line_items', message: 'At least one invoice line is required', severity: 'error' });
  } else {
    invoice.line_items.forEach((line, index) => {
      if (!line.description) {
        errors.push({ code: `BR-25-${index}`, field: `line_items[${index}].description`, message: `Line ${index + 1}: Description is required`, severity: 'error' });
      }
      if (line.quantity === undefined || line.quantity === null) {
        errors.push({ code: `BR-22-${index}`, field: `line_items[${index}].quantity`, message: `Line ${index + 1}: Quantity is required`, severity: 'error' });
      }
      if (line.unit_price === undefined || line.unit_price === null) {
        errors.push({ code: `BR-26-${index}`, field: `line_items[${index}].unit_price`, message: `Line ${index + 1}: Unit price is required`, severity: 'error' });
      }
    });
  }
  
  // Monetary totals validation
  if (invoice.payable_amount === undefined || invoice.payable_amount === null) {
    errors.push({ code: 'BR-CO-10', field: 'payable_amount', message: 'Payable amount is required (BT-115)', severity: 'error' });
  }
  
  // Validate totals calculation
  if (invoice.line_items && invoice.line_items.length > 0) {
    const calculatedSubtotal = invoice.line_items.reduce((sum, line) => sum + (line.line_amount || 0), 0);
    if (invoice.subtotal && Math.abs(calculatedSubtotal - invoice.subtotal) > 0.01) {
      errors.push({ 
        code: 'BR-CO-10', 
        field: 'subtotal', 
        message: `Subtotal mismatch: calculated ${calculatedSubtotal.toFixed(2)}, declared ${invoice.subtotal}`,
        severity: 'warning' 
      });
    }
  }
  
  // Credit note validation
  if (invoice.invoice_type_code === '381' && !invoice.preceding_invoice_ref) {
    errors.push({ code: 'BR-55', field: 'preceding_invoice_ref', message: 'Credit note must reference the original invoice (BT-25)', severity: 'error' });
  }
  
  return errors;
}

// Sample invoice for testing
export const SAMPLE_BASIC_INVOICE = {
  invoice_number: 'INV-2024-001',
  invoice_type_code: '380',
  issue_date: '2024-01-15',
  due_date: '2024-02-14',
  currency_code: 'SGD',
  seller_peppol_id: '0195:T08GB0001A',
  seller_uen: 'T08GB0001A',
  seller_name: 'ACME Pte Ltd',
  seller_trading_name: 'ACME',
  seller_gst_number: 'M2-1234567-8',
  seller_gst_registered: true,
  seller_address: {
    street: '123 Business Park',
    building: 'Tower A #05-01',
    city: 'Singapore',
    postal_code: '123456',
    country_code: 'SG'
  },
  seller_contact: {
    name: 'John Doe',
    phone: '+65 6789 0123',
    email: 'billing@acme.sg'
  },
  buyer_peppol_id: '0195:T08GB0002B',
  buyer_uen: 'T08GB0002B',
  buyer_name: 'XYZ Corp Pte Ltd',
  buyer_address: {
    street: '456 Commerce Street',
    city: 'Singapore',
    postal_code: '654321',
    country_code: 'SG'
  },
  payment_means_code: '30',
  payment_terms: 'Net 30 days',
  payee_bank: {
    account_name: 'ACME Pte Ltd',
    account_number: '123-456-789',
    bank_code: 'DBS',
    swift_code: 'DBSSSGSG'
  },
  line_items: [
    {
      line_id: '1',
      description: 'Professional Services - January 2024',
      quantity: 10,
      unit_code: 'HUR',
      unit_price: 150.00,
      line_amount: 1500.00,
      tax_category: 'SR',
      tax_rate: 9,
      tax_amount: 135.00
    },
    {
      line_id: '2',
      description: 'Software License - Annual Subscription',
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
      taxable_amount: 2000.00,
      tax_amount: 180.00
    }
  ],
  subtotal: 2000.00,
  tax_exclusive_amount: 2000.00,
  tax_amount: 180.00,
  tax_inclusive_amount: 2180.00,
  payable_amount: 2180.00,
  notes: ['Thank you for your business']
};

export const SAMPLE_CREDIT_NOTE = {
  ...SAMPLE_BASIC_INVOICE,
  invoice_number: 'CN-2024-001',
  invoice_type_code: '381',
  preceding_invoice_ref: 'INV-2024-001',
  notes: ['Credit note for Invoice INV-2024-001']
};

export default {
  generateInvoiceUBL,
  validateInvoiceForUBL,
  SAMPLE_BASIC_INVOICE,
  SAMPLE_CREDIT_NOTE,
  TAX_CATEGORIES,
  UNIT_CODES,
  PEPPOL_SG_CONFIG
};