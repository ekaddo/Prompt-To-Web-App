import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Users, Scissors, Sparkles, CheckCircle2, AlertCircle, Plus, Edit2, Trash2, Lock, Unlock, Phone, Mail, FileText } from 'lucide-react';
import { AppointmentBooking, TimeSlot } from '../types';

interface StylistDashboardProps {
  appointments: AppointmentBooking[];
  timeSlots: TimeSlot[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onUpdateStatus: (id: string, status: AppointmentBooking['status'], notes?: string) => void;
  onDeleteAppointment: (id: string) => void;
  onToggleBlockSlot: (slotId: string) => void;
  onOpenManualBooking: () => void;
}

export const StylistDashboard: React.FC<StylistDashboardProps> = ({
  appointments,
  timeSlots,
  selectedDate,
  setSelectedDate,
  onUpdateStatus,
  onDeleteAppointment,
  onToggleBlockSlot,
  onOpenManualBooking
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Filter appointments for selected date
  const dateAppointments = appointments.filter(a => a.date === selectedDate);
  const filteredAppointments = filterStatus === 'all'
    ? dateAppointments
    : dateAppointments.filter(a => a.status === filterStatus);

  const totalRevenue = dateAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const totalManiCount = dateAppointments.filter(a => a.selectedMani && a.selectedMani.price > 0).length;
  const totalPediCount = dateAppointments.filter(a => a.selectedPedi && a.selectedPedi.price > 0).length;

  const handleSaveNotes = (id: string) => {
    onUpdateStatus(id, appointments.find(a => a.id === id)?.status || 'confirmed', tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 text-[#0F172A] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004684] text-xs font-extrabold mb-2">
            <Scissors className="w-3.5 h-3.5 text-[#004684]" />
            <span>Aggie Stylist Schedule Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold font-serif text-[#004684] uppercase">N.C. A&T Homecoming Schedule & Slot Manager</h2>
          <p className="text-xs text-stone-600 mt-1">
            Manage your 1.5-hour hair slots, view client custom hair requests, manicure/pedicure add-ons, and track daily revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenManualBooking}
            className="px-4 py-2.5 rounded-xl bg-[#004684] text-[#FDB927] font-extrabold text-xs uppercase tracking-wider hover:bg-[#00315C] transition-all flex items-center gap-2 cursor-pointer shadow-md"
            id="manual-booking-btn"
          >
            <Plus className="w-4 h-4 text-[#FDB927]" />
            <span>Add Manual / Phone Booking</span>
          </button>
        </div>
      </div>

      {/* Date Picker & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Date Selector Card */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#004684]" />
            <span>Schedule Date:</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004684] text-[#004684] font-bold bg-slate-50"
          />
          <span className="text-[11px] text-stone-500 mt-2">
            Showing {dateAppointments.length} bookings on this date
          </span>
        </div>

        {/* Metric 1: Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#004684] border border-amber-200 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-[#004684]" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-500 block uppercase">Day Revenue</span>
            <span className="text-2xl font-black text-[#004684] font-serif">${totalRevenue}</span>
          </div>
        </div>

        {/* Metric 2: Booked Slots */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#004684] text-[#FDB927] flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-6 h-6 text-[#FDB927]" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-500 block uppercase">1.5h Hair Slots</span>
            <span className="text-2xl font-black text-[#004684] font-serif">
              {dateAppointments.length} / {timeSlots.length}
            </span>
          </div>
        </div>

        {/* Metric 3: Add-ons */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#004684] border border-blue-200 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-[#004684]" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-500 block uppercase">Beauty Add-ons</span>
            <span className="text-xl font-black text-[#004684] font-serif">
              {totalManiCount} Mani • {totalPediCount} Pedi
            </span>
          </div>
        </div>

      </div>

      {/* Time Slots & Schedule Breakdown */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-4 bg-slate-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#004684]" />
            <h3 className="font-extrabold text-[#004684] text-sm uppercase">
              1.5-Hour Appointment Master Schedule ({selectedDate})
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Filter status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 border border-stone-200 rounded-lg bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#004684]"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In-Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Time Slot List */}
        <div className="divide-y divide-stone-100">
          {timeSlots.map((slot) => {
            const appointment = dateAppointments.find(a => a.timeSlotId === slot.id);

            return (
              <div
                key={slot.id}
                className={`p-4 transition-colors flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 ${
                  appointment ? 'bg-blue-50/40' : 'bg-white'
                }`}
              >
                {/* Slot Info & Lock Button */}
                <div className="w-full lg:w-48 shrink-0 flex items-center justify-between lg:block">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#004684] text-[#FDB927] text-xs font-extrabold rounded-md uppercase">
                      {slot.displayLabel}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() => onToggleBlockSlot(slot.id)}
                      className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                        slot.isBlocked ? 'text-rose-600' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {slot.isBlocked ? (
                        <>
                          <Lock className="w-3 h-3 text-rose-600" /> Blocked
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" /> Block Slot
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Appointment Content */}
                {appointment ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    
                    {/* Client Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#004684] text-sm font-extrabold">{appointment.client.fullName}</strong>
                        <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-[#004684] font-mono rounded border border-blue-200 font-bold">
                          {appointment.bookingCode}
                        </span>
                      </div>
                      
                      <p className="text-stone-600 flex items-center gap-1.5 font-medium">
                        <Phone className="w-3 h-3 text-[#004684]" /> {appointment.client.phone}
                      </p>
                      
                      {appointment.client.schoolName && (
                        <p className="text-stone-600 font-bold">🏫 {appointment.client.schoolName}</p>
                      )}

                      {appointment.client.readyByTime && (
                        <p className="text-[#004684] font-bold bg-amber-50 inline-block px-1.5 py-0.5 rounded border border-amber-200">
                          ⏰ Ready By: {appointment.client.readyByTime}
                        </p>
                      )}
                    </div>

                    {/* Hair & Needs */}
                    <div className="space-y-1">
                      <div className="font-extrabold text-[#004684] flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-[#004684]" />
                        <span>{appointment.hairService.name}</span>
                      </div>

                      {appointment.selectedHairNeeds.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {appointment.selectedHairNeeds.map((need) => (
                            <span key={need} className="px-1.5 py-0.5 text-[10px] bg-white text-[#004684] rounded font-bold border border-blue-200">
                              {need}
                            </span>
                          ))}
                        </div>
                      )}

                      {appointment.customHairDetails && (
                        <div className="text-stone-600 bg-white p-2 rounded-lg border border-stone-200 italic mt-1 text-[11px]">
                          "{appointment.customHairDetails}"
                        </div>
                      )}
                    </div>

                    {/* Nails & Status */}
                    <div className="space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        {(appointment.selectedMani || appointment.selectedPedi) ? (
                          <>
                            {appointment.selectedMani && appointment.selectedMani.price > 0 && (
                              <p className="text-stone-900 font-semibold">💅 Mani: {appointment.selectedMani.name}</p>
                            )}
                            {appointment.selectedPedi && appointment.selectedPedi.price > 0 && (
                              <p className="text-stone-900 font-semibold">🦶 Pedi: {appointment.selectedPedi.name}</p>
                            )}
                            {appointment.nailColorNotes && (
                              <p className="text-stone-500 text-[11px]">Art: {appointment.nailColorNotes}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-stone-400">Hair only (No nail add-ons)</span>
                        )}
                        <div className="font-extrabold text-[#004684] pt-1">Total: ${appointment.totalPrice}</div>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                        <select
                          value={appointment.status}
                          onChange={(e) => onUpdateStatus(appointment.id, e.target.value as any)}
                          className="px-2 py-1 text-[11px] font-bold rounded-lg border border-stone-200 bg-white focus:outline-none text-[#004684]"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In-Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => onDeleteAppointment(appointment.id)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Cancel/Delete Appointment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="flex-1 text-xs text-stone-400 flex items-center justify-between py-2">
                    <span>
                      {slot.isBlocked
                        ? 'This 1.5-hour slot is blocked for break or private booking.'
                        : 'Open 1.5-hour slot available for Aggie clients.'}
                    </span>
                    {!slot.isBlocked && (
                      <span className="px-2 py-1 bg-amber-50 text-[#004684] border border-amber-200 font-bold rounded text-[11px]">
                        Available
                      </span>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
