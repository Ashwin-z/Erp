import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, Brain, FileSearch, Clock } from 'lucide-react';

const props = [
  {
    icon: Brain,
    title: "Predictive Cashflow & AI Actions",
    description: "See cash 90 days ahead with AI-powered forecasting. Get actionable recommendations before issues arise.",
    stat: "90 days",
    statLabel: "forecast horizon",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    icon: Zap,
    title: "95% Auto-Reconciliation & OCR",
    description: "Cut reconciliation time by 90%. Our AI matches transactions with near-perfect accuracy.",
    stat: "95%",
    statLabel: "accuracy rate",
    gradient: "from-lime-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "IRAS GST + PDPA Compliant",
    description: "Designed for Singapore HQ with full APAC localization. Enterprise-grade security built-in.",
    stat: "100%",
    statLabel: "compliance ready",
    gradient: "from-blue-500 to-cyan-500"
  }
];

export default function ValueProps() {
  return (
    <section id="value-props" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-lime-600 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Why ARKFinex
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Transform Your Finance Operations
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Purpose-built for modern accounting agencies and growing enterprises across Asia
          </p>
        </motion.div>

        {/* Props Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {props.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-100 hover:border-slate-200">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prop.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <prop.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {prop.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {prop.description}
                </p>

                {/* Stat */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold bg-gradient-to-r ${prop.gradient} text-transparent bg-clip-text`}>
                      {prop.stat}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {prop.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <motion.div 
          className="mt-20 bg-slate-900 rounded-3xl p-8 lg:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Companies Trust Us" },
              { value: "$2B+", label: "Transactions Processed" },
              { value: "99.9%", label: "Uptime Guaranteed" },
              { value: "24/7", label: "Support Available" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}