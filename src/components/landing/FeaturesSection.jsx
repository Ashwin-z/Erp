import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, FileText, Receipt, Building2, Calculator,
  Brain, FileSearch, TrendingUp, MessageSquare, Lightbulb,
  Shield, Lock, Key, Database,
  Users, LayoutDashboard, BarChart3, Settings,
  Landmark, CreditCard, Link2, Workflow, ArrowRight
} from 'lucide-react';

const featureCategories = [
  {
    id: 'core',
    title: 'Finance & Accounting Core',
    description: 'Complete financial management suite',
    icon: BookOpen,
    color: 'lime',
    features: [
      { icon: BookOpen, name: 'General Ledger', desc: 'Multi-currency double-entry accounting' },
      { icon: Receipt, name: 'Accounts Payable', desc: 'Streamlined vendor management' },
      { icon: FileText, name: 'Accounts Receivable', desc: 'Automated invoicing & collections' },
      { icon: Building2, name: 'Bank Reconciliation', desc: 'Smart transaction matching' },
      { icon: Calculator, name: 'GST Management', desc: 'IRAS-compliant tax handling' }
    ]
  },
  {
    id: 'ai',
    title: 'AI Suite',
    description: 'Intelligent automation powered by ML',
    icon: Brain,
    color: 'violet',
    features: [
      { icon: FileSearch, name: 'OCR Processing', desc: 'Extract data from any document' },
      { icon: TrendingUp, name: 'Cashflow Analyst', desc: '90-day predictive forecasting' },
      { icon: MessageSquare, name: 'Collections AI', desc: 'Smart payment follow-ups' },
      { icon: Lightbulb, name: 'Suggestion Engine', desc: 'Actionable recommendations' },
      { icon: Brain, name: 'Auto-Reconciliation', desc: '95% accuracy matching' }
    ]
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'Enterprise-grade protection',
    icon: Shield,
    color: 'blue',
    features: [
      { icon: Shield, name: 'PDPA Compliant', desc: 'Full Singapore data protection' },
      { icon: Lock, name: 'SOC-2 Ready', desc: 'Enterprise security controls' },
      { icon: Key, name: 'Encryption', desc: 'AES-256 at rest & in transit' },
      { icon: Database, name: 'Audit Trail', desc: 'Complete activity logging' },
      { icon: Users, name: '2FA/MFA', desc: 'Multi-factor authentication' }
    ]
  },
  {
    id: 'agency',
    title: 'Agency Panel',
    description: 'Multi-client management',
    icon: Users,
    color: 'emerald',
    features: [
      { icon: Users, name: 'Client Management', desc: 'Unlimited client entities' },
      { icon: LayoutDashboard, name: 'Client Dashboards', desc: 'Per-client analytics view' },
      { icon: BarChart3, name: 'Performance Reports', desc: 'Agency-wide metrics' },
      { icon: Settings, name: 'White Label', desc: 'Custom branding options' },
      { icon: Workflow, name: 'Workflow Templates', desc: 'Standardized processes' }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect your ecosystem',
    icon: Link2,
    color: 'orange',
    features: [
      { icon: Landmark, name: 'DBS Bank', desc: 'Direct feed integration' },
      { icon: Landmark, name: 'OCBC Bank', desc: 'Automated statements' },
      { icon: Landmark, name: 'UOB Bank', desc: 'Real-time sync' },
      { icon: CreditCard, name: 'Payroll Systems', desc: 'HR & payroll connect' },
      { icon: Link2, name: 'CRM Integration', desc: 'Salesforce, HubSpot' }
    ]
  }
];

const colorClasses = {
  lime: { 
    bg: 'bg-lime-500', 
    light: 'bg-gradient-to-br from-lime-50 to-emerald-100', 
    text: 'text-lime-600', 
    border: 'border-lime-200',
    cardBg: 'bg-gradient-to-br from-lime-500/10 to-emerald-500/20',
    hoverBg: 'hover:bg-lime-100'
  },
  violet: { 
    bg: 'bg-violet-500', 
    light: 'bg-gradient-to-br from-violet-50 to-purple-100', 
    text: 'text-violet-600', 
    border: 'border-violet-200',
    cardBg: 'bg-gradient-to-br from-violet-500/10 to-purple-500/20',
    hoverBg: 'hover:bg-violet-100'
  },
  blue: { 
    bg: 'bg-blue-500', 
    light: 'bg-gradient-to-br from-blue-50 to-cyan-100', 
    text: 'text-blue-600', 
    border: 'border-blue-200',
    cardBg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/20',
    hoverBg: 'hover:bg-blue-100'
  },
  emerald: { 
    bg: 'bg-emerald-500', 
    light: 'bg-gradient-to-br from-emerald-50 to-teal-100', 
    text: 'text-emerald-600', 
    border: 'border-emerald-200',
    cardBg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/20',
    hoverBg: 'hover:bg-emerald-100'
  },
  orange: { 
    bg: 'bg-orange-500', 
    light: 'bg-gradient-to-br from-orange-50 to-amber-100', 
    text: 'text-orange-600', 
    border: 'border-orange-200',
    cardBg: 'bg-gradient-to-br from-orange-500/10 to-amber-500/20',
    hoverBg: 'hover:bg-orange-100'
  }
};

export default function FeaturesSection() {
  const [activeCategory, setActiveCategory] = useState('core');
  const active = featureCategories.find(c => c.id === activeCategory);
  const colors = colorClasses[active.color];

  return (
    <section className="py-24 bg-slate-50" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-lime-600 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Platform Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A complete finance operating system designed for modern businesses
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {featureCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const catColors = colorClasses[cat.color];
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                  isActive 
                    ? `${catColors.bg} text-white shadow-lg shadow-${cat.color}-500/30` 
                    : `bg-white text-slate-600 hover:text-slate-900 ${catColors.hoverBg} border-2 border-slate-200 hover:border-${cat.color}-300`
                }`}
              >
                <cat.icon className={`w-5 h-5 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                <span className="hidden sm:inline">{cat.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Features Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`rounded-3xl border-2 ${colors.border} overflow-hidden shadow-2xl`}>
              <div className="grid lg:grid-cols-2">
                {/* Left - Info */}
                <div className={`${colors.light} p-10 lg:p-14 relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className={`absolute top-10 right-10 w-32 h-32 ${colors.bg} rounded-full blur-3xl`} />
                    <div className={`absolute bottom-10 left-10 w-24 h-24 ${colors.bg} rounded-full blur-2xl`} />
                  </div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <active.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">
                      {active.title}
                    </h3>
                    <p className="text-lg text-slate-600 mb-8">
                      {active.description}
                    </p>
                    
                    {/* Mini Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <motion.div 
                        className={`bg-white/80 backdrop-blur rounded-xl p-4 border-2 ${colors.border} shadow-sm`}
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <p className={`text-2xl font-bold ${colors.text}`}>99%</p>
                        <p className="text-slate-500 text-sm">Automation Rate</p>
                      </motion.div>
                      <motion.div 
                        className={`bg-white/80 backdrop-blur rounded-xl p-4 border-2 ${colors.border} shadow-sm`}
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <p className={`text-2xl font-bold ${colors.text}`}>5min</p>
                        <p className="text-slate-500 text-sm">Setup Time</p>
                      </motion.div>
                    </div>

                    {/* CTA Button */}
                    <Link to={createPageUrl('Dashboard')}>
                      <Button 
                        className={`${colors.bg} hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg group transition-all duration-300 hover:shadow-xl hover:scale-105`}
                      >
                        Explore {active.title}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right - Features List */}
                <div className="bg-white p-10 lg:p-14">
                  <div className="space-y-5">
                    {active.features.map((feature, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 8, scale: 1.02 }}
                        className={`flex items-start gap-4 group p-4 rounded-xl cursor-pointer transition-all duration-300 ${colors.hoverBg} hover:shadow-md`}
                      >
                        <div className={`w-12 h-12 ${colors.cardBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border ${colors.border}`}>
                          <feature.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-slate-800">
                            {feature.name}
                          </h4>
                          <p className="text-slate-500 text-sm group-hover:text-slate-600">
                            {feature.desc}
                          </p>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity ml-auto self-center`} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}