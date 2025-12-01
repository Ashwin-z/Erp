import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { 
  BookOpen, FileText, Receipt, Building2, Calculator,
  Brain, FileSearch, TrendingUp, MessageSquare, Lightbulb,
  Shield, Lock, Key, Database, Users, LayoutDashboard, 
  BarChart3, Settings, Landmark, CreditCard, Link2, Workflow,
  ArrowRight, CheckCircle2, Sparkles, Zap
} from 'lucide-react';

const features = [
  {
    category: "Finance & Accounting Core",
    description: "Complete double-entry accounting with multi-currency support",
    icon: BookOpen,
    color: "lime",
    items: [
      { icon: BookOpen, title: "General Ledger", desc: "Multi-currency double-entry accounting with real-time balance tracking and journal management." },
      { icon: Receipt, title: "Accounts Payable", desc: "Streamlined vendor bill processing, approval workflows, and payment scheduling." },
      { icon: FileText, title: "Accounts Receivable", desc: "Automated invoicing, payment tracking, and customer statement generation." },
      { icon: Building2, title: "Bank Reconciliation", desc: "Smart AI-powered transaction matching with 95% auto-reconciliation accuracy." },
      { icon: Calculator, title: "GST Management", desc: "IRAS-compliant GST filing with automatic tax code assignment and reporting." }
    ]
  },
  {
    category: "AI Suite",
    description: "Intelligent automation powered by machine learning",
    icon: Brain,
    color: "violet",
    items: [
      { icon: FileSearch, title: "OCR Processing", desc: "Extract data from invoices, receipts, and statements with 99% accuracy." },
      { icon: TrendingUp, title: "Cashflow Analyst", desc: "90-day predictive forecasting with scenario modeling and alerts." },
      { icon: MessageSquare, title: "Collections AI", desc: "Automated payment reminders with smart timing and personalized messaging." },
      { icon: Lightbulb, title: "Suggestion Engine", desc: "Actionable recommendations for cost savings and cash optimization." },
      { icon: Zap, title: "Auto-Reconciliation", desc: "ML-powered transaction matching with confidence scoring." }
    ]
  },
  {
    category: "Security & Compliance",
    description: "Enterprise-grade protection and regulatory compliance",
    icon: Shield,
    color: "blue",
    items: [
      { icon: Shield, title: "PDPA Compliant", desc: "Full Singapore Personal Data Protection Act compliance with consent management." },
      { icon: Lock, title: "SOC-2 Ready", desc: "Enterprise security controls meeting SOC 2 Type II requirements." },
      { icon: Key, title: "Encryption", desc: "AES-256 encryption at rest and TLS 1.3 in transit for all data." },
      { icon: Database, title: "Audit Trail", desc: "Complete activity logging with immutable audit records." },
      { icon: Users, title: "2FA/MFA", desc: "Multi-factor authentication with SSO integration support." }
    ]
  },
  {
    category: "Agency Panel",
    description: "Multi-client management for accounting firms",
    icon: Users,
    color: "emerald",
    items: [
      { icon: Users, title: "Client Management", desc: "Unlimited client entities with role-based access control." },
      { icon: LayoutDashboard, title: "Client Dashboards", desc: "Per-client analytics and KPI tracking in a unified view." },
      { icon: BarChart3, title: "Performance Reports", desc: "Agency-wide metrics and productivity analytics." },
      { icon: Settings, title: "White Label", desc: "Custom branding with your logo, colors, and domain." },
      { icon: Workflow, title: "Workflow Templates", desc: "Standardized processes for consistent service delivery." }
    ]
  },
  {
    category: "Integrations",
    description: "Connect with your existing ecosystem",
    icon: Link2,
    color: "orange",
    items: [
      { icon: Landmark, title: "DBS Bank", desc: "Direct bank feed integration with real-time transaction sync." },
      { icon: Landmark, title: "OCBC Bank", desc: "Automated statement imports and payment initiation." },
      { icon: Landmark, title: "UOB Bank", desc: "Secure connection for transaction downloads and reconciliation." },
      { icon: CreditCard, title: "Payroll Systems", desc: "Integration with popular HR and payroll platforms." },
      { icon: Link2, title: "CRM Integration", desc: "Connect with Salesforce, HubSpot, and other CRM systems." }
    ]
  }
];

const colorClasses = {
  lime: { bg: 'bg-lime-500', light: 'bg-lime-50', text: 'text-lime-600', border: 'border-lime-200' },
  violet: { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
};

export default function Features() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-medium text-lime-400">Platform Features</span>
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Everything You Need to <br />
              <span className="text-lime-400">Transform Finance</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              A complete finance operating system with AI-powered automation, 
              designed for modern businesses and accounting agencies.
            </p>
            <div className="flex justify-center gap-4">
              <Link to={createPageUrl('Dashboard')}>
                <Button size="lg" className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Sections */}
      {features.map((section, sectionIdx) => {
        const colors = colorClasses[section.color];
        return (
          <section key={section.category} className={`py-24 ${sectionIdx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/50'}`}>
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {section.category}
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  {section.description}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 hover:border-lime-500/50 transition-all duration-300 group hover:bg-slate-800"
                  >
                    <div className={`w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your finance operations?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to={createPageUrl('Landing')}>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}