import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import BookDemoModal from './BookDemoModal';

const words = ['Define.', 'Decide.', 'Deliver.'];

export default function MetaverseHero() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeWord, setActiveWord] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80"
          alt="Professional team meeting"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>
      
      {/* Animated Neon Grid Floor */}
      <div className="absolute inset-0 z-[1]">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(132, 204, 22, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(132, 204, 22, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top'
          }}
        />
        {/* Grid glow animation */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background: 'linear-gradient(to top, rgba(132, 204, 22, 0.15), transparent)'
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Floating Holographic Orbs */}
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 rounded-full z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-1/3 left-10 w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
          filter: 'blur(30px)'
        }}
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }}
        animate={{ 
          scale: [1, 1.4, 1],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-lime-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px rgba(132, 204, 22, 0.8)'
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}

      {/* Scanning Light Beam */}
      <motion.div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-lime-400/50 to-transparent"
        animate={{ x: ['-100%', '100vw'] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(132,204,22,0.2) 0%, rgba(139,92,246,0.2) 100%)',
                border: '1px solid rgba(132, 204, 22, 0.4)',
                boxShadow: '0 0 20px rgba(132, 204, 22, 0.2)'
              }}
              animate={{ boxShadow: ['0 0 20px rgba(132,204,22,0.2)', '0 0 40px rgba(132,204,22,0.4)', '0 0 20px rgba(132,204,22,0.2)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-medium text-lime-400">AI-Powered Finance Platform</span>
            </motion.div>

            {/* Animated Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              {words.map((word, index) => (
                <motion.span 
                  key={word}
                  className="block"
                  animate={{
                    color: activeWord === index ? '#84cc16' : '#ffffff',
                    textShadow: activeWord === index 
                      ? '0 0 40px rgba(132, 204, 22, 0.8), 0 0 80px rgba(132, 204, 22, 0.4)' 
                      : '0 0 0px transparent',
                    scale: activeWord === index ? 1.05 : 1,
                    x: activeWord === index ? 10 : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p 
              className="text-xl lg:text-2xl text-slate-300 mb-4 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              With AI Power.
            </motion.p>

            <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
              Singapore-first, enterprise-grade finance automation built for accounting agencies 
              and growing businesses across Asia. Predictive cashflow intelligence that transforms 
              how you manage money.
            </p>

            {/* CTAs with Neon Glow */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8 py-6 text-lg rounded-xl group transition-all duration-300"
                  style={{
                    boxShadow: '0 0 30px rgba(132, 204, 22, 0.5), 0 0 60px rgba(132, 204, 22, 0.3)'
                  }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-violet-500/50 hover:bg-violet-500/20 hover:border-violet-400 px-8 py-6 text-lg rounded-xl group bg-slate-800/80"
                  style={{
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                  }}
                  onClick={() => setDemoModalOpen(true)}
                >
                  <Play className="mr-2 w-5 h-5 text-violet-400" />
                  <span className="text-white font-semibold">Book a Demo</span>
                </Button>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>PDPA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <span>14-day free trial</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Holographic Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Holographic Glass Card */}
              <motion.div 
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)',
                  border: '1px solid rgba(132, 204, 22, 0.3)',
                  boxShadow: '0 0 40px rgba(132, 204, 22, 0.15), inset 0 0 60px rgba(139, 92, 246, 0.05)'
                }}
                animate={{ 
                  boxShadow: [
                    '0 0 40px rgba(132,204,22,0.15), inset 0 0 60px rgba(139,92,246,0.05)',
                    '0 0 60px rgba(132,204,22,0.25), inset 0 0 80px rgba(139,92,246,0.1)',
                    '0 0 40px rgba(132,204,22,0.15), inset 0 0 60px rgba(139,92,246,0.05)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Holographic Shine */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />

                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                        boxShadow: '0 0 20px rgba(132, 204, 22, 0.5)'
                      }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <span className="text-slate-900 font-bold text-sm">AF</span>
                    </motion.div>
                    <div>
                      <p className="text-white font-medium">Financial Overview</p>
                      <p className="text-slate-400 text-sm">Real-time insights</p>
                    </div>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full bg-lime-500/20 text-lime-400 border border-lime-500/30">
                    Cashflow Forecast
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                  <motion.div 
                    className="rounded-xl p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(30,41,59,0.5) 100%)',
                      border: '1px solid rgba(132, 204, 22, 0.2)'
                    }}
                    whileHover={{ scale: 1.05, borderColor: 'rgba(132, 204, 22, 0.5)' }}
                  >
                    <p className="text-slate-400 text-xs mb-1">Cash Runway</p>
                    <p className="text-2xl font-bold text-white">87 days</p>
                    <p className="text-lime-400 text-xs mt-1">↑ 12% from last month</p>
                  </motion.div>
                  <motion.div 
                    className="rounded-xl p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(30,41,59,0.5) 100%)',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}
                    whileHover={{ scale: 1.05, borderColor: 'rgba(139, 92, 246, 0.5)' }}
                  >
                    <p className="text-slate-400 text-xs mb-1">Bank Balance</p>
                    <p className="text-2xl font-bold text-white">$248,520</p>
                    <p className="text-violet-400 text-xs mt-1">↑ 8.3% growth</p>
                  </motion.div>
                </div>

                {/* AI Alert */}
                <motion.div 
                  className="rounded-xl p-4 mb-4 relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(132,204,22,0.15) 0%, rgba(6,182,212,0.15) 100%)',
                    border: '1px solid rgba(132, 204, 22, 0.3)'
                  }}
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(132,204,22,0.1)',
                      '0 0 40px rgba(132,204,22,0.2)',
                      '0 0 20px rgba(132,204,22,0.1)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className="w-8 h-8 rounded-lg bg-lime-500/20 flex items-center justify-center flex-shrink-0"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-4 h-4 text-lime-400" />
                    </motion.div>
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

                {/* Auto-Reconciled Card */}
                <motion.div 
                  className="rounded-xl p-4 relative z-10 flex items-center gap-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,244,0.95) 100%)',
                    boxShadow: '0 0 30px rgba(132, 204, 22, 0.3)'
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                      boxShadow: '0 0 20px rgba(132, 204, 22, 0.4)'
                    }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-slate-600 text-xs font-medium">Auto-Reconciled</p>
                    <motion.p 
                      className="text-3xl font-bold text-slate-900"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      95%
                    </motion.p>
                    <p className="text-emerald-600 text-xs font-medium">This month</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[80, 95, 70, 90].map((h, i) => (
                      <motion.div 
                        key={i}
                        className="w-2 rounded-full bg-lime-500"
                        style={{ height: `${h / 10}px` }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Chart Card */}
              <motion.div 
                className="absolute -top-4 -right-4 rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <p className="text-slate-400 text-xs mb-2">Cashflow Forecast</p>
                <div className="flex items-end gap-1 h-12">
                  {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                    <motion.div 
                      key={i} 
                      className="w-3 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, #84cc16, #10b981)`,
                        boxShadow: '0 0 10px rgba(132, 204, 22, 0.5)'
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* 3D Floating Elements */}
              <motion.div
                className="absolute -left-8 top-1/3 w-16 h-16 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(139,92,246,0.3) 100%)',
                  border: '1px solid rgba(236, 72, 153, 0.4)'
                }}
                animate={{ 
                  rotate: [0, 180, 360],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 left-1/4 w-12 h-12 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.4) 0%, rgba(132,204,22,0.4) 100%)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  x: [0, 20, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
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
        <div 
          className="w-6 h-10 rounded-full flex items-start justify-center p-2"
          style={{
            border: '2px solid rgba(132, 204, 22, 0.5)',
            boxShadow: '0 0 15px rgba(132, 204, 22, 0.3)'
          }}
        >
          <motion.div 
            className="w-1.5 h-3 bg-lime-400 rounded-full"
            style={{ boxShadow: '0 0 10px rgba(132, 204, 22, 0.8)' }}
          />
        </div>
      </motion.div>

      <BookDemoModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </section>
  );
}