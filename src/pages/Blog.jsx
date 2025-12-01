import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Filter, BookOpen, TrendingUp, 
  FileText, Loader2
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BlogCard from '@/components/blog/BlogCard';
import BlogEditor from '@/components/blog/BlogEditor';

const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'finance-tips', label: 'Finance Tips' },
  { value: 'product-updates', label: 'Product Updates' },
  { value: 'case-studies', label: 'Case Studies' },
  { value: 'industry-news', label: 'Industry News' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'compliance', label: 'Compliance' }
];

export default function Blog() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogPosts']);
      setShowEditor(false);
      setEditingPost(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BlogPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogPosts']);
      setShowEditor(false);
      setEditingPost(null);
    }
  });

  const handleSave = async (data) => {
    if (editingPost) {
      await updateMutation.mutateAsync({ id: editingPost.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const publishedPosts = filteredPosts.filter(p => p.status === 'published');
  const draftPosts = filteredPosts.filter(p => p.status === 'draft');

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Blog & Resources</h1>
                <p className="text-slate-500">Create, edit, and manage blog content with AI assistance</p>
              </div>
              <Button onClick={() => { setEditingPost(null); setShowEditor(true); }} className="bg-lime-500 hover:bg-lime-600">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Posts', value: posts.length, icon: FileText, color: 'bg-blue-500' },
                { label: 'Published', value: posts.filter(p => p.status === 'published').length, icon: BookOpen, color: 'bg-green-500' },
                { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length, icon: FileText, color: 'bg-yellow-500' },
                { label: 'Total Views', value: posts.reduce((sum, p) => sum + (p.views || 0), 0), icon: TrendingUp, color: 'bg-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-10"
                />
              </div>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="flex-wrap">
                  {categories.map(cat => (
                    <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No posts found</h3>
                <p className="text-slate-500 mb-4">Get started by creating your first blog post</p>
                <Button onClick={() => setShowEditor(true)} className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            ) : (
              <>
                {draftPosts.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Badge variant="secondary">Drafts</Badge>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {draftPosts.map((post, i) => (
                        <div key={post.id} onClick={() => { setEditingPost(post); setShowEditor(true); }} className="cursor-pointer">
                          <BlogCard post={post} index={i} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedPosts.map((post, i) => (
                    <div key={post.id} onClick={() => { setEditingPost(post); setShowEditor(true); }} className="cursor-pointer">
                      <BlogCard post={post} index={i} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>

      {showEditor && (
        <BlogEditor 
          post={editingPost}
          onSave={handleSave}
          onClose={() => { setShowEditor(false); setEditingPost(null); }}
        />
      )}
    </div>
  );
}