import React from 'react';
import { ArrowRight, Download, Sparkles, Star, Users, Smartphone, ShieldCheck } from 'lucide-react';
import { LANDING_HERO_CONTENT } from '@/lib/marketing/landing-data';

interface HeroSectionProps {
  onStartFree: () => void;
  onDownloadApp?: () => void;
}

export function HeroSection({ onStartFree, onDownloadApp }: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-slate-950 text-white border-b border-slate-800/60">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[300px] h-[200px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{LANDING_HERO_CONTENT.badge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] max-w-5xl mx-auto">
          {LANDING_HERO_CONTENT.titlePrefix}{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
            {LANDING_HERO_CONTENT.titleHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          {LANDING_HERO_CONTENT.description}
        </p>

        {/* Action Buttons: Start Free & Download App */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartFree}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{LANDING_HERO_CONTENT.primaryCta}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onDownloadApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-100 border border-slate-700/80 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <span>{LANDING_HERO_CONTENT.secondaryCta}</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-400 text-xs sm:text-sm">
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User"
            />
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="User"
            />
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 object-cover"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
              alt="User"
            />
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 object-cover"
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80"
              alt="User"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="font-semibold text-slate-200">4.9/5 rating</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              {LANDING_HERO_CONTENT.socialProofText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

