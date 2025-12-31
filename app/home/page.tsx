'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Footer } from '@/app/components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlueprintVisible, setIsBlueprintVisible] = useState(false);
  const [isProofVisible, setIsProofVisible] = useState(false);
  const [isFaqVisible, setIsFaqVisible] = useState(false);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [yearlyCount, setYearlyCount] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);
  const [affordabilityWidth, setAffordabilityWidth] = useState(0);
  const [activeFaqTab, setActiveFaqTab] = useState(0);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === blueprintRef.current) setIsBlueprintVisible(true);
            if (entry.target === proofRef.current) setIsProofVisible(true);
            if (entry.target === faqRef.current) setIsFaqVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (blueprintRef.current) observer.observe(blueprintRef.current);
    if (proofRef.current) observer.observe(proofRef.current);
    if (faqRef.current) observer.observe(faqRef.current);

    return () => {
      if (blueprintRef.current) observer.unobserve(blueprintRef.current);
      if (proofRef.current) observer.unobserve(proofRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isBlueprintVisible) return;

    let monthlyFrame = 0;
    let yearlyFrame = 0;
    let incomeFrame = 0;
    let affordabilityFrame = 0;

    const animateMonthly = () => {
      if (monthlyFrame < 18750) {
        monthlyFrame += 18750 / 60;
        setMonthlyCount(Math.floor(monthlyFrame));
        requestAnimationFrame(animateMonthly);
      } else {
        setMonthlyCount(18750);
      }
    };

    const animateYearly = () => {
      if (yearlyFrame < 225000) {
        yearlyFrame += 225000 / 60;
        setYearlyCount(Math.floor(yearlyFrame));
        requestAnimationFrame(animateYearly);
      } else {
        setYearlyCount(225000);
      }
    };

    const animateIncome = () => {
      if (incomeFrame < 350000) {
        incomeFrame += 350000 / 60;
        setIncomeCount(Math.floor(incomeFrame));
        requestAnimationFrame(animateIncome);
      } else {
        setIncomeCount(350000);
      }
    };

    const animateAffordability = () => {
      if (affordabilityFrame < 64) {
        affordabilityFrame += 64 / 50;
        setAffordabilityWidth(Math.floor(affordabilityFrame));
        requestAnimationFrame(animateAffordability);
      } else {
        setAffordabilityWidth(64);
      }
    };

    animateMonthly();
    setTimeout(animateYearly, 100);
    setTimeout(animateIncome, 200);
    setTimeout(animateAffordability, 300);
  }, [isBlueprintVisible]);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(14, 15, 17, 0.5), rgba(14, 15, 17, 0.7), rgba(14, 15, 17, 0.9))' }} />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Bottom Fade Out */}
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to bottom, transparent, rgba(14, 15, 17, 0.6), var(--bg-primary))', zIndex: 20, pointerEvents: 'none' }} />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Centered Hero Content */}
          <div className="flex-1 flex items-center justify-center px-8 md:px-12">
            <div className="w-full max-w-3xl text-center">
              {/* Headline */}
              <h1
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ color: 'var(--text-primary)' }}
              >
                Where do you want to wake up?
              </h1>
              <p
                className={`text-lg md:text-xl mb-8 transition-all duration-1000 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '100ms', color: 'var(--text-secondary)' }}
              >
                Build your dream lifestyle. See what it costs. Get clarity on your future.
              </p>

              {/* LifeSpec Meter */}
              <div
                className={`mb-12 transition-all duration-1000 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="group backdrop-blur-xl border rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                  {/* Meter Values */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Monthly</p>
                      <p className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent-gold)' }}>$18,750</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>/mo</p>
                    </div>
                    <div className="text-center border-l border-r" style={{ borderColor: 'var(--border-color)' }}>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Yearly</p>
                      <p className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent-gold-muted)' }}>$225,000</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>/yr</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Required Income</p>
                      <p className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>$350,000</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>/yr</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-6" style={{ background: `linear-gradient(to right, transparent, var(--accent-gold), transparent)`, opacity: 0.2 }} />

                  {/* Affordability Index */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Affordability Index</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent-gold)' }}>64%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: isLoaded ? '64%' : '0%',
                          background: `linear-gradient(to right, var(--accent-gold-muted), var(--accent-gold))`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-center" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Estimates for inspiration only.</p>
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
                  className="px-8 py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 mb-4"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: 'var(--bg-primary)',
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
                  }}
                >
                  Start Building
                </button>

                {/* Secondary Link */}
                <button
                  onClick={scrollToHowItWorks}
                  className="block mx-auto transition-colors duration-300 text-sm font-medium mb-8"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  See how it works ↓
                </button>

                {/* Feature Chips */}
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="px-4 py-2 backdrop-blur-sm border rounded-full text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-gold)' }} />
                    No sign-up required
                  </div>
                  <div className="px-4 py-2 backdrop-blur-sm border rounded-full text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-gold)' }} />
                    Takes under 3 minutes
                  </div>
                  <div className="px-4 py-2 backdrop-blur-sm border rounded-full text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-gold)' }} />
                    Realistic cost estimates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Timeline Style */}
      <section className="relative py-16 md:py-20 px-8 md:px-12 overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>How It Works</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Three simple steps to build and share your LifeSpec.</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, var(--accent-gold) 0%, var(--accent-gold) 30%, transparent 100%)', opacity: 0.5 }} />

            {/* Timeline Items */}
            <div className="space-y-12 md:space-y-16">
              {/* Step 1 */}
              <div
                className={`md:ml-24 transition-all duration-700 ease-out ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
              >
                <div className="hidden md:block absolute left-0 top-0 w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold -translate-x-8" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)' }}>
                  1
                </div>
                <div className="group backdrop-blur-sm border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 rounded-lg flex items-center justify-center flex-shrink-0 border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                      <img src="/image1.webp" alt="Choose your life" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Choose your life.</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Home, cars, travel, style — pick what your life looks like.</p>
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
                <div className="hidden md:block absolute left-0 top-0 w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold -translate-x-8" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)' }}>
                  2
                </div>
                <div className="group backdrop-blur-sm border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 rounded-lg flex items-center justify-center flex-shrink-0 border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                      <img src="/image2.webp" alt="See your numbers" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>See your numbers.</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Monthly cost, yearly total, and required income — instantly.</p>
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
                <div className="hidden md:block absolute left-0 top-0 w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold -translate-x-8" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)' }}>
                  3
                </div>
                <div className="group backdrop-blur-sm border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 rounded-lg flex items-center justify-center flex-shrink-0 border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                      <img src="/image3.webp" alt="Lock it in" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Lock it in.</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Finish with a clean summary you can screenshot and share.</p>
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
              className={`px-8 py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: '300ms',
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
              }}
            >
              Start Building
            </button>
          </div>
        </div>
      </section>

      {/* Example Blueprint Section */}
      <section ref={blueprintRef} className="relative py-16 md:py-20 px-8 md:px-12 overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Background Gradient + Glow */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl" style={{
            background: 'linear-gradient(to bottom right, rgba(212, 175, 55, 0.2), rgba(200, 162, 77, 0.1))',
            animation: 'pulse 8s ease-in-out infinite',
          }} />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{
            background: 'linear-gradient(to bottom right, rgba(212, 175, 55, 0.15), transparent)',
            animation: 'pulse 10s ease-in-out infinite 1s',
          }} />
        </div>

        {/* Diagonal Gradient Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%)',
        }} />

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%);
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-slide-up {
            animation: slideUp 0.6s ease-out forwards;
          }
          .animate-pop-in {
            animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-2 backdrop-blur-sm border rounded-full text-xs font-semibold uppercase tracking-wider mb-6 transition-all duration-700 ${
              isBlueprintVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`} style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'var(--border-color)', color: 'var(--accent-gold)' }}>
              Example Blueprint
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 transition-all duration-700 ${
              isBlueprintVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ color: 'var(--text-primary)' }}>
              This is what your dream life costs.
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-700 ${
              isBlueprintVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: isBlueprintVisible ? '100ms' : '0ms', color: 'var(--text-secondary)' }}>
              Build your LifeSpec in minutes and get your monthly cost, yearly cost, and required income — instantly.
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Copy + CTA */}
            <div className={`flex flex-col justify-center transition-all duration-700 ${
              isBlueprintVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Hype Bullets */}
              <div className="space-y-4 mb-8">
                {[
                  'Real-time totals as you pick items',
                  'Monthly + yearly breakdown',
                  'Affordability meter in seconds',
                ].map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 transition-all duration-500"
                    style={{
                      animation: isBlueprintVisible ? `slideUp 0.6s ease-out ${300 + idx * 100}ms forwards` : 'none',
                      opacity: isBlueprintVisible ? 1 : 0,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--accent-gold)' }} />
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{bullet}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => router.push('/loading-screen')}
                  className="px-8 py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105"
                  style={{
                    animation: isBlueprintVisible ? 'slideUp 0.6s ease-out 600ms forwards' : 'none',
                    opacity: isBlueprintVisible ? 1 : 0,
                    backgroundColor: 'var(--accent-gold)',
                    color: 'var(--bg-primary)',
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
                  }}
                >
                  Create My LifeSpec
                </button>
                <button
                  onClick={() => blueprintRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 font-semibold rounded-xl transition-all duration-300 border"
                  style={{
                    animation: isBlueprintVisible ? 'slideUp 0.6s ease-out 700ms forwards' : 'none',
                    opacity: isBlueprintVisible ? 1 : 0,
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    e.currentTarget.style.color = 'var(--accent-gold)';
                    e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  See the Blueprint
                </button>
              </div>

              {/* Trust Pills */}
              <div className="flex flex-wrap gap-3">
                {['No sign-up required', 'Takes ~2 minutes', 'Shareable blueprint'].map((pill, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 backdrop-blur-sm border rounded-full text-xs transition-all duration-500"
                    style={{
                      animation: isBlueprintVisible ? `slideUp 0.6s ease-out ${800 + idx * 100}ms forwards` : 'none',
                      opacity: isBlueprintVisible ? 1 : 0,
                      backgroundColor: 'rgba(212, 175, 55, 0.05)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    ✓ {pill}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Blueprint Panel */}
            <button
              onClick={() => router.push('/loading-screen')}
              className={`group relative transition-all duration-700 cursor-pointer ${
                isBlueprintVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isBlueprintVisible ? '200ms' : '0ms' }}
            >
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to bottom right, rgba(212, 175, 55, 0.1), rgba(200, 162, 77, 0.05))' }} />

              <div className="relative backdrop-blur-xl border rounded-3xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2 group-hover:animate-float" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                {/* Blueprint Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>LifeSpec Blueprint</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Example</p>
                  </div>
                  <div className="w-10 h-10 rounded-full" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))', opacity: 0.2 }} />
                </div>

                {/* Stat Tiles Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Monthly Cost', value: `$${monthlyCount.toLocaleString()}`, color: 'var(--accent-gold)', delay: 0 },
                    { label: 'Yearly Cost', value: `$${yearlyCount.toLocaleString()}`, color: 'var(--accent-gold-muted)', delay: 100 },
                    { label: 'Required Income', value: `$${incomeCount.toLocaleString()}`, color: 'var(--text-primary)', delay: 200 },
                    { label: 'Affordability', value: `${affordabilityWidth}%`, color: 'var(--accent-gold)', delay: 300 },
                  ].map((tile, idx) => (
                    <div
                      key={idx}
                      className="border rounded-xl p-4 transition-all duration-300 group-hover:scale-105"
                      style={{
                        animation: isBlueprintVisible ? `popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${600 + tile.delay}ms forwards` : 'none',
                        opacity: isBlueprintVisible ? 1 : 0,
                        backgroundColor: 'rgba(212, 175, 55, 0.05)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>{tile.label}</p>
                      <p className="text-xl font-bold" style={{ color: tile.color }}>{tile.value}</p>
                    </div>
                  ))}
                </div>

                {/* Itemized Picks */}
                <div className="space-y-1 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  {[
                    { category: 'Home', item: 'Malibu Waterfront Mansion', price: 12500 },
                    { category: 'Vehicle', item: 'Mercedes G63 AMG', price: 2400 },
                    { category: 'Services', item: 'Private Chef', price: 4000 },
                    { category: 'Services', item: 'Housekeeping', price: 800 },
                    { category: 'Travel', item: 'Lake Como Villa Weekends', price: 1750 },
                    { category: 'Fashion', item: 'Designer Wardrobe', price: 1300 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-2 rounded-lg transition-colors duration-200"
                      style={{
                        animation: isBlueprintVisible ? `slideUp 0.4s ease-out ${800 + idx * 50}ms forwards` : 'none',
                        opacity: isBlueprintVisible ? 1 : 0,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.category}</p>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.item}</p>
                      </div>
                      <p className="text-sm font-semibold ml-4" style={{ color: 'var(--accent-gold)' }}>+${item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Footer Hint */}
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Try yours</span>
                  <span style={{ color: 'var(--accent-gold)' }}>→</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Marquee Reviews */}
      <section ref={proofRef} className="relative py-16 md:py-20 px-8 md:px-12 overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <style>{`
          @keyframes marqueeLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marqueeRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-left { animation: marqueeLeft 50s linear infinite; }
          .marquee-right { animation: marqueeRight 50s linear infinite; }
          .marquee-left:hover { animation-play-state: paused; }
          .marquee-right:hover { animation-play-state: paused; }
        `}</style>

        <div className="relative z-10 max-w-7xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className={`text-4xl md:text-5xl font-bold mb-3 transition-all duration-700 ${
              isProofVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ color: 'var(--text-primary)' }}>
              Real people. Real wake-up call.
            </h2>
            <p className={`text-lg transition-all duration-700 ${
              isProofVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: isProofVisible ? '100ms' : '0ms', color: 'var(--text-secondary)' }}>
              LifeSpec turns "one day" into a number you can actually work with.
            </p>
          </div>
        </div>

        {/* Marquee Row A - Left */}
        <div className="relative mb-6 overflow-hidden">
          <div className="marquee-left flex gap-4 w-max">
            {[
              { handle: '@dylan.builds', initials: 'DB', text: 'Seeing $18,750/mo in black and white changed everything. No more guessing.', monthly: '$18,750' },
              { handle: '@lina.moves', initials: 'LM', text: 'The affordability bar was eye-opening. I need to earn way more than I thought.', monthly: '$12,300' },
              { handle: '@ari.plans', initials: 'AP', text: 'Built my blueprint in 2 minutes. Instant clarity on what my dream costs.', monthly: '$22,500' },
              { handle: '@noahmetrics', initials: 'NM', text: 'Monthly total: $15,600. Now I have a real target to work toward.', monthly: '$15,600' },
              { handle: '@sasha.studies', initials: 'SS', text: 'The custom items feature let me add exactly what I want. So flexible.', monthly: '$9,800' },
              { handle: '@jaydensteps', initials: 'JS', text: 'Required income breakdown was a reality check I needed. Highly recommend.', monthly: '$28,000' },
            ].map((review, idx) => (
              <div key={idx} className="flex-shrink-0 w-80 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 shadow-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))', color: 'var(--bg-primary)' }}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{review.handle}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Verified Build</p>
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--accent-gold)' }}>★★★★★</div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Monthly total:</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>{review.monthly}</p>
                </div>
              </div>
            ))}
            {/* Repeat for infinite scroll */}
            {[
              { handle: '@dylan.builds', initials: 'DB', text: 'Seeing $18,750/mo in black and white changed everything. No more guessing.', monthly: '$18,750' },
              { handle: '@lina.moves', initials: 'LM', text: 'The affordability bar was eye-opening. I need to earn way more than I thought.', monthly: '$12,300' },
              { handle: '@ari.plans', initials: 'AP', text: 'Built my blueprint in 2 minutes. Instant clarity on what my dream costs.', monthly: '$22,500' },
              { handle: '@noahmetrics', initials: 'NM', text: 'Monthly total: $15,600. Now I have a real target to work toward.', monthly: '$15,600' },
              { handle: '@sasha.studies', initials: 'SS', text: 'The custom items feature let me add exactly what I want. So flexible.', monthly: '$9,800' },
              { handle: '@jaydensteps', initials: 'JS', text: 'Required income breakdown was a reality check I needed. Highly recommend.', monthly: '$28,000' },
            ].map((review, idx) => (
              <div key={`repeat-a-${idx}`} className="flex-shrink-0 w-80 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 shadow-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))', color: 'var(--bg-primary)' }}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{review.handle}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Verified Build</p>
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--accent-gold)' }}>★★★★★</div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Monthly total:</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>{review.monthly}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row B - Right */}
        <div className="relative mb-8 overflow-hidden">
          <div className="marquee-right flex gap-4 w-max">
            {[
              { handle: '@mia.finance', initials: 'MF', text: 'Shared my blueprint with my partner. We finally agree on our target.', monthly: '$21,000' },
              { handle: '@kevinfocus', initials: 'KF', text: 'No sign-up needed. Built, saw my numbers, and left. Perfect.', monthly: '$16,800' },
              { handle: '@dylan.builds', initials: 'DB', text: 'The 25% tax + 30% savings math is realistic. Not inflated.', monthly: '$18,750' },
              { handle: '@lina.moves', initials: 'LM', text: 'Customized every item. My blueprint is actually mine.', monthly: '$12,300' },
              { handle: '@ari.plans', initials: 'AP', text: 'Instant. No waiting. No complexity. Just the number.', monthly: '$22,500' },
              { handle: '@noahmetrics', initials: 'NM', text: 'Bookmarked it. Going back to check my progress monthly.', monthly: '$15,600' },
            ].map((review, idx) => (
              <div key={idx} className="flex-shrink-0 w-80 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 shadow-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold-muted), var(--accent-gold))', color: 'var(--bg-primary)' }}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{review.handle}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Verified Build</p>
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--accent-gold)' }}>★★★★★</div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Monthly total:</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>{review.monthly}</p>
                </div>
              </div>
            ))}
            {/* Repeat for infinite scroll */}
            {[
              { handle: '@mia.finance', initials: 'MF', text: 'Shared my blueprint with my partner. We finally agree on our target.', monthly: '$21,000' },
              { handle: '@kevinfocus', initials: 'KF', text: 'No sign-up needed. Built, saw my numbers, and left. Perfect.', monthly: '$16,800' },
              { handle: '@dylan.builds', initials: 'DB', text: 'The 25% tax + 30% savings math is realistic. Not inflated.', monthly: '$18,750' },
              { handle: '@lina.moves', initials: 'LM', text: 'Customized every item. My blueprint is actually mine.', monthly: '$12,300' },
              { handle: '@ari.plans', initials: 'AP', text: 'Instant. No waiting. No complexity. Just the number.', monthly: '$22,500' },
              { handle: '@noahmetrics', initials: 'NM', text: 'Bookmarked it. Going back to check my progress monthly.', monthly: '$15,600' },
            ].map((review, idx) => (
              <div key={`repeat-b-${idx}`} className="flex-shrink-0 w-80 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 shadow-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold-muted), var(--accent-gold))', color: 'var(--bg-primary)' }}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{review.handle}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Verified Build</p>
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--accent-gold)' }}>★★★★★</div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Monthly total:</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>{review.monthly}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Line */}
        <div className={`text-center transition-all duration-700 ${
          isProofVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--accent-gold)' }}>4.8/5</span> average — based on <span className="font-semibold" style={{ color: 'var(--accent-gold-muted)' }}>9,400+</span> builds
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="relative py-16 md:py-20 px-8 md:px-12 overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-4xl md:text-5xl font-bold mb-3 transition-all duration-700 ${
              isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ color: 'var(--text-primary)' }}>
              Questions?
            </h2>
            <p className={`text-lg transition-all duration-700 ${
              isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
            }`} style={{ transitionDelay: isFaqVisible ? '100ms' : '0ms', color: 'var(--text-secondary)' }}>
              Quick clarity before you build.
            </p>
          </div>

          {/* Tabbed FAQ Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Question Tabs */}
            <div className={`space-y-2 transition-all duration-700 ${
              isFaqVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
            }`}>
              {[
                'How does LifeSpec estimate monthly costs?',
                'Are these numbers exact or averages?',
                'Can I customize items and prices?',
                'Why do you show required income?',
                'Do I need an account to use it?',
                'Can I save and share my blueprint?',
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFaqTab(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border ${
                    activeFaqTab === idx ? '' : ''
                  }`}
                  style={{
                    backgroundColor: activeFaqTab === idx ? 'var(--accent-gold)' : 'rgba(212, 175, 55, 0.05)',
                    color: activeFaqTab === idx ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    borderColor: activeFaqTab === idx ? 'var(--accent-gold)' : 'var(--border-color)',
                  }}
                >
                  <p className="text-sm font-medium">{question}</p>
                </button>
              ))}
            </div>

            {/* Right: Answer Panel */}
            <div className={`lg:col-span-2 transition-all duration-700 ${
              isFaqVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`} style={{ transitionDelay: isFaqVisible ? '200ms' : '0ms' }}>
              <div className="backdrop-blur-sm border rounded-2xl p-8 min-h-64 flex flex-col justify-between" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
                {/* Answer Content */}
                <div className="fade-in">
                  {activeFaqTab === 0 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>How does LifeSpec estimate monthly costs?</h3>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>We sum up the monthly prices of all items you select. Each item has a base price, and you can customize any of them. The total is your estimated monthly lifestyle cost.</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>This is for inspiration and planning — not financial advice.</p>
                    </div>
                  )}
                  {activeFaqTab === 1 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Are these numbers exact or averages?</h3>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>They're realistic estimates based on market research. A Malibu mansion might cost $12,500/mo, but your actual costs could vary. Use these as a starting point, not gospel.</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Customize prices to match your local market or preferences.</p>
                    </div>
                  )}
                  {activeFaqTab === 2 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Can I customize items and prices?</h3>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Yes. Every step lets you add custom items with your own monthly price. Want a $5,000/mo car instead of the preset? Add it. Your blueprint, your rules.</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Custom items are stored locally during your session.</p>
                    </div>
                  )}
                  {activeFaqTab === 3 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Why do you show required income?</h3>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>We work backward from your lifestyle cost. We assume 25% taxes and 30% savings, so your gross income needs to cover the rest. It's a reality check.</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Use the affordability meter to compare your income to your dream lifestyle.</p>
                    </div>
                  )}
                  {activeFaqTab === 4 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Do I need an account to use it?</h3>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Nope. Build your blueprint, see your numbers, and leave. No sign-up required. (Saving blueprints for later will require an account — coming soon.)</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Screenshot your blueprint and share it with anyone.</p>
                    </div>
                  )}
                  {activeFaqTab === 5 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Can I save and share my blueprint?</h3>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>You can screenshot your blueprint and share it instantly. Saving to your account for later is a future feature we're building.</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>For now, your blueprint lives in your browser session.</p>
                    </div>
                  )}
                </div>

                {/* Tip Row */}
                <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>💡 Tip:</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try entering your net income on the Blueprint screen to see your affordability %.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button
              onClick={() => router.push('/loading-screen')}
              className={`px-8 py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
                isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isFaqVisible ? '300ms' : '0ms',
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
              }}
            >
              Start building
            </button>
            <button
              onClick={() => blueprintRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-8 py-4 border font-semibold rounded-xl transition-all duration-300 ${
                isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isFaqVisible ? '400ms' : '0ms',
                backgroundColor: 'transparent',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.color = 'var(--accent-gold)';
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
