import React from 'react';
import { CheckCircle2, Calendar, Clock, Scissors, Sparkles, Printer, X, Download, Share2, MapPin, Phone } from 'lucide-react';
import { AppointmentBooking } from '../types';

interface BookingConfirmationModalProps {
  booking: AppointmentBooking | null;
  onClose: () => void;
  onNewBooking: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose,
  onNewBooking
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full p-6 text-[#0F172A] shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Top Status */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-[#004684] shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-[#004684]" />
          </div>
          <h2 className="text-2xl font-serif font-extrabold text-[#004684] uppercase">Aggie Homecoming Pass Reserved!</h2>
          <p className="text-xs text-stone-600">
            Booking Code: <span className="font-mono font-bold text-[#004684] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">{booking.bookingCode}</span>
          </p>
        </div>

        {/* Digital Pass Card */}
        <div className="bg-slate-50 border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
          
          {/* Salon Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#004684] tracking-wider">Official Homecoming Pass</span>
              <h3 className="font-serif text-base font-extrabold text-[#004684]">N.C. A&T Aggie Homecoming Hair & Nails Salon</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Total Package</span>
              <span className="text-xl font-bold font-serif text-[#004684]">${booking.totalPrice}</span>
            </div>
          </div>

          {/* Appointment Slot Info */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 block font-medium">Homecoming Date:</span>
              <span className="font-extrabold text-[#004684]">{booking.date}</span>
            </div>

            <div>
              <span className="text-stone-500 block font-medium">1.5-Hour Slot:</span>
              <span className="font-extrabold text-[#004684]">{booking.timeSlotLabel}</span>
            </div>
          </div>

          {/* Hair & Nail Details */}
          <div className="space-y-2 text-xs">
            
            {/* Hair */}
            <div className="flex items-start gap-2">
              <Scissors className="w-4 h-4 text-[#004684] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#004684]">{booking.hairService.name}</span>
                <span className="text-stone-500 block">1.5 Hours Base Salon Session</span>
                
                {booking.selectedHairNeeds.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {booking.selectedHairNeeds.map((need) => (
                      <span key={need} className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-[#004684] rounded border border-blue-200 font-bold">
                        {need}
                      </span>
                    ))}
                  </div>
                )}

                {booking.customHairDetails && (
                  <p className="text-[11px] text-stone-700 italic mt-1 bg-white p-2 rounded-lg border border-stone-200">
                    "{booking.customHairDetails}"
                  </p>
                )}
              </div>
            </div>

            {/* Nails */}
            {(booking.selectedMani || booking.selectedPedi) && (
              <div className="pt-2 border-t border-stone-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#004684] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {booking.selectedMani && booking.selectedMani.price > 0 && (
                    <p className="text-stone-800">
                      <strong className="text-[#004684]">Mani:</strong> {booking.selectedMani.name} (+${booking.selectedMani.price})
                    </p>
                  )}
                  {booking.selectedPedi && booking.selectedPedi.price > 0 && (
                    <p className="text-stone-800">
                      <strong className="text-[#004684]">Pedi:</strong> {booking.selectedPedi.name} (+${booking.selectedPedi.price})
                    </p>
                  )}
                  {booking.nailColorNotes && (
                    <p className="text-[11px] text-stone-500">Nail notes: {booking.nailColorNotes}</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Client Details */}
          <div className="pt-2 border-t border-stone-200 text-xs text-stone-700 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-stone-500">Aggie Client: </span>
              <strong className="text-[#004684]">{booking.client.fullName}</strong> ({booking.client.phone})
            </div>
            {booking.client.readyByTime && (
              <div className="text-[#004684] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                Ready by: {booking.client.readyByTime}
              </div>
            )}
          </div>

        </div>

        {/* Salon Location & Reminder */}
        <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[#004684] font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#004684]" />
            <span>N.C. A&T Salon Location & Arrival Notice</span>
          </div>
          <p className="text-slate-700">
            N.C. A&T Aggie Salon, Student Union Beauty Hub Suite 200, Greensboro, NC. Please arrive 5 minutes before your 1.5-hour slot with dry/washed hair.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-100 text-[#004684] border border-slate-200 hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass / Save PDF</span>
          </button>

          <button
            onClick={() => {
              onNewBooking();
              onClose();
            }}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-[#004684] text-[#FDB927] hover:bg-[#00315C] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md uppercase tracking-wider"
          >
            <span>Book Another Appointment</span>
          </button>
        </div>

      </div>
    </div>
  );
};
