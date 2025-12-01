import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, CheckCircle2, BarChart3, Building2 } from 'lucide-react';

const clients = [
  { name: 'Finance Nexus', clients: 47, closed: 12 },
  { name: 'Quantum Ledger Group', clients: 63, closed: 18 },
  { name: 'MetAccounting Alliance', clients: 35, closed: 8 },
  { name: 'PrimeCore Digital Finance', clients: 52, closed: 15 }
];

export default function MetaverseAgency() {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-900">
      {/* Background with professionals */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80"
          alt="Team reviewing dashboards"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/90" />
      </div>
      
      {/* Background Effects */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full z-[1]"
        style={{
          background: 'radial-gradient(circle, rgba(132,204,22,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
        animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}
            >
              <Building2 className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">For Agencies</span>
            </motion.span>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Agency{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                Dashboard
              </span>
            </h2>

            <p className="text-xl text-slate-400 mb-8">
              Manage multiple clients from a single, powerful dashboard. PDPA-safe, secure, and scalable.
            </p>

            <div className="space-y-4">
              {['Unlimited client entities', 'White-label options', 'Real-time analytics', 'Automated workflows'].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 0 60px rgba(139, 92, 246, 0.15)'
              }}
            >
              {/* Holographic Shine */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)'
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                    }}
                  >
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Agency Overview</p>
                    <p className="text-slate-400 text-sm">All clients</p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  className="rounded-xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(132,204,22,0.15) 0%, rgba(30,41,59,0.5) 100%)',
                    border: '1px solid rgba(132, 204, 22, 0.3)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(132,204,22,0.1)',
                      '0 0 30px rgba(132,204,22,0.2)',
                      '0 0 20px rgba(132,204,22,0.1)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                    <span className="text-lime-400 text-sm font-medium">12 clients</span>
                  </div>
                  <p className="text-slate-400 text-xs">Auto-closed this month</p>
                </motion.div>
                <motion.div
                  className="rounded-xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(30,41,59,0.5) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span className="text-violet-400 text-sm font-medium">47 Active Clients</span>
                  </div>
                  <p className="text-slate-400 text-xs">Total managed</p>
                </motion.div>
              </div>

              {/* Client Cards */}
              <div className="space-y-3">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.name}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(100, 116, 139, 0.2)'
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      borderColor: 'rgba(132, 204, 22, 0.4)',
                      boxShadow: '0 0 20px rgba(132, 204, 22, 0.1)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          background: `linear-gradient(135deg, hsl(${index * 60}, 70%, 50%) 0%, hsl(${index * 60 + 30}, 70%, 40%) 100%)`
                        }}
                      >
                        {client.name[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{client.name}</p>
                        <p className="text-slate-500 text-xs">{client.clients} clients</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-lime-400" />
                      <span className="text-lime-400 text-sm">+{client.closed}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Neon Chart Placeholder */}
              <div className="mt-6 h-24 rounded-xl overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(139,92,246,0.1) 100%)'
                }}
              >
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#84cc16" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 0 80 Q 50 60 100 50 T 200 40 T 300 30 T 400 45 T 500 35"
                    fill="none"
                    stroke="url(#chartGrad)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(132, 204, 22, 0.5))' }}
                  />
                </svg>
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -top-4 -right-4 px-4 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                boxShadow: '0 0 30px rgba(132, 204, 22, 0.5)'
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-slate-900 font-bold text-sm">PDPA Safe</span>
            </motion.div>
            
            {/* Floating Professional Avatar */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full overflow-hidden"
              style={{
                border: '3px solid rgba(139, 92, 246, 0.6)',
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)'
              }}
              animate={{ y: [0, 8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
                alt="Finance professional"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}