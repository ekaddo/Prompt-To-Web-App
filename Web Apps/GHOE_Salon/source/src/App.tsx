import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import { HairServiceSelector } from './components/HairServiceSelector';
import { NailAddonSelector } from './components/NailAddonSelector';
import { ClientInfoForm } from './components/ClientInfoForm';
import { BookingSummaryCard } from './components/BookingSummaryCard';
import { AIStyleConsultantModal } from './components/AIStyleConsultantModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { StylistDashboard } from './components/StylistDashboard';
import { ManualBookingModal } from './components/ManualBookingModal';

import {
  HairService,
  ManiAddon,
  PediAddon,
  TimeSlot,
  ClientInfo,
  AppointmentBooking
} from './types';
import {
  DEFAULT_TIME_SLOTS,
  HAIR_SERVICES,
  MANICURE_ADDONS,
  PEDICURE_ADDONS,
  SAMPLE_APPOINTMENTS
} from './data/initialData';
import { Calendar, Clock, Scissors, Sparkles, UserCheck } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'booking' | 'dashboard'>('booking');

  // Appointments & Slot State
  const [appointments, setAppointments] = useState<AppointmentBooking[]>(SAMPLE_APPOINTMENTS);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);

  // Booking Wizard Step & Data
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-10');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(DEFAULT_TIME_SLOTS[0]);

  const [hairService, setHairService] = useState<HairService>(HAIR_SERVICES[0]);
  const [selectedHairNeeds, setSelectedHairNeeds] = useState<string[]>([]);
  const [customHairDetails, setCustomHairDetails] = useState<string>('');
  const [hairInspirationUrl, setHairInspirationUrl] = useState<string>('');

  const [selectedMani, setSelectedMani] = useState<ManiAddon>(MANICURE_ADDONS[1]); // Default Gel Gloss
  const [selectedPedi, setSelectedPedi] = useState<PediAddon>(PEDICURE_ADDONS[0]); // Default None
  const [nailShape, setNailShape] = useState<string>('Almond');
  const [nailColorNotes, setNailColorNotes] = useState<string>('');

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    fullName: '',
    phone: '',
    email: '',
    instagramHandle: '',
    schoolName: 'Westlake High School',
    homecomingDate: '2026-10-10',
    readyByTime: '3:30 PM'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState<boolean>(false);

  // Fetch appointments from server
  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => {
        if (data.appointments && Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
        }
      })
      .catch((err) => console.log('Using sample appointments fallback:', err));
  }, []);

  // Sync slot availability with booked appointments
  useEffect(() => {
    setTimeSlots((prev) =>
      prev.map((slot) => {
        const booked = appointments.find(
          (a) => a.date === selectedDate && a.timeSlotId === slot.id && a.status !== 'cancelled'
        );
        return {
          ...slot,
          isBooked: !!booked,
          bookedByClientName: booked ? booked.client.fullName : undefined
        };
      })
    );
  }, [appointments, selectedDate]);

  // Validation logic
  const canProceedStep1 = !!selectedDate && !!selectedSlot && !selectedSlot.isBooked;
  const canProceedStep2 = !!hairService;
  const canProceedStep3 = true;

  const validateStep4 = () => {
    const errors: Record<string, string> = {};
    if (!clientInfo.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!clientInfo.phone.trim()) errors.phone = 'Phone Number is required for SMS confirmation';
    if (!clientInfo.email.trim() || !clientInfo.email.includes('@'))
      errors.email = 'Valid Email Address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceedCurrentStep = () => {
    if (currentStep === 1) return canProceedStep1;
    if (currentStep === 2) return canProceedStep2;
    if (currentStep === 3) return canProceedStep3;
    if (currentStep === 4) return !!clientInfo.fullName && !!clientInfo.phone && !!clientInfo.email;
    return true;
  };

  // Handle Booking Submission
  const handleConfirmBooking = async () => {
    if (!validateStep4() || !selectedSlot) return;

    setIsSubmitting(true);

    const newBooking: AppointmentBooking = {
      id: 'b-' + Date.now(),
      createdAt: new Date().toISOString(),
      bookingCode: 'HOCO-' + Math.floor(1000 + Math.random() * 9000),
      date: selectedDate,
      timeSlotId: selectedSlot.id,
      timeSlotLabel: selectedSlot.displayLabel,
      hairService,
      selectedHairNeeds,
      customHairDetails,
      hairInspirationUrl,
      selectedMani,
      selectedPedi,
      nailShape,
      nailColorNotes,
      client: { ...clientInfo, homecomingDate: selectedDate },
      totalPrice: hairService.basePrice + selectedMani.price + selectedPedi.price,
      totalDurationMinutes:
        hairService.durationMinutes +
        selectedMani.additionalMinutes +
        selectedPedi.additionalMinutes,
      status: 'confirmed'
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      const data = await res.json();
      const saved = data.appointment || newBooking;

      setAppointments((prev) => [saved, ...prev]);
      setConfirmedBooking(saved);
    } catch (err) {
      console.error('Failed server booking, proceeding with local booking:', err);
      setAppointments((prev) => [newBooking, ...prev]);
      setConfirmedBooking(newBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form for new booking
  const handleResetForm = () => {
    setCurrentStep(1);
    setConfirmedBooking(null);
    setCustomHairDetails('');
    setSelectedHairNeeds([]);
    setNailColorNotes('');
    setClientInfo({
      fullName: '',
      phone: '',
      email: '',
      instagramHandle: '',
      schoolName: 'Westlake High School',
      homecomingDate: selectedDate,
      readyByTime: '3:30 PM'
    });
  };

  // Apply AI Style Recommendation
  const handleApplyAiRecommendation = (
    recommendedService: HairService,
    needsLabels: string[],
    maniNotes: string
  ) => {
    setHairService(recommendedService);
    setSelectedHairNeeds(needsLabels);
    if (maniNotes) setNailColorNotes(maniNotes);
    setCurrentStep(2); // Jump to hair step
  };

  // Update appointment status in Stylist Portal
  const handleUpdateStatus = (
    id: string,
    status: AppointmentBooking['status'],
    notes?: string
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, stylistNotes: notes || a.stylistNotes } : a))
    );

    fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, stylistNotes: notes })
    }).catch((err) => console.log('Error patching appointment:', err));
  };

  // Delete appointment
  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    fetch(`/api/appointments/${id}`, { method: 'DELETE' }).catch((err) =>
      console.log('Error deleting appointment:', err)
    );
  };

  // Toggle Slot Blocked state
  const handleToggleBlockSlot = (slotId: string) => {
    setTimeSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isBlocked: !s.isBlocked } : s))
    );
  };

  // Add Manual Phone Appointment
  const handleAddManualAppointment = (newAppt: AppointmentBooking) => {
    setAppointments((prev) => [newAppt, ...prev]);
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppt)
    }).catch((err) => console.log('Error adding manual appointment:', err));
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2926] font-sans antialiased selection:bg-stone-800 selection:text-stone-50">
      
      {/* Header Bar */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAiConsultant={() => setIsAiModalOpen(true)}
        appointmentCount={appointments.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeView === 'booking' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Columns: Interactive Booking Steps */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Wizard Progress Bar */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-medium mb-2.5 text-stone-500">
                  <span className="text-[#004684] font-serif font-extrabold text-sm uppercase tracking-wide">
                    N.C. A&T Homecoming Glam Booking
                  </span>
                  <span className="text-stone-600 font-bold">Step {currentStep} of 4</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { step: 1, label: '1. Date & 1.5h Slot', icon: Clock },
                    { step: 2, label: '2. Hair & Needs', icon: Scissors },
                    { step: 3, label: '3. Mani & Pedi', icon: Sparkles },
                    { step: 4, label: '4. Contact & Schedule', icon: UserCheck }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = currentStep === item.step;
                    const isCompleted = currentStep > item.step;

                    return (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => {
                          if (item.step < currentStep || canProceedCurrentStep()) {
                            setCurrentStep(item.step);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isActive
                            ? 'bg-[#004684] text-[#FDB927] border-[#00315C] font-extrabold shadow-sm'
                            : isCompleted
                            ? 'bg-blue-50 text-[#004684] border-blue-200 font-bold'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className="w-3.5 h-3.5 text-[#FDB927]" />
                          <span className="text-[10px] font-mono font-bold">
                            {isCompleted ? '✓' : `0${item.step}`}
                          </span>
                        </div>
                        <span className="text-[11px] truncate mt-1">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Components */}
              {currentStep === 1 && (
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  timeSlots={timeSlots}
                  selectedSlotId={selectedSlot?.id || null}
                  onSelectSlot={(slot) => setSelectedSlot(slot)}
                />
              )}

              {currentStep === 2 && (
                <HairServiceSelector
                  selectedService={hairService}
                  setSelectedService={setHairService}
                  selectedHairNeeds={selectedHairNeeds}
                  setSelectedHairNeeds={setSelectedHairNeeds}
                  customHairDetails={customHairDetails}
                  setCustomHairDetails={setCustomHairDetails}
                  hairInspirationUrl={hairInspirationUrl}
                  setHairInspirationUrl={setHairInspirationUrl}
                />
              )}

              {currentStep === 3 && (
                <NailAddonSelector
                  selectedMani={selectedMani}
                  setSelectedMani={setSelectedMani}
                  selectedPedi={selectedPedi}
                  setSelectedPedi={setSelectedPedi}
                  nailShape={nailShape}
                  setNailShape={setNailShape}
                  nailColorNotes={nailColorNotes}
                  setNailColorNotes={setNailColorNotes}
                />
              )}

              {currentStep === 4 && (
                <ClientInfoForm
                  clientInfo={clientInfo}
                  setClientInfo={setClientInfo}
                  errors={formErrors}
                />
              )}

            </div>

            {/* Right 4 Columns: Sticky Booking Summary Sidebar */}
            <div className="lg:col-span-4">
              <BookingSummaryCard
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                hairService={hairService}
                selectedHairNeeds={selectedHairNeeds}
                customHairDetails={customHairDetails}
                selectedMani={selectedMani}
                selectedPedi={selectedPedi}
                onConfirmBooking={handleConfirmBooking}
                isSubmitting={isSubmitting}
                canProceed={canProceedCurrentStep()}
              />
            </div>

          </div>
        ) : (
          /* Stylist / Admin Schedule View */
          <StylistDashboard
            appointments={appointments}
            timeSlots={timeSlots}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onUpdateStatus={handleUpdateStatus}
            onDeleteAppointment={handleDeleteAppointment}
            onToggleBlockSlot={handleToggleBlockSlot}
            onOpenManualBooking={() => setIsManualBookingOpen(true)}
          />
        )}

      </main>

      {/* AI Style Consultant Modal */}
      <AIStyleConsultantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyRecommendation={handleApplyAiRecommendation}
      />

      {/* Booking Confirmation Pass Modal */}
      <BookingConfirmationModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onNewBooking={handleResetForm}
      />

      {/* Manual Phone Booking Modal for Stylist */}
      <ManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        selectedDate={selectedDate}
        timeSlots={timeSlots}
        onAddAppointment={handleAddManualAppointment}
      />

    </div>
  );
}
