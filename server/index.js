// index.js - Node / Express ERP proxy for ERPNext

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- CONFIG ----------------

const PORT = process.env.PORT || 5000;

// Your ERPNext URL (Site URL, NOT /app/home)
const ERP_BASE_URL =
  process.env.ERP_BASE_URL || 'http://161.97.64.147:8001';

// Your ERPNext API key/secret
const ERP_API_KEY =
  process.env.ERP_API_KEY || '10529571e219054';
const ERP_API_SECRET =
  process.env.ERP_API_SECRET || '4818f1ab3f95286';

const erpHeaders = {
  Authorization: `token ${ERP_API_KEY}:${ERP_API_SECRET}`,
  'Content-Type': 'application/json',
};

function logError(label, err) {
  console.error(`❌ ${label}:`, err.response?.status, err.response?.statusText);
  if (err.response?.data) {
    console.error('Response data:', err.response.data);
  } else {
    console.error('Error message:', err.message);
  }
}

// ---------------- HEALTH CHECK ----------------

app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'ERP Proxy running' });
});

// ---------------- CUSTOMERS → CRM ----------------
// This is the main endpoint used by CRM & any "Total Contacts" card.

app.get('/api/customers', async (req, res) => {
  try {
    const response = await axios.get(
      `${ERP_BASE_URL}/api/resource/Customer`,
      {
        headers: erpHeaders,
        params: {
          // keep it VERY simple so we don't cause ERP errors
          limit_page_length: 100,
          order_by: 'modified desc',
        },
      }
    );

    // ERPNext returns { data: [ ... ] }
    const rows = response.data?.data || [];

    console.log(`✅ /api/customers → got ${rows.length} customers from ERPNext`);

    res.json({
      data: rows,
    });
  } catch (err) {
    logError('GET /api/customers', err);
    res.status(500).json({ error: 'Failed to fetch customers from ERPNext' });
  }
});

// ---------------- DASHBOARD KPIs ----------------
// Used by fetchDashboardKpis() → KPICards

app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    // Re-use same Customer call so behaviour is consistent
    const customersRes = await axios.get(
      `${ERP_BASE_URL}/api/resource/Customer`,
      {
        headers: erpHeaders,
        params: {
          limit_page_length: 100,
          order_by: 'modified desc',
        },
      }
    );

    const customers = customersRes.data?.data || [];
    const customersCount = customers.length;

    const kpis = [
      {
        key: 'customers',
        title: 'Total Customers',
        value: String(customersCount),
        change: '',
        trend: customersCount > 0 ? 'up' : 'neutral',
        color: 'emerald',
        link: 'CRM',
        tooltip: 'Count from ERPNext Customer doctype',
      },
      {
        key: 'cash_runway',
        title: 'Cash Runway',
        value: '—',
        change: '',
        trend: 'neutral',
        color: 'lime',
        link: 'CashflowForecast',
        tooltip: 'Wire to real cashflow later',
      },
      {
        key: 'ar_overdue',
        title: 'AR Overdue',
        value: '—',
        change: '',
        trend: 'neutral',
        color: 'amber',
        link: 'AccountsReceivable',
        tooltip: 'Wire to Sales Invoice / AR later',
      },
      {
        key: 'ap_due',
        title: 'AP Due',
        value: '—',
        change: '',
        trend: 'neutral',
        color: 'blue',
        link: 'AccountsPayable',
        tooltip: 'Wire to Purchase Invoice later',
      },
      {
        key: 'monthly_burn',
        title: 'Monthly Burn',
        value: '—',
        change: '',
        trend: 'neutral',
        color: 'violet',
        link: 'CashflowForecast',
        tooltip: 'Wire to expenses later',
      },
    ];

    console.log('✅ /api/dashboard/kpis → OK');

    res.json({ data: kpis });
  } catch (err) {
    logError('GET /api/dashboard/kpis', err);
    res.status(500).json({ error: 'Failed to fetch KPIs from ERPNext' });
  }
});

// ---------------- RECENT DOCUMENTS ----------------
// Used by fetchRecentDocuments() → RecentDocuments

app.get('/api/documents/recent', async (req, res) => {
  try {
    const invoicesRes = await axios.get(
      `${ERP_BASE_URL}/api/resource/Sales Invoice`,
      {
        headers: erpHeaders,
        params: {
          limit_page_length: 5,
          order_by: 'posting_date desc',
          fields: JSON.stringify([
            'name',
            'customer',
            'posting_date',
            'grand_total',
            'status',
          ]),
        },
      }
    );

    const invoices = invoicesRes.data?.data || [];

    const docs = invoices.map((inv) => ({
      id: inv.name,
      name: inv.name,
      type: 'Invoice',
      uploadedAt: inv.posting_date,
      status:
        inv.status === 'Paid'
          ? 'processed'
          : inv.status === 'Draft'
          ? 'review'
          : 'processing',
      link: 'AccountsReceivable',
    }));

    console.log(`✅ /api/documents/recent → ${docs.length} docs`);

    res.json({ data: docs });
  } catch (err) {
    logError('GET /api/documents/recent', err);
    res.status(500).json({ error: 'Failed to fetch recent documents' });
  }
});

// ---------------- RECONCILIATION SUGGESTIONS ----------------
// Used by fetchReconciliationSuggestions() → ReconciliationWidget

app.get('/api/reconciliation/suggestions', async (req, res) => {
  try {
    const paymentsRes = await axios.get(
      `${ERP_BASE_URL}/api/resource/Payment Entry`,
      {
        headers: erpHeaders,
        params: {
          limit_page_length: 5,
          order_by: 'posting_date desc',
          fields: JSON.stringify([
            'name',
            'party_name',
            'paid_amount',
            'posting_date',
          ]),
        },
      }
    );

    const payments = paymentsRes.data?.data || [];

    const suggestions = payments.map((p) => ({
      id: p.name,
      bankDesc: `PAYMENT - ${p.party_name || p.name}`,
      amount: p.paid_amount,
      date: p.posting_date,
      matchTo: p.name,
      matchVendor: p.party_name,
      confidence: 90, // placeholder
    }));

    console.log(
      `✅ /api/reconciliation/suggestions → ${suggestions.length} suggestions`
    );

    res.json({ data: suggestions });
  } catch (err) {
    logError('GET /api/reconciliation/suggestions', err);
    res
      .status(500)
      .json({ error: 'Failed to fetch reconciliation suggestions' });
  }
});

// ---------------- START SERVER ----------------

app.listen(PORT, () => {
  console.log(`✅ Custom ERP API running at http://localhost:${PORT}`);
  console.log(`➡  Using ERP_BASE_URL = ${ERP_BASE_URL}`);
});
