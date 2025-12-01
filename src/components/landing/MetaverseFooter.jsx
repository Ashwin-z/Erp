import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';
import BookDemoModal from './BookDemoModal';

const footerLinks = {
  Product: [
    { name: 'Features', href: 'Features' },
    { name: 'Pricing', href: 'Landing' },
    { name: 'Integrations', href: 'Landing' },
    { name: 'Changelog', href: 'Blog' }
  ],
  Company: [
    { name: 'About Us', href: 'Landing' },
    { name: 'Blog', href: 'Blog' },
    { name: 'Careers', href: 'Landing' },
    { name: 'Contact', href: 'Landing' }
  ],
  Resources: [
    { name: 'Documentation', href: 'Resources' },
    { name: 'API Reference', href: 'Resources' },
    { name: 'Case Studies', href: 'Blog' },
    { name: 'Help Center', href: 'Resources' }
  ],
  Legal: [
    { name: 'Privacy Policy', href: 'Landing' },
    { name: 'Terms of Service', href: 'Landing' },
    { name: 'PDPA Compliance', href: 'PDPACompliance' },
    { name: 'Security', href: 'Cybersecurity' }
  ]
};

const socialLinks = [
  { icon: Linkedin, href: '#', color: '#0A66C2' },
  { icon: Twitter, href: '#', color: '#1DA1F2' },
  { icon: Facebook, href: '#', color: '#1877F2' },
  { icon: Youtube, href: '#', color: '#FF0000' }
];

export default function MetaverseFooter() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <footer className="relative bg-slate-950 overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(132, 204, 22, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(132, 204, 22, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* CTA Section */}
      <div className="relative z-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            className="rounded-3xl p-10 lg:p-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(139,92,246,0.1) 100%)',
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
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-violet-400">
                    Finance Operations?
                  </span>
                </h2>
                <p className="text-lg text-slate-400">
                  Join 500+ companies already using ARKFinex to automate their finance workflows.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="px-8 py-6 text-base font-semibold rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                      boxShadow: '0 0 30px rgba(132, 204, 22, 0.4)'
                    }}
                    onClick={() => setDemoOpen(true)}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-slate-900">Book a Demo</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-base font-semibold rounded-xl border-violet-500/50 hover:bg-violet-500/20 bg-slate-800/80"
                    onClick={() => setDemoOpen(true)}
                  >
                    <MessageSquare className="w-5 h-5 mr-2 text-violet-400" />
                    <span className="text-white">Talk to Sales</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                  boxShadow: '0 0 30px rgba(132, 204, 22, 0.4)'
                }}
              >
                <span className="text-slate-900 font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-white">ARKFinex</span>
            </motion.div>

            <p className="text-slate-400 mb-6 leading-relaxed">
              Singapore's leading AI-powered finance automation platform. Transforming how businesses manage money.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-lime-400" />
                <span>hello@arkfinex.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-lime-400" />
                <span>+65 6123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-lime-400" />
                <span>Singapore</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(100, 116, 139, 0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    borderColor: social.color,
                    boxShadow: `0 0 20px ${social.color}40`
                  }}
                >
                  <social.icon className="w-5 h-5 text-slate-400" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={createPageUrl(link.href)}
                      className="text-slate-400 hover:text-lime-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 ARKFinex. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </footer>
  );
}