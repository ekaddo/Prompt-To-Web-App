import { HairService, ManiAddon, PediAddon, SpecificHairNeed, TimeSlot, AppointmentBooking } from '../types';

// Standard 1.5-Hour Time Slots (strictly 1.5 hours per appointment)
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-1', startTime: '08:00 AM', endTime: '09:30 AM', displayLabel: '8:00 AM - 9:30 AM', isBooked: false },
  { id: 'slot-2', startTime: '09:30 AM', endTime: '11:00 AM', displayLabel: '9:30 AM - 11:00 AM', isBooked: true, bookedByClientName: 'Brianna M.' },
  { id: 'slot-3', startTime: '11:00 AM', endTime: '12:30 PM', displayLabel: '11:00 AM - 12:30 PM', isBooked: false },
  { id: 'slot-4', startTime: '01:00 PM', endTime: '02:30 PM', displayLabel: '1:00 PM - 2:30 PM', isBooked: false },
  { id: 'slot-5', startTime: '02:30 PM', endTime: '04:00 PM', displayLabel: '2:30 PM - 4:00 PM', isBooked: true, bookedByClientName: 'Sophia K.' },
  { id: 'slot-6', startTime: '04:00 PM', endTime: '05:30 PM', displayLabel: '4:00 PM - 5:30 PM', isBooked: false },
  { id: 'slot-7', startTime: '05:30 PM', endTime: '07:00 PM', displayLabel: '5:30 PM - 7:00 PM', isBooked: false },
  { id: 'slot-8', startTime: '07:00 PM', endTime: '08:30 PM', displayLabel: '7:00 PM - 8:30 PM', isBooked: false },
];

export const HAIR_SERVICES: HairService[] = [
  {
    id: 'hair-1',
    name: 'Hollywood Glam Waves',
    description: 'Deep defined red-carpet vintage waves with maximum shine, volume, and humidity-proof setting spray.',
    durationMinutes: 90,
    basePrice: 120,
    popularForHomecoming: true,
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'hair-2',
    name: 'Elegant Homecoming Updo / Low Chignon',
    description: 'Intricate pinned updo or sleek low textured chignon with face-framing tendrils and accessory placement.',
    durationMinutes: 90,
    basePrice: 135,
    popularForHomecoming: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'hair-3',
    name: 'Silk Press & Glass Shine Finish',
    description: 'Deep clarifying treatment, steam hydration, precision blow dry, and silky smooth flat iron press with glass finish.',
    durationMinutes: 90,
    basePrice: 110,
    popularForHomecoming: false,
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'hair-4',
    name: 'Half-Up Half-Down Glam Curls',
    description: 'Bouncy tousled curls combined with braided or twisted half-up crown detail and crown volume.',
    durationMinutes: 90,
    basePrice: 115,
    popularForHomecoming: true,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'hair-5',
    name: 'Boho Braided Crown & Soft Waves',
    description: 'Dutch or fishtail braided crown accents cascading into effortless beachy waves with pearl or gem pins.',
    durationMinutes: 90,
    basePrice: 125,
    popularForHomecoming: false,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'hair-6',
    name: 'Custom Homecoming Specialty Hair',
    description: 'Tailored custom styling based on your inspiration photo (extensions, pony, loc styling, or creative updos).',
    durationMinutes: 90,
    basePrice: 140,
    popularForHomecoming: true,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=600'
  }
];

export const SPECIFIC_HAIR_NEEDS: SpecificHairNeed[] = [
  { id: 'need-clipins', label: 'Installing/Blending Clip-In Extensions', category: 'extensions' },
  { id: 'need-tapeins', label: 'Styling with Tape-In / Sew-In Extensions', category: 'extensions' },
  { id: 'need-glitter', label: 'Hair Glitter & Sparkle Spray Application', category: 'styling' },
  { id: 'need-gems', label: 'Pearl or Crystal Gem Hair Placement', category: 'styling' },
  { id: 'need-extrahold', label: 'All-Night Dance Extra-Hold Freeze Spray', category: 'styling' },
  { id: 'need-volume', label: 'Crown Teasing & High-Volume Boost', category: 'styling' },
  { id: 'need-crownbraid', label: 'Crown Braid / Side Braid Accent', category: 'styling' },
  { id: 'need-heatprotect', label: 'Thermal Shield & Anti-Frizz Treatment', category: 'treatment' },
  { id: 'need-thick', label: 'Extra Long or Ultra-Thick Hair Care', category: 'hair_type' },
  { id: 'need-curly', label: 'Natural Curl Definition / Diffusing', category: 'hair_type' },
];

