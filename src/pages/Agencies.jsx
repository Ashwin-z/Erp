import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { 
  Users, Building2, LayoutDashboard, Clock, TrendingUp, 
  ArrowRight, Settings, Workflow, Award
} from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: "Unlimited Client Entities",
    description: "Manage as many clients as you need with complete data isolation and role-based access control."
  },
  {
    icon: LayoutDashboard,
    title: "Unified Agency Dashboard",
    description: "See all clients at a glance with aggregated KPIs, alerts, and task management in one view."
  },
  {
    icon: Clock,
    title: "80% Faster Month-End Close",
    description: "Automate reconciliation, journal entries, and reporting to dramatically reduce close time."
  },
  {
    icon: TrendingUp,
    title: "AI-Powered Insights",
    description: "Deliver value-added advisory with cashflow forecasting and actionable recommendations."
  },
  {
    icon: Settings,
    title: "White-Label Branding",
    description: "Present the platform as your own with custom logos, colors, and branded client portals."
  },
  {
    icon: Workflow,
    title: "Standardized Workflows",
    description: "Create and deploy consistent processes across all clients for quality and efficiency."
  }
];

const stats = [
  { value: "500+", label: "Agencies Trust Us" },
  { value: "10,000+", label: "Clients Managed" },
  { value: "80%", label: "Time Saved" },
  { value: "99.9%", label: "Uptime" }
];

const testimonials = [
  {
    quote: "ARKFinex transformed our practice. We now manage 3x more clients with the same team size.",
    author: "David Lim",
    role: "Managing Partner",
    company: "Lim & Associates"
  },
  {
    quote: "The white-label feature lets us present this as our own platform. Clients love the modern experience.",
    author: "Rachel Ng",
    role: "Director",
    company: "Prime Advisory Group"
  }
];

export default function Agencies() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 mb-6">
                <Building2 className="w-4 h-4 text-lime-400" />
                <span className="text-sm font-medium text-lime-400">For Accounting Agencies</span>
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Scale Your Practice <br />
                <span className="text-lime-400">Without Limits</span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Manage dozens of clients from one platform. Automate month-end, 
                deliver AI-powered insights, and transform your practice from 
                compliance work to strategic advisory.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl('Dashboard')}>
                  <Button size="lg" className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8">
                    Schedule Agency Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Landing')}>
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white font-semibold text-lg">Agency Dashboard</h3>
                  <span className="text-xs text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
                    47 Active Clients
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { name: "TechStart Pte Ltd", status: "Up to date", statusColor: "text-lime-400", revenue: "$12,450" },
                    { name: "Marina Foods Co.", status: "Review needed", statusColor: "text-amber-400", revenue: "$8,920" },
                    { name: "Urban Retail Group", status: "Up to date", statusColor: "text-lime-400", revenue: "$24,100" }
                  ].map((client, i) => (
                    <div key={i} className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between">
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
                    </div>
                  ))}
                </div>

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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Agencies Choose ARKFinex
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Purpose-built features that help accounting firms scale efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-lime-500/50 transition-all"
              >
                <div className="w-14 h-14 bg-lime-500 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Trusted by Leading Agencies
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-slate-500 text-sm">{testimonial.role}, {testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to scale your practice?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Join 500+ agencies already using ARKFinex to manage their clients.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8">
                Schedule Demo
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