// src/api/erp.ts

// Base URL for your Node/Express ERP proxy
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export type CRMContact = {
  id: string;
  contact_person: string;
  company_name: string;
  type: string;              // 'customer' | 'vendor' | 'lead' etc.
  status?: string;           // 'active', 'lead', ...
  ai_lead_score?: number;
  assigned_to?: string;
  last_contact_date?: string;
  industry?: string;
};

/**
 * Fetch contacts from ERPNext via our Node server.
 * Currently backed by /api/customers which returns ERPNext Customer docs.
 *
 * Here we also show how to compute an average from two raw values.
 */
export async function fetchCRMContacts(): Promise<CRMContact[]> {
  const res = await fetch(`${API_BASE_URL}/api/customers`);

  if (!res.ok) {
    throw new Error("Failed to load contacts from ERPNext");
  }

  const json = await res.json(); // { data: [...] } from Node server
  const items = json.data || [];

  // Map ERPNext "Customer" → shape used by CRM UI
  return items.map((c: any) => {
    /**
     * EXAMPLE: average of two values
     * --------------------------------
     * Replace these field names with your actual custom fields on Customer.
     *
     * For example, if you created custom fields:
     *   - customer.lead_score_1
     *   - customer.lead_score_2
     * then set them below.
     */

    const raw1 = c.lead_score_1 ?? null;  // TODO: put your real field name
    const raw2 = c.lead_score_2 ?? null;  // TODO: put your real field name

    let averageScore: number | undefined = undefined;

    if (raw1 != null && raw2 != null) {
      const n1 = Number(raw1);
      const n2 = Number(raw2);

      if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
        averageScore = (n1 + n2) / 2;
      }
    }

    return {
      id: c.name,                      // ERPNext document name (e.g. "Grant Plastics Ltd.")
      contact_person: c.customer_name, // treating customer_name as person for now
      company_name: c.customer_name,   // same (you can change later)
      type: "customer",                // only Customers for now
      status: "active",                // Customer doctype has no status by default
      ai_lead_score: averageScore,     // <-- calculated average from the two values
      assigned_to: undefined,          // not wired yet
      last_contact_date: undefined,    // not wired yet
      industry: c.customer_group,      // use customer_group like "industry"
    };
  });
}
