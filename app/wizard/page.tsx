'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LegacyIcon, SafetyIcon } from '@/app/components/icons/LifeSpecIcons';
import { TotalsCard } from '@/app/components/TotalsCard';
import { TotalsMobileBar } from '@/app/components/TotalsMobileBar';
import { supabase } from '@/lib/supabaseClient';
import { saveBlueprint, PENDING_BLUEPRINT_KEY } from '@/lib/blueprintService';
import { BlueprintPayload } from '@/lib/blueprintTypes';

type PricingType = 'purchase' | 'monthly' | 'yearly';
type CategoryId = 'home' | 'vehicles' | 'jewellery' | 'services' | 'travel' | 'wardrobe' | 'food' | 'wellness' | 'legacy' | 'safety' | 'toys';
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
    if (option.category === 'toys') {
      return roundToNearest10(option.amount * 0.01 + 100);
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
      { id: 'v15', name: 'Toyota Camry', pricingType: 'purchase', amount: 35000, category: 'vehicles' },
      { id: 'v16', name: 'Tesla Model 3', pricingType: 'purchase', amount: 55000, category: 'vehicles' },
      { id: 'v17', name: 'Bentley Continental GT', pricingType: 'purchase', amount: 230000, category: 'vehicles' },
      { id: 'v18', name: 'Cadillac Escalade', pricingType: 'purchase', amount: 85000, category: 'vehicles' },
      { id: 'v19', name: 'Mercedes Benz CLE 53 AMG', pricingType: 'purchase', amount: 95000, category: 'vehicles' },
      { id: 'v20', name: 'Toyota Supra', pricingType: 'purchase', amount: 55000, category: 'vehicles' },
      { id: 'v21', name: 'BMW M340i', pricingType: 'purchase', amount: 60000, category: 'vehicles' },
      { id: 'v22', name: 'Toyota Land Cruiser', pricingType: 'purchase', amount: 90000, category: 'vehicles' },
      { id: 'v23', name: 'Lexus LC500', pricingType: 'purchase', amount: 100000, category: 'vehicles' },
      { id: 'v24', name: 'Lexus IS350', pricingType: 'purchase', amount: 50000, category: 'vehicles' },
    ],
  },
  {
    id: 'toys',
    heading: 'Toys & Recreation',
    subheading: 'What toys would you like to play with?',
    maxSelections: 999,
    options: [
      { id: 'toy1', name: 'Jetski', pricingType: 'purchase', amount: 15000, category: 'toys' },
      { id: 'toy2', name: 'ATV', pricingType: 'purchase', amount: 12000, category: 'toys' },
      { id: 'toy3', name: 'Surf Set', pricingType: 'purchase', amount: 3000, category: 'toys' },
      { id: 'toy4', name: 'Speedboat', pricingType: 'purchase', amount: 50000, category: 'toys' },
      { id: 'toy5', name: 'Yacht', pricingType: 'purchase', amount: 500000, category: 'toys' },
      { id: 'toy6', name: 'Indoor Golf Simulator', pricingType: 'purchase', amount: 25000, category: 'toys' },
      { id: 'toy7', name: 'Sim Racing Setup', pricingType: 'purchase', amount: 8000, category: 'toys' },
      { id: 'toy8', name: 'Dirt Bike', pricingType: 'purchase', amount: 8000, category: 'toys' },
      { id: 'toy9', name: 'Helicopter', pricingType: 'purchase', amount: 2000000, category: 'toys' },
      { id: 'toy10', name: 'Cold Plunge Tub', pricingType: 'purchase', amount: 5000, category: 'toys' },
      { id: 'toy11', name: 'Hot Tub', pricingType: 'purchase', amount: 8000, category: 'toys' },
      { id: 'toy12', name: 'Premium Mountain Bike', pricingType: 'purchase', amount: 5000, category: 'toys' },
      { id: 'toy13', name: 'Electric Scooter', pricingType: 'purchase', amount: 1500, category: 'toys' },
      { id: 'toy14', name: 'Premium Electric Bike', pricingType: 'purchase', amount: 4000, category: 'toys' },
      { id: 'toy15', name: 'Kayak', pricingType: 'purchase', amount: 2000, category: 'toys' },
    ],
  },
  {
    id: 'jewellery',
    heading: 'Jewellery',
    subheading: 'What are you wearing on your wrist?',
    maxSelections: 999,
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
    maxSelections: 999,
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
    maxSelections: 999,
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
    maxSelections: 999,
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
    maxSelections: 999,
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
    maxSelections: 999,
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
    maxSelections: 999,
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
    maxSelections: 999,
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

const confettiColors = ['#D4AF37', '#C8A24D', '#B89B5E', '#E6E6E6', '#9AA0A6', '#D4AF37'];

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
  'v7': '/cars/dsc09285.webp',
  'v8': '/cars/phantom.jpg',
  'v9': '/cars/superfast812.webp',
  'v10': '/cars/svj.jpg',
  'v11': '/cars/079-bentley-bentayga-speed.webp',
  'v12': '/cars/0P1A0922-3_1.jpg',
  'v13': '/cars/c63amg.avif',
  'v14': '/cars/rs7.jpg',
  'v15': '/cars/toyotacamry.jpg',
  'v16': '/cars/model3.webp',
  'v17': '/cars/bentleygt.jpg',
  'v18': '/cars/escalade.avif',
  'v19': '/cars/cle53.webp',
  'v20': '/cars/toyotasupra.jpg',
  'v21': '/cars/m340i.jpg',
  'v22': '/cars/landcruiser.avif',
  'v23': '/cars/lc500.avif',
  'v24': '/cars/is350.jpg',
  'toy1': '/Toys/jetski.jpg',
  'toy2': '/Toys/atv.jpg',
  'toy3': '/Toys/surfset.webp',
  'toy4': '/Toys/speedboat.jpeg',
  'toy5': '/Toys/yacht.avif',
  'toy6': '/Toys/indoorgolf.jpg',
  'toy7': '/Toys/simracing.jpg',
  'toy8': '/Toys/dirtbike.webp',
  'toy9': '/Toys/helicopter.jpg',
  'toy10': '/Toys/coldplunge.jpeg',
  'toy11': '/Toys/hottub.jpeg',
  'toy12': '/Toys/premiummountainbike.jpeg',
  'toy13': '/Toys/electricscooter.jpg',
  'toy14': '/Toys/premiumebike.jpg',
  'toy15': '/Toys/kayak.webp',
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
  'f1': '/Food/basicgroceries.webp',
  'f2': '/Food/organicgroceries.jpg',
  'f3': '/Food/weeklymealprep.webp',
  'f4': '/Food/casualdining.jpg',
  'f5': '/Food/upscale.png',
  'f6': '/Food/michelin.webp',
  'f7': '/Food/privatechef.jpg',
  'f8': '/Food/luxuryfood.webp',
  'f9': '/Food/specialtycoffee.webp',
  'f10': '/Food/wineandine.jpg',
  'hw1': '/healthandwellness/gymmembership.webp',
  'hw2': '/healthandwellness/stairmaster.avif',
  'hw3': '/healthandwellness/pilates.jpg',
};

