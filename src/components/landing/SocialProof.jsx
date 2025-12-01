import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "ARKFinex reduced our month-end close from 5 days to just 1. The AI reconciliation is a game-changer for our agency.",
    author: "Sarah Chen",
    role: "Managing Partner",
    company: "Nexus Accounting Group",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    quote: "The cashflow forecasting helped us avoid a critical cash crunch. We now have 90-day visibility that's incredibly accurate.",
    author: "Michael Tan",
    role: "CFO",
    company: "TechVentures Asia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    quote: "Managing 50+ clients used to be chaotic. With ARKFinex's agency panel, we've streamlined everything into one dashboard.",
    author: "Priya Sharma",
    role: "Director",
    company: "PrimeBooks Advisory",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];

const logos = [
  { name: "DBS", color: "text-red-600" },
  { name: "OCBC", color: "text-red-700" },
  { name: "UOB", color: "text-blue-700" },
  { name: "Grab", color: "text-emerald-600" },
  { name: "Shopee", color: "text-orange-500" },
  { name: "Razer", color: "text-lime-500" }
];

export default function SocialProof() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logos */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 text-sm font-medium mb-8 uppercase tracking-wider">
            Trusted by Modern Accounting Teams Across Singapore
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-14">
            {logos.map((logo, i) => (
              <div key={i} className={`${logo.color} font-bold text-2xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}>
                {logo.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-lime-600 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Loved by Finance Teams
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-lime-600" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col items-center bg-gradient-to-r from-lime-50 to-emerald-50 rounded-3xl px-12 py-10 border border-lime-200">
            <div className="flex -space-x-3 mb-4">
              {testimonials.map((t, i) => (
                <img 
                  key={i}
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-lime-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                +497
              </div>
            </div>
            <p className="text-slate-700 font-medium mb-1">
              Join 500+ companies already using ARKFinex
            </p>
            <p className="text-slate-500 text-sm">
              Start your 14-day free trial today
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}