'use client';

import { useState } from 'react';

type PricingType = 'purchase' | 'monthly' | 'yearly';
type CategoryId = 'home' | 'vehicles' | 'jewellery' | 'services' | 'travel' | 'wardrobe' | 'food' | 'wellness' | 'legacy' | 'safety';

interface Option {
  id: string;
  name: string;
  pricingType: PricingType;
  amount: number;
  category: CategoryId;
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

function formatYearly(n: number): string {
  return formatMoney(n) + '/yr';
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
    return formatYearly(option.amount);
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

function Confetti() {
  const pieces = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotateZ(360deg);
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
}

function OptionCard({ option, isSelected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-2xl ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950'
          : 'hover:ring-2 hover:ring-slate-700 hover:ring-offset-2 hover:ring-offset-slate-950'
      }`}
    >
      <div
        className={`bg-slate-800/50 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${
          isSelected
            ? 'border-blue-500/50 shadow-lg shadow-blue-500/20'
            : 'border-slate-700/50 hover:border-slate-600/50 shadow-md'
        }`}
      >
        <div className="w-full aspect-video bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-t-2xl flex items-center justify-center border-b border-slate-700/30">
          <span className="text-sm font-medium text-slate-500">Image</span>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">{option.name}</h3>
          <p className="text-sm text-slate-400">{getDisplayPrice(option)}</p>
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-blue-500/5"></div>
        </div>
      )}
    </button>
  );
}

export default function LifeSpecWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showMaxMessage, setShowMaxMessage] = useState(false);

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

  const step = steps[currentStep];

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
  });

  const handleNext = () => {
    if (canProceed) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {isFinished && <Confetti />}

      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="text-xl font-semibold text-white">LifeSpec</div>
          <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </button>
        </div>
      </header>

      <div className="fixed top-20 left-6 z-30">
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-full px-6 py-4 shadow-lg">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Monthly Total
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatMonthly(totalMonthly)}
          </div>
        </div>
      </div>

      <main className="flex-1 pt-20 pb-32 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6">
          {isFinished ? (
            <div className="text-center py-16">
              <h1 className="text-5xl font-bold text-white mb-4">
                Your LifeSpec is complete.
              </h1>
              <p className="text-lg text-slate-400 mb-12">
                Here's your personalized lifestyle summary
              </p>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Your Selections</h2>
                  <div className="space-y-4 text-left">
                    {steps.map((s) => {
                      const sel = allSelections.find((x) => x.id === s.id);
                      const ids = Array.isArray(sel?.value) ? sel.value : (sel?.value ? [sel.value] : []);
                      if (ids.length === 0) return null;
                      return (
                        <div key={s.id}>
                          <h3 className="font-semibold text-slate-300 mb-2">{s.heading}</h3>
                          <ul className="space-y-1 ml-4">
                            {ids.map((id) => {
                              const option = s.options.find((o) => o.id === id);
                              if (!option) return null;
                              const monthly = computeMonthlyFromOption(option);
                              return (
                                <li key={id} className="text-slate-400 text-sm">
                                  {option.name} — {formatMonthly(monthly)}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-8">
                  <div className="text-sm text-slate-400 mb-2">Total Monthly Cost</div>
                  <div className="text-5xl font-bold text-blue-400">
                    {formatMonthly(totalMonthly)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-white mb-2">
                  {step.heading}
                </h1>
                <p className="text-lg text-slate-400 mb-4">{step.subheading}</p>
                <p className="text-sm text-slate-500">
                  Selected {selectedCount}/{step.maxSelections}
                </p>
                {showMaxMessage && (
                  <p className="text-sm text-orange-400 mt-2">
                    Max {step.maxSelections} selected
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {step.options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    isSelected={Array.isArray(currentSelection) ? currentSelection.includes(option.id) : currentSelection === option.id}
                    onClick={() => handleSelectOption(option.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                !canProceed
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
