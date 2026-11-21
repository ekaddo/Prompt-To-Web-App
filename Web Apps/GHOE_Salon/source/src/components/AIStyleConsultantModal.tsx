import React, { useState } from 'react';
import { X, Sparkles, Wand2, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { AIStyleRecommendation, HairService } from '../types';
import { HAIR_SERVICES } from '../data/initialData';

interface AIStyleConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation: (
    hairService: HairService,
    needsLabels: string[],
    maniNotes: string
  ) => void;
}

export const AIStyleConsultantModal: React.FC<AIStyleConsultantModalProps> = ({
  isOpen,
  onClose,
  onApplyRecommendation
}) => {
  const [dressColor, setDressColor] = useState('Emerald Green');
  const [dressStyle, setDressStyle] = useState('Strapless Sweetheart Satin');
  const [vibe, setVibe] = useState('Vintage Glamour');
  const [hairLength, setHairLength] = useState('Long (past shoulders)');
  const [hairTexture, setHairTexture] = useState('Medium Wavy');

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIStyleRecommendation | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dressColor, dressStyle, vibe, hairLength, hairTexture })
      });
      const data = await res.json();
      if (data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error('Error contacting AI recommendation endpoint:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!recommendation) return;

    // Find best matching hair service
    const matchedService = HAIR_SERVICES.find(s =>
      recommendation.hairStyleSuggestion.toLowerCase().includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes('waves')
    ) || HAIR_SERVICES[0];

    const maniNotes = `${recommendation.suggestedManiMatch} (Matched to ${dressColor} dress)`;

    onApplyRecommendation(
      matchedService,
      recommendation.hairNeedsToSelect || [],
      maniNotes
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 text-[#0F172A] shadow-2xl space-y-5 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#004684] text-[#FDB927] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#FDB927]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-extrabold text-[#004684] uppercase">AI Aggie Style Consultant</h3>
              <p className="text-xs text-stone-600">Match your hair style & nails to your Homecoming dress</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-[#004684] hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[#004684] font-bold mb-1">Dress Color:</label>
            <input
              type="text"
              value={dressColor}
              onChange={(e) => setDressColor(e.target.value)}
              placeholder="E.g. Royal Blue, Aggie Gold, Emerald Green"
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            />
          </div>

          <div>
            <label className="block text-[#004684] font-bold mb-1">Dress Style / Neckline:</label>
            <input
              type="text"
              value={dressStyle}
              onChange={(e) => setDressStyle(e.target.value)}
              placeholder="E.g. Strapless, Halter, Backless, Corset"
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            />
          </div>

          <div>
            <label className="block text-[#004684] font-bold mb-1">Homecoming Vibe:</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            >
              <option value="Aggie Royalty Glam">Aggie Royalty Glam</option>
              <option value="Hollywood Red Carpet">Hollywood Red Carpet</option>
              <option value="Romantic & Soft Updo">Romantic & Soft Updo</option>
              <option value="Edgy Modern & Sleek">Edgy Modern & Sleek</option>
            </select>
          </div>

          <div>
            <label className="block text-[#004684] font-bold mb-1">Your Hair Length:</label>
            <select
              value={hairLength}
              onChange={(e) => setHairLength(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            >
              <option value="Short (Bob / Pixie)">Short (Bob / Pixie)</option>
              <option value="Medium (Shoulder Length)">Medium (Shoulder Length)</option>
              <option value="Long (Mid-back)">Long (Mid-back)</option>
              <option value="Extra Long / Extensions">Extra Long / Extensions</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-[#004684] text-[#FDB927] hover:bg-[#00315C] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FDB927]" />
              <span>Analyzing Dress & Aggie Vibe...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-[#FDB927]" />
              <span>Get AI Hair & Nail Recommendation</span>
            </>
          )}
        </button>

        {/* Results Card */}
        {recommendation && (
          <div className="bg-slate-50 border border-stone-200 rounded-2xl p-5 space-y-4 text-xs">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">AI Suggested Style</span>
                <h4 className="text-lg font-serif font-extrabold text-[#004684]">{recommendation.hairStyleSuggestion}</h4>
              </div>
              <span className="px-2.5 py-1 bg-[#FDB927] text-[#004684] border border-amber-300 rounded-full font-extrabold text-[11px] uppercase tracking-wide">
                Perfect Match
              </span>
            </div>

            <p className="text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
              <strong className="text-[#004684]">Why it works:</strong> {recommendation.whyItWorks}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="font-extrabold text-[#004684]">Suggested Manicure:</span>
                <p className="text-stone-700">{recommendation.suggestedManiMatch}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="font-extrabold text-[#004684]">Suggested Pedicure:</span>
                <p className="text-stone-700">{recommendation.suggestedPediMatch}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-[#004684]">
              <strong>Pro Stylist Advice:</strong> {recommendation.proStylistTip}
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3 px-4 rounded-xl bg-[#FDB927] text-[#004684] font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#004684]" />
              <span>Apply AI Style & Needs to Booking Form</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
