import React, { useState } from 'react';
import {
  HeroSection,
  AppPreviewSection,
  HowItWorksSection,
  FeaturesSection,
  RealWorldMissionsSection,
  ComparisonSection,
  TestimonialsSection,
  PricingSection,
  FaqSection,
  FooterSection,
  ScientificBaseSection,
  DemoExperienceSection,
} from '@/components/marketing';
import { X, Smartphone, Apple, Play, Download, Sparkles, QrCode } from 'lucide-react';

interface MarketingPageProps {
  onStartOnboarding?: () => void;
  onGoToDashboard?: () => void;
}

export default function MarketingPage({
  onStartOnboarding = () => {},
  onGoToDashboard = () => {},
}: MarketingPageProps) {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGoToDashboard}>
            <div className="p-2 rounded-xl bg-indigo-600 text-white font-black text-lg">F</div>
            <span className="text-xl font-bold tracking-tight text-white">Fluento</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#why-fluento" className="hover:text-white transition">
              Why Fluento
            </a>
            <a href="#mockups" className="hover:text-white transition">
              App Preview
            </a>
            <a href="#reviews" className="hover:text-white transition">
              Reviews
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="min-h-[44px] text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
              aria-label="Ir para o Dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={onStartOnboarding}
              className="min-h-[44px] text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Começar teste gratuito"
            >
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Main Marketing Sections */}
      <main>
        <HeroSection
          onStartFree={onStartOnboarding}
          onDownloadApp={() => setShowDownloadModal(true)}
        />

        <div id="demo">
          <DemoExperienceSection onStartFree={onStartOnboarding} />
        </div>

        <div id="mockups">
          <AppPreviewSection />
        </div>

        <div id="science">
          <ScientificBaseSection />
        </div>

        <div id="how-it-works">
          <HowItWorksSection />
        </div>

        <div id="why-fluento">
          <ComparisonSection />
          <FeaturesSection />
          <RealWorldMissionsSection />
        </div>

        <div id="reviews">
          <TestimonialsSection />
        </div>

        <div id="pricing">
          <PricingSection onStartFree={onStartOnboarding} />
        </div>

        <div id="faq">
          <FaqSection />
        </div>
      </main>

      {/* Footer Section */}
      <FooterSection
        onStartFree={onStartOnboarding}
        onGoToDashboard={onGoToDashboard}
      />

      {/* Download App Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-base text-white">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <span>Download Fluento Mobile & Desktop</span>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Practice speaking on the go with real-time audio voice mode and offline longitudinal memory synchronization.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition flex items-center gap-3 text-left">
                <Apple className="w-6 h-6 text-white shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Download on the</div>
                  <div className="text-xs font-bold text-white">Apple App Store</div>
                </div>
              </button>

              <button className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition flex items-center gap-3 text-left">
                <Play className="w-6 h-6 text-emerald-400 fill-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">GET IT ON</div>
                  <div className="text-xs font-bold text-white">Google Play</div>
                </div>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900/40 flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shrink-0">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant QR Scan
                </span>
                <p className="text-slate-400 text-[11px]">
                  Scan with your smartphone camera to immediately install the mobile web app with native audio support.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  onStartOnboarding();
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
              >
                Or Continue in Browser (Start Free)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
