import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ChevronRight,
  Heart,
  Scale,
  ShoppingBag,
  Zap,
  Award,
  Video,
  BatteryCharging,
  Compass,
  ArrowRight,
  Flame,
  Star,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DJI_PRODUCTS } from '../data/products';
import { formatPrice } from '../data/currency';
import { Product } from '../types';
import { HomeHeroCarousel } from './home/HomeHeroCarousel';

export const HomeView: React.FC = () => {
  const {
    navigateToPdp,
    navigateToPlp,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    setQuickViewProduct,
    currency,
    setViewMode,
    addToast
  } = useStore();

  // Drone Matcher Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizExperience, setQuizExperience] = useState<string>('beginner');
  const [quizGoal, setQuizGoal] = useState<string>('travel');
  const [matchedDrone, setMatchedDrone] = useState<Product | null>(null);

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizExperience === 'beginner' || quizGoal === 'travel') {
      setMatchedDrone(DJI_PRODUCTS.find((p) => p.id === 'prod-mini-4-pro') || DJI_PRODUCTS[2]);
    } else if (quizGoal === 'fpv') {
      setMatchedDrone(DJI_PRODUCTS.find((p) => p.id === 'prod-avata-2') || DJI_PRODUCTS[3]);
    } else if (quizExperience === 'pro' || quizGoal === 'cinema') {
      setMatchedDrone(DJI_PRODUCTS.find((p) => p.id === 'prod-mavic-4-pro') || DJI_PRODUCTS[0]);
    } else {
      setMatchedDrone(DJI_PRODUCTS.find((p) => p.id === 'prod-air-3s') || DJI_PRODUCTS[1]);
    }
  };

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast({ type: 'error', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return;
    }
    setNewsletterSubscribed(true);
    addToast({
      type: 'success',
      title: 'Welcome to Flight Club',
      message: 'You have been registered for exclusive European stock alerts & firmware updates.'
    });
  };

  // Featured Products
  const featuredProducts = DJI_PRODUCTS.filter((p) => p.isFeatured);

  return (
    <div className="w-full space-y-16 lg:space-y-24 pb-20">
      <HomeHeroCarousel />

      {/* Interactive 30-Second Drone Matcher Recommender */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900/20 via-indigo-900/15 to-purple-900/20 rounded-3xl p-6 sm:p-10 border border-blue-200/40 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> AI Drone Matcher
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                Find Your Ideal European Drone in 30 Seconds
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Answer two quick questions to get the exact model matched to your European flight license, travel weight, and creative ambitions.
              </p>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    1. What is your flight experience & license status in the EU?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setQuizExperience('beginner')}
                      className={`p-3 rounded-xl border font-semibold text-left transition-all ${
                        quizExperience === 'beginner'
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Beginner / No Exam (<span className="text-emerald-600 font-bold">&lt;249g C0</span>)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizExperience('intermediate')}
                      className={`p-3 rounded-xl border font-semibold text-left transition-all ${
                        quizExperience === 'intermediate'
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Enthusiast (EASA A1/A3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizExperience('pro')}
                      className={`p-3 rounded-xl border font-semibold text-left transition-all ${
                        quizExperience === 'pro'
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Professional Pilot (A2 / STS)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    2. What is your primary creative mission?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setQuizGoal('travel')}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        quizGoal === 'travel'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ✈️ Travel & Hiking
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizGoal('fpv')}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        quizGoal === 'fpv'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      🥽 Immersive FPV
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizGoal('cinema')}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        quizGoal === 'cinema'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      🎬 8K Pro Cinema
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizGoal('social')}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        quizGoal === 'social'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      📱 Vertical Reels
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide transition-all shadow"
                  >
                    Calculate Best Match →
                  </button>

                  {matchedDrone && (
                    <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <span className="text-xs text-emerald-800 font-bold">
                        Top Pick: {matchedDrone.modelName}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigateToPdp(matchedDrone.id)}
                        className="text-xs text-blue-600 hover:underline font-bold"
                      >
                        View Drone →
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Showcase (Merchandised Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#E30613] font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4" /> Bestsellers & New Releases
            </div>
            <h2 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
              European Flagship Lineup
            </h2>
          </div>

          <button
            onClick={() => navigateToPlp('all')}
            className="text-sm font-bold text-gray-700 hover:text-[#E30613] transition-colors flex items-center gap-1"
          >
            Explore Complete Catalog ({DJI_PRODUCTS.length} Models) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-200/80 hover:border-gray-400/80 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden relative"
            >
              {/* Badge & Quick Action Overlay */}
              <div className="p-4 pb-0 flex items-center justify-between z-10">
                {product.badgeLabel ? (
                  <span className="bg-[#E30613] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {product.badgeLabel}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {product.categoryLabel}
                  </span>
                )}

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      isInCompare(product.id)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Compare Model"
                  >
                    <Scale className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      isInWishlist(product.id)
                        ? 'bg-rose-500 text-white'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Save Item"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Visual */}
              <div
                onClick={() => navigateToPdp(product.id)}
                className="p-6 cursor-pointer flex items-center justify-center relative overflow-hidden group/img"
              >
                <img
                  src={product.images.cutout || product.images.hero}
                  alt={product.modelName}
                  className="h-44 object-contain transition-transform duration-500 group-hover/img:scale-105"
                />
              </div>

              {/* Card Meta & Combos */}
              <div className="p-5 pt-0 space-y-3">
                <div onClick={() => navigateToPdp(product.id)} className="cursor-pointer">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1D1D1F] group-hover:text-[#E30613] transition-colors leading-snug">
                    {product.modelName}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {product.tagline}
                  </p>
                </div>

                {/* Combos pill preview */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[10px]">
                  {product.variants.map((v, idx) => (
                    <span
                      key={v.id}
                      className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium whitespace-nowrap"
                    >
                      {v.comboName.split('(')[0]}
                    </span>
                  ))}
                </div>

                {/* Price & Add to Cart Button */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Starting at</span>
                    <span className="text-base font-extrabold text-[#1D1D1F]">
                      {formatPrice(product.basePriceEur, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.variants[0], 1)}
                    className="p-2.5 rounded-xl bg-[#1D1D1F] hover:bg-[#E30613] text-white transition-colors shadow-sm"
                    title="Add to Shopping Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Product Ecosystem Category Showcase (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
            Ecosystem Exploration
          </span>
          <h2 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Engineered for Every Creator & Mission
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Camera Drones */}
          <div
            onClick={() => navigateToPlp('camera-drones')}
            className="group md:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-800 text-white p-8 sm:p-12 cursor-pointer shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 max-w-md space-y-4">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                Aerial Systems
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Camera Drones
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                From ultralight &lt;249g travel models (Mavic Mini) to 8K triple-camera flagships with 46-minute stamina and EASA compliance.
              </p>
              <div className="pt-2 flex items-center text-sm font-bold text-red-400 group-hover:text-red-300">
                Explore Camera Drones <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80"
              alt="DJI Camera Drones"
              className="absolute right-0 bottom-0 w-1/2 h-full object-cover object-center opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
            />
          </div>

          {/* Bento 2: Handheld & Osmo */}
          <div
            onClick={() => navigateToPlp('handheld')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-8 cursor-pointer shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                Pocket & Action
              </span>
              <h3 className="text-2xl font-extrabold">Handheld & Osmo</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                1-Inch sensor stabilization for mobile filmmakers, vloggers, and scuba sports creators.
              </p>
            </div>

            <div className="pt-8 flex items-center text-sm font-bold text-blue-400 group-hover:text-blue-300">
              Explore Osmo Series <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento 3: Professional Cinema */}
          <div
            onClick={() => navigateToPlp('professional')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-tr from-stone-900 to-stone-800 text-white p-8 cursor-pointer shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                Hollywood Cinema
              </span>
              <h3 className="text-2xl font-extrabold">Pro Cinema & Inspire</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Full-frame 8K ProRes RAW, RTK Waypoints 3.0, and 360° pan gimbal systems.
              </p>
            </div>

            <div className="pt-8 flex items-center text-sm font-bold text-amber-400 group-hover:text-amber-300">
              Explore Cinema <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento 4: OEM Accessories & Power */}
          <div
            onClick={() => navigateToPlp('accessories')}
            className="group md:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 text-white p-8 sm:p-12 cursor-pointer shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 max-w-md space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Genuine OEM
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight">
                Batteries, Remotes & Care Plans
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Official Intelligent Flight Batteries, 700-Nit DJI RC 2 remotes, Freewell ND filter kits, and comprehensive Care Refresh replacement plans.
              </p>
              <div className="pt-2 flex items-center text-sm font-bold text-emerald-400 group-hover:text-emerald-300">
                Shop OEM Accessories <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80"
              alt="DJI Accessories"
              className="absolute right-0 bottom-0 w-1/2 h-full object-cover object-center opacity-30 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* 5. DJI Care & European Protection Promotion Layer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#111113] via-[#1a1a20] to-[#111113] text-white p-8 sm:p-12 border border-gray-800 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5" /> Official European Protection Service
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Fly with Total Peace of Mind: DJI Care Refresh
              </h2>
              <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
                Accidental water damage, collision replacements, flyaway incident coverage, and free DHL express round-trip shipping across all 27 European Union member states.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="bg-gray-900/80 p-3.5 rounded-xl border border-gray-800">
                  <span className="font-bold text-white block text-sm">🌊 Water Damage</span>
                  <span className="text-gray-400">Submerged drone replacements</span>
                </div>
                <div className="bg-gray-900/80 p-3.5 rounded-xl border border-gray-800">
                  <span className="font-bold text-white block text-sm">💨 Flyaway Coverage</span>
                  <span className="text-gray-400">Low-cost replacement if lost</span>
                </div>
                <div className="bg-gray-900/80 p-3.5 rounded-xl border border-gray-800">
                  <span className="font-bold text-white block text-sm">⚡ VIP Fast Track</span>
                  <span className="text-gray-400">Priority European factory queue</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <button
                onClick={() => navigateToPlp('accessories')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/30"
              >
                Add Care Refresh to Aircraft →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The 5 Pillars of European Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#E30613] uppercase tracking-widest block">
            Why Choose DJI Store EU
          </span>
          <h2 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Built for European Creators & Commercial Operators
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">2-Year EU Statutory Warranty</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every aircraft, gimbal, and charger is protected by full 24-month statutory European consumer warranty with factory technicians.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">24h-48h DHL Express Dispatch</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dispatched same day from our Frankfurt & Nuremberg logistics centers. Free shipping on all orders over €500.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">100% Genuine OEM Serials</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Factory-sealed European stock with genuine serial numbers eligible for official firmware updates and flight activations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">SEPA Wire & Web3 Crypto</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Direct commercial bank transfer with German IBAN or instant Web3 USDT/BTC settlement with zero foreign exchange fees.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Creator Showcase & Community Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              European Community
            </span>
            <h2 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
              Captured with DJI in Europe
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">#ShotOnDJI • 8K ProRes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="group rounded-2xl overflow-hidden bg-gray-900 text-white relative shadow-md">
            <img
              src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
              alt="Dolomites 8K Aerial"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-red-400 uppercase">Mavic 4 Pro • Dolomites, Italy</span>
              <p className="text-sm font-semibold mt-1">"The dynamic range in high-altitude sunset mist is extraordinary."</p>
              <span className="text-xs text-gray-400 mt-2">— Marco B. (Alpine Cinematographer)</span>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden bg-gray-900 text-white relative shadow-md">
            <img
              src="https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=600&q=80"
              alt="Air 3S Iceland"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-blue-400 uppercase">Air 3S • Black Sand Beach, Iceland</span>
              <p className="text-sm font-semibold mt-1">"Having dual 1-inch focal lengths changed my entire travel workflow."</p>
              <span className="text-xs text-gray-400 mt-2">— Elena V. (Travel Documentarian)</span>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden bg-gray-900 text-white relative shadow-md">
            <img
              src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80"
              alt="Mini 4 Pro Lofoten"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Mini 4 Pro • Lofoten, Norway</span>
              <p className="text-sm font-semibold mt-1">"Under 249g means I hike for 8 hours without carrying heavy cinema gear."</p>
              <span className="text-xs text-gray-400 mt-2">— Lars H. (Nordic Explorer)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. European Flight Club Newsletter Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1D1D1F] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden border border-gray-800">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
              Exclusive European Member Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Join the DJI Europe Flight Club
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Receive instant firmware release notifications, limited stock allocation radar, European airspace regulation briefings, and VIP private bundle discounts.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 font-bold text-sm animate-fadeIn">
                ✓ You are enrolled in the Flight Club! Check your inbox for your 2026 EASA Drone Flight Map.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E30613]"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-[#E30613] hover:bg-[#c20510] text-white font-bold text-sm transition-all shadow-md shrink-0"
                >
                  Join Flight Club
                </button>
              </form>
            )}

            <p className="text-[11px] text-gray-500">
              🔒 100% GDPR Compliant • Zero Spam • Unsubscribe in 1-Click Anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
