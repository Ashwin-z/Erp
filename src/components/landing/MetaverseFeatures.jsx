import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Brain, Shield, Users, Link2,
  ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';

const categories = [
  { id: 'core', name: 'Finance Core', icon: BookOpen, color: 'lime', gradient: 'from-lime-400 to-emerald-400' },
  { id: 'ai', name: 'AI Suite', icon: Brain, color: 'violet', gradient: 'from-violet-400 to-purple-400' },
  { id: 'security', name: 'Security', icon: Shield, color: 'cyan', gradient: 'from-cyan-400 to-blue-400' },
  { id: 'agency', name: 'Agency', icon: Users, color: 'pink', gradient: 'from-pink-400 to-rose-400' },
  { id: 'integrations', name: 'Integrations', icon: Link2, color: 'orange', gradient: 'from-orange-400 to-amber-400' }
];

const features = {
  core: ['General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Bank Reconciliation', 'GST Management'],
  ai: ['OCR Processing', 'Cashflow Analyst', 'Collections AI', 'Auto-Reconciliation', 'Smart Suggestions'],
  security: ['PDPA Compliant', 'SOC-2 Ready', 'AES-256 Encryption', 'Audit Trail', '2FA/MFA'],
  agency: ['Multi-Client', 'White Label', 'Client Dashboards', 'Workflow Templates', 'Performance Reports'],
  integrations: ['DBS Bank', 'OCBC Bank', 'UOB Bank', 'Xero', 'QuickBooks']
};

const colorMap = {
  lime: { bg: 'rgba(132,204,22,0.15)', border: 'rgba(132,204,22,0.4)', glow: 'rgba(132,204,22,0.5)', text: 'text-lime-400' },
  violet: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', glow: 'rgba(139,92,246,0.5)', text: 'text-violet-400' },
  cyan: { bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.4)', glow: 'rgba(6,182,212,0.5)', text: 'text-cyan-400' },
  pink: { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.4)', glow: 'rgba(236,72,153,0.5)', text: 'text-pink-400' },
  orange: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', glow: 'rgba(249,115,22,0.5)', text: 'text-orange-400' }
};