export const MANICURE_ADDONS: ManiAddon[] = [
  {
    id: 'mani-none',
    name: 'No Manicure',
    description: 'Hair service only without nail add-on.',
    price: 0,
    additionalMinutes: 0
  },
  {
    id: 'mani-gel',
    name: 'Gel Gloss Manicure',
    description: 'Nail shaping, cuticle care, long-lasting LED gel polish with high-shine topcoat.',
    price: 35,
    additionalMinutes: 30,
    popular: true
  },
  {
    id: 'mani-acrylic',
    name: 'Acrylic Full Set w/ Homecoming Art',
    description: 'Full acrylic set, custom length/shape, glitter accents, french tip, or ombre nail art.',
    price: 60,
    additionalMinutes: 45,
    popular: true
  },
  {
    id: 'mani-pressons',
    name: 'Custom Press-On Application & Shaping',
    description: 'Professional nail prep, custom alignment, and secure glue bond for client-supplied or salon press-ons.',
    price: 25,
    additionalMinutes: 20
  }
];

export const PEDICURE_ADDONS: PediAddon[] = [
  {
    id: 'pedi-none',
    name: 'No Pedicure',
    description: 'Skip pedicure service.',
    price: 0,
    additionalMinutes: 0
  },
  {
    id: 'pedi-classic',
    name: 'Classic Homecoming Express Pedicure',
    description: 'Warm foot soak, scrub, nail shaping, massage, and high-shine quick dry polish.',
    price: 40,
    additionalMinutes: 30
  },
  {
    id: 'pedi-gel-deluxe',
    name: 'Deluxe Homecoming Gel Spa Pedicure',
    description: 'Exfoliating rose scrub, hydrating foot mask, hot towel wrap, and non-chip gel polish.',
    price: 65,
    additionalMinutes: 45,
    popular: true
  },
  {
    id: 'pedi-reflexology',
    name: 'Relaxation Reflexology & Gloss Pedicure',
    description: 'Extended foot and calf massage to ease homecoming dancing heels, plus glossy polish.',
    price: 50,
    additionalMinutes: 35
  }
];

export const SAMPLE_APPOINTMENTS: AppointmentBooking[] = [
  {
    id: 'b-101',
    createdAt: new Date().toISOString(),
    bookingCode: 'HOCO-9201',
    date: '2026-10-10',
    timeSlotId: 'slot-2',
    timeSlotLabel: '9:30 AM - 11:00 AM',
    hairService: HAIR_SERVICES[0], // Hollywood Glam Waves
    selectedHairNeeds: ['Installing/Blending Clip-In Extensions', 'All-Night Dance Extra-Hold Freeze Spray'],
    customHairDetails: 'Bringing 20-inch clip-in human hair extensions in chocolate brown. Want big soft Hollywood waves brushed out.',
    selectedMani: MANICURE_ADDONS[1], // Gel Gloss
    selectedPedi: PEDICURE_ADDONS[2], // Deluxe Gel Pedi
    nailShape: 'Almond',
    nailColorNotes: 'Emerald green gel with silver glitter line to match emerald silk dress',
    client: {
      fullName: 'Brianna Martinez',
      phone: '(555) 234-5678',
      email: 'brianna.m@example.com',
      instagramHandle: '@bri_glam',
      schoolName: 'Westlake High School',
      homecomingDate: '2026-10-10',
      readyByTime: '3:00 PM'
    },
    totalPrice: 220,
    totalDurationMinutes: 165,
    status: 'confirmed',
    stylistNotes: 'Confirmed extensions. Prepare extra setting clips for Hollywood waves.'
  },
  {
    id: 'b-102',
    createdAt: new Date().toISOString(),
    bookingCode: 'HOCO-9202',
    date: '2026-10-10',
    timeSlotId: 'slot-5',
    timeSlotLabel: '2:30 PM - 4:00 PM',
    hairService: HAIR_SERVICES[1], // Elegant Updo
    selectedHairNeeds: ['Pearl or Crystal Gem Hair Placement', 'Crown Teasing & High-Volume Boost'],
    customHairDetails: 'Low textured bun with loose tendrils framing face. Bringing 6 pearl hair pins.',
    selectedMani: MANICURE_ADDONS[2], // Acrylic Full Set
    selectedPedi: PEDICURE_ADDONS[0], // No pedi
    nailShape: 'Coffin',
    nailColorNotes: 'French tip with tiny pearl accents',
    client: {
      fullName: 'Sophia Kim',
      phone: '(555) 876-5432',
      email: 'sophia.k@example.com',
      instagramHandle: '@sophiak_hoco',
      schoolName: 'Oakridge Academy',
      homecomingDate: '2026-10-10',
      readyByTime: '5:30 PM'
    },
    totalPrice: 195,
    totalDurationMinutes: 135,
    status: 'confirmed',
    stylistNotes: 'Has pearl pins in bag.'
  }
];
