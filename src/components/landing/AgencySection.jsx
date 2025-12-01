import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Users, LayoutDashboard, Clock, TrendingUp, 
  ArrowRight, CheckCircle2, Building2 
} from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: "Multi-Client Management",
    description: "Manage dozens of clients from a single dashboard with client-level isolation"
  },
  {
    icon: Clock,
    title: "Automate Month-End",
    description: "Reduce month-end close time by 80% with AI-powered workflows"
  },
  {
    icon: TrendingUp,
    title: "Value-Added Advisory",
    description: "Deliver AI insights to clients and become a strategic advisor, not just a bookkeeper"
  },
  {
    icon: LayoutDashboard,
    title: "White-Label Ready",
    description: "Brand the platform as your own with custom logos and domains"
  }
];

export default function AgencySection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden" id="agencies">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 mb-6">
              <Building2 className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-medium text-lime-400">For Accounting Agencies</span>
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Built for Agencies <br />
              <span className="text-lime-400">That Scale</span>
            </h2>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Manage dozens of clients from one platform, automate month-end, and deliver 
              value-added advisory with AI insights. Transform your practice from compliance 
              to strategic partner.
            </p>

            {/* Benefits */}
            <div className="space-y-6 mb-10">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <benefit.icon className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-slate-400 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8 py-6 text-base rounded-xl group"
            >
              Schedule Agency Demo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-semibold text-lg">Agency Dashboard</h3>
                <span className="text-xs text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
                  47 Active Clients
                </span>
              </div>

              {/* Client Cards */}
              <div className="space-y-4 mb-6">
                {[
                  { name: "TechStart Pte Ltd", status: "Up to date", statusColor: "text-lime-400", revenue: "$12,450" },
                  { name: "Marina Foods Co.", status: "Review needed", statusColor: "text-amber-400", revenue: "$8,920" },
                  { name: "Urban Retail Group", status: "Up to date", statusColor: "text-lime-400", revenue: "$24,100" }
                ].map((client, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{client.name}</p>
                        <p className={`text-xs ${client.statusColor}`}>{client.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{client.revenue}</p>
                      <p className="text-slate-400 text-xs">Monthly revenue</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total MRR", value: "$45,470" },
                  { label: "Tasks Done", value: "94%" },
                  { label: "Avg Response", value: "2.4h" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-700/30 rounded-xl p-4 text-center">
                    <p className="text-lime-400 font-bold text-lg">{stat.value}</p>
                    <p className="text-slate-400 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div 
              className="absolute -top-4 -right-4 bg-lime-500 rounded-2xl px-4 py-3 shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
                <div>
                  <p className="text-slate-900 font-bold text-sm">12 clients</p>
                  <p className="text-slate-700 text-xs">Auto-closed this month</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}