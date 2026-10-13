import React from 'react';
import { 
  Wind, 
  Trees, 
  Droplet, 
  Recycle, 
  MapPin, 
  Thermometer, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface WardEcoTelemetryProps {
  wardName: string;
}

interface TelemetryData {
  aqi: number;
  aqiCategory: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor';
  pm25: number;
  temperatureC: number;
  treeCanopyPercent: number;
  canopyTarget: number;
  aquiferDepthFt: number;
  aquiferStatus: 'Recharging' | 'Stable' | 'Depleting';
  segregationCompliancePercent: number;
  dailyWetTonnageTons: number;
}

export const WardEcoTelemetry: React.FC<WardEcoTelemetryProps> = ({ wardName }) => {
  // Dynamic ward-based telemetry profiles
  const getWardData = (name: string): TelemetryData => {
    if (name.includes('Delhi') || name.includes('Vasant Kunj') || name.includes('Connaught')) {
      return {
        aqi: 148,
        aqiCategory: 'Moderate',
        pm25: 54,
        temperatureC: 31,
        treeCanopyPercent: 18.2,
        canopyTarget: 33.0,
        aquiferDepthFt: 62.4,
        aquiferStatus: 'Depleting',
        segregationCompliancePercent: 64,
        dailyWetTonnageTons: 14.8
      };
    }
    // Default to Bengaluru (HSR Layout / Indiranagar)
    return {
      aqi: 68,
      aqiCategory: 'Satisfactory',
      pm25: 22,
      temperatureC: 26,
      treeCanopyPercent: 24.6,
      canopyTarget: 33.0,
      aquiferDepthFt: 38.5,
      aquiferStatus: 'Recharging',
      segregationCompliancePercent: 79,
      dailyWetTonnageTons: 11.2
    };
  };

  const data = getWardData(wardName);

  return (
    <div className="bg-[#FAF9F5] border border-[#E3DFD5] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm text-[#1A2E22]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 hairline-b pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2D5A40] text-white flex items-center justify-center">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#526357]">
              Environmental Ground Telemetry
            </div>
            <div className="text-sm font-bold text-[#143628]">
              {wardName} Micro-Climate &amp; Ecological Vital Signs
            </div>
          </div>
        </div>

        <div className="text-xs text-[#526357] flex items-center gap-2">
          <span>Ambient Temp: <strong>{data.temperatureC}°C</strong></span>
          <span>·</span>
          <span>Status: <strong className="text-[#2D5A40]">Sensor Network Synced</strong></span>
        </div>
      </div>

      {/* 4 Ecological Vitals Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Air Quality Index */}
        <div className="p-4 rounded-2xl bg-white border border-[#E1DDD3] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526357]">
            <span>Air Quality Index</span>
            <Wind className="w-3.5 h-3.5 text-[#2D5A40]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#143628] tabular-nums">
            {data.aqi} AQI
          </div>
          <div className="text-[11px] font-semibold text-[#2D5A40]">
            {data.aqiCategory} · PM2.5: {data.pm25} µg/m³
          </div>
        </div>

        {/* Metric 2: Urban Tree Canopy */}
        <div className="p-4 rounded-2xl bg-white border border-[#E1DDD3] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526357]">
            <span>Canopy Cover</span>
            <Trees className="w-3.5 h-3.5 text-[#2D5A40]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#143628] tabular-nums">
            {data.treeCanopyPercent}%
          </div>
          <div className="text-[11px] text-[#526357]">
            Target: 33% (National Forest Policy)
          </div>
        </div>

        {/* Metric 3: Shallow Aquifer Depth */}
        <div className="p-4 rounded-2xl bg-white border border-[#E1DDD3] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526357]">
            <span>Groundwater Level</span>
            <Droplet className="w-3.5 h-3.5 text-[#1C5D82]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1C5D82] tabular-nums">
            {data.aquiferDepthFt} ft
          </div>
          <div className="text-[11px] font-semibold text-[#1C5D82]">
            Trend: {data.aquiferStatus}
          </div>
        </div>

        {/* Metric 4: Municipal Segregation Compliance */}
        <div className="p-4 rounded-2xl bg-white border border-[#E1DDD3] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526357]">
            <span>Source Segregation</span>
            <Recycle className="w-3.5 h-3.5 text-[#A34B2F]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#A34B2F] tabular-nums">
            {data.segregationCompliancePercent}%
          </div>
          <div className="text-[11px] text-[#526357]">
            {data.dailyWetTonnageTons} tons wet waste daily
          </div>
        </div>

      </div>
    </div>
  );
};
