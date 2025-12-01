import { base44 } from '@/api/base44Client';
import moment from 'moment';
import { StorageFactory } from './StorageAdapters';

/**
 * DMS Controller
 * Handles AI logic, File Ops, Workflows, and Search.
 */
export const DMSController = {
  
  /**
   * AI Naming Engine
   */
  generateFileName(template, data) {
    let name = template || "{YYYY}{MM}{DD}_{DocType}_{Entity}_{Amount}";
    const date = data.date ? moment(data.date) : moment();
    
    // Context-aware naming
    const keywords = (data.keywords || []).slice(0, 2).join('_');
    const itemContext = (data.items && data.items.length > 0) ? data.items[0].description : '';
    
    const replacements = {
      "{YYYY}": date.format('YYYY'),
      "{MM}": date.format('MM'),
      "{DD}": date.format('DD'),
      "{DocType}": (data.doc_type || 'Doc').replace(/\s+/g, ''),
      "{Entity}": (data.vendor || data.name || data.company || 'Unknown').replace(/[^a-zA-Z0-9]/g, ''),
      "{Amount}": data.amount ? `${data.amount}${data.currency || ''}` : '',
      "{Vendor}": (data.vendor || '').replace(/[^a-zA-Z0-9]/g, ''),
      "{Keywords}": keywords || 'NoKey',
      "{Item}": itemContext ? itemContext.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) : 'Gen',
      "{ShortHash}": Math.random().toString(36).substring(2, 6)
    };

    Object.keys(replacements).forEach(key => {
      name = name.replace(key, replacements[key]);
    });

    name = name.replace(/__+/g, '_').replace(/_$/, '');
    return `${name}.pdf`;
  },

  /**
   * Smart Folder Structure Generator
   */
  generateFolderPath(data) {
    const date = data.date ? moment(data.date) : moment();
    const year = date.format('YYYY');
    const month = date.format('MM');
    const category = (data.doc_type || 'General').replace(/\s+/g, '');
    const entity = (data.vendor || data.name || 'Unsorted').replace(/[^a-zA-Z0-9 ]/g, '').trim();
    
    return `/${category}/${year}/${month}/${entity}/`;
  },

  /**
   * Entity Mapping Logic
   */
  suggestMapping(data, docType) {
    const suggestions = [];

    if (docType === 'Business Card' && data.name) {
      suggestions.push({
        doctype: 'Contact',
        action: 'Create',
        details: `Create Contact: ${data.name}`,
        payload: {
          first_name: data.name.split(' ')[0],
          last_name: data.name.split(' ').slice(1).join(' '),
          email_id: data.email,
          mobile_no: data.phone,
          company_name: data.company,
          designation: data.title
        }
      });
    }

    if ((docType === 'Receipt' || docType === 'Invoice') && data.amount) {
      suggestions.push({
        doctype: 'Purchase Invoice',
        action: 'Create Draft',
        details: `Create Invoice: ${data.vendor} - ${data.amount}`,
        payload: {
          supplier: data.vendor, // Needs fuzzy match in real app
          posting_date: data.date,
          grand_total: data.amount,
          currency: data.currency || 'SGD',
          items: data.items || [] // Needs Item mapping
        }
      });
    }

    if (docType === 'Contract') {
         suggestions.push({
            doctype: 'Project',
            action: 'Link',
            details: `Link to Project: ${data.project_name || 'General'}`,
            payload: {
                project_name: data.project_name
            }
         });
    }

    return suggestions;
  },

  /**
   * Execute Workflow (Create/Link Entities)
   */
  async executeWorkflow(mapping) {
      if (mapping.action === 'Create' || mapping.action === 'Create Draft') {
          // Simulate Entity Creation
          // In real app: await base44.entities[mapping.doctype].create(mapping.payload);
          console.log(`[Workflow] Creating ${mapping.doctype}`, mapping.payload);
          return { success: true, id: 'NEW-' + Math.random().toString(36).substr(2,6) };
      }
      return { success: false };
  },

  /**
   * Process Scan Task with Enhanced AI
   */
  async processScanTask(scanTask, fileUrl) {
    const prompt = `
      Analyze this document (URL: ${fileUrl}).
      Mode: ${scanTask.scan_mode}.
      Capabilities: Multi-language OCR, Handwriting Recognition, Summarization.
      
      Tasks:
      1. Detect Document Type (Receipt, Invoice, Business Card, Contract, ID, Other).
      2. Extract Entities:
         - Common: Date (YYYY-MM-DD), Language.
         - Receipt/Invoice: Vendor, Total Amount, Currency, Tax, Line Items (desc, qty, amount).
         - Business Card: Name, Title, Company, Email, Phone, Address, Website.
         - Contract: Parties, Effective Date, End Date, Key Terms (Renewal, Termination), Summary (3 sentences).
      3. Categorize based on content (e.g., "Legal", "Finance", "HR").
      4. Extract 3-5 relevant Keywords.
      
      Return JSON.
    `;

    const res = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
            type: "object",
            properties: {
                doc_type: { type: "string" },
                category: { type: "string" },
                language: { type: "string" },
                summary: { type: "string" },
                keywords: { type: "array", items: { type: "string" } },
                date: { type: "string" },
                vendor: { type: "string" },
                amount: { type: "number" },
                currency: { type: "string" },
                items: { 
                    type: "array", 
                    items: { 
                        type: "object",
                        properties: {
                            description: { type: "string" },
                            quantity: { type: "number" },
                            total: { type: "number" }
                        }
                    }
                },
                name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                company: { type: "string" },
                title: { type: "string" },
                parties: { type: "array", items: { type: "string" } },
                ocr_text: { type: "string" }
            }
        }
    });

    return res;
  },

  /**
   * Advanced Search
   */
  searchFiles(files, filters) {
      return files.filter(file => {
          const meta = JSON.parse(file.metadata_json || '{}');
          const text = (file.ocr_text || '') + (file.file_name || '');
          
          // Fuzzy Text Search
          if (filters.search && !text.toLowerCase().includes(filters.search.toLowerCase())) {
              return false;
          }

          // Doc Type Filter
          if (filters.docType && filters.docType !== 'All' && meta.doc_type !== filters.docType) {
              return false;
          }

          // Date Range
          if (filters.startDate && moment(file.created_date).isBefore(filters.startDate)) return false;
          if (filters.endDate && moment(file.created_date).isAfter(filters.endDate)) return false;

          // Provider
          if (filters.provider && filters.provider !== 'All' && file.storage_provider !== filters.provider) {
              return false;
          }

          // Tags
          if (filters.tags && filters.tags.length > 0) {
              const fileTags = file.tags || [];
              const hasTag = filters.tags.some(t => fileTags.includes(t));
              if (!hasTag) return false;
          }

          return true;
      });
  },

  /**
   * Upload to Cloud Provider
   */
  async uploadToProvider(provider, config, fileObj, path) {
      const adapter = StorageFactory.getAdapter(provider, config);
      return await adapter.uploadFile(fileObj, path);
  }
};