'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060A0F]">
      {/* Hero Section with Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/homepage.png)',
            filter: 'blur(12px)',
          }}
        />

        {/* Dark Overlay with Radial Spotlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060A0F]/50 via-[#060A0F]/70 to-[#060A0F]/90" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 800px 400px at center 30%, rgba(45,212,191,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Bottom Fade Out */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#060A0F]/60 to-[#060A0F] z-20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-6 md:px-12 md:py-8 border-b border-white/5 backdrop-blur-sm">
            <div className="text-xl md:text-2xl font-light tracking-widest text-white">
              Life<span className="font-semibold">Spec</span>
            </div>
            <button
              onClick={() => router.push('/signin')}
              className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300"
            >
              Sign In
            </button>
          </header>

          {/* Centered Hero Content */}
          <div className="flex-1 flex items-center justify-center px-8 md:px-12">
            <div className="w-full max-w-3xl text-center">
              {/* Headline */}
              <h1
                className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Ready to spec your dream life?
              </h1>

              {/* Subheadline */}
              <p
                className={`text-lg md:text-xl text-slate-300 mb-12 transition-all duration-1000 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                Build your lifestyle in minutes and see the real monthly + yearly cost.
              </p>

              {/* LifeSpec Meter */}
              <div
                className={`mb-12 transition-all duration-1000 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="group bg-gradient-to-br from-white/12 to-white/6 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
                  {/* Meter Values */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-2">Monthly</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#2DD4BF]">$18,750</p>
                      <p className="text-xs text-slate-500">/mo</p>
                    </div>
                    <div className="text-center border-l border-r border-white/10">
                      <p className="text-slate-400 text-sm mb-2">Yearly</p>
                      <p className="text-2xl md:text-3xl font-bold text-[#F6C66A]">$225,000</p>
                      <p className="text-xs text-slate-500">/yr</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-2">Required Income</p>
                      <p className="text-2xl md:text-3xl font-bold text-white">$350,000</p>
                      <p className="text-xs text-slate-500">/yr</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-white/0 via-white/15 to-white/0 mb-6" />

                  {/* Affordability Index */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Affordability Index</span>
                      <span className="text-sm font-bold text-[#2DD4BF]">64%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] rounded-full transition-all duration-1000"
                        style={{ width: isLoaded ? '64%' : '0%' }}
                      />
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-slate-500 text-center">Estimates for inspiration only.</p>
                </div>
              </div>

              {/* CTA Area */}
              <div
                className={`transition-all duration-1000 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                {/* Primary Button */}
                <button
                  onClick={() => router.push('/loading-screen')}
                  className="px-8 py-4 bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] text-white font-semibold rounded-xl hover:from-[#0D5F5B] hover:to-[#1BA39F] transition-all duration-300 shadow-lg shadow-[rgba(45,212,191,0.25)] hover:shadow-xl hover:shadow-[rgba(45,212,191,0.35)] transform hover:scale-105 mb-4"
                >
                  Start Building
                </button>

                {/* Secondary Link */}
                <button
                  onClick={scrollToHowItWorks}
                  className="block mx-auto text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium mb-8"
                >
                  See how it works ↓
                </button>

                {/* Feature Chips */}
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#2DD4BF]/30 rounded-full text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6C66A]" />
                    No sign-up required
                  </div>
                  <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#2DD4BF]/30 rounded-full text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6C66A]" />
                    Takes under 3 minutes
                  </div>
                  <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-[#2DD4BF]/30 rounded-full text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6C66A]" />
                    Realistic cost estimates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Timeline Style */}
      <section id="how-it-works" className="relative z-10 py-24 md:py-32 px-8 md:px-12 bg-[#060A0F]">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-300">Three simple steps to build and share your LifeSpec.</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#2DD4BF]/50 via-[#2DD4BF]/30 to-transparent" />

            {/* Timeline Items */}
            <div className="space-y-12 md:space-y-16">
              {/* Step 1 */}
              <div
                className={`md:ml-24 transition-all duration-700 ease-out ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
              >
                <div className="hidden md:block absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-[#F6C66A] to-[#E8B856] rounded-full flex items-center justify-center text-sm font-bold text-[#060A0F] -translate-x-8">
                  1
                </div>
                <div className="group bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm border border-white/15 rounded-2xl p-8 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-[#0F766E]/30 to-[#2DD4BF]/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                      <span className="text-slate-400 text-sm font-medium">Image</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">Choose your life.</h3>
                      <p className="text-slate-300">Home, cars, travel, style — pick what your life looks like.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`md:ml-24 transition-all duration-700 ease-out ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                <div className="hidden md:block absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-[#F6C66A] to-[#E8B856] rounded-full flex items-center justify-center text-sm font-bold text-[#060A0F] -translate-x-8">
                  2
                </div>
                <div className="group bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm border border-white/15 rounded-2xl p-8 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-[#0F766E]/30 to-[#2DD4BF]/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                      <span className="text-slate-400 text-sm font-medium">Image</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">See the number.</h3>
                      <p className="text-slate-300">Instant monthly + yearly totals with required income estimates.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`md:ml-24 transition-all duration-700 ease-out ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="hidden md:block absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-[#F6C66A] to-[#E8B856] rounded-full flex items-center justify-center text-sm font-bold text-[#060A0F] -translate-x-8">
                  3
                </div>
                <div className="group bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-sm border border-white/15 rounded-2xl p-8 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-[#0F766E]/30 to-[#2DD4BF]/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                      <span className="text-slate-400 text-sm font-medium">Image</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">Lock it in.</h3>
                      <p className="text-slate-300">Finish with a clean summary you can screenshot and share.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-16">
            <button
              onClick={() => router.push('/loading-screen')}
              className={`px-8 py-4 bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] text-white font-semibold rounded-xl hover:from-[#0D5F5B] hover:to-[#1BA39F] transition-all duration-300 shadow-lg shadow-[rgba(45,212,191,0.25)] hover:shadow-xl hover:shadow-[rgba(45,212,191,0.35)] transform hover:scale-105 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              Start Building
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