interface ResultsScreenProps {
  totalMonthly: number;
  steps: StepConfig[];
  allSelections: Array<{ id: CategoryId; value: string | string[] | null }>;
  customOptionsByCategory: Record<CategoryId, Option[]>;
}

function ResultsScreen({ totalMonthly, steps, allSelections, customOptionsByCategory }: ResultsScreenProps) {
  const router = useRouter();
  const [showAffordability, setShowAffordability] = useState(false);
  const [netMonthlyInput, setNetMonthlyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const requiredGrossMonthly = totalMonthly / 0.45;
  const requiredGrossYearly = requiredGrossMonthly * 12;

  const netMonthly = netMonthlyInput ? parseFloat(netMonthlyInput) : 0;
  const grossMonthly = netMonthly > 0 ? netMonthly / 0.75 : 0;
  const spendableMonthly = grossMonthly * 0.70;
  const progressPct = netMonthly > 0 ? Math.min((spendableMonthly / totalMonthly) * 100, 100) : 0;

  // These functions are not used in the simplified version

  const handleSaveBlueprint = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const requiredGrossMonthly = totalMonthly / 0.45;
      const requiredGrossYearly = requiredGrossMonthly * 12;

      const payload: BlueprintPayload = {
        totalMonthly,
        totalYearly: Math.round(totalMonthly * 12 / 10) * 10,
        requiredGrossYearly: Math.round(requiredGrossYearly),
        timestamp: new Date().toISOString(),
      };

      if (user) {
        const result = await saveBlueprint(payload);
        if (result.success) {
          alert('Blueprint saved successfully!');
        } else {
          // Extract user-friendly error message
          const errorMsg = result.error?.message || result.reason || 'Unknown error';
          const errorCode = result.error?.code ? ` (${result.error.code})` : '';
          const errorHint = result.error?.hint ? `\n\nTip: ${result.error.hint}` : '';
          
          console.error('[handleSaveBlueprint] Save failed:', {
            reason: result.reason,
            error: result.error,
          });
          
          alert(`Failed to save blueprint: ${errorMsg}${errorCode}${errorHint}`);
        }
      } else {
        // Store in localStorage for later retrieval
        localStorage.setItem(PENDING_BLUEPRINT_KEY, JSON.stringify({
          blueprint_json: payload,
          name: 'My Blueprint'
        }));
        alert('Blueprint saved temporarily. Please sign up to save permanently.');
        router.push('/signup?next=/blueprints');
      }
    } catch (error) {
      console.error('[handleSaveBlueprint] Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Failed to save blueprint: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`py-8 sm:py-16 transition-all duration-300 ease-out opacity-100 translate-y-0 relative`}>
      {/* Graffiti Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 text-6xl sm:text-8xl opacity-5 font-black" style={{ color: 'var(--white)', transform: 'rotate(-15deg)' }}>✓</div>
        <div className="absolute bottom-20 left-5 text-5xl sm:text-7xl opacity-5 font-black" style={{ color: 'var(--white)', transform: 'rotate(25deg)' }}>★</div>
        <div className="absolute top-1/3 left-1/4 text-4xl opacity-5" style={{ color: 'var(--white)' }}>→</div>
        <div className="absolute bottom-1/3 right-1/4 text-6xl opacity-5 font-bold" style={{ color: 'var(--white)' }}>!</div>
      </div>

      {/* Top Row: Title + Button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 sm:mb-12 gap-4 sm:gap-0 relative z-10">
        <div>
          <h1 className="text-3xl sm:text-5xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>LifeSpec Blueprint</h1>
          <p className="text-sm sm:text-lg" style={{ color: 'var(--text-secondary)' }}>Your lifestyle cost breakdown</p>
        </div>
        <button
          onClick={() => setShowAffordability(!showAffordability)}
          className="group relative px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 rounded-xl overflow-hidden whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(200, 162, 77, 0.05) 100%)`,
            border: '1.5px solid',
            borderColor: 'var(--white)',
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          }} />
          <div className="relative flex items-center gap-2 transition-colors duration-300" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            How far am I?
          </div>
        </button>
      </div>

      {/* Affordability Dropdown */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out mb-8 sm:mb-12"
        style={{
          maxHeight: showAffordability ? '400px' : '0px',
          opacity: showAffordability ? 1 : 0,
        }}
      >
        <div className="backdrop-blur-sm border rounded-2xl p-4 sm:p-6 mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Monthly income (after tax)</label>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={netMonthlyInput}
              onChange={(e) => setNetMonthlyInput(e.target.value)}
              className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>We'll estimate savings based on 30% of gross income.</p>
          </div>

          {netMonthly > 0 && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Progress</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--white)' }}>{Math.round(progressPct)}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: `linear-gradient(to right, var(--white), var(--white))`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated spendable per month:</span>
                  <span className="font-semibold" style={{ color: 'var(--white)' }}>{formatMonthly(Math.round(spendableMonthly))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Goal lifestyle cost:</span>
                  <span className="font-semibold" style={{ color: 'var(--white)' }}>{formatMonthly(totalMonthly)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* Left: Blueprint Numbers */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>Blueprint Numbers</h2>

          <div className="mb-8 sm:mb-12">
            <div className="text-4xl sm:text-6xl font-bold" style={{ color: 'var(--white)' }}>{formatMonthly(totalMonthly)}</div>
            <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Monthly Lifestyle Cost</p>
          </div>

          {/* Stat Tiles */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="backdrop-blur-sm border rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Yearly Lifestyle Cost</p>
              <p className="text-lg sm:text-2xl font-semibold" style={{ color: 'var(--white)' }}>{formatMoney(roundToNearest10(totalMonthly * 12))}</p>
            </div>

            <div className="backdrop-blur-sm border rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Required Gross Income (Yearly)</p>
              <p className="text-lg sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{formatMoney(Math.round(requiredGrossYearly))}</p>
            </div>

            <div className="backdrop-blur-sm border rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Assumptions</p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>25% tax + 30% savings</p>
            </div>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>These are estimates, not financial advice.</p>
        </div>

        {/* Right: Your Selections */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>Your Selections</h2>

          <div className="space-y-4 sm:space-y-6">
            {steps.map((s) => {
              const sel = allSelections.find((x) => x.id === s.id);
              const ids = Array.isArray(sel?.value) ? sel.value : (sel?.value ? [sel.value] : []);
              const customOpts = customOptionsByCategory[s.id as CategoryId] || [];
              const allOpts = [...s.options, ...customOpts];
              const selectedOpts = allOpts.filter((o) => ids.includes(o.id));
              if (selectedOpts.length === 0) return null;

              return (
                <div key={s.id}>
                  <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>{s.heading}</h3>
                  <div className="space-y-2 pl-3 sm:pl-4 border-l" style={{ borderColor: 'var(--border-color)' }}>
                    {selectedOpts.map((option) => {
                      const monthly = computeMonthlyFromOption(option);
                      return (
                        <div key={option.id} className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                            {option.name}
                            {option.isCustom && <span className="ml-2" style={{ color: 'var(--white)' }}>(Custom)</span>}
                          </span>
                          <span className="text-xs sm:text-sm font-medium whitespace-nowrap" style={{ color: 'var(--white)' }}>+{formatMonthly(monthly)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Blueprint Button - Bottom Left */}
      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={handleSaveBlueprint}
          disabled={isSaving}
          className="group relative px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--white)',
            color: 'var(--bg-primary)',
            opacity: isSaving ? 0.7 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isSaving ? 'Saving...' : 'Save blueprint'}
        </button>
      </div>

    </div>
  );
}

function OptionCard({ option, isSelected, onClick, onDelete }: OptionCardProps) {
  const imageSrc = imageMap[option.id];
  
  // Determine if this option should use an icon instead of an image
  const useIcon = option.category === 'legacy' || option.category === 'safety';
  
  const renderIcon = () => {
    if (option.category === 'legacy') {
      return (
        <LegacyIcon className={`w-12 h-12 transition-colors duration-200 ${
          isSelected ? 'text-[var(--white)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--white)]'
        }`} />
      );
    }
    if (option.category === 'safety') {
      return (
        <SafetyIcon className={`w-12 h-12 transition-colors duration-200 ${
          isSelected ? 'text-[var(--white)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--white)]'
        }`} />
      );
    }
    return null;
  };

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-[var(--white)]'
          : 'ring-1 ring-transparent hover:ring-[rgba(212,175,55,0.3)]'
      }`}
    >
      <div
        className={`backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-200 ${
          isSelected ? 'shadow-lg' : 'shadow-md'
        }`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: isSelected ? '0 10px 25px rgba(255, 255, 255, 0.2)' : undefined,
        }}
      >
        <div className="w-full aspect-video flex items-center justify-center border-b overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--border-color)' }}>
          {useIcon ? (
            renderIcon()
          ) : imageSrc ? (
            <img src={imageSrc} alt={option.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)', opacity: 0.65 }}>Image</span>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-base sm:text-lg font-semibold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{option.name}</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-xs sm:text-sm transition-colors duration-200 ${isSelected ? 'font-semibold' : ''}`} style={{ color: isSelected ? 'var(--white)' : 'var(--text-secondary)' }}>
              {getDisplayPrice(option)}
            </p>
            {option.isCustom && (
              <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: 'var(--white)', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                Custom
              </span>
            )}
          </div>
        </div>
      </div>

      {option.isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 transition-colors backdrop-blur-sm p-1.5 rounded-lg z-10"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'rgba(14, 15, 17, 0.8)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--white)';
            e.currentTarget.style.backgroundColor = 'rgba(14, 15, 17, 0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'rgba(14, 15, 17, 0.8)';
          }}
        >
          ✕
        </button>
      )}
    </button>
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
          className="border rounded-2xl p-4 sm:p-8 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>Add Custom Item</h2>

          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Personal Masseuse"
              className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            {nameError && <p className="text-xs sm:text-sm mt-2" style={{ color: '#ff6b6b' }}>{nameError}</p>}
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Monthly Price ($)</label>
            <input
              type="number"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 2500"
              min="0"
              max="1000000"
              className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            {priceError && <p className="text-xs sm:text-sm mt-2" style={{ color: '#ff6b6b' }}>{priceError}</p>}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-xs sm:text-sm transition-all font-medium"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--white)';
                e.currentTarget.style.borderColor = 'var(--white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm transition-all font-medium shadow-lg"
              style={{
                backgroundColor: 'var(--white)',
                color: 'var(--bg-primary)',
                boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)',
              }}
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
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customOptionsByCategory, setCustomOptionsByCategory] = useState<Record<CategoryId, Option[]>>({
    home: [], vehicles: [], jewellery: [], services: [], travel: [], wardrobe: [], food: [], wellness: [], legacy: [], safety: [], toys: [],
  });

  const [homeIds, setHomeIds] = useState<string[]>([]);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [jewelleryIds, setJewelleryIds] = useState<string[]>([]);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [travelIds, setTravelIds] = useState<string[]>([]);
  const [wardrobeIds, setWardrobeIds] = useState<string[]>([]);
  const [foodIds, setFoodIds] = useState<string[]>([]);
  const [wellnessIds, setWellnessIds] = useState<string[]>([]);
  const [legacyIds, setLegacyIds] = useState<string[]>([]);
  const [safetyIds, setSafetyIds] = useState<string[]>([]);
  const [toysIds, setToysIds] = useState<string[]>([]);

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

  const getSelectionState = (categoryId: CategoryId): string[] => {
    switch (categoryId) {
      case 'home': return homeIds;
      case 'vehicles': return vehicleIds;
      case 'jewellery': return jewelleryIds;
      case 'services': return serviceIds;
      case 'travel': return travelIds;
      case 'wardrobe': return wardrobeIds;
      case 'food': return foodIds;
      case 'wellness': return wellnessIds;
      case 'legacy': return legacyIds;
      case 'safety': return safetyIds;
      case 'toys': return toysIds;
      default: return [];
    }
  };

  const setSelectionState = (categoryId: CategoryId, value: string[]) => {
    switch (categoryId) {
      case 'home': setHomeIds(value); break;
      case 'vehicles': setVehicleIds(value); break;
      case 'jewellery': setJewelleryIds(value); break;
      case 'services': setServiceIds(value); break;
      case 'travel': setTravelIds(value); break;
      case 'wardrobe': setWardrobeIds(value); break;
      case 'food': setFoodIds(value); break;
      case 'wellness': setWellnessIds(value); break;
      case 'legacy': setLegacyIds(value); break;
      case 'safety': setSafetyIds(value); break;
      case 'toys': setToysIds(value); break;
    }
  };

  const handleSelectOption = (optionId: string) => {
    const ids = getSelectionState(step.id);
    if (ids.includes(optionId)) {
      setSelectionState(step.id, ids.filter((id) => id !== optionId));
    } else {
      setSelectionState(step.id, [...ids, optionId]);
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

    const ids = getSelectionState(step.id);
    setSelectionState(step.id, [...ids, customId]);
    setShowAddCustomModal(false);
  };

  const handleDeleteCustom = (optionId: string) => {
    setCustomOptionsByCategory((prev) => ({
      ...prev,
      [step.id]: prev[step.id].filter((opt) => opt.id !== optionId),
    }));

    const ids = getSelectionState(step.id);
    setSelectionState(step.id, ids.filter((id) => id !== optionId));
  };

  const currentSelection = getSelectionState(step.id);
  const selectedCount = Array.isArray(currentSelection) ? currentSelection.length : (currentSelection ? 1 : 0);
  const canProceed = selectedCount > 0;
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  let totalMonthly = 0;
  const allSelections = [
    { id: 'home', value: homeIds },
    { id: 'vehicles', value: vehicleIds },
    { id: 'toys', value: toysIds },
    { id: 'jewellery', value: jewelleryIds },
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

    const ids = sel.value || [];
    ids.forEach((id) => {
      const option = stepConfig.options.find((o) => o.id === id);
      if (option) {
        totalMonthly += computeMonthlyFromOption(option);
      }
    });

    const customOptions = customOptionsByCategory[sel.id as CategoryId] || [];
    customOptions.forEach((opt) => {
      if (ids.includes(opt.id)) {
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
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-radial-gradient opacity-20" style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
        }}></div>
      </div>

      {isFinished && <Confetti />}

      <AddCustomModal
        isOpen={showAddCustomModal}
        onClose={() => setShowAddCustomModal(false)}
        onAdd={handleAddCustom}
      />

      {!isFinished && (
        <>
          {/* Premium Totals Components */}
          <TotalsCard
            totalMonthly={totalMonthly}
            totalYearly={roundToNearest10(totalMonthly * 12)}
          />
          <TotalsMobileBar
            totalMonthly={totalMonthly}
            totalYearly={roundToNearest10(totalMonthly * 12)}
          />
        </>
      )}

      <main className="flex-1 pt-24 sm:pt-32 pb-48 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {isFinished ? (
            <ResultsScreen
              totalMonthly={totalMonthly}
              steps={steps}
              allSelections={allSelections as Array<{ id: CategoryId; value: string | string[] | null }>}
              customOptionsByCategory={customOptionsByCategory}
            />
          ) : (
            <div className={`transition-all duration-300 ease-out ${getTransitionClass()}`}>
              <div className="text-center mb-8 sm:mb-16">
                <h1 className="text-3xl sm:text-5xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{step.heading}</h1>
                <p className="text-sm sm:text-lg" style={{ color: 'var(--text-secondary)' }}>{step.subheading}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                <button
                  onClick={() => setShowAddCustomModal(true)}
                  className="group relative text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-2xl hover:ring-2 hover:ring-offset-2"
                >
                  <div className="backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg h-full" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="w-full aspect-video rounded-t-2xl flex items-center justify-center border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--border-color)' }}>
                      <span className="text-5xl" style={{ color: 'var(--white)' }}>+</span>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Add Custom</h3>
                      <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Create your own option</p>
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

      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-sm border-t px-4 sm:px-6 py-4 sm:py-6" style={{ backgroundColor: 'rgba(14, 15, 17, 0.8)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{step.heading}</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(to right, var(--white), var(--white))`,
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || isAnimating}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--white)';
                e.currentTarget.style.borderColor = 'var(--white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || isAnimating}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              style={{
                backgroundColor: 'var(--white)',
                color: 'var(--bg-primary)',
                boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)',
              }}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 md:py-16 px-8 md:px-12 text-center border-t mt-auto" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <p className="text-xs md:text-sm max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          Disclaimer: LifeSpec provides illustrative estimates for entertainment and inspiration purposes only. All costs and projections are approximations and should not be used as financial, legal, or investment advice.
        </p>
      </footer>
    </div>
  );
}
