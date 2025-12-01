import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { 
  BookOpen, FileText, Video, Headphones, ArrowRight, 
  Download, ExternalLink, Search, Clock, User,
  HelpCircle, MessageSquare, Mail, Sparkles
} from 'lucide-react';

const categories = [
  { icon: BookOpen, label: "Documentation", count: 45 },
  { icon: Video, label: "Video Tutorials", count: 23 },
  { icon: FileText, label: "Guides & Ebooks", count: 12 },
  { icon: Headphones, label: "Webinars", count: 8 }
];

const featuredResources = [
  {
    type: "Guide",
    title: "Getting Started with ARKFinex",
    description: "A comprehensive guide to setting up your account, importing data, and processing your first transactions.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    readTime: "15 min read",
    icon: BookOpen
  },
  {
    type: "Video",
    title: "AI Reconciliation Masterclass",
    description: "Learn how to leverage AI-powered reconciliation to reduce manual work by 90%.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    readTime: "25 min watch",
    icon: Video
  },
  {
    type: "Ebook",
    title: "Cashflow Forecasting Best Practices",
    description: "Expert strategies for accurate cashflow prediction and proactive financial management.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    readTime: "Download PDF",
    icon: Download
  }
];

const articles = [
  { title: "How to Set Up Bank Feeds", category: "Setup", time: "5 min" },
  { title: "Understanding GST Reports", category: "Compliance", time: "8 min" },
  { title: "Multi-Currency Accounting Guide", category: "Finance", time: "12 min" },
  { title: "OCR Document Processing Tips", category: "AI", time: "6 min" },
  { title: "Agency Client Onboarding", category: "Agencies", time: "10 min" },
  { title: "Security Best Practices", category: "Security", time: "7 min" }
];

const supportOptions = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    action: "Start Chat",
    available: true
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get a response within 24 hours",
    action: "Send Email",
    available: true
  },
  {
    icon: Headphones,
    title: "Phone Support",
    description: "Available for Enterprise customers",
    action: "Schedule Call",
    available: false
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 mb-6">
              <BookOpen className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-medium text-lime-400">Resources & Support</span>
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Learn, Grow & <br />
              <span className="text-lime-400">Get Support</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Everything you need to master ARKFinex — documentation, tutorials, 
              guides, and 24/7 support.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search documentation, tutorials, guides..."
                className="pl-12 pr-4 py-6 text-lg bg-white/10 border-slate-700 text-white placeholder:text-slate-400 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-lime-500/20 rounded-xl flex items-center justify-center group-hover:bg-lime-500/30 transition-colors">
                    <cat.icon className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{cat.label}</p>
                    <p className="text-slate-400 text-sm">{cat.count} resources</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Featured Resources
            </h2>
            <p className="text-lg text-slate-400">
              Start here to get the most out of ARKFinex
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.map((resource, idx) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-lime-500/50 transition-all group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-lime-400 border border-lime-500/20">
                      {resource.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {resource.readTime}
                    </span>
                    <ArrowRight className="w-5 h-5 text-lime-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Articles */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Popular Articles
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {articles.map((article, idx) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-800/50 rounded-xl p-5 hover:bg-slate-800 transition-colors cursor-pointer group border border-slate-700/50 hover:border-lime-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-lime-400 bg-lime-500/10 px-2 py-1 rounded border border-lime-500/20">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-500">{article.time}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-lime-400 transition-colors">
                  {article.title}
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Need Help?
            </h2>
            <p className="text-lg text-slate-400">
              Our support team is here for you 24/7
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {supportOptions.map((option, idx) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center hover:border-lime-500/50 transition-all"
              >
                <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <option.icon className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                <p className="text-slate-400 mb-6">{option.description}</p>
                <Button 
                  className={option.available ? "bg-white text-slate-900 hover:bg-lime-400" : "bg-slate-800 text-slate-500 cursor-not-allowed"}
                  disabled={!option.available}
                >
                  {option.action}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Our team is always happy to help with any questions.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-8">
              Contact Support
            </Button>
            <Link to={createPageUrl('Landing')}>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}