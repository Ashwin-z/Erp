import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, Save, Eye, Send, Loader2, Search, 
  TrendingUp, AlertCircle, CheckCircle2, X, Plus
} from 'lucide-react';
import ReactQuill from 'react-quill';
import { base44 } from '@/api/base44Client';

const categories = [
  { value: 'finance-tips', label: 'Finance Tips' },
  { value: 'product-updates', label: 'Product Updates' },
  { value: 'case-studies', label: 'Case Studies' },
  { value: 'industry-news', label: 'Industry News' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'compliance', label: 'Compliance' }
];

export default function BlogEditor({ post, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    category: post?.category || 'finance-tips',
    tags: post?.tags || [],
    cover_image: post?.cover_image || '',
    status: post?.status || 'draft',
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    seo_keywords: post?.seo_keywords || []
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [seoScore, setSeoScore] = useState(post?.seo_score || null);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const generateWithAI = async (type) => {
    setAiLoading(true);
    try {
      let prompt = '';
      if (type === 'draft') {
        prompt = `Write a professional blog post about "${formData.title || 'finance automation'}". 
        Category: ${formData.category}. 
        Make it informative, engaging, and around 800 words. 
        Focus on Singapore and Asia market context. Include practical tips.`;
      } else if (type === 'seo') {
        prompt = `Analyze this blog post for SEO and provide optimization suggestions:
        Title: ${formData.title}
        Content: ${formData.content.substring(0, 1000)}
        Provide: 1) SEO score (0-100), 2) optimized title, 3) meta description, 4) suggested keywords`;
      } else if (type === 'topics') {
        prompt = `Suggest 5 blog post topics for a finance automation platform targeting Singapore accounting agencies. 
        Return as JSON: {"topics": [{"title": "", "description": "", "category": ""}]}`;
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: type === 'topics' ? {
          type: "object",
          properties: {
            topics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" }
                }
              }
            }
          }
        } : type === 'seo' ? {
          type: "object",
          properties: {
            score: { type: "number" },
            optimized_title: { type: "string" },
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            suggestions: { type: "array", items: { type: "string" } }
          }
        } : undefined
      });

      if (type === 'draft') {
        handleChange('content', response);
      } else if (type === 'seo') {
        setSeoScore(response.score);
        setFormData(prev => ({
          ...prev,
          seo_title: response.optimized_title || prev.seo_title,
          seo_description: response.meta_description || prev.seo_description,
          seo_keywords: response.keywords || prev.seo_keywords
        }));
        setAiSuggestions(response.suggestions || []);
      } else if (type === 'topics') {
        setAiSuggestions(response.topics || []);
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      const readTime = Math.ceil(formData.content.split(' ').length / 200);
      const saveData = {
        ...formData,
        read_time: readTime,
        seo_score: seoScore,
        status: publish ? 'published' : formData.status,
        publish_date: publish ? new Date().toISOString() : post?.publish_date
      };
      await onSave(saveData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-slate-900">
              {post ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Draft
              </Button>
              <Button onClick={() => handleSave(true)} disabled={saving} className="bg-lime-500 hover:bg-lime-600">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Publish
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 p-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Label>Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter post title..."
                  className="text-lg font-medium"
                />
              </div>

              <div>
                <Label>Excerpt</Label>
                <Textarea 
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="Brief summary of the post..."
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Content</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => generateWithAI('draft')}
                    disabled={aiLoading}
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    AI Generate Draft
                  </Button>
                </div>
                <ReactQuill 
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  className="h-96 mb-12"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Tabs defaultValue="settings">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="ai">AI Tools</TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cover Image URL</Label>
                    <Input 
                      value={formData.cover_image}
                      onChange={(e) => handleChange('cover_image', e.target.value)}
                      placeholder="https://..."
                    />
                    {formData.cover_image && (
                      <img src={formData.cover_image} alt="Cover" className="mt-2 rounded-lg h-32 w-full object-cover" />
                    )}
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag..."
                      />
                      <Button variant="outline" size="icon" onClick={addTag}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label>SEO Analysis</Label>
                    <Button variant="outline" size="sm" onClick={() => generateWithAI('seo')} disabled={aiLoading}>
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>

                  {seoScore !== null && (
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <div className={`text-3xl font-bold ${seoScore >= 70 ? 'text-green-600' : seoScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {seoScore}
                          </div>
                          <div>
                            <p className="font-medium">SEO Score</p>
                            <p className="text-xs text-slate-500">
                              {seoScore >= 70 ? 'Good' : seoScore >= 40 ? 'Needs Improvement' : 'Poor'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <Label>SEO Title</Label>
                    <Input 
                      value={formData.seo_title}
                      onChange={(e) => handleChange('seo_title', e.target.value)}
                      placeholder="Optimized title for search..."
                    />
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <Textarea 
                      value={formData.seo_description}
                      onChange={(e) => handleChange('seo_description', e.target.value)}
                      placeholder="Description for search results..."
                      rows={3}
                    />
                  </div>

                  {aiSuggestions.length > 0 && (
                    <div>
                      <Label>AI Suggestions</Label>
                      <ul className="text-sm space-y-2 mt-2">
                        {aiSuggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-600">
                            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ai" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-lime-500" />
                        AI Topic Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mb-3"
                        onClick={() => generateWithAI('topics')}
                        disabled={aiLoading}
                      >
                        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                        Get Topic Ideas
                      </Button>
                      {aiSuggestions.length > 0 && aiSuggestions[0]?.title && (
                        <div className="space-y-2">
                          {aiSuggestions.map((topic, i) => (
                            <div 
                              key={i}
                              onClick={() => {
                                handleChange('title', topic.title);
                                handleChange('category', topic.category || 'finance-tips');
                              }}
                              className="p-2 rounded-lg border border-slate-200 hover:border-lime-300 hover:bg-lime-50 cursor-pointer transition-colors"
                            >
                              <p className="font-medium text-sm">{topic.title}</p>
                              <p className="text-xs text-slate-500">{topic.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}