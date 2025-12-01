import React from 'react';
import { motion } from 'framer-motion';
import { 
  Linkedin, Twitter, Mail, MapPin, Phone,
  Shield, Lock, Award
} from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'API Docs', 'Changelog'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Contact'],
  Resources: ['Documentation', 'Help Center', 'Community', 'Partners', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'GDPR', 'PDPA Compliance', 'Security']
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">A</span>
              </div>
              <span className="text-white font-bold text-xl">ARKFinex</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              Enterprise-grade finance automation built for Singapore and Asia. 
              Define. Decide. Deliver — with AI Power.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">One Raffles Place, Singapore 048616</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@arkfinex.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+65 6123 4567</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[Linkedin, Twitter, Mail].map((Icon, i) => (
                <a 
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap justify-center gap-8 py-8 border-t border-b border-slate-800 mb-8">
          {[
            { icon: Shield, label: 'PDPA Compliant' },
            { icon: Lock, label: 'SOC 2 Type II' },
            { icon: Award, label: 'ISO 27001' }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-500">
              <badge.icon className="w-5 h-5" />
              <span className="text-sm">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 ARKFinex. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Made with ❤️ in Singapore
          </p>
        </div>
      </div>
    </footer>
  );
}