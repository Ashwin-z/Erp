import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, CreditCard, Building2, Database, Cloud, Link2 } from 'lucide-react';

const integrations = [
  { name: 'DBS Bank', icon: Landmark, color: '#E31937' },
  { name: 'OCBC Bank', icon: Landmark, color: '#E31937' },
  { name: 'UOB Bank', icon: Landmark, color: '#0033A0' },
  { name: 'Xero', icon: Cloud, color: '#13B5EA' },
  { name: 'QuickBooks', icon: Database, color: '#2CA01C' },
  { name: 'Stripe', icon: CreditCard, color: '#635BFF' },
  { name: 'PayPal', icon: CreditCard, color: '#003087' },
  { name: 'Salesforce', icon: Building2, color: '#00A1E0' },
];

export default function MetaverseIntegrations() {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-900">
      {/* Background with professionals */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80"
          alt="Team meeting"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
      </div>
      {/* Network Mesh Background */}
      <div className="absolute inset-0 z-[1]">
        <svg className="w-full h-full opacity-20">
          <defs>
            <pattern id="mesh" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="rgba(132, 204, 22, 0.5)" />
              <line x1="50" y1="50" x2="100" y2="0" stroke="rgba(132, 204, 22, 0.2)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="100" y2="100" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="0" y2="100" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>

      {/* Animated Connection Lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px z-[2]"
          style={{
            width: '200px',
            left: `${10 + i * 20}%`,
            top: `${30 + i * 10}%`,
            background: 'linear-gradient(90deg, transparent, rgba(132, 204, 22, 0.5), transparent)'
          }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, 100, 200],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(139,92,246,0.2) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}
          >
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Seamless Integrations</span>
          </motion.span>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Connect Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
              Ecosystem
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Integrates seamlessly with modern accounting & finance ecosystems across Singapore.
          </p>
        </motion.div>

        {/* Integration Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -10 }}
            >
              <motion.div
                className="p-6 rounded-2xl text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.9) 100%)',
                  border: '1px solid rgba(132, 204, 22, 0.2)'
                }}
                whileHover={{
                  borderColor: 'rgba(132, 204, 22, 0.6)',
                  boxShadow: '0 0 40px rgba(132, 204, 22, 0.2)'
                }}
              >
                {/* Holographic Shine */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Spinning Ring on Hover */}
                <motion.div
                  className="absolute inset-4 rounded-full border border-lime-500/30 opacity-0 group-hover:opacity-100"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />

                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center relative z-10"
                  style={{
                    background: `linear-gradient(135deg, ${integration.color}20 0%, ${integration.color}10 100%)`,
                    border: `1px solid ${integration.color}40`
                  }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <integration.icon className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-white font-medium relative z-10">{integration.name}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Connection Animation Center */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="w-24 h-24 rounded-full relative"
            style={{
              background: 'linear-gradient(135deg, rgba(132,204,22,0.2) 0%, rgba(139,92,246,0.2) 100%)',
              border: '2px solid rgba(132, 204, 22, 0.5)'
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(132,204,22,0.3)',
                '0 0 60px rgba(132,204,22,0.5)',
                '0 0 30px rgba(132,204,22,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                border: '1px dashed rgba(139, 92, 246, 0.5)'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lime-400 font-bold text-lg">AF</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}