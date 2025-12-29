'use client';

import { useState, useEffect } from 'react';

type PricingType = 'purchase' | 'monthly' | 'yearly';
type CategoryId = 'home' | 'vehicles' | 'jewellery' | 'services' | 'travel' | 'wardrobe' | 'food' | 'wellness' | 'legacy' | 'safety';
type TransitionPhase = 'idle' | 'out' | 'in';
type TransitionDirection = 'forward' | 'back';

interface Option {
  id: string;
  name: string;
  pricingType: PricingType;
  amount: number;
  category: CategoryId;
  isCustom?: boolean;
}

interface StepConfig {
  id: CategoryId;
  heading: string;
  subheading: string;
  maxSelections: number;
  options: Option[];
}

function roundToNearest10(n: number): number {
  return Math.round(n / 10) * 10;
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatMonthly(n: number): string {
  return formatMoney(n) + '/mo';
}

function computeMonthlyFromOption(option: Option): number {
  if (option.pricingType === 'purchase') {
    if (option.category === 'home') {
      return roundToNearest10(option.amount * 0.0065 + 2500);
    }
    if (option.category === 'vehicles') {
      return roundToNearest10(option.amount * 0.0125 + 450);
    }
    if (option.category === 'jewellery') {
      return roundToNearest10((option.amount * 0.02) / 12);
    }
  }
  if (option.pricingType === 'monthly') {
    return option.amount;
  }
  if (option.pricingType === 'yearly') {
    return roundToNearest10(option.amount / 12);
  }
  return 0;
}

function getDisplayPrice(option: Option): string {
  if (option.pricingType === 'purchase') {
    return formatMoney(option.amount);
  }
  if (option.pricingType === 'monthly') {
    return formatMonthly(option.amount);
  }
  if (option.pricingType === 'yearly') {
    return formatMoney(option.amount) + '/yr';
  }
  return '$0';
}

const steps: StepConfig[] = [
  {
    id: 'home',
    heading: 'Where do you want to wake up?',
    subheading: 'Choose your dream house',
    maxSelections: 1,
    options: [
      { id: 'h1', name: 'NYC Penthouse', pricingType: 'purchase', amount: 12000000, category: 'home' },
      { id: 'h2', name: 'Lake Tahoe Cabin', pricingType: 'purchase', amount: 3500000, category: 'home' },
      { id: 'h3', name: 'Aspen Cabin', pricingType: 'purchase', amount: 6000000, category: 'home' },
      { id: 'h4', name: 'Malibu Waterfront Mansion', pricingType: 'purchase', amount: 25000000, category: 'home' },
      { id: 'h5', name: 'London Apartment', pricingType: 'purchase', amount: 7500000, category: 'home' },
      { id: 'h6', name: 'West Vancouver Mansion', pricingType: 'purchase', amount: 9000000, category: 'home' },
      { id: 'h7', name: 'Lake Como Historic Villa', pricingType: 'purchase', amount: 18000000, category: 'home' },
      { id: 'h8', name: 'Monaco Cliffside Penthouse', pricingType: 'purchase', amount: 22000000, category: 'home' },
      { id: 'h9', name: 'Swiss Alps Private Chalet', pricingType: 'purchase', amount: 8000000, category: 'home' },
      { id: 'h10', name: 'Vancouver West Point Grey Estate', pricingType: 'purchase', amount: 14000000, category: 'home' },
      { id: 'h11', name: 'Cape Town Villa', pricingType: 'purchase', amount: 5000000, category: 'home' },
      { id: 'h12', name: 'Marbella Villa', pricingType: 'purchase', amount: 6500000, category: 'home' },
      { id: 'h13', name: 'Maldives Private Island Residence', pricingType: 'purchase', amount: 30000000, category: 'home' },
      { id: 'h14', name: 'Carmel California House', pricingType: 'purchase', amount: 4000000, category: 'home' },
      { id: 'h15', name: 'La Jolla Castle', pricingType: 'purchase', amount: 15000000, category: 'home' },
    ],
  },
  {
    id: 'vehicles',
    heading: 'Choose the ride of your dreams',
    subheading: 'What car would you like to drive?',
    maxSelections: 1,
    options: [
      { id: 'v1', name: 'Mercedes GLS 600 Maybach', pricingType: 'purchase', amount: 200000, category: 'vehicles' },
      { id: 'v2', name: 'Mercedes G63 AMG', pricingType: 'purchase', amount: 180000, category: 'vehicles' },
      { id: 'v3', name: 'BMW X7 M60i', pricingType: 'purchase', amount: 110000, category: 'vehicles' },
      { id: 'v4', name: 'BMW X6M Competition', pricingType: 'purchase', amount: 120000, category: 'vehicles' },
      { id: 'v5', name: 'Aston Martin DB12', pricingType: 'purchase', amount: 250000, category: 'vehicles' },
      { id: 'v6', name: 'Rolls-Royce Cullinan', pricingType: 'purchase', amount: 400000, category: 'vehicles' },
      { id: 'v7', name: 'Ferrari SF90 Stradale', pricingType: 'purchase', amount: 520000, category: 'vehicles' },
      { id: 'v8', name: 'Rolls-Royce Phantom', pricingType: 'purchase', amount: 500000, category: 'vehicles' },
      { id: 'v9', name: 'Ferrari 812 Superfast', pricingType: 'purchase', amount: 430000, category: 'vehicles' },
      { id: 'v10', name: 'Lamborghini Aventador SVJ', pricingType: 'purchase', amount: 520000, category: 'vehicles' },
      { id: 'v11', name: 'Bentley Bentayga Speed', pricingType: 'purchase', amount: 300000, category: 'vehicles' },
      { id: 'v12', name: 'Porsche 992 GT3 RS', pricingType: 'purchase', amount: 225000, category: 'vehicles' },
      { id: 'v13', name: 'Mercedes C63 AMG', pricingType: 'purchase', amount: 85000, category: 'vehicles' },
      { id: 'v14', name: 'Audi RS7', pricingType: 'purchase', amount: 125000, category: 'vehicles' },
    ],
  },
  {
    id: 'jewellery',
    heading: 'Jewellery',
    subheading: 'What are you wearing on your wrist?',
    maxSelections: 1,
    options: [
      { id: 'j1', name: 'Rolex Datejust (Yellow Dial)', pricingType: 'purchase', amount: 10000, category: 'jewellery' },
      { id: 'j2', name: 'Rolex Submariner (Black)', pricingType: 'purchase', amount: 11000, category: 'jewellery' },
      { id: 'j3', name: 'Patek Philippe Aquanaut', pricingType: 'purchase', amount: 70000, category: 'jewellery' },
      { id: 'j4', name: 'Audemars Piguet Royal Oak', pricingType: 'purchase', amount: 55000, category: 'jewellery' },
      { id: 'j5', name: 'Cartier Santos', pricingType: 'purchase', amount: 8000, category: 'jewellery' },
      { id: 'j6', name: 'Cartier Tank Louis', pricingType: 'purchase', amount: 14000, category: 'jewellery' },
      { id: 'j7', name: 'Omega Speedmaster Professional', pricingType: 'purchase', amount: 7000, category: 'jewellery' },
      { id: 'j8', name: 'Cartier Love Bracelet (Yellow Gold)', pricingType: 'purchase', amount: 7500, category: 'jewellery' },
      { id: 'j9', name: 'Cartier Juste un Clou Bracelet', pricingType: 'purchase', amount: 10000, category: 'jewellery' },
      { id: 'j10', name: 'Van Cleef & Arpels Alhambra Bracelet', pricingType: 'purchase', amount: 6000, category: 'jewellery' },
      { id: 'j11', name: 'Solid Gold Cuban Link Chain (18k)', pricingType: 'purchase', amount: 15000, category: 'jewellery' },
      { id: 'j12', name: 'Van Cleef & Arpels Alhambra Necklace', pricingType: 'purchase', amount: 8000, category: 'jewellery' },
      { id: 'j13', name: 'Diamond Tennis Necklace', pricingType: 'purchase', amount: 20000, category: 'jewellery' },
      { id: 'j14', name: 'Cartier Love Ring', pricingType: 'purchase', amount: 2500, category: 'jewellery' },
      { id: 'j15', name: 'Signet Ring (18k Gold, Custom Engraved)', pricingType: 'purchase', amount: 5000, category: 'jewellery' },
    ],
  },
  {
    id: 'services',
    heading: 'Services',
    subheading: 'What services would you like?',
    maxSelections: 3,
    options: [
      { id: 's1', name: 'Housekeeping', pricingType: 'monthly', amount: 800, category: 'services' },
      { id: 's2', name: 'Private Chef', pricingType: 'monthly', amount: 8000, category: 'services' },
      { id: 's3', name: 'Personal Trainer', pricingType: 'monthly', amount: 3000, category: 'services' },
      { id: 's4', name: 'Live-in Butler', pricingType: 'monthly', amount: 6000, category: 'services' },
      { id: 's5', name: 'Chauffeur', pricingType: 'monthly', amount: 5000, category: 'services' },
      { id: 's6', name: 'Security Detail', pricingType: 'monthly', amount: 6500, category: 'services' },
      { id: 's7', name: 'Personal Assistant', pricingType: 'monthly', amount: 4000, category: 'services' },
      { id: 's8', name: 'Landscaper', pricingType: 'monthly', amount: 400, category: 'services' },
    ],
  },
  {
    id: 'travel',
    heading: 'Travel',
    subheading: 'Where would you like to travel?',
    maxSelections: 3,
    options: [
      { id: 't1', name: 'St Barts Hillside Villa', pricingType: 'yearly', amount: 60000, category: 'travel' },
      { id: 't2', name: 'Monaco Grand Prix Weekend', pricingType: 'yearly', amount: 45000, category: 'travel' },
      { id: 't3', name: 'Aspen Ski Chalet', pricingType: 'yearly', amount: 50000, category: 'travel' },
      { id: 't4', name: 'Dubai Atlantis Royal (All Inclusive)', pricingType: 'yearly', amount: 35000, category: 'travel' },
      { id: 't5', name: 'Lake Como Private Villa', pricingType: 'yearly', amount: 45000, category: 'travel' },
      { id: 't6', name: 'Las Vegas Cosmopolitan Stay', pricingType: 'yearly', amount: 15000, category: 'travel' },
      { id: 't7', name: 'Ritz-Carlton Half Moon Bay', pricingType: 'yearly', amount: 18000, category: 'travel' },
      { id: 't8', name: 'Ritz-Carlton Laguna Niguel', pricingType: 'yearly', amount: 20000, category: 'travel' },
      { id: 't9', name: 'The Plaza Hotel NYC', pricingType: 'yearly', amount: 25000, category: 'travel' },
      { id: 't10', name: 'Fontainebleau Miami Beach', pricingType: 'yearly', amount: 22000, category: 'travel' },
    ],
  },
  {
    id: 'wardrobe',
    heading: 'Wardrobe',
    subheading: 'What fashion items would you like?',
    maxSelections: 3,
    options: [
      { id: 'w1', name: 'Minimal Everyday Wardrobe', pricingType: 'yearly', amount: 3000, category: 'wardrobe' },
      { id: 'w2', name: 'Athletic Performance Wardrobe', pricingType: 'yearly', amount: 4000, category: 'wardrobe' },
      { id: 'w3', name: 'Designer Casual Wardrobe', pricingType: 'yearly', amount: 10000, category: 'wardrobe' },
      { id: 'w4', name: 'Luxury Streetwear Rotation', pricingType: 'yearly', amount: 15000, category: 'wardrobe' },
      { id: 'w5', name: 'Tailored Suit Collection', pricingType: 'yearly', amount: 12000, category: 'wardrobe' },
      { id: 'w6', name: 'High-Fashion Runway Wardrobe', pricingType: 'yearly', amount: 25000, category: 'wardrobe' },
      { id: 'w7', name: 'Seasonal Capsule Wardrobe', pricingType: 'yearly', amount: 8000, category: 'wardrobe' },
      { id: 'w8', name: 'Resort / Vacation Wardrobe', pricingType: 'yearly', amount: 6000, category: 'wardrobe' },
      { id: 'w9', name: 'Collector Sneaker Rotation', pricingType: 'yearly', amount: 5000, category: 'wardrobe' },
      { id: 'w10', name: 'Ultra-Luxury Bespoke Wardrobe', pricingType: 'yearly', amount: 50000, category: 'wardrobe' },
    ],
  },
  {
    id: 'food',
    heading: 'Food',
    subheading: 'What dining experiences would you like?',
    maxSelections: 3,
    options: [
      { id: 'f1', name: 'Basic Groceries', pricingType: 'monthly', amount: 400, category: 'food' },
      { id: 'f2', name: 'Organic Groceries', pricingType: 'monthly', amount: 700, category: 'food' },
      { id: 'f3', name: 'Weekly Meal Prep Service', pricingType: 'monthly', amount: 350, category: 'food' },
      { id: 'f4', name: 'Casual Dining Out', pricingType: 'monthly', amount: 500, category: 'food' },
      { id: 'f5', name: 'Upscale Restaurant Dining', pricingType: 'monthly', amount: 1000, category: 'food' },
      { id: 'f6', name: 'Michelin-Star Dining', pricingType: 'monthly', amount: 1800, category: 'food' },
      { id: 'f7', name: 'Private Chef at Home', pricingType: 'monthly', amount: 4000, category: 'food' },
      { id: 'f8', name: 'Luxury Food Delivery', pricingType: 'monthly', amount: 800, category: 'food' },
      { id: 'f9', name: 'Specialty Coffee & Cafés', pricingType: 'monthly', amount: 200, category: 'food' },
      { id: 'f10', name: 'Wine & Fine Dining Experiences', pricingType: 'monthly', amount: 1200, category: 'food' },
    ],
  },
  {
    id: 'wellness',
    heading: 'Health & Wellness',
    subheading: 'What wellness services would you like?',
    maxSelections: 2,
    options: [
      { id: 'hw1', name: 'Weightlifting Membership', pricingType: 'monthly', amount: 120, category: 'wellness' },
      { id: 'hw2', name: 'Stairmaster / Cardio Routine', pricingType: 'monthly', amount: 40, category: 'wellness' },
      { id: 'hw3', name: 'Pilates Classes', pricingType: 'monthly', amount: 250, category: 'wellness' },
    ],
  },
  {
    id: 'legacy',
    heading: 'Legacy',
    subheading: 'What legacy would you like to build?',
    maxSelections: 3,
    options: [
      { id: 'l1', name: 'Student Loan Support', pricingType: 'yearly', amount: 12000, category: 'legacy' },
      { id: 'l2', name: 'Emergency Family Fund', pricingType: 'yearly', amount: 10000, category: 'legacy' },
      { id: 'l3', name: 'Charitable Giving Budget', pricingType: 'yearly', amount: 15000, category: 'legacy' },
      { id: 'l4', name: 'Education & Skill Fund', pricingType: 'yearly', amount: 20000, category: 'legacy' },
      { id: 'l5', name: 'Community Project Sponsorship', pricingType: 'yearly', amount: 12000, category: 'legacy' },
      { id: 'l6', name: 'Healthcare Support Fund', pricingType: 'yearly', amount: 8000, category: 'legacy' },
      { id: 'l7', name: 'Future Child Savings Plan', pricingType: 'yearly', amount: 18000, category: 'legacy' },
      { id: 'l8', name: 'Family Travel & Memories Fund', pricingType: 'yearly', amount: 12000, category: 'legacy' },
    ],
  },
  {
    id: 'safety',
    heading: 'Safety & Financial Foundation',
    subheading: 'What safety measures would you like?',
    maxSelections: 3,
    options: [
      { id: 'sf1', name: 'Health Insurance', pricingType: 'monthly', amount: 600, category: 'safety' },
      { id: 'sf2', name: 'Life Insurance', pricingType: 'monthly', amount: 120, category: 'safety' },
      { id: 'sf3', name: 'Disability Insurance', pricingType: 'monthly', amount: 150, category: 'safety' },
      { id: 'sf4', name: 'Umbrella Insurance', pricingType: 'monthly', amount: 60, category: 'safety' },
      { id: 'sf5', name: 'Homeowners Insurance', pricingType: 'monthly', amount: 250, category: 'safety' },
      { id: 'sf6', name: 'Auto Insurance', pricingType: 'monthly', amount: 200, category: 'safety' },
      { id: 'sf7', name: 'Emergency Fund Contribution', pricingType: 'monthly', amount: 500, category: 'safety' },
      { id: 'sf8', name: 'High-Yield Savings', pricingType: 'monthly', amount: 300, category: 'safety' },
      { id: 'sf9', name: 'Stock Portfolio Contribution', pricingType: 'monthly', amount: 1000, category: 'safety' },
      { id: 'sf10', name: 'Index Fund Portfolio', pricingType: 'monthly', amount: 750, category: 'safety' },
      { id: 'sf11', name: '401(k) Contribution', pricingType: 'monthly', amount: 800, category: 'safety' },
      { id: 'sf12', name: 'Roth IRA', pricingType: 'monthly', amount: 500, category: 'safety' },
      { id: 'sf13', name: 'Investment Property Reserve', pricingType: 'monthly', amount: 1500, category: 'safety' },
      { id: 'sf14', name: 'College Savings', pricingType: 'monthly', amount: 500, category: 'safety' },
      { id: 'sf15', name: 'Wealth Management', pricingType: 'monthly', amount: 300, category: 'safety' },
    ],
  },
];

const confettiColors = ['#2DD4BF', '#F6C66A', '#60A5FA', '#A78BFA', '#34D399', '#FCA5A5'];

function Confetti() {
  const pieces = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 0.5,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    size: 2 + Math.random() * 3,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: `${piece.left}%`,
            top: '-10px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: '50%',
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
            transform: `rotateZ(${piece.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

interface OptionCardProps {
  option: Option;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

const imageMap: { [key: string]: string } = {
  'h1': '/House/nycpenthouse.webp',
  'h2': '/House/laketahoecabin.webp',
  'h3': '/House/aspencabin.jpg',
  'h4': '/House/malibuwaterfront.webp',
  'h5': '/House/londonluxapartement.webp',
  'h6': '/House/westvanmansion.jpg',
  'h7': '/House/lakecomovilla.webp',
  'h8': '/House/monacopent.jpg',
  'h9': '/House/swissalps.webp',
  'h10': '/House/westpointgrey.webp',
  'h11': '/House/capetownvilla.webp',
  'h12': '/House/marbellavilla.jpg',
  'h13': '/House/maldives.jpg',
  'h14': '/House/carmel.jpg',
  'h15': '/House/lajolla.webp',
  'v1': '/cars/gls600.avif',
  'v2': '/cars/g63.jpg',
  'v3': '/cars/BMW X7 M60i xDrive 2022-2.webp',
  'v4': '/cars/x6mc.avif',
  'v5': '/cars/db12.png',
  'v6': '/cars/rrcullinan.jpeg',
  'v7': '/cars/0P1A0922-3_1.jpg',
  'v8': '/cars/phantom.jpg',
  'v9': '/cars/superfast812.webp',
  'v10': '/cars/svj.jpg',
  'v11': '/cars/079-bentley-bentayga-speed.webp',
  'v12': '/cars/dsc09285.webp',
  'v13': '/cars/c63amg.avif',
  'v14': '/cars/rs7.jpg',
  'j1': '/jewellery/rolexyellow.webp',
  'j2': '/jewellery/submariner.webp',
  'j3': '/jewellery/Patek-Philippe-Aquanaut-Travel-Time-5164G-Featured.jpg',
  'j4': '/jewellery/Audemars-Piguet-Royal-Oak-Jumbo-Extra-Thin-Openworked-16204BC-Featured.webp',
  'j5': '/jewellery/santos.avif',
  'j6': '/jewellery/cartier tank louis.jpg',
  'j7': '/jewellery/speedmaster.webp',
  'j8': '/jewellery/lovebracelet.webp',
  'j9': '/jewellery/cartierjustunclou.avif',
  'j10': '/jewellery/alhambravc.jpeg',
  'j11': '/jewellery/cubanlinkchain.webp',
  'j12': '/jewellery/neckalcealhambra.webp',
  'j13': '/jewellery/tennisnecklace.avif',
  'j14': '/jewellery/cartierlovering.webp',
  'j15': '/jewellery/signetring.webp',
  's1': '/services/housekeeping.webp',
  's2': '/services/privatechef.webp',
  's3': '/services/personaltrainer.jpg',
  's4': '/services/butler.jpg',
  's5': '/services/chauffeur.png',
  's6': '/services/security.jpg',
  's7': '/services/personalassistant.webp',
  's8': '/services/landscaper.png',
  't1': '/travel/stbartsvilla.webp',
  't2': '/travel/monaco.jpg',
  't3': '/travel/aspenski.jpg',
  't4': '/travel/dubaiatlantis.webp',
  't5': '/travel/lakecomo.jpg',
  't6': '/travel/lasvegas.webp',
  't7': '/travel/halfmoonbay.jpg',
  't8': '/travel/ritzcarltonlaguna.jpeg',
  't9': '/travel/theplaza.jpg',
  't10': '/travel/fountainbleau.jpg',
  'w1': '/wardrobe/everydaywardrobe.jpg',
  'w2': '/wardrobe/athletic.webp',
  'w3': '/wardrobe/designer.jpg',
  'w4': '/wardrobe/luxurystreetwear.jpg',
  'w5': '/wardrobe/suitcloset.jpg',
  'w6': '/wardrobe/runway.jpg',
  'w7': '/wardrobe/seasonal.jpg',
  'w8': '/wardrobe/vacation.webp',
  'w9': '/wardrobe/sneaker.webp',
  'w10': '/wardrobe/ultralux.webp',
};

function OptionCard({ option, isSelected, onClick, onDelete }: OptionCardProps) {
  const imageSrc = imageMap[option.id];

  return (
    <div
      className={`group relative text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF] rounded-2xl ${
        isSelected
          ? 'ring-2 ring-[#F6C66A] ring-offset-2 ring-offset-[#060A0F]'
          : 'hover:ring-2 hover:ring-[rgba(45,212,191,0.22)] hover:ring-offset-2 hover:ring-offset-[#060A0F]'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full text-left"
      >
        <div
          className={`bg-gradient-to-br from-[#0B1220] to-[#0E1A2B] backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${
            isSelected
              ? 'border-[#F6C66A] shadow-2xl'
              : 'border-[rgba(148,163,184,0.14)] hover:border-[rgba(45,212,191,0.22)] shadow-lg'
          }`}
          style={isSelected ? { boxShadow: '0 0 24px rgba(45,212,191,0.15)' } : {}}
        >
          <div className="w-full aspect-video bg-gradient-to-br from-[#0F766E]/20 to-[#0B1220] rounded-t-2xl flex items-center justify-center border-b border-[rgba(45,212,191,0.14)] overflow-hidden">
            {imageSrc ? (
              <img src={imageSrc} alt={option.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-[rgba(231,237,246,0.65)]">Image</span>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#E7EDF6] mb-2 flex-1">{option.name}</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${isSelected ? 'text-[#F6C66A] font-semibold' : 'text-[#A8B3C7]'}`}>
                {getDisplayPrice(option)}
              </p>
              {option.isCustom && (
                <span className="text-xs font-medium text-[#2DD4BF] bg-[#0F766E]/30 px-2 py-1 rounded">
                  Custom
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {option.isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 text-[#A8B3C7] hover:text-[#F6C66A] transition-colors bg-[#060A0F]/80 backdrop-blur-sm p-1.5 rounded-lg hover:bg-[#0B1220] z-10"
        >
          ✕
        </button>
      )}

      {isSelected && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2DD4BF]/10 to-[#F6C66A]/10"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#2DD4BF] to-[#F6C66A] opacity-50 rounded-t-2xl"></div>
        </div>
      )}
    </div>
  );
}

interface AddCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, monthlyPrice: number) => void;
}

function AddCustomModal({ isOpen, onClose, onAdd }: AddCustomModalProps) {
  const [name, setName] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setMonthlyPrice('');
      setNameError('');
      setPriceError('');
    }
  }, [isOpen]);

  const handleAdd = () => {
    setNameError('');
    setPriceError('');

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 40) {
      setNameError('Name must be 2–40 characters');
      return;
    }

    const price = parseFloat(monthlyPrice);
    if (isNaN(price) || price < 0 || price > 1000000) {
      setPriceError('Price must be between $0 and $1,000,000');
      return;
    }

    const rounded = roundToNearest10(price);
    onAdd(trimmedName, rounded);
    setName('');
    setMonthlyPrice('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-gradient-to-br from-[#0B1220] to-[#0E1A2B] border border-[rgba(45,212,191,0.14)] rounded-2xl p-8 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-semibold text-[#E7EDF6] mb-6">Add Custom Item</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#A8B3C7] mb-2">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Personal Masseuse"
              className="w-full bg-[#0F1A28] border border-[rgba(45,212,191,0.22)] rounded-lg px-4 py-3 text-[#E7EDF6] placeholder-[rgba(168,179,199,0.5)] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent transition-all"
            />
            {nameError && <p className="text-sm text-[#F87171] mt-2">{nameError}</p>}
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-[#A8B3C7] mb-2">Monthly Price ($)</label>
            <input
              type="number"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 2500"
              min="0"
              max="1000000"
              className="w-full bg-[#0F1A28] border border-[rgba(45,212,191,0.22)] rounded-lg px-4 py-3 text-[#E7EDF6] placeholder-[rgba(168,179,199,0.5)] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent transition-all"
            />
            {priceError && <p className="text-sm text-[#F87171] mt-2">{priceError}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-[rgba(45,212,191,0.22)] text-[#A8B3C7] hover:text-[#2DD4BF] hover:border-[rgba(45,212,191,0.44)] transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] text-[#E7EDF6] hover:from-[#0D5F5B] hover:to-[#1BA39F] transition-all font-medium shadow-lg shadow-[rgba(45,212,191,0.15)]"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LifeSpecWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [renderedStep, setRenderedStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customOptionsByCategory, setCustomOptionsByCategory] = useState<Record<CategoryId, Option[]>>({
    home: [], vehicles: [], jewellery: [], services: [], travel: [], wardrobe: [], food: [], wellness: [], legacy: [], safety: [],
  });

  const [homeId, setHomeId] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [jewelleryId, setJewelleryId] = useState<string | null>(null);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [travelIds, setTravelIds] = useState<string[]>([]);
  const [wardrobeIds, setWardrobeIds] = useState<string[]>([]);
  const [foodIds, setFoodIds] = useState<string[]>([]);
  const [wellnessIds, setWellnessIds] = useState<string[]>([]);
  const [legacyIds, setLegacyIds] = useState<string[]>([]);
  const [safetyIds, setSafetyIds] = useState<string[]>([]);

  const step = steps[renderedStep];

  useEffect(() => {
    if (transitionPhase === 'out') {
      const outTimer = setTimeout(() => {
        setRenderedStep(currentStep);
        setTransitionPhase('in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 180);
      return () => clearTimeout(outTimer);
    }
    if (transitionPhase === 'in') {
      const inTimer = setTimeout(() => {
        setTransitionPhase('idle');
        setIsAnimating(false);
      }, 180);
      return () => clearTimeout(inTimer);
    }
  }, [transitionPhase, currentStep]);

  useEffect(() => {
    if (showAddCustomModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showAddCustomModal]);

  const getSelectionState = (categoryId: CategoryId): string | string[] | null => {
    switch (categoryId) {
      case 'home': return homeId;
      case 'vehicles': return vehicleId;
      case 'jewellery': return jewelleryId;
      case 'services': return serviceIds;
      case 'travel': return travelIds;
      case 'wardrobe': return wardrobeIds;
      case 'food': return foodIds;
      case 'wellness': return wellnessIds;
      case 'legacy': return legacyIds;
      case 'safety': return safetyIds;
      default: return null;
    }
  };

  const setSelectionState = (categoryId: CategoryId, value: string | string[] | null) => {
    switch (categoryId) {
      case 'home': setHomeId(value as string | null); break;
      case 'vehicles': setVehicleId(value as string | null); break;
      case 'jewellery': setJewelleryId(value as string | null); break;
      case 'services': setServiceIds(value as string[]); break;
      case 'travel': setTravelIds(value as string[]); break;
      case 'wardrobe': setWardrobeIds(value as string[]); break;
      case 'food': setFoodIds(value as string[]); break;
      case 'wellness': setWellnessIds(value as string[]); break;
      case 'legacy': setLegacyIds(value as string[]); break;
      case 'safety': setSafetyIds(value as string[]); break;
    }
  };

  const handleSelectOption = (optionId: string) => {
    const selection = getSelectionState(step.id);
    if (step.maxSelections === 1) {
      if (selection === optionId) {
        setSelectionState(step.id, null);
      } else {
        setSelectionState(step.id, optionId);
      }
    } else {
      const ids = (selection as string[]) || [];
      if (ids.includes(optionId)) {
        setSelectionState(step.id, ids.filter((id) => id !== optionId));
      } else {
        if (ids.length < step.maxSelections) {
          setSelectionState(step.id, [...ids, optionId]);
        } else {
          setShowMaxMessage(true);
          setTimeout(() => setShowMaxMessage(false), 1500);
        }
      }
    }
  };

  const handleAddCustom = (name: string, monthlyPrice: number) => {
    const customId = `custom-${step.id}-${Date.now()}`;
    const newCustomOption: Option = {
      id: customId,
      name,
      pricingType: 'monthly',
      amount: monthlyPrice,
      category: step.id,
      isCustom: true,
    };

    setCustomOptionsByCategory((prev) => ({
      ...prev,
      [step.id]: [...prev[step.id], newCustomOption],
    }));

    const selection = getSelectionState(step.id);
    if (step.maxSelections === 1) {
      setSelectionState(step.id, customId);
    } else {
      const ids = (selection as string[]) || [];
      if (ids.length < step.maxSelections) {
        setSelectionState(step.id, [...ids, customId]);
      } else {
        setShowMaxMessage(true);
        setTimeout(() => setShowMaxMessage(false), 1500);
      }
    }
    setShowAddCustomModal(false);
  };

  const handleDeleteCustom = (optionId: string) => {
    setCustomOptionsByCategory((prev) => ({
      ...prev,
      [step.id]: prev[step.id].filter((opt) => opt.id !== optionId),
    }));

    const selection = getSelectionState(step.id);
    if (step.maxSelections === 1) {
      if (selection === optionId) {
        setSelectionState(step.id, null);
      }
    } else {
      const ids = (selection as string[]) || [];
      setSelectionState(step.id, ids.filter((id) => id !== optionId));
    }
  };

  const currentSelection = getSelectionState(step.id);
  const selectedCount = Array.isArray(currentSelection) ? currentSelection.length : (currentSelection ? 1 : 0);
  const canProceed = selectedCount > 0;
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  let totalMonthly = 0;
  const allSelections = [
    { id: 'home', value: homeId },
    { id: 'vehicles', value: vehicleId },
    { id: 'jewellery', value: jewelleryId },
    { id: 'services', value: serviceIds },
    { id: 'travel', value: travelIds },
    { id: 'wardrobe', value: wardrobeIds },
    { id: 'food', value: foodIds },
    { id: 'wellness', value: wellnessIds },
    { id: 'legacy', value: legacyIds },
    { id: 'safety', value: safetyIds },
  ];

  allSelections.forEach((sel) => {
    const stepConfig = steps.find((s) => s.id === sel.id);
    if (!stepConfig) return;

    const ids = Array.isArray(sel.value) ? sel.value : (sel.value ? [sel.value] : []);
    ids.forEach((id) => {
      const option = stepConfig.options.find((o) => o.id === id);
      if (option) {
        totalMonthly += computeMonthlyFromOption(option);
      }
    });

    const customOptions = customOptionsByCategory[sel.id as CategoryId] || [];
    const customIds = Array.isArray(sel.value) ? sel.value : (sel.value ? [sel.value] : []);
    customOptions.forEach((opt) => {
      if (customIds.includes(opt.id)) {
        totalMonthly += opt.amount;
      }
    });
  });

  const handleNext = () => {
    if (canProceed && !isAnimating) {
      setIsAnimating(true);
      setTransitionDirection('forward');
      setTransitionPhase('out');
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0 && !isAnimating) {
      setIsAnimating(true);
      setTransitionDirection('back');
      setTransitionPhase('out');
      setCurrentStep(currentStep - 1);
    }
  };

  const getTransitionClass = () => {
    if (transitionPhase === 'idle') return 'opacity-100 translate-y-0 translate-x-0 blur-0';
    if (transitionPhase === 'out') {
      if (transitionDirection === 'forward') {
        return 'opacity-0 translate-y-2 -translate-x-2 blur-sm';
      } else {
        return 'opacity-0 translate-y-2 translate-x-2 blur-sm';
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0 blur-0';
  };

  const displayOptions = [...step.options, ...customOptionsByCategory[step.id]];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060A0F] via-[#071827] to-[#060A0F] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-radial-gradient opacity-20" style={{
          background: 'radial-gradient(circle at center, rgba(45,212,191,0.15) 0%, transparent 70%)'
        }}></div>
      </div>

      {isFinished && <Confetti />}

      <AddCustomModal
        isOpen={showAddCustomModal}
        onClose={() => setShowAddCustomModal(false)}
        onAdd={handleAddCustom}
      />

      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#060A0F]/80 backdrop-blur-sm border-b border-[rgba(45,212,191,0.14)]">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="text-xl font-semibold text-[#2DD4BF]">LifeSpec</div>
          <button className="px-4 py-2 text-sm font-medium text-[#A8B3C7] hover:text-[#2DD4BF] transition-colors">
            Sign In
          </button>
        </div>
      </header>

      <div className="fixed top-20 left-6 z-30">
        <div className="bg-gradient-to-br from-[#0B1220] to-[#0E1A2B] backdrop-blur-md border border-[rgba(45,212,191,0.14)] rounded-2xl px-6 py-4 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#2DD4BF] to-[#F6C66A] opacity-30 rounded-t-2xl"></div>
          <div className="text-xs font-medium text-[#A8B3C7] uppercase tracking-wide">Monthly Total</div>
          <div className="text-2xl font-semibold text-[#2DD4BF] mt-1">{formatMonthly(totalMonthly)}</div>
          <div className="border-t border-[rgba(45,212,191,0.14)] my-3"></div>
          <div className="text-xs font-medium text-[#A8B3C7] uppercase tracking-wide">Yearly Total</div>
          <div className="text-xl font-semibold text-[#F6C66A] mt-1">{formatMoney(roundToNearest10(totalMonthly * 12))}/yr</div>
        </div>
      </div>

      <main className="flex-1 pt-32 pb-48 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          {isFinished ? (
            <div className={`text-center py-16 transition-all duration-300 ease-out ${getTransitionClass()}`}>
              <h1 className="text-5xl font-semibold text-[#E7EDF6] mb-4">Your LifeSpec is complete.</h1>
              <p className="text-lg text-[#A8B3C7] mb-12">Here's your personalized lifestyle summary</p>

              <div className="bg-gradient-to-br from-[#0B1220] to-[#0E1A2B] backdrop-blur-sm border border-[rgba(45,212,191,0.14)] rounded-2xl p-8 mb-12 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#2DD4BF] to-[#F6C66A] opacity-30 rounded-t-2xl"></div>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-[#E7EDF6] mb-6">Your Selections</h2>
                  <div className="space-y-4 text-left">
                    {steps.map((s) => {
                      const sel = allSelections.find((x) => x.id === s.id);
                      const ids = Array.isArray(sel?.value) ? sel.value : (sel?.value ? [sel.value] : []);
                      const customOpts = customOptionsByCategory[s.id as CategoryId] || [];
                      const allOpts = [...s.options, ...customOpts];
                      const selectedOpts = allOpts.filter((o) => ids.includes(o.id));
                      if (selectedOpts.length === 0) return null;
                      return (
                        <div key={s.id}>
                          <h3 className="font-semibold text-[#E7EDF6] mb-2">{s.heading}</h3>
                          <ul className="space-y-1 ml-4">
                            {selectedOpts.map((option) => {
                              const monthly = computeMonthlyFromOption(option);
                              return (
                                <li key={option.id} className="text-[#A8B3C7] text-sm">
                                  {option.name} {option.isCustom && <span className="text-[#2DD4BF]">(Custom)</span>} — <span className="text-[#2DD4BF]">{formatMonthly(monthly)}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-[rgba(45,212,191,0.14)] pt-8">
                  <div className="text-sm text-[#A8B3C7] mb-2">Total Monthly Cost</div>
                  <div className="text-5xl font-semibold text-[#F6C66A]">{formatMonthly(totalMonthly)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`transition-all duration-300 ease-out ${getTransitionClass()}`}>
              <div className="text-center mb-16">
                <h1 className="text-5xl font-semibold text-[#E7EDF6] mb-2">{step.heading}</h1>
                <p className="text-lg text-[#A8B3C7] mb-4">{step.subheading}</p>
                <p className="text-sm text-[rgba(231,237,246,0.65)]">Selected {selectedCount}/{step.maxSelections}</p>
                {showMaxMessage && (
                  <p className="text-sm text-[#F6C66A] mt-2">Max {step.maxSelections} selected</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button
                  onClick={() => setShowAddCustomModal(true)}
                  className="group relative text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF] rounded-2xl hover:ring-2 hover:ring-[rgba(45,212,191,0.22)] hover:ring-offset-2 hover:ring-offset-[#060A0F]"
                >
                  <div className="bg-gradient-to-br from-[#0B1220] to-[#0E1A2B] backdrop-blur-sm border border-[rgba(148,163,184,0.14)] hover:border-[rgba(45,212,191,0.22)] rounded-2xl overflow-hidden transition-all duration-300 shadow-lg h-full">
                    <div className="w-full aspect-video bg-gradient-to-br from-[#0F766E]/20 to-[#0B1220] rounded-t-2xl flex items-center justify-center border-b border-[rgba(45,212,191,0.14)]">
                      <span className="text-5xl text-[#2DD4BF]">+</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-[#E7EDF6]">Add Custom</h3>
                      <p className="text-sm text-[#A8B3C7] mt-1">Create your own option</p>
                    </div>
                  </div>
                </button>

                {displayOptions.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    isSelected={Array.isArray(currentSelection) ? currentSelection.includes(option.id) : currentSelection === option.id}
                    onClick={() => handleSelectOption(option.id)}
                    onDelete={option.isCustom ? () => handleDeleteCustom(option.id) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#060A0F]/80 backdrop-blur-sm border-t border-[rgba(45,212,191,0.14)] px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#A8B3C7]">{step.heading}</span>
            </div>
            <div className="w-full h-2 bg-[#0E1A2B] rounded-full overflow-hidden border border-[rgba(45,212,191,0.14)]">
              <div
                className="h-full bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {!isFinished && (
              <button
                onClick={handleBack}
                disabled={currentStep === 0 || isAnimating}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 border ${
                  currentStep === 0 || isAnimating
                    ? 'text-[rgba(231,237,246,0.35)] cursor-not-allowed bg-[#0E1A2B] border-[rgba(148,163,184,0.14)]'
                    : 'text-[#A8B3C7] hover:text-[#2DD4BF] hover:border-[rgba(45,212,191,0.22)] border-[rgba(148,163,184,0.14)] bg-[#0B1220]'
                }`}
              >
                ←
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed || isAnimating}
              className={`flex-1 max-w-3xl px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 border ${
                !canProceed || isAnimating
                  ? 'bg-[#0E1A2B] text-[#A8B3C7] cursor-not-allowed border-[rgba(148,163,184,0.14)]'
                  : 'bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] text-[#E7EDF6] hover:from-[#0D5F5B] hover:to-[#1BA39F] border-[rgba(45,212,191,0.22)] shadow-lg shadow-[rgba(45,212,191,0.15)]'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
