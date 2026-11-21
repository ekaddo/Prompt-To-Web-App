import React from 'react';
import { Calendar, Clock, Scissors, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { HairService, ManiAddon, PediAddon, TimeSlot } from '../types';

interface BookingSummaryCardProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedDate: string;
  selectedSlot: TimeSlot | null;
  hairService: HairService;
  selectedHairNeeds: string[];
  customHairDetails: string;
  selectedMani: ManiAddon;
  selectedPedi: PediAddon;
  onConfirmBooking: () => void;
  isSubmitting: boolean;
  canProceed: boolean;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  currentStep,
  setCurrentStep,
  selectedDate,
  selectedSlot,
  hairService,
  selectedHairNeeds,
  customHairDetails,
  selectedMani,
  selectedPedi,
  onConfirmBooking,
  isSubmitting,
  canProceed
}) => {
  const totalPrice = hairService.basePrice + selectedMani.price + selectedPedi.price;
  const totalMinutes = hairService.durationMinutes + selectedMani.additionalMinutes + selectedPedi.additionalMinutes;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const durationText = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 text-[#0F172A] shadow-md space-y-5 sticky top-20">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <h3 className="font-serif text-lg font-extrabold text-[#004684] uppercase">Appointment Summary</h3>
          <p className="text-[11px] text-stone-500 font-semibold">N.C. A&T Homecoming Glam Package</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#004684] text-[#FDB927] text-xs font-bold">
          Step {currentStep} of 4
        </span>
      </div>

      {/* Date & Slot Breakdown */}
      <div className="space-y-3 text-xs">
        
        {/* Date & Time */}
        <div className="bg-slate-50 p-3 rounded-xl border border-stone-200 space-y-1">
          <div className="flex items-center gap-1.5 text-stone-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#004684]" />
            <span>Date & 1.5h Slot:</span>
          </div>
          <div className="text-[#004684] font-bold text-sm">
            {selectedDate ? selectedDate : 'Select Date'}
          </div>
          <div className="text-stone-800 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#004684]" />
            <span>{selectedSlot ? selectedSlot.displayLabel : 'No slot selected yet'}</span>
          </div>
        </div>

        {/* Selected Hair Service */}
        <div className="bg-slate-50 p-3 rounded-xl border border-stone-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-stone-500 font-medium">
              <Scissors className="w-3.5 h-3.5 text-[#004684]" />
              <span>Hair Style (1.5h):</span>
            </span>
            <span className="font-bold text-[#004684]">${hairService.basePrice}</span>
          </div>
          <div className="font-semibold text-stone-900">{hairService.name}</div>
          
          {selectedHairNeeds.length > 0 && (
            <div className="mt-1.5 pt-1.5 border-t border-stone-200 flex flex-wrap gap-1">
              {selectedHairNeeds.slice(0, 3).map((need) => (
                <span key={need} className="px-1.5 py-0.5 rounded text-[10px] bg-white text-[#004684] border border-stone-200 font-bold">
                  {need}
                </span>
              ))}
              {selectedHairNeeds.length > 3 && (
                <span className="text-[10px] text-stone-500">+{selectedHairNeeds.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        {/* Manicure & Pedicure Add-ons */}
        <div className="bg-slate-50 p-3 rounded-xl border border-stone-200 space-y-2">
          
          {/* Mani */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Sparkles className="w-3.5 h-3.5 text-[#004684]" />
              <span>Manicure:</span>
            </div>
            <span className="font-semibold text-stone-900">
              {selectedMani.price === 0 ? 'None' : `+$${selectedMani.price}`}
            </span>
          </div>
          {selectedMani.price > 0 && (
            <div className="text-[11px] text-stone-600 pl-5">{selectedMani.name}</div>
          )}

          {/* Pedi */}
          <div className="flex items-center justify-between pt-1 border-t border-stone-200">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Sparkles className="w-3.5 h-3.5 text-[#004684]" />
              <span>Pedicure:</span>
            </div>
            <span className="font-semibold text-stone-900">
              {selectedPedi.price === 0 ? 'None' : `+$${selectedPedi.price}`}
            </span>
          </div>
          {selectedPedi.price > 0 && (
            <div className="text-[11px] text-stone-600 pl-5">{selectedPedi.name}</div>
          )}

        </div>

      </div>

      {/* Total Price & Duration */}
      <div className="pt-3 border-t border-stone-200 space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Estimated Duration:</span>
          <span className="font-semibold text-stone-800">{durationText} total</span>
        </div>
        
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-stone-700">Total Price:</span>
          <span className="text-2xl font-black text-[#004684] font-serif">${totalPrice}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 space-y-2">
        {currentStep < 4 ? (
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => setCurrentStep(currentStep + 1)}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              canProceed
                ? 'bg-[#004684] text-white hover:bg-[#00315C] shadow-md'
                : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
            }`}
            id="next-step-btn"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4 text-[#FDB927]" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canProceed || isSubmitting}
            onClick={onConfirmBooking}
            className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              canProceed && !isSubmitting
                ? 'bg-[#FDB927] text-[#004684] hover:bg-amber-300 shadow-md'
                : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
            }`}
            id="confirm-booking-btn"
          >
            {isSubmitting ? (
              <span>Reserving Appointment...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-[#004684]" />
                <span>Confirm & Reserve Appointment</span>
              </>
            )}
          </button>
        )}

        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-stone-600 hover:text-[#004684] hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            id="prev-step-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>
        )}
      </div>

      <div className="pt-2 text-center text-[10px] text-stone-500 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#004684]" />
        <span>No advance payment required. Pay at salon.</span>
      </div>

    </div>
  );
};
