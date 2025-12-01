import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, FileText, BarChart3, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const blogPosts = [
  {
    title: 'The Future of Finance Automation',
    category: 'Industry News',
    icon: Lightbulb,
    color: 'lime',
    excerpt: 'How AI is revolutionizing the way businesses manage their finances...',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
  },
  {
    title: 'Case Study: 80% Time Savings',
    category: 'Case Studies',
    icon: BarChart3,
    color: 'violet',
    excerpt: 'See how a leading accounting firm transformed their operations...',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'
  },
  {
    title: 'GST Compliance Made Easy',
    category: 'Tutorials',
    icon: FileText,
    color: 'cyan',
    excerpt: 'A step-by-step guide to automated GST reporting in Singapore...',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80'
  }
];

const caseStudyComparison = {
  before: { cost: '$45,000/yr', time: '120 hrs/mo', staff: '5 FTEs', errors: '12%' },
  after: { cost: '$12,000/yr', time: '24 hrs/mo', staff: '2 FTEs', errors: '<1%' }
};

const colorClasses = {
  lime: { bg: 'rgba(132, 204, 22, 0.2)', border: 'rgba(132, 204, 22, 0.4)', text: 'text-lime-400', glow: 'rgba(132, 204, 22, 0.5)' },
  violet: { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.4)', text: 'text-violet-400', glow: 'rgba(139, 92, 246, 0.5)' },
  cyan: { bg: 'rgba(6, 182, 212, 0.2)', border: 'rgba(6, 182, 212, 0.4)', text: 'text-cyan-400', glow: 'rgba(6, 182, 212, 0.5)' }
};

export default function MetaverseBlog() {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-950">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(132, 204, 22, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
        }}
      />

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
              background: 'linear-gradient(135deg, rgba(132,204,22,0.2) 0%, rgba(6,182,212,0.2) 100%)',
              border: '1px solid rgba(132, 204, 22, 0.3)'
            }}
          >
            <BookOpen className="w-4 h-4 text-lime-400" />
            <span className="text-sm font-medium text-lime-400">Resources & Insights</span>
          </motion.span>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Learn from the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-cyan-400 to-violet-400">
              Best
            </span>
          </h2>
        </motion.div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post, index) => {
            const colors = colorClasses[post.color];
            return (
              <motion.div
                key={post.title}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(15,23,42,0.9) 100%)`,
                    border: `1px solid ${colors.border}`
                  }}
                  whileHover={{
                    boxShadow: `0 0 40px ${colors.glow}`
                  }}
                />

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  
                  {/* Category Badge */}
                  <motion.div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${colors.text}`}
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {post.category}
                  </motion.div>

                  {/* Particle explosion on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                          background: colors.glow
                        }}
                        animate={{
                          x: [0, (Math.random() - 0.5) * 100],
                          y: [0, (Math.random() - 0.5) * 100],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.05
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">{post.excerpt}</p>
                  <div className={`flex items-center gap-2 ${colors.text} text-sm font-medium`}>
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Case Study Comparison Table */}
        <motion.div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
            border: '1px solid rgba(132, 204, 22, 0.3)'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)'
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Real Results: Before vs After{' '}
            <span className="text-lime-400">ARKFinex</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="rounded-xl p-6" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h4 className="text-lg font-semibold text-red-400 mb-4">Before ARKFinex</h4>
              <div className="space-y-3">
                {Object.entries(caseStudyComparison.before).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-red-500/20">
                    <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-red-400 font-mono font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="rounded-xl p-6" style={{ background: 'rgba(132, 204, 22, 0.1)', border: '1px solid rgba(132, 204, 22, 0.3)' }}>
              <h4 className="text-lg font-semibold text-lime-400 mb-4">After ARKFinex</h4>
              <div className="space-y-3">
                {Object.entries(caseStudyComparison.after).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-lime-500/20">
                    <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-lime-400 font-mono font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROI Badge */}
          <motion.div
            className="mt-8 text-center"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span 
              className="inline-block px-6 py-3 rounded-full text-lg font-bold text-slate-900"
              style={{
                background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                boxShadow: '0 0 40px rgba(132, 204, 22, 0.5)'
              }}
            >
              275% ROI in Year 1
            </span>
          </motion.div>
        </motion.div>

        {/* View All Link */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to={createPageUrl('Blog')}>
            <motion.button
              className="inline-flex items-center gap-2 text-lime-400 font-medium hover:text-lime-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              View All Resources
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}