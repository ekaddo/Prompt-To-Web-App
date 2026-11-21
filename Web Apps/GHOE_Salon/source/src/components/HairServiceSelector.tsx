import React from 'react';
import { Scissors, Check, Sparkles, HelpCircle, AlertCircle, FileText, Camera } from 'lucide-react';
import { HairService, SpecificHairNeed } from '../types';
import { HAIR_SERVICES, SPECIFIC_HAIR_NEEDS } from '../data/initialData';

interface HairServiceSelectorProps {
  selectedService: HairService;
  setSelectedService: (service: HairService) => void;
  selectedHairNeeds: string[];
  setSelectedHairNeeds: (needs: string[]) => void;
  customHairDetails: string;
  setCustomHairDetails: (details: string) => void;
  hairInspirationUrl: string;
  setHairInspirationUrl: (url: string) => void;
}

export const HairServiceSelector: React.FC<HairServiceSelectorProps> = ({
  selectedService,
  setSelectedService,
  selectedHairNeeds,
  setSelectedHairNeeds,
  customHairDetails,
  setCustomHairDetails,
  hairInspirationUrl,
  setHairInspirationUrl
}) => {
  const toggleNeed = (needLabel: string) => {
    if (selectedHairNeeds.includes(needLabel)) {
      setSelectedHairNeeds(selectedHairNeeds.filter(n => n !== needLabel));
    } else {
      setSelectedHairNeeds([...selectedHairNeeds, needLabel]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-[#0F172A]">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004684] text-xs font-bold mb-2">
              <Scissors className="w-3.5 h-3.5 text-[#004684]" />
              <span>Base Duration: 1.5 Hours (${selectedService.basePrice})</span>
            </div>
            <h2 className="text-xl font-extrabold font-serif text-[#004684] uppercase">Step 2: Choose Hair Style & Specify Your Hair Needs</h2>
            <p className="text-xs text-stone-600 mt-1">
              Select your primary homecoming look and check off any specific hair service techniques or custom requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Hair Styles Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider flex items-center justify-between">
          <span>Primary Homecoming Hair Styles (1.5 Hours)</span>
          <span className="text-stone-500 font-normal normal-case">Includes full prep & setting spray</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HAIR_SERVICES.map((service) => {
            const isSelected = selectedService.id === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#004684] bg-blue-50/60 ring-2 ring-[#004684] shadow-sm'
                    : 'border-stone-200 bg-white hover:border-[#004684] hover:shadow-2xs'
                }`}
                id={`hair-style-card-${service.id}`}
              >
                {/* Image & Badge */}
                <div className="relative h-36 bg-stone-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00315C]/80 via-transparent to-transparent" />
                  
                  {service.popularForHomecoming && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#FDB927] text-[#004684] text-[10px] font-extrabold uppercase tracking-wide shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#004684]" /> Aggie Favorite
                    </span>
                  )}

                  <span className="absolute bottom-2 right-2.5 px-2.5 py-0.5 rounded-md bg-[#004684] text-[#FDB927] text-xs font-extrabold border border-blue-900">
                    ${service.basePrice}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-extrabold text-sm ${isSelected ? 'text-[#004684]' : 'text-stone-800'}`}>
                        {service.name}
                      </h3>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#004684] text-[#FDB927] flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span>1.5 Hours Slot</span>
                    <span className={isSelected ? 'text-[#004684] font-bold' : 'text-stone-500'}>
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specific Hair Services & Needs Checklist (Explicit User Requirement!) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-[#004684] text-sm uppercase flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[#004684]" />
            <span>Specific Hair Services & Technique Needs</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Check any specific techniques, extensions, or accessories your stylist should prepare for during your 1.5-hour booking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {SPECIFIC_HAIR_NEEDS.map((need) => {
            const isChecked = selectedHairNeeds.includes(need.label);
            return (
              <label
                key={need.id}
                className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-150 flex items-center gap-2.5 select-none ${
                  isChecked
                    ? 'border-[#004684] bg-blue-50/80 text-[#004684] font-bold shadow-2xs'
                    : 'border-stone-200 hover:border-[#004684] text-stone-700 bg-slate-50/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleNeed(need.label)}
                  className="w-4 h-4 rounded accent-[#004684] border-stone-300 cursor-pointer"
                />
                <span className="leading-snug">{need.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Custom Hair Needs & Inspiration Details Field */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div>
          <label htmlFor="custom-hair-details-textarea" className="block text-xs font-bold text-[#004684] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#004684]" />
            <span>What type of hair services do you need? (Custom Hair Details)</span>
          </label>
          <p className="text-xs text-stone-500 mt-1">
            Describe your hair texture, current length, extension details, desired volume, or specific inspiration notes for your stylist.
          </p>
        </div>

        <textarea
          id="custom-hair-details-textarea"
          rows={3}
          value={customHairDetails}
          onChange={(e) => setCustomHairDetails(e.target.value)}
          placeholder="E.g., I have waist-length thick 4c hair, bringing 22-inch clip-in extensions. I want voluminous Hollywood waves brushed out soft with a deep side part and extra holding spray..."
          className="w-full p-3.5 text-xs text-stone-800 bg-slate-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684] transition-all"
        />

        {/* Hair Inspiration Photo URL Input */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 shrink-0">
            <Camera className="w-4 h-4 text-[#004684]" />
            <span>Inspiration Image URL (Optional):</span>
          </div>
          <input
            type="url"
            value={hairInspirationUrl}
            onChange={(e) => setHairInspirationUrl(e.target.value)}
            placeholder="https://pinterest.com/pin/... or image link"
            className="flex-1 px-3 py-1.5 text-xs text-stone-800 bg-slate-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#004684]"
          />
        </div>
      </div>

    </div>
  );
};
