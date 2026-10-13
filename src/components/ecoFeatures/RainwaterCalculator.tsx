import React, { useState } from 'react';
import { 
  Droplets, 
  HelpCircle, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const RainwaterCalculator: React.FC = () => {
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(1400);
  const [rainfallMm, setRainfallMm] = useState<number>(970); // Bengaluru average
  const [runoffCoefficient, setRunoffCoefficient] = useState<number>(0.85); // Concrete terrace
  const [cityPreset, setCityPreset] = useState<string>('Bengaluru');

  const cityPresets: Record<string, number> = {
    'Bengaluru': 970,
    'New Delhi': 790,
    'Mumbai': 2400,
    'Chennai': 1400,
    'Kolkata': 1600
  };

  const handleCityChange = (city: string) => {
    setCityPreset(city);
    if (cityPresets[city]) {
      setRainfallMm(cityPresets[city]);
    }
  };

  // Formula: Volume (Liters) = Area (sq.m) × Rainfall (mm) × Runoff Coeff
  // 1 sq ft = 0.0929 sq meters
  const areaSqMeters = roofAreaSqFt * 0.092903;
  const harvestableLiters = Math.round(areaSqMeters * rainfallMm * runoffCoefficient);
  
  // 1 commercial tanker = ~5,000 Liters, typical urban cost = ₹900 - ₹1,400 per tanker
  const tankerCount = Math.round((harvestableLiters / 5000) * 10) / 10;
  const moneySavedInr = Math.round(tankerCount * 1100);
  
  // Recharge well capability (typical 3ft diameter × 15ft depth well absorbs ~20,000L/season)
  const openWellsRecharged = Math.round((harvestableLiters / 25000) * 10) / 10;
  
  // Municipal By-law mandate: in most metro cities (BBMP, DJB), plots > 1200 sq.ft must install RWH
  const isMandatoryByLaw = roofAreaSqFt >= 1200;

  return (
    <div className="bg-[#FAF9F5] border border-[#E3DFD5] rounded-3xl p-6 sm:p-8 space-y-6 text-[#1A2E22] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1C5D82]">
            Hydrological Citizen Tool
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#143628] mt-0.5">
            Rooftop Rainwater Harvesting &amp; Aquifer Simulator
          </h3>
          <p className="text-xs text-[#526357] mt-1 max-w-xl">
            Calculate how many thousands of liters of pure rainwater your terrace can filter back into unconfined shallow aquifers instead of causing street flash floods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(cityPresets).map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cityPreset === city
                  ? 'bg-[#1C5D82] text-white shadow-xs'
                  : 'bg-white border border-[#D8D2C4] text-[#4F6254] hover:bg-[#F0ECE1]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs & Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Parameter Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Slider 1: Roof Footprint Area */}
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E1DDD3]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2D3A31]">Terrace / Rooftop Area:</span>
              <span className="font-black text-[#1C5D82] text-sm tabular-nums">
                {roofAreaSqFt.toLocaleString()} sq. ft ({Math.round(areaSqMeters)} m²)
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="50"
              value={roofAreaSqFt}
              onChange={(e) => setRoofAreaSqFt(Number(e.target.value))}
              className="w-full accent-[#1C5D82] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6E7E72]">
              <span>Small Plot (600 sq.ft)</span>
              <span>Independent Home (1500 sq.ft)</span>
              <span>Apartment Block (4000+ sq.ft)</span>
            </div>
          </div>

          {/* Slider 2: Annual Rainfall */}
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E1DDD3]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2D3A31]">Annual Monsoon Rainfall ({cityPreset}):</span>
              <span className="font-black text-[#1C5D82] text-sm tabular-nums">
                {rainfallMm} mm / year
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="2800"
              step="20"
              value={rainfallMm}
              onChange={(e) => {
                setRainfallMm(Number(e.target.value));
                setCityPreset('Custom');
              }}
              className="w-full accent-[#1C5D82] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6E7E72]">
              <span>Semi-arid (500 mm)</span>
              <span>Metropolitan Average (1000 mm)</span>
              <span>High Coastal (2400+ mm)</span>
            </div>
          </div>

          {/* Surface Material Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2D3A31]">Rooftop Surface Type:</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setRunoffCoefficient(0.85)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  runoffCoefficient === 0.85 
                    ? 'bg-[#EAF3F8] border-[#1C5D82] text-[#123E5C] font-bold' 
                    : 'bg-white border-[#E1DDD3] text-[#4A5D50]'
                }`}
              >
                <div>Concrete / Tiled Terrace</div>
                <div className="text-[10px] text-[#6C7E72] font-normal">Runoff Coeff: 0.85 (Standard)</div>
              </button>
              <button
                onClick={() => setRunoffCoefficient(0.90)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  runoffCoefficient === 0.90 
                    ? 'bg-[#EAF3F8] border-[#1C5D82] text-[#123E5C] font-bold' 
                    : 'bg-white border-[#E1DDD3] text-[#4A5D50]'
                }`}
              >
                <div>Corrugated Metal / Tin Shed</div>
                <div className="text-[10px] text-[#6C7E72] font-normal">Runoff Coeff: 0.90 (High capture)</div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Hydrological Impact Cards (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#123E5C] to-[#0A263A] text-white rounded-3xl p-6 space-y-5 shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ED0F8]">
              Estimated Annual Water Harvest
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1 tabular-nums">
              {harvestableLiters.toLocaleString()} Liters
            </div>
            <div className="text-xs text-[#A8D3ED] mt-0.5">
              of clean rainwater diverted from storm gutters
            </div>
          </div>

          {/* Impact Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1C5075] text-xs">
            <div className="p-3 bg-white/10 rounded-2xl">
              <div className="text-xl font-black text-[#58D198] tabular-nums">
                {tankerCount} Trucks
              </div>
              <div className="text-[10px] text-[#C2E3F7] mt-0.5">
                5,000L Private Tankers Saved
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl">
              <div className="text-xl font-black text-[#FFD166] tabular-nums">
                ₹{moneySavedInr.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#C2E3F7] mt-0.5">
                Annual Water Bill Savings
              </div>
            </div>
          </div>

          {/* Groundwater Aquifer & Legal Compliance Pill */}
          <div className="p-3.5 bg-white/10 rounded-2xl space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#8ED0F8]">
              <ShieldCheck className="w-4 h-4 text-[#58D198]" />
              <span>Municipal Building By-Law Status:</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              {isMandatoryByLaw
                ? 'Mandatory Requirement: In municipal corporation limits, plots of 1200 sq.ft and above are legally required to maintain functional RWH structures.'
                : 'Voluntary Resilience: Plots under 1200 sq.ft can recharge shallow borewells and enjoy property tax rebates.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
