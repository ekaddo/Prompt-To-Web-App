import React from 'react';
import { User, Phone, Mail, Instagram, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { ClientInfo } from '../types';

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;
  errors: Record<string, string>;
}

export const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientInfo,
  setClientInfo,
  errors
}) => {
  const handleChange = (field: keyof ClientInfo, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-[#0F172A]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004684] text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#004684]" />
            <span>Step 4 of 4: Client & Homecoming Details</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#004684] uppercase">Contact & Aggie Homecoming Schedule</h2>
          <p className="text-xs text-stone-600 mt-1">
            We send instant booking confirmations and SMS appointment reminders so your N.C. A&T Homecoming day runs smoothly.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#004684]" />
              <span>Full Name <span className="text-rose-600">*</span></span>
            </label>
            <input
              type="text"
              required
              value={clientInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="E.g. Maya Williams"
              className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 transition-all ${
                errors.fullName
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-stone-200 bg-slate-50 focus:bg-white focus:ring-[#004684] focus:border-[#004684] text-stone-800'
              }`}
            />
            {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#004684]" />
              <span>Mobile Phone (SMS Confirmation) <span className="text-rose-600">*</span></span>
            </label>
            <input
              type="tel"
              required
              value={clientInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(336) 000-0000"
              className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 transition-all ${
                errors.phone
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-stone-200 bg-slate-50 focus:bg-white focus:ring-[#004684] focus:border-[#004684] text-stone-800'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#004684]" />
              <span>Email Address <span className="text-rose-600">*</span></span>
            </label>
            <input
              type="email"
              required
              value={clientInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="aggie@ncat.edu"
              className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 transition-all ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-stone-200 bg-slate-50 focus:bg-white focus:ring-[#004684] focus:border-[#004684] text-stone-800'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* Instagram Handle */}
          <div>
            <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#004684]" />
              <span>Instagram Handle (Optional for Tagging)</span>
            </label>
            <input
              type="text"
              value={clientInfo.instagramHandle}
              onChange={(e) => handleChange('instagramHandle', e.target.value)}
              placeholder="@aggie_pride2026"
              className="w-full px-3.5 py-2.5 text-xs border border-stone-200 bg-slate-50 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684] text-stone-800 transition-all"
            />
          </div>

        </div>

        {/* Homecoming Event Specifics */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* High School / University Name */}
          <div>
            <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#004684]" />
              <span>University / Organization Name</span>
            </label>
            <input
              type="text"
              value={clientInfo.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="North Carolina A&T State University"
              className="w-full px-3.5 py-2.5 text-xs border border-stone-200 bg-slate-50 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684] text-stone-800 transition-all font-semibold"
            />
          </div>

          {/* Ready-By Target Time */}
          <div>
            <label className="block text-xs font-bold text-[#004684] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#004684]" />
              <span>Target "Ready By" Time for Photos/Gala</span>
            </label>
            <input
              type="text"
              value={clientInfo.readyByTime}
              onChange={(e) => handleChange('readyByTime', e.target.value)}
              placeholder="E.g. 3:30 PM (before tailgating / parade)"
              className="w-full px-3.5 py-2.5 text-xs border border-stone-200 bg-slate-50 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004684] focus:border-[#004684] text-stone-800 transition-all"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
