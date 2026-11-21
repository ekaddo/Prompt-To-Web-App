export type ServiceCategory = 'hair' | 'manicure' | 'pedicure';

export interface HairService {
  id: string;
  name: string;
  description: string;
  durationMinutes: number; // Hair base is 90 mins (1.5 hours)
  basePrice: number;
  popularForHomecoming?: boolean;
  image?: string;
}

export interface ManiAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  additionalMinutes: number;
  popular?: boolean;
}

export interface PediAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  additionalMinutes: number;
  popular?: boolean;
}

export interface SpecificHairNeed {
  id: string;
  label: string;
  category: 'extensions' | 'styling' | 'hair_type' | 'treatment';
}

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "08:00 AM"
  endTime: string;   // e.g. "09:30 AM" (1.5h)
  displayLabel: string; // "8:00 AM - 9:30 AM (1.5 hrs)"
  isBooked: boolean;
  isBlocked?: boolean;
  bookedByClientName?: string;
}

export interface ClientInfo {
  fullName: string;
  phone: string;
  email: string;
  instagramHandle?: string;
  schoolName: string;
  homecomingDate: string; // YYYY-MM-DD
  readyByTime: string;   // e.g. "4:00 PM"
}

export interface AppointmentBooking {
  id: string;
  createdAt: string;
  bookingCode: string; // e.g. "HOCO-8492"
  date: string; // YYYY-MM-DD
  timeSlotId: string;
  timeSlotLabel: string; // "8:00 AM - 9:30 AM"
  
  hairService: HairService;
  selectedHairNeeds: string[]; // List of specific need labels
  customHairDetails: string;   // Custom text field for specific needs
  hairInspirationUrl?: string;

  selectedMani?: ManiAddon;
  selectedPedi?: PediAddon;
  nailShape?: string;
  nailColorNotes?: string;

  client: ClientInfo;
  
  totalPrice: number;
  totalDurationMinutes: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  stylistNotes?: string;
}

export interface AIStyleRecommendationRequest {
  dressColor: string;
  dressStyle: string;
  vibe: string;
  hairLength: string;
  hairTexture: string;
}

export interface AIStyleRecommendation {
  hairStyleSuggestion: string;
  whyItWorks: string;
  hairNeedsToSelect: string[];
  suggestedManiMatch: string;
  suggestedPediMatch: string;
  proStylistTip: string;
}