export default function MetaverseFeatures() {
  const [active, setActive] = useState('core');
  const current = categories.find(c => c.id === active);
  const colors = colorMap[current.color];

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Animated Background with Mesh */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #1a1a2e 50%, #0f172a 100%)'
          }}
        />
        
        {/* Holographic Mesh Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="hexGrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="rgba(132,204,22,0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexGrid)" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-[15%] w-32 h-32"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, transparent 70%)',
            borderRadius: '30% 70% 53% 47% / 47% 53% 47% 53%'
          }}
          animate={{ 
            rotate: [0, 180, 360],
            borderRadius: [
              '30% 70% 53% 47% / 47% 53% 47% 53%',
              '53% 47% 30% 70% / 70% 30% 70% 30%',
              '30% 70% 53% 47% / 47% 53% 47% 53%'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-[10%] w-48 h-48"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, transparent 70%)',
            borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%'
          }}
          animate={{ 
            rotate: [360, 180, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        {/* Moving Light Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            border: '1px solid rgba(132, 204, 22, 0.1)'
          }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            border: '1px dashed rgba(139, 92, 246, 0.1)'
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#84cc16', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 3)],
            boxShadow: '0 0 10px currentColor'
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title with Fluid Animation */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 mb-8"
            style={{
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(139,92,246,0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(132, 204, 22, 0.3)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-lime-400" />
            <span className="text-lime-400 font-medium">Platform Features</span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 relative">
            Everything You Need to{' '}
            <span className="relative inline-block">
              <motion.span 
                className={`text-transparent bg-clip-text bg-gradient-to-r ${current.gradient}`}
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Scale
              </motion.span>
              {/* Fluid animated glow behind text */}
              <motion.div
                className="absolute -inset-4 -z-10 rounded-full blur-xl"
                style={{ background: colors.glow }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </h2>
        </motion.div>

        {/* Category Selector - Organic Floating Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat, index) => {
            const isActive = active === cat.id;
            const catColors = colorMap[cat.color];
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className="relative flex items-center gap-2 px-6 py-4 font-medium transition-all overflow-hidden"
                style={{
                  borderRadius: '30px 50px 40px 50px',
                  background: isActive ? catColors.bg : 'rgba(30, 41, 59, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isActive ? catColors.border : 'rgba(100, 116, 139, 0.2)'}`,
                  boxShadow: isActive ? `0 0 40px ${catColors.glow}` : 'none'
                }}
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: `0 0 30px ${catColors.glow}`
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  borderRadius: isActive ? [
                    '30px 50px 40px 50px',
                    '50px 30px 50px 40px',
                    '30px 50px 40px 50px'
                  ] : '30px 50px 40px 50px'
                }}
                transition={{ duration: 4, repeat: isActive ? Infinity : 0 }}
              >
                {/* Holographic shine on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
                  }}
                  animate={isActive ? { x: ['-100%', '200%'] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <cat.icon className={`w-5 h-5 ${isActive ? catColors.text : 'text-slate-400'}`} />
                </motion.div>
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{cat.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Feature Display - Organic Glassmorphism Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative">
              {/* Main Content Area - Organic Shape */}
              <motion.div
                className="relative overflow-hidden"
                style={{
                  borderRadius: '60px 100px 80px 120px',
                  background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.6) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${colors.border}`,
                  boxShadow: `0 0 80px ${colors.glow}, inset 0 0 60px rgba(0,0,0,0.3)`
                }}
                animate={{
                  borderRadius: [
                    '60px 100px 80px 120px',
                    '80px 120px 60px 100px',
                    '60px 100px 80px 120px'
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              >
                {/* Holographic Shine */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)'
                  }}
                  animate={{ x: ['-150%', '150%'] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                />

                <div className="grid lg:grid-cols-2 p-8 lg:p-12 gap-8">
                  {/* Left - Category Info */}
                  <div className="relative z-10">
                    {/* Floating Glow */}
                    <motion.div
                      className="absolute -top-10 -left-10 w-40 h-40 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                        filter: 'blur(40px)'
                      }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Icon in organic shape */}
                    <motion.div 
                      className="w-20 h-20 flex items-center justify-center mb-6 relative z-10"
                      style={{
                        borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
                        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.glow} 100%)`,
                        boxShadow: `0 0 40px ${colors.glow}`
                      }}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      animate={{
                        borderRadius: [
                          '40% 60% 55% 45% / 50% 45% 55% 50%',
                          '55% 45% 40% 60% / 45% 55% 45% 55%',
                          '40% 60% 55% 45% / 50% 45% 55% 50%'
                        ]
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      <current.icon className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 relative z-10">
                      {current.name}
                    </h3>

                    {/* Stats in organic bubbles */}
                    <div className="flex gap-4 mb-8 relative z-10">
                      <motion.div 
                        className="px-6 py-4"
                        style={{
                          borderRadius: '30px 50px 40px 50px',
                          background: 'rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${colors.border}`
                        }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <p className={`text-2xl font-bold ${colors.text}`}>99%</p>
                        <p className="text-slate-500 text-sm">Automation</p>
                      </motion.div>
                      <motion.div 
                        className="px-6 py-4"
                        style={{
                          borderRadius: '50px 30px 50px 40px',
                          background: 'rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${colors.border}`
                        }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <p className={`text-2xl font-bold ${colors.text}`}>5min</p>
                        <p className="text-slate-500 text-sm">Setup</p>
                      </motion.div>
                    </div>

                    <Link to={createPageUrl('Dashboard')}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          className="font-semibold relative z-10 px-8 py-6"
                          style={{
                            borderRadius: '30px 50px 40px 50px',
                            background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.glow} 100%)`,
                            boxShadow: `0 0 40px ${colors.glow}`
                          }}
                        >
                          <span className="text-white">Explore {current.name}</span>
                          <ArrowRight className="ml-2 w-4 h-4 text-white" />
                        </Button>
                      </motion.div>
                    </Link>
                  </div>

                  {/* Right - Feature List in Floating Bubbles */}
                  <div className="relative z-10">
                    <div className="space-y-3">
                      {features[active].map((feature, i) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 30, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-4 cursor-pointer group"
                          style={{
                            borderRadius: '20px 40px 30px 40px',
                            background: 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(100, 116, 139, 0.2)'
                          }}
                          whileHover={{
                            x: 10,
                            borderColor: colors.border,
                            boxShadow: `0 0 25px ${colors.glow}`,
                            borderRadius: '40px 20px 40px 30px'
                          }}
                        >
                          <motion.div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              background: colors.bg,
                              border: `1px solid ${colors.border}`
                            }}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
                          </motion.div>
                          <span className="text-white font-medium flex-1">{feature}</span>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Decorative Elements */}
              <motion.div
                className="absolute -top-6 right-20 w-16 h-16"
                style={{
                  borderRadius: '50% 50% 45% 55%',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0 0 30px ${colors.glow}`
                }}
                animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-4 left-32 w-12 h-12 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}