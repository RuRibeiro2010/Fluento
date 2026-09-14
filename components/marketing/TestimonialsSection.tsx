import React from 'react';
import { TESTIMONIALS } from '@/lib/marketing/landing-data';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Loved by Polyglots</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Real Results from Real Learners</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Discover how students, creators, and professionals reached conversational fluency using Fluento AI Coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">{testimonial.name}</h4>
                    <p className="text-[11px] text-slate-400">{testimonial.role}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center gap-1">
                  <span>{testimonial.flag}</span>
                  <span className="hidden sm:inline">{testimonial.language.split(' ')[0]}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
