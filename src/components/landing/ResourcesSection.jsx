import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, FileText, Video, Users, 
  ArrowRight, Download, ExternalLink, Calendar, Clock, Eye
} from 'lucide-react';

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Complete guides and API references for developers",
    cta: "View Docs",
    color: "bg-blue-500"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides to get you started",
    cta: "Watch Now",
    color: "bg-violet-500"
  },
  {
    icon: FileText,
    title: "Case Studies",
    description: "See how Singapore businesses succeed with ARKFinex",
    cta: "Read Stories",
    color: "bg-emerald-500"
  },
  {
    icon: Users,
    title: "Community",
    description: "Join our community of finance professionals",
    cta: "Join Now",
    color: "bg-orange-500"
  }
];

const featuredPosts = [
  {
    title: "5 Ways AI is Transforming Accounting in Singapore",
    excerpt: "Discover how artificial intelligence is revolutionizing the accounting industry...",
    category: "Industry News",
    date: "Dec 15, 2024",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80"
  },
  {
    title: "Complete Guide to GST Filing with Automation",
    excerpt: "Learn how to streamline your IRAS GST compliance with automated tools...",
    category: "Tutorials",
    date: "Dec 10, 2024",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
  },
  {
    title: "How Marina Foods Reduced Month-End Close by 80%",
    excerpt: "A case study on implementing AI-powered reconciliation for F&B businesses...",
    category: "Case Studies",
    date: "Dec 5, 2024",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80"
  }
];

export default function ResourcesSection() {
  return (
    <section className="py-24 bg-slate-50" id="resources">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-lime-600 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Resources
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Learn & Grow With Us
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to master ARKFinex and transform your finance operations
          </p>
        </motion.div>

        {/* Featured Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Latest from the Blog</h3>
            <Link to={createPageUrl('Blog')}>
              <Button variant="outline" className="gap-2">
                View All Posts
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-slate-700">{post.category}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-lime-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-slate-500 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Resource Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-12 h-12 ${resource.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <resource.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                {resource.description}
              </p>
              <div className="flex items-center text-lime-600 font-medium text-sm group-hover:text-lime-700">
                {resource.cta}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Download Section */}
        <motion.div 
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 lg:p-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Free Finance Automation Guide
              </h3>
              <p className="text-slate-400 mb-6">
                Download our comprehensive guide to automating your finance operations 
                with AI. Learn best practices from Singapore's leading companies.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-6 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 rounded-xl">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read Online
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="bg-slate-700/50 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Finance Automation</p>
                    <p className="text-slate-400 text-sm">2024 Edition • 45 pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-lime-400 text-sm">
                  <Download className="w-4 h-4" />
                  <span>2,450+ downloads</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}