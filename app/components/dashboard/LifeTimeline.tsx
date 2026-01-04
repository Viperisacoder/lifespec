'use client';

import { useRef, useEffect } from 'react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  timeframe: string; // e.g., "2 years" or "5 years"
  isAchievable: boolean;
  isLocked: boolean;
}

interface LifeTimelineProps {
  milestones?: Milestone[];
}

export default function LifeTimeline({
  milestones = [
    {
      id: "milestone1",
      title: "Break-even",
      description: "Income matches expenses",
      timeframe: "6 months",
      isAchievable: true,
      isLocked: false
    },
    {
      id: "milestone2",
      title: "Lifestyle Fully Funded",
      description: "Savings cover 6 months of expenses",
      timeframe: "2 years",
      isAchievable: true,
      isLocked: true
    },
    {
      id: "milestone3",
      title: "First $100k Saved",
      description: "Major savings milestone",
      timeframe: "4 years",
      isAchievable: false,
      isLocked: true
    },
    {
      id: "milestone4",
      title: "First $1M Net Worth",
      description: "Financial independence milestone",
      timeframe: "15 years",
      isAchievable: false,
      isLocked: true
    }
  ]
}: LifeTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle horizontal scrolling with mouse wheel
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };
    
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-light tracking-wide text-[var(--text-primary)] mb-8">
        Your Life Timeline
      </h2>
      
      <div 
        ref={scrollContainerRef}
        className="relative overflow-x-auto pb-8 hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex min-w-max space-x-6 px-2 pb-4">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[rgba(212,175,55,0.15)]" />
          
          {/* Current position marker */}
          <div className="absolute top-1/2 left-0 h-6 w-6 rounded-full bg-[var(--white)] transform -translate-y-1/2 z-10 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[var(--bg-primary)]" />
          </div>
          
          {/* Milestones */}
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id}
              className="relative animate-fade-in"
            >
              {/* Timeline dot */}
              <div 
                className={`absolute top-0 left-1/2 h-4 w-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                  milestone.isAchievable 
                    ? "bg-[var(--white)]" 
                    : "bg-[rgba(212,175,55,0.3)]"
                }`}
                style={{
                  boxShadow: milestone.isAchievable 
                    ? '0 0 15px rgba(255, 255, 255, 0.5)' 
                    : 'none'
                }}
              />
              
              {/* Milestone card */}
              <div 
                className={`relative w-64 rounded-xl p-6 hover:shadow-lg transition-shadow ${
                  milestone.isLocked 
                    ? "bg-[rgba(20,20,22,0.7)]" 
                    : "bg-[rgba(20,20,22,0.9)]"
                }`}
                style={{
                  boxShadow: milestone.isAchievable 
                    ? '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.2)',
                  marginTop: index % 2 === 0 ? '40px' : '0',
                  marginBottom: index % 2 === 0 ? '0' : '40px'
                }}
              >
                {/* Lock icon for locked milestones */}
                {milestone.isLocked && (
                  <div className="absolute top-4 right-4 text-[rgba(212,175,55,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                )}
                
                <h3 className={`text-xl font-light mb-2 ${
                  milestone.isAchievable 
                    ? "text-[var(--text-primary)]" 
                    : "text-[var(--text-secondary)]"
                }`}>
                  {milestone.title}
                </h3>
                
                <p className="text-sm mb-4 text-[var(--text-secondary)]">
                  {milestone.description}
                </p>
                
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    milestone.isAchievable 
                      ? "bg-[var(--white)]" 
                      : "bg-[rgba(212,175,55,0.3)]"
                  }`} />
                  <p className={`text-sm ${
                    milestone.isAchievable 
                      ? "text-[var(--white)]" 
                      : "text-[var(--text-secondary)]"
                  }`}>
                    {milestone.timeframe}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile note */}
      <p className="text-xs text-[var(--text-secondary)] mt-4 md:hidden">
        Swipe horizontally to explore your timeline
      </p>
      
      {/* Custom scrollbar styling */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        
        .hide-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
