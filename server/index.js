// server/index.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Allow your Vite dev server (change port if yours is different)
app.use(
  cors({
    origin: "*",
    
  })
);
app.use(express.json());

const { ERPNEXT_URL, ERPNEXT_API_KEY, ERPNEXT_API_SECRET } = process.env;

if (!ERPNEXT_URL || !ERPNEXT_API_KEY || !ERPNEXT_API_SECRET) {
  console.error("❌ Missing ERPNEXT env vars");
  process.exit(1);
}

const erpClient = axios.create({
  baseURL: `${ERPNEXT_URL}/api`,
  headers: {
    Authorization: `token ${ERPNEXT_API_KEY}:${ERPNEXT_API_SECRET}`,
    "Content-Type": "application/json",
  },
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, erpnext: ERPNEXT_URL });
});

// Test: list first 20 Customers
app.get("/api/customers", async (req, res) => {
  try {
    const resp = await erpClient.get("/resource/Customer", {
      params: {
        fields: JSON.stringify(["name", "customer_name", "customer_group"]),
        limit_page_length: 20,
      },
    });

    res.json(resp.data); // ERPNext: { data: [...] }
  } catch (err) {
    console.error("ERPNext error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch customers from ERPNext",
      details: err.response?.data || err.message,
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Custom ERP API running at http://localhost:${port}`);
});
