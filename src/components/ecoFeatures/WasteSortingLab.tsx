import React, { useState } from 'react';
import { 
  Recycle, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShieldCheck, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WasteItem {
  id: string;
  name: string;
  category: 'wet' | 'dry' | 'sanitary' | 'hazardous';
  description: string;
  hint: string;
  correctBin: string;
  ruleCitation: string;
}

const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'w1',
    name: 'Banana Peels & Vegetable Scraps',
    category: 'wet',
    description: 'Daily kitchen food waste with high moisture content.',
    hint: 'Contains ~80% moisture. Perfect for aerobic home composting or biomethanation.',
    correctBin: 'green',
    ruleCitation: 'SWM Rules 2016 Rule 4(1)(a): Must be segregated at source into the bio-degradable green bin.'
  },
  {
    id: 'w2',
    name: 'Rinsed & Air-Dried Milk Pouch',
    category: 'dry',
    description: 'Low-Density Polyethylene (LDPE) clean plastic pouch.',
    hint: 'Clean, residue-free plastics are 100% mechanically recyclable if dry.',
    correctBin: 'blue',
    ruleCitation: 'SWM Rules 2016 Rule 4(1)(b): Non-biodegradable recyclables must be collected dry to prevent contamination.'
  },
  {
    id: 'w3',
    name: 'Used Sanitary Diaper / Napkin',
    category: 'sanitary',
    description: 'Absorbent pad containing biological human fluids.',
    hint: 'Must be securely wrapped in newspaper or paper pouch and marked with a distinct red symbol.',
    correctBin: 'red',
    ruleCitation: 'SWM Rules 2016 Rule 4(2): Mandates wrapping in pouches provided by manufacturers or paper marked with a red cross.'
  },
  {
    id: 'w4',
    name: 'Broken Fluorescent Tube (CFL)',
    category: 'hazardous',
    description: 'Mercury-vapor lighting lamp with sharp broken glass.',
    hint: 'Contains toxic elemental mercury. Never mix with regular household recyclables or trash.',
    correctBin: 'black',
    ruleCitation: 'SWM Rules 2016 Rule 4(1)(c): Domestic hazardous waste must be handed over separately to designated municipal centers.'
  },
  {
    id: 'w5',
    name: 'Clean Cardboard Shipping Carton',
    category: 'dry',
    description: 'Flattened corrugated kraft paper box without tape residue.',
    hint: 'Valuable circular fiber that goes directly to authorized dry waste aggregators.',
    correctBin: 'blue',
    ruleCitation: 'SWM Rules 2016 Rule 4: Clean paper and cardboard must be collected in the dry waste channel.'
  },
  {
    id: 'w6',
    name: 'Expired Medicinal Blister Packets',
    category: 'hazardous',
    description: 'Unused antibiotic tablets in foil packaging.',
    hint: 'Pharmaceutical chemicals leach into groundwater if dumped in soil.',
    correctBin: 'black',
    ruleCitation: 'Domestic Hazardous Waste under SWM 2016: Requires authorized pharmacy take-back or hazardous incineration.'
  }
];

interface WasteSortingLabProps {
  onEarnPoints: (points: number) => void;
}

export const WasteSortingLab: React.FC<WasteSortingLabProps> = ({ onEarnPoints }) => {
  const [items, setItems] = useState<WasteItem[]>(WASTE_ITEMS);
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(WASTE_ITEMS[0]);
  const [feedback, setFeedback] = useState<{
    itemId: string;
    isCorrect: boolean;
    binChosen: string;
    message: string;
    citation: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const handleBinSelect = (binType: 'green' | 'blue' | 'red' | 'black') => {
    if (!selectedItem) return;

    const isCorrect = selectedItem.correctBin === binType;
    
    if (isCorrect && !completedItems.includes(selectedItem.id)) {
      setScore((prev) => prev + 1);
      setCompletedItems((prev) => [...prev, selectedItem.id]);
      onEarnPoints(15);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setFeedback({
      itemId: selectedItem.id,
      isCorrect,
      binChosen: binType,
      message: isCorrect
        ? `Correct sorting! ${selectedItem.name} belongs here.`
        : `Incorrect bin! ${selectedItem.name} cannot be processed in this stream.`,
      citation: selectedItem.ruleCitation
    });
  };

  const handleNextItem = () => {
    const uncompleted = items.filter((i) => !completedItems.includes(i.id) && i.id !== selectedItem?.id);
    if (uncompleted.length > 0) {
      setSelectedItem(uncompleted[0]);
    } else {
      const nextIndex = (items.findIndex((i) => i.id === selectedItem?.id) + 1) % items.length;
      setSelectedItem(items[nextIndex]);
    }
    setFeedback(null);
  };

  const handleReset = () => {
    setScore(0);
    setCompletedItems([]);
    setSelectedItem(items[0]);
    setFeedback(null);
  };

  return (
    <div className="bg-[#FAF9F5] border border-[#E3DFD5] rounded-3xl p-6 sm:p-8 space-y-6 text-[#1A2E22] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#2D5A40]">
            Interactive Physical Sorting Simulator
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#143628] mt-0.5">
            The 3-Way Municipal Waste Sorting Laboratory
          </h3>
          <p className="text-xs text-[#526357] mt-1 max-w-xl">
            Test your reflex on real household waste streams according to the Solid Waste Management Rules 2016. Every correct sorting saves landfill toxicity and protects sanitation workers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-[#526357] font-medium">Compliance Score</div>
            <div className="text-lg font-bold text-[#1B4332] tabular-nums">
              {score} / {items.length} Items Sorted
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#EBE7DC] hover:bg-[#E0DACB] text-[#2D5A40] transition-colors cursor-pointer"
            title="Reset Simulator"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Carousel Selection Strip */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#2D5A40]">
          Select an Item to Audit &amp; Sort:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {items.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            const isDone = completedItems.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setFeedback(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? 'bg-[#EAF2EC] border-[#2A6546] ring-1 ring-[#2A6546] text-[#143628]'
                    : isDone
                    ? 'bg-[#F2F5F2] border-[#D0DDD2] text-[#4A5D50]'
                    : 'bg-white border-[#E2DED4] text-[#2D3A31] hover:border-[#BAC7BD]'
                }`}
              >
                <div className="text-xs font-bold line-clamp-2 leading-snug">
                  {item.name}
                </div>
                <div className="text-[10px] text-[#5A6D60] mt-1 flex items-center justify-between">
                  <span>{item.category.toUpperCase()}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A6546]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Item Inspect Card */}
      {selectedItem && (
        <div className="p-5 rounded-2xl bg-white border border-[#E1DDD3] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5B32] bg-[#F7F2E8] px-2.5 py-0.5 rounded-md border border-[#E8DFC8]">
                Inspecting Item: {selectedItem.name}
              </span>
              <p className="text-xs text-[#4E5E53] mt-2 leading-relaxed">
                {selectedItem.description}
              </p>
              <div className="text-xs text-[#2A6546] font-semibold mt-1">
                💡 Scientific Hint: {selectedItem.hint}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Physical Municipal Waste Bins */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#2D5A40] text-center sm:text-left">
          Tap the Authorized Municipal Bin to Deposit:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Bin 1: Wet Waste (Green) */}
          <button
            onClick={() => handleBinSelect('green')}
            className="group p-5 rounded-2xl bg-[#EAF5EE] border-2 border-[#76B88F] hover:border-[#1E6B3E] hover:bg-[#DDF0E3] transition-all cursor-pointer text-left space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#2D7349] text-white flex items-center justify-center font-black text-sm">
                W
              </span>
              <span className="text-[11px] font-bold text-[#1E5634] uppercase tracking-wide">
                Green Bin
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#143B23]">Wet Organics</h4>
              <p className="text-xs text-[#396347] mt-1 leading-relaxed">
                Kitchen peels, tea leaves, leftover cooked food. Handed over daily for aerobic composting or biomethanation.
              </p>
            </div>
          </button>

          {/* Bin 2: Dry Recyclables (Blue) */}
          <button
            onClick={() => handleBinSelect('blue')}
            className="group p-5 rounded-2xl bg-[#E9F3F9] border-2 border-[#7DB3D6] hover:border-[#1B5F8C] hover:bg-[#DCEDF7] transition-all cursor-pointer text-left space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#1E6796] text-white flex items-center justify-center font-black text-sm">
                D
              </span>
              <span className="text-[11px] font-bold text-[#175279] uppercase tracking-wide">
                Blue Bin
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#123E5C]">Dry Recyclables</h4>
              <p className="text-xs text-[#2A5E82] mt-1 leading-relaxed">
                Clean and rinsed plastics, milk bags, newspapers, metal cans, glass. Handed over to Dry Waste Centers (DWCC).
              </p>
            </div>
          </button>

          {/* Bin 3: Wrapped Sanitary Waste (Red 'X') */}
          <button
            onClick={() => handleBinSelect('red')}
            className="group p-5 rounded-2xl bg-[#FDF0EE] border-2 border-[#E39D90] hover:border-[#A83724] hover:bg-[#FAE5E2] transition-all cursor-pointer text-left space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#BD3A24] text-white flex items-center justify-center font-black text-sm">
                ✕
              </span>
              <span className="text-[11px] font-bold text-[#8F2815] uppercase tracking-wide">
                Red Cross Wrap
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#6B1E10]">Sanitary Biohazard</h4>
              <p className="text-xs text-[#8F3B2C] mt-1 leading-relaxed">
                Diapers, pads, bandages. Must be wrapped in paper with a distinct red symbol to protect sanitation workers.
              </p>
            </div>
          </button>

          {/* Bin 4: Domestic Hazardous (Black) */}
          <button
            onClick={() => handleBinSelect('black')}
            className="group p-5 rounded-2xl bg-[#F2F1EE] border-2 border-[#A8A398] hover:border-[#3D3A35] hover:bg-[#EAE8E3] transition-all cursor-pointer text-left space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#3D3A35] text-white flex items-center justify-center font-black text-sm">
                H
              </span>
              <span className="text-[11px] font-bold text-[#3D3A35] uppercase tracking-wide">
                Hazardous / E-Waste
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#23211E]">Domestic Toxic Waste</h4>
              <p className="text-xs text-[#59554E] mt-1 leading-relaxed">
                CFLs, tube lights, batteries, expired medicines, paint cans. Handed over separately for safe municipal incineration.
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Dynamic Feedback Callout */}
      {feedback && (
        <div className={`p-4 rounded-2xl border ${
          feedback.isCorrect 
            ? 'bg-[#EAF5EE] border-[#74BA8E] text-[#143B23]' 
            : 'bg-[#FDF0EE] border-[#E59F92] text-[#6B1E10]'
        } space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#2D7349]" />
              ) : (
                <XCircle className="w-5 h-5 text-[#BD3A24]" />
              )}
              <span>{feedback.message}</span>
            </div>
            {feedback.isCorrect && (
              <span className="text-xs font-bold text-[#2D7349] bg-white px-2.5 py-1 rounded-lg border border-[#B4DEC2]">
                +15 Eco-Points Awarded
              </span>
            )}
          </div>
          
          <div className="text-xs leading-relaxed opacity-90 pl-7">
            <strong>Statutory Rule Reference:</strong> {feedback.citation}
          </div>

          <div className="pt-2 pl-7">
            <button
              onClick={handleNextItem}
              className="px-4 py-2 bg-[#1B4332] hover:bg-[#143628] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Audit Next Household Item →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
