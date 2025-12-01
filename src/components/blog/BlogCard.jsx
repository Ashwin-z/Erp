import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const categoryColors = {
  'finance-tips': 'bg-blue-100 text-blue-700',
  'product-updates': 'bg-lime-100 text-lime-700',
  'case-studies': 'bg-purple-100 text-purple-700',
  'industry-news': 'bg-orange-100 text-orange-700',
  'tutorials': 'bg-emerald-100 text-emerald-700',
  'compliance': 'bg-red-100 text-red-700'
};

export default function BlogCard({ post, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.cover_image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className={categoryColors[post.category] || 'bg-slate-100 text-slate-700'}>
            {post.category?.replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-lime-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.publish_date ? format(new Date(post.publish_date), 'MMM d, yyyy') : 'Draft'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.read_time || 5} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views || 0}</span>
          </div>
        </div>

        {/* Author & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <img 
              src={post.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop'}
              alt={post.author_name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-slate-700">{post.author_name || 'ARKFinex Team'}</span>
          </div>
          <Link 
            to={createPageUrl(`BlogPost?id=${post.id}`)}
            className="flex items-center gap-1 text-lime-600 font-medium text-sm hover:text-lime-700"
          >
            Read More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}