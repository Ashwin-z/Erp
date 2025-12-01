import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import BookDemoModal from './BookDemoModal';

export default function HeroSection() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80"
          alt="Finance professionals in meeting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(132, 204, 22, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(132, 204, 22, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-medium text-lime-400">AI-Powered Finance Platform</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              <span className="block">Define.</span>
              <span className="block">Decide.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                Deliver.
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-300 mb-4 font-light">
              With AI Power.
            </p>

            <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
              Singapore-first, enterprise-grade finance automation built for accounting agencies 
              and growing businesses across Asia. Predictive cashflow intelligence that transforms 
              how you manage money.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8 py-6 text-lg rounded-xl group transition-all duration-300 shadow-lg shadow-lime-500/25"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-500 text-white hover:bg-white/10 hover:border-lime-400 px-8 py-6 text-lg rounded-xl group bg-slate-800/50"
                onClick={() => setDemoModalOpen(true)}
              >
                <Play className="mr-2 w-5 h-5 text-lime-400" />
                <span className="text-white">Book a Demo</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-lime-400" />
                <span>PDPA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-lime-400" />
                <span>14-day free trial</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
                {/* Mini Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                      <span className="text-slate-900 font-bold text-sm">AF</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Financial Overview</p>
                      <p className="text-slate-400 text-sm">Real-time insights</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-xs mb-1">Cash Runway</p>
                    <p className="text-2xl font-bold text-white">87 days</p>
                    <p className="text-lime-400 text-xs mt-1">↑ 12% from last month</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-xs mb-1">Bank Balance</p>
                    <p className="text-2xl font-bold text-white">$248,520</p>
                    <p className="text-lime-400 text-xs mt-1">↑ 8.3% growth</p>
                  </div>
                </div>

                {/* AI Alert */}
                <motion.div 
                  className="bg-gradient-to-r from-lime-500/20 to-emerald-500/20 border border-lime-500/30 rounded-xl p-4"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-lime-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">AI Recommendation</p>
                      <p className="text-slate-300 text-xs mt-1">
                        3 invoices ready for auto-reconciliation with 98% confidence
                      </p>
                      <button className="text-lime-400 text-xs font-medium mt-2 hover:underline">
                        Apply Now →
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Auto-Reconciled Stats - moved below AI Recommendation */}
                <motion.div 
                  className="bg-white rounded-xl p-4 shadow-lg mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-slate-600 text-xs font-medium">Auto-Reconciled</p>
                  <p className="text-3xl font-bold text-slate-900">95%</p>
                  <p className="text-emerald-600 text-xs">This month</p>
                </motion.div>
              </div>

              {/* Floating Chart Card */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-slate-800 rounded-xl p-4 border border-slate-700"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <p className="text-slate-400 text-xs mb-2">Cashflow Forecast</p>
                <div className="flex items-end gap-1 h-12">
                  {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-3 bg-gradient-to-t from-lime-500 to-emerald-400 rounded-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-lime-400 rounded-full" />
        </div>
      </motion.div>

      <BookDemoModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </section>
  );
}