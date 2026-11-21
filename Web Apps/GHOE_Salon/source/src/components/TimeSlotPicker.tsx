import React from 'react';
import { Clock, Calendar as CalendarIcon, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { TimeSlot } from '../types';

interface TimeSlotPickerProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  timeSlots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  setSelectedDate,
  timeSlots,
  selectedSlotId,
  onSelectSlot
}) => {
  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-[#0F172A]">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004684] text-xs font-bold mb-2">
              <Clock className="w-3.5 h-3.5 text-[#004684]" />
              <span>Strict 1.5-Hour Duration Per Hair Appointment</span>
            </div>
            <h2 className="text-xl font-extrabold font-serif text-[#004684] uppercase">Step 1: Select Homecoming Date & Time Slot</h2>
            <p className="text-xs text-stone-600 mt-1">
              Every hair appointment is allocated a dedicated 1.5-hour time window to guarantee perfection for N.C. A&T Homecoming.
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#004684]" />
          <span>Homecoming Event Date</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { date: '2026-10-10', label: 'Saturday, Oct 10', subtitle: 'Main Aggie Homecoming' },
            { date: '2026-10-09', label: 'Friday, Oct 9', subtitle: 'Friday Pep Rally & Gala' },
            { date: '2026-10-17', label: 'Saturday, Oct 17', subtitle: 'Post-Homecoming Events' },
          ].map((item) => (
            <button
              key={item.date}
              type="button"
              onClick={() => setSelectedDate(item.date)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                selectedDate === item.date
                  ? 'border-[#004684] bg-blue-50/80 ring-2 ring-[#004684] text-[#004684] shadow-xs font-bold'
                  : 'border-stone-200 hover:border-[#004684] hover:bg-slate-50 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{item.label}</span>
                {selectedDate === item.date && (
                  <CheckCircle2 className="w-4 h-4 text-[#004684]" />
                )}
              </div>
              <span className="text-xs text-stone-500 mt-0.5 block">{item.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">Or pick custom date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#004684] text-stone-800 bg-slate-50 font-medium"
          />
        </div>
      </div>

      {/* 1.5-Hour Time Slots Grid */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#004684] text-sm uppercase flex items-center gap-2">
              <span>Available 1.5-Hour Slots</span>
              <span className="text-xs font-bold text-[#004684]">
                ({timeSlots.filter(s => !s.isBooked && !s.isBlocked).length} available)
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select your ideal 1.5-hour slot. Nail add-ons will be scheduled immediately before or after your hair session.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const isUnavailable = slot.isBooked || slot.isBlocked;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={isUnavailable}
                onClick={() => onSelectSlot(slot)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[82px] cursor-pointer ${
                  isUnavailable
                    ? 'bg-slate-100 border-slate-200 text-stone-400 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-[#004684] border-[#00315C] text-white shadow-md ring-2 ring-[#FDB927] transform scale-[1.02]'
                    : 'bg-white border-stone-200 hover:border-[#004684] hover:bg-blue-50/50 text-stone-800'
                }`}
                id={`timeslot-btn-${slot.id}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                    1.5 Hours
                  </span>
                  {isUnavailable ? (
                    <span className="px-1.5 py-0.5 text-[10px] bg-slate-200 text-stone-600 font-semibold rounded">
                      Booked
                    </span>
                  ) : isSelected ? (
                    <span className="px-1.5 py-0.5 text-[10px] bg-[#FDB927] text-[#004684] font-extrabold rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#004684]" /> Selected
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-[#004684] font-bold rounded border border-blue-200">
                      Open
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <div className={`text-sm font-extrabold ${isSelected ? 'text-[#FDB927]' : 'text-[#004684]'}`}>
                    {slot.displayLabel}
                  </div>
                  {slot.bookedByClientName && (
                    <div className="text-[11px] text-blue-200 truncate mt-0.5">
                      Reserved ({slot.bookedByClientName})
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-50 border border-blue-200"></span>
            <span>Available (1.5h Slot)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#004684]"></span>
            <span>Your Selected Slot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
            <span>Already Booked</span>
          </div>
        </div>

      </div>

    </div>
  );
};
