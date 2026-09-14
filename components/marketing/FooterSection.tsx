import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';

interface FooterSectionProps {
  onStartFree: () => void;
  onGoToDashboard: () => void;
}

export function FooterSection({ onStartFree, onGoToDashboard }: FooterSectionProps) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Call to action footer banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 border border-indigo-800/60 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Start Speaking with Confidence?
            </h3>
            <p className="text-sm text-indigo-200 max-w-xl mx-auto">
              Join thousands of polyglots accelerating their fluency with personalized AI coaching today.
            </p>
          </div>
          <button
            onClick={onStartFree}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02]"
          >
            Start Your Free Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Links and Branding */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-6">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white font-black text-lg">F</div>
              <span className="text-lg font-bold text-white tracking-tight">Fluento</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Fluento is an adaptive AI Language Coach empowering learners around the world through native-language explanations, longitudinal memory, and personalized study plans.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Available in 11+ languages</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onGoToDashboard} className="hover:text-white transition">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={onStartFree} className="hover:text-white transition">
                  AI Onboarding
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Languages</h4>
            <ul className="space-y-2 text-slate-400">
              <li>English Coaching</li>
              <li>Spanish Coaching</li>
              <li>German Coaching</li>
              <li>French Coaching</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Security</li>
              <li>Contact Support</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fluento Inc. All rights reserved.</p>
          <p className="text-[11px]">Empowered by Antigravity & Gemini AI</p>
        </div>
      </div>
    </footer>
  );
}
