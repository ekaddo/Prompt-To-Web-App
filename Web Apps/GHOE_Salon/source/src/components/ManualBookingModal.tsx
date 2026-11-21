import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, User, Phone, Scissors } from 'lucide-react';
import { HairService, ManiAddon, PediAddon, TimeSlot, AppointmentBooking } from '../types';
import { HAIR_SERVICES, MANICURE_ADDONS, PEDICURE_ADDONS } from '../data/initialData';

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  timeSlots: TimeSlot[];
  onAddAppointment: (appointment: AppointmentBooking) => void;
}

export const ManualBookingModal: React.FC<ManualBookingModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  timeSlots,
  onAddAppointment
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [slotId, setSlotId] = useState(timeSlots[0]?.id || '');
  const [hairService, setHairService] = useState<HairService>(HAIR_SERVICES[0]);
  const [customHairDetails, setCustomHairDetails] = useState('');
  const [selectedMani, setSelectedMani] = useState<ManiAddon>(MANICURE_ADDONS[0]);
  const [selectedPedi, setSelectedPedi] = useState<PediAddon>(PEDICURE_ADDONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const chosenSlot = timeSlots.find(s => s.id === slotId) || timeSlots[0];

    const newAppointment: AppointmentBooking = {
      id: 'b-manual-' + Date.now(),
      createdAt: new Date().toISOString(),
      bookingCode: 'HOCO-' + Math.floor(1000 + Math.random() * 9000),
      date: selectedDate,
      timeSlotId: chosenSlot.id,
      timeSlotLabel: chosenSlot.displayLabel,
      hairService,
      selectedHairNeeds: [],
      customHairDetails,
      selectedMani,
      selectedPedi,
      client: {
        fullName: clientName,
        phone: clientPhone,
        email: 'phone-client@salon.com',
        schoolName: 'Phone / Walk-In',
        homecomingDate: selectedDate,
        readyByTime: 'N/A'
      },
      totalPrice: hairService.basePrice + selectedMani.price + selectedPedi.price,
      totalDurationMinutes: hairService.durationMinutes + selectedMani.additionalMinutes + selectedPedi.additionalMinutes,
      status: 'confirmed'
    };

    onAddAppointment(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 text-[#0F172A] shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#004684]" />
            <h3 className="font-serif text-lg font-extrabold text-[#004684] uppercase">Add Manual / Aggie Phone Booking</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-[#004684] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#004684] font-bold mb-1">Client Full Name *</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="E.g. Sarah Williams"
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            />
          </div>

          <div>
            <label className="block text-[#004684] font-bold mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="(336) 000-0000"
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            />
          </div>

          <div>
            <label className="block text-[#004684] font-bold mb-1">1.5-Hour Time Slot *</label>
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            >
              {timeSlots.map(s => (
                <option key={s.id} value={s.id} disabled={s.isBooked}>
                  {s.displayLabel} {s.isBooked ? '(Already Booked)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#004684] font-bold mb-1">Hair Service (1.5h)</label>
            <select
              value={hairService.id}
              onChange={(e) => setHairService(HAIR_SERVICES.find(h => h.id === e.target.value) || HAIR_SERVICES[0])}
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            >
              {HAIR_SERVICES.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} (${h.basePrice})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#004684] font-bold mb-1">Specific Hair Needs / Notes</label>
            <input
              type="text"
              value={customHairDetails}
              onChange={(e) => setCustomHairDetails(e.target.value)}
              placeholder="E.g. Clip-ins installation, extra freeze spray..."
              className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#004684] font-bold mb-1">Manicure Add-On</label>
              <select
                value={selectedMani.id}
                onChange={(e) => setSelectedMani(MANICURE_ADDONS.find(m => m.id === e.target.value) || MANICURE_ADDONS[0])}
                className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
              >
                {MANICURE_ADDONS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (+${m.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#004684] font-bold mb-1">Pedicure Add-On</label>
              <select
                value={selectedPedi.id}
                onChange={(e) => setSelectedPedi(PEDICURE_ADDONS.find(p => p.id === e.target.value) || PEDICURE_ADDONS[0])}
                className="w-full px-3 py-2 bg-slate-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684]"
              >
                {PEDICURE_ADDONS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (+${p.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#004684] text-[#FDB927] font-extrabold text-xs uppercase tracking-wider hover:bg-[#00315C] transition-all cursor-pointer shadow-md mt-2"
          >
            Save Appointment to Schedule
          </button>
        </form>

      </div>
    </div>
  );
};
