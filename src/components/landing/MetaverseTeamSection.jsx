import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Lightbulb, BarChart3, Zap, Sparkles } from 'lucide-react';

const teamFeatures = [
  { icon: Users, title: 'Collaborative Workflows', description: 'Work together seamlessly', color: 'lime' },
  { icon: MessageSquare, title: 'Real-time Sync', description: 'Instant updates', color: 'cyan' },
  { icon: Lightbulb, title: 'AI Suggestions', description: 'Smart insights', color: 'violet' },
  { icon: BarChart3, title: 'Live Dashboards', description: 'Shared data', color: 'pink' }
];

export default function MetaverseTeamSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0f172a 60%, #134e4a 100%)'
          }}
          animate={{
            background: [
              'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0f172a 60%, #134e4a 100%)',
              'linear-gradient(135deg, #0f172a 0%, #134e4a 30%, #1e1b4b 60%, #0f172a 100%)',
              'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0f172a 60%, #134e4a 100%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#84cc16', '#8b5cf6', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 4)],
            boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`
          }}
          animate={{
            y: [0, -50 - Math.random() * 50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}

      {/* Large Floating Orbs */}
      <motion.div
        className="absolute top-10 right-[10%] w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(132,204,22,0.2) 0%, transparent 60%)',
          filter: 'blur(60px)'
        }}
        animate={{ scale: [1, 1.4, 1], x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%)',
          filter: 'blur(80px)'
        }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(132,204,22,0.15) 0%, rgba(6,182,212,0.15) 100%)',
              border: '1px solid rgba(132, 204, 22, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-lime-400" />
            <span className="text-lime-400 font-medium">Human-Centric AI</span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 relative inline-block">
            Designed for Teams Who Want to{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400">
                Work Smarter Together
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 h-1 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #84cc16, #06b6d4, #8b5cf6)',
                  boxShadow: '0 0 20px rgba(132, 204, 22, 0.6)'
                }}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mt-6">
            Where AI meets human collaboration in a futuristic workspace
          </p>
        </motion.div>

        {/* Main Visual */}
        <div className="relative">
          <motion.div
            className="relative w-full mt-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-full h-[300px] md:h-[400px] lg:h-[450px] relative overflow-hidden mx-auto max-w-5xl"
              style={{
                borderRadius: '30px',
                background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 50%, rgba(15,23,42,0.9) 100%)',
                border: '2px solid rgba(132, 204, 22, 0.5)',
                boxShadow: '0 0 80px rgba(132, 204, 22, 0.4), inset 0 0 60px rgba(139, 92, 246, 0.1)'
              }}
            >
              {/* Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(rgba(132, 204, 22, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.3) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />
              
              {/* Center Glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 lg:w-56 lg:h-56"
                style={{
                  background: 'radial-gradient(circle, rgba(132,204,22,0.3) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)',
                  borderRadius: '50%',
                  boxShadow: '0 0 80px rgba(132, 204, 22, 0.4)'
                }}
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 12, repeat: Infinity }}
              />
              
              {/* Main Team Image */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 lg:w-72 lg:h-48 rounded-2xl overflow-hidden"
                style={{
                  border: '3px solid rgba(132, 204, 22, 0.7)',
                  boxShadow: '0 0 50px rgba(132, 204, 22, 0.4)'
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&q=90&fit=crop"
                  alt="Team meeting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              </motion.div>
              
              {/* Floating Photos */}
              <motion.div
                className="absolute top-[10%] left-[8%] w-28 h-20 lg:w-40 lg:h-28 rounded-xl overflow-hidden"
                style={{
                  border: '2px solid rgba(139, 92, 246, 0.7)',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
                }}
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&q=90&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                className="absolute top-[8%] right-[10%] w-24 h-18 lg:w-36 lg:h-24 rounded-xl overflow-hidden"
                style={{
                  border: '2px solid rgba(6, 182, 212, 0.7)',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
                }}
                animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=280&q=90&fit=crop"
                  alt="Meeting"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                className="absolute bottom-[15%] left-[12%] w-20 h-20 lg:w-28 lg:h-28 rounded-xl overflow-hidden"
                style={{
                  border: '2px solid rgba(236, 72, 153, 0.7)',
                  boxShadow: '0 0 25px rgba(236, 72, 153, 0.4)'
                }}
                animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&q=90&fit=crop"
                  alt="Team celebration"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Floating Avatars */}
              <motion.div
                className="absolute top-[25%] left-[35%] w-14 h-14 rounded-full overflow-hidden"
                style={{
                  border: '3px solid rgba(132, 204, 22, 0.9)',
                  boxShadow: '0 0 25px rgba(132, 204, 22, 0.6)'
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&q=90&fit=crop"
                  alt="Professional"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                className="absolute top-[60%] right-[8%] w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden"
                style={{
                  border: '3px solid rgba(139, 92, 246, 0.9)',
                  boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)'
                }}
                animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&q=90&fit=crop"
                  alt="Professional"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                className="absolute bottom-[20%] right-[25%] w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden"
                style={{
                  border: '3px solid rgba(6, 182, 212, 0.9)',
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.6)'
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&q=90&fit=crop"
                  alt="Professional"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                className="absolute top-[70%] left-[30%] w-10 h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden"
                style={{
                  border: '3px solid rgba(236, 72, 153, 0.9)',
                  boxShadow: '0 0 25px rgba(236, 72, 153, 0.6)'
                }}
                animate={{ y: [0, 6, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&q=90&fit=crop"
                  alt="Professional"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Holographic Shine */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'
                }}
                animate={{ x: ['-150%', '150%'] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>

            {/* Floating Badges */}
            <motion.div
              className="absolute -top-4 right-8 lg:-top-6 lg:right-16 w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(132, 204, 22, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(132, 204, 22, 0.5)',
                boxShadow: '0 0 40px rgba(132, 204, 22, 0.4)'
              }}
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-center">
                <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-lime-400 mx-auto mb-1" />
                <span className="text-lime-400 text-xs font-bold">LIVE</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 left-8 lg:-bottom-6 lg:left-16 w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(139, 92, 246, 0.5)',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)'
              }}
              animate={{ y: [0, 8, 0], x: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-violet-400">+34%</p>
                <p className="text-violet-300 text-xs">Efficiency</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Bubbles */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 mt-16">
            {teamFeatures.map((feature, i) => {
              const colors = {
                lime: { bg: 'rgba(132,204,22,0.1)', border: 'rgba(132,204,22,0.4)', glow: 'rgba(132,204,22,0.4)', text: 'text-lime-400' },
                cyan: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.4)', glow: 'rgba(6,182,212,0.4)', text: 'text-cyan-400' },
                violet: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.4)', glow: 'rgba(139,92,246,0.4)', text: 'text-violet-400' },
                pink: { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.4)', glow: 'rgba(236,72,153,0.4)', text: 'text-pink-400' }
              }[feature.color];

              return (
                <motion.div
                  key={feature.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <motion.div
                    className="w-44 h-44 flex flex-col items-center justify-center text-center cursor-pointer"
                    style={{
                      borderRadius: '50% 50% 45% 55% / 55% 45% 50% 50%',
                      background: colors.bg,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${colors.border}`,
                      boxShadow: `0 0 30px ${colors.glow}`
                    }}
                    whileHover={{ 
                      scale: 1.15,
                      boxShadow: `0 0 50px ${colors.glow}`
                    }}
                    animate={{
                      y: [0, -8, 0],
                      borderRadius: [
                        '50% 50% 45% 55% / 55% 45% 50% 50%',
                        '45% 55% 50% 50% / 50% 50% 55% 45%',
                        '50% 50% 45% 55% / 55% 45% 50% 50%'
                      ]
                    }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${colors.bg}, ${colors.glow})`,
                        boxShadow: `0 0 20px ${colors.glow}`
                      }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className={`w-6 h-6 ${colors.text}`} />
                    </motion.div>
                    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-slate-500 text-xs">{feature.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}