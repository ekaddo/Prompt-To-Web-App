import React from 'react';
import { Sparkles, Check, Heart, ShieldCheck, Palette, FileText } from 'lucide-react';
import { ManiAddon, PediAddon } from '../types';
import { MANICURE_ADDONS, PEDICURE_ADDONS } from '../data/initialData';

interface NailAddonSelectorProps {
  selectedMani: ManiAddon;
  setSelectedMani: (mani: ManiAddon) => void;
  selectedPedi: PediAddon;
  setSelectedPedi: (pedi: PediAddon) => void;
  nailShape: string;
  setNailShape: (shape: string) => void;
  nailColorNotes: string;
  setNailColorNotes: (notes: string) => void;
}

export const NailAddonSelector: React.FC<NailAddonSelectorProps> = ({
  selectedMani,
  setSelectedMani,
  selectedPedi,
  setSelectedPedi,
  nailShape,
  setNailShape,
  nailColorNotes,
  setNailColorNotes
}) => {
  const NAIL_SHAPES = ['Almond', 'Coffin', 'Square', 'Oval', 'Stiletto', 'Natural'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-[#0F172A]">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004684] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#004684]" />
              <span>Complete Your Aggie Homecoming Glam</span>
            </div>
            <h2 className="text-xl font-extrabold font-serif text-[#004684] uppercase">Step 3: Manicure & Pedicure Add-Ons</h2>
            <p className="text-xs text-stone-600 mt-1">
              Add matching manicures and pedicures to your 1.5-hour hair appointment. Nail services are seamlessly scheduled with your hair session.
            </p>
          </div>
        </div>
      </div>

      {/* MANICURE SECTION */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#004684] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004684]"></span>
            <span>Select Manicure Add-On</span>
          </label>
          <span className="text-xs text-stone-500 font-medium">Aggie Gold, Navy & glitter art available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MANICURE_ADDONS.map((mani) => {
            const isSelected = selectedMani.id === mani.id;
            return (
              <div
                key={mani.id}
                onClick={() => setSelectedMani(mani)}
                className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#004684] bg-blue-50/80 ring-2 ring-[#004684] shadow-xs'
                    : 'border-stone-200 hover:border-[#004684] hover:bg-slate-50'
                }`}
                id={`mani-addon-card-${mani.id}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-[#004684]">{mani.name}</h4>
                    <span className="font-bold text-xs text-[#004684] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {mani.price === 0 ? 'No Add-On' : `+$${mani.price}`}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{mani.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{mani.additionalMinutes > 0 ? `+${mani.additionalMinutes} mins` : '0 mins'}</span>
                  {isSelected && (
                    <span className="text-[#004684] font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PEDICURE SECTION */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#004684] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004684]"></span>
            <span>Select Pedicure Add-On</span>
          </label>
          <span className="text-xs text-stone-500 font-medium">Relaxing foot care before heels & dancing</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PEDICURE_ADDONS.map((pedi) => {
            const isSelected = selectedPedi.id === pedi.id;
            return (
              <div
                key={pedi.id}
                onClick={() => setSelectedPedi(pedi)}
                className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#004684] bg-blue-50/80 ring-2 ring-[#004684] shadow-xs'
                    : 'border-stone-200 hover:border-[#004684] hover:bg-slate-50'
                }`}
                id={`pedi-addon-card-${pedi.id}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-[#004684]">{pedi.name}</h4>
                    <span className="font-bold text-xs text-[#004684] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {pedi.price === 0 ? 'No Add-On' : `+$${pedi.price}`}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{pedi.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{pedi.additionalMinutes > 0 ? `+${pedi.additionalMinutes} mins` : '0 mins'}</span>
                  {isSelected && (
                    <span className="text-[#004684] font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAIL CUSTOMIZATION DETAILS */}
      {(selectedMani.price > 0 || selectedPedi.price > 0) && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#004684]" />
            <h3 className="font-extrabold text-[#004684] text-sm uppercase">Nail Shape & Aggie Dress Color Matching</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Shape Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Preferred Nail Shape:
              </label>
              <div className="flex flex-wrap gap-2">
                {NAIL_SHAPES.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setNailShape(shape)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      nailShape === shape
                        ? 'bg-[#004684] text-[#FDB927] border-[#00315C] font-extrabold'
                        : 'bg-slate-50 text-stone-700 border-stone-200 hover:bg-slate-100'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Color & Art details */}
            <div>
              <label htmlFor="nail-color-notes-input" className="block text-xs font-bold text-stone-700 mb-1.5">
                Nail Polish / Art Notes (Matching Dress):
              </label>
              <input
                id="nail-color-notes-input"
                type="text"
                value={nailColorNotes}
                onChange={(e) => setNailColorNotes(e.target.value)}
                placeholder="E.g., Aggie Gold polish with French navy tips & gold glitter..."
                className="w-full px-3 py-2 text-xs border border-stone-200 bg-slate-50 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004684] text-stone-800"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
