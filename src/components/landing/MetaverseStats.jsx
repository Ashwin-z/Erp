import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 500, suffix: '+', label: 'Companies Trust Us', color: 'lime' },
  { value: 2, prefix: '$', suffix: 'B+', label: 'Transactions Processed', color: 'violet' },
  { value: 99.9, suffix: '%', label: 'Uptime Guaranteed', color: 'cyan' },
  { value: 24, suffix: '/7', label: 'Support Available', color: 'pink' }
];

function AnimatedCounter({ value, prefix = '', suffix = '', label, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const colorClasses = {
    lime: 'text-lime-400',
    violet: 'text-violet-400',
    cyan: 'text-cyan-400',
    pink: 'text-pink-400'
  };

  const glowColors = {
    lime: 'rgba(132, 204, 22, 0.6)',
    violet: 'rgba(139, 92, 246, 0.6)',
    cyan: 'rgba(6, 182, 212, 0.6)',
    pink: 'rgba(236, 72, 153, 0.6)'
  };

  const bgColors = {
    lime: 'rgba(132, 204, 22, 0.15)',
    violet: 'rgba(139, 92, 246, 0.15)',
    cyan: 'rgba(6, 182, 212, 0.15)',
    pink: 'rgba(236, 72, 153, 0.15)'
  };

  return (
    <motion.div
      ref={ref}
      className="text-center relative group flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-32 h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center relative mb-4"
        style={{
          background: bgColors[color],
          border: `2px solid ${glowColors[color]}`,
          boxShadow: `0 0 30px ${glowColors[color]}, inset 0 0 20px ${bgColors[color]}`
        }}
        animate={{
          boxShadow: [
            `0 0 30px ${glowColors[color]}, inset 0 0 20px ${bgColors[color]}`,
            `0 0 50px ${glowColors[color]}, inset 0 0 30px ${bgColors[color]}`,
            `0 0 30px ${glowColors[color]}, inset 0 0 20px ${bgColors[color]}`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            border: `1px dashed ${glowColors[color]}`,
            opacity: 0.5
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        <motion.p 
          className={`text-3xl lg:text-4xl font-bold ${colorClasses[color]} relative z-10`}
          style={{
            textShadow: `0 0 20px ${glowColors[color]}`
          }}
        >
          {prefix}{typeof count === 'number' ? (Number.isInteger(value) ? Math.floor(count) : count.toFixed(1)) : count}{suffix}
        </motion.p>
      </motion.div>
      
      <p className="text-white/90 text-sm uppercase tracking-wider font-medium relative z-10 text-center max-w-[140px]">
        {label}
      </p>
    </motion.div>
  );
}

export default function MetaverseStats() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=90&fit=crop"
          alt="Professional team meeting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
      </div>

      <motion.div
        className="absolute inset-0 z-[1] opacity-40"
        style={{
          background: 'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.1) 100%)'
        }}
        animate={{
          background: [
            'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.1) 100%)',
            'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.1) 50%, rgba(236,72,153,0.1) 100%)',
            'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.1) 100%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div 
        className="absolute inset-0 opacity-5 z-[2]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full z-[3]"
          style={{
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#84cc16', '#8b5cf6', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 4)],
            boxShadow: '0 0 15px currentColor'
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <motion.div
        className="absolute top-16 left-8 lg:left-20 z-[4] hidden md:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="relative">
          <div 
            className="w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden"
            style={{
              border: '3px solid rgba(132, 204, 22, 0.8)',
              boxShadow: '0 0 25px rgba(132, 204, 22, 0.5)'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&q=90&fit=crop"
              alt="Professional"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div 
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(132, 204, 22, 0.8)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs">💼</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-24 right-12 lg:right-24 z-[4] hidden md:block"
        animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className="relative">
          <div 
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden"
            style={{
              border: '3px solid rgba(139, 92, 246, 0.8)',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&q=90&fit=crop"
              alt="Professional"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)' }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <span className="text-xs">📊</span>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-24 left-1/4 z-[4] hidden md:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <div className="relative">
          <div 
            className="w-11 h-11 lg:w-13 lg:h-13 rounded-full overflow-hidden"
            style={{
              border: '3px solid rgba(6, 182, 212, 0.8)',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&q=90&fit=crop"
              alt="Professional"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs">💡</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-[15%] z-[4] hidden md:block"
        animate={{ y: [0, 12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      >
        <div className="relative">
          <div 
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden"
            style={{
              border: '3px solid rgba(236, 72, 153, 0.8)',
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.5)'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&q=90&fit=crop"
              alt="Professional"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)' }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <span className="text-xs">🚀</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
        <motion.h2 
          className="text-center text-3xl lg:text-5xl font-bold text-white mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Transform Your{' '}
          <span 
            className="text-transparent bg-clip-text font-extrabold"
            style={{
              backgroundImage: 'linear-gradient(90deg, #84cc16, #a3e635, #06b6d4)',
              WebkitBackgroundClip: 'text'
            }}
          >
            Finance Operations
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <AnimatedCounter
              key={index}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              color={stat.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}