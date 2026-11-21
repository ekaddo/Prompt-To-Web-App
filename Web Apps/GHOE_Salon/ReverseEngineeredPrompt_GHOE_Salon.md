```text
Build "Aura Glam" — a React + Vite + Express web app for booking 1.5-hour hair appointments (with
manicure/pedicure add-ons) for N.C. A&T's Aggie Homecoming, including an AI dress-matching style
consultant and a stylist/admin dashboard.

TECH
- Vite 6 + React 19 + TypeScript, Tailwind v4 via the `@tailwindcss/vite` plugin (no tailwind.config
  file — base styles and a few named utility classes live in src/index.css under `@layer base`).
- A single Express server (server.ts) that in dev mode mounts Vite's middleware (`createViteServer`,
  `middlewareMode: true`, `appType: 'spa'`) and in production serves the built `dist/` folder with an
  SPA catch-all. `npm run dev` = `tsx server.ts`; `npm run build` = `vite build` + esbuild-bundling
  server.ts to `dist/server.cjs`; `npm start` runs that bundle.
- lucide-react for icons, `motion` available for animation (optional), lead font stack: Montserrat +
  Playfair Display + Plus Jakarta Sans via Google Fonts.
- AI: `@google/genai`'s `GoogleGenAI`, model `gemini-2.5-flash`, called only from the server
  (`GEMINI_API_KEY` env var). If the key is missing or still the placeholder, return a hardcoded
  fallback recommendation instead of calling the API — the app must work fully offline/keyless.
- Persistence: appointments are kept in a module-level array on the server and mirrored to a JSON
  file (`appointments_data.json`) on every write; on boot, load that file if present, else seed from
  sample data. No real database.

DATA MODEL (src/types.ts)
- HairService { id, name, description, durationMinutes (always 90), basePrice, popularForHomecoming?,
  image? }. ManiAddon / PediAddon { id, name, description, price, additionalMinutes, popular? }.
  SpecificHairNeed { id, label, category: 'extensions'|'styling'|'hair_type'|'treatment' }.
  TimeSlot { id, startTime, endTime, displayLabel, isBooked, isBlocked?, bookedByClientName? }.
  ClientInfo { fullName, phone, email, instagramHandle?, schoolName, homecomingDate, readyByTime }.
  AppointmentBooking { id, createdAt, bookingCode ("HOCO-"+4 random digits), date, timeSlotId,
  timeSlotLabel, hairService, selectedHairNeeds[], customHairDetails, hairInspirationUrl?,
  selectedMani?, selectedPedi?, nailShape?, nailColorNotes?, client, totalPrice, totalDurationMinutes,
  status: 'confirmed'|'in_progress'|'completed'|'cancelled', stylistNotes? }.
  AIStyleRecommendationRequest { dressColor, dressStyle, vibe, hairLength, hairTexture }.
  AIStyleRecommendation { hairStyleSuggestion, whyItWorks, hairNeedsToSelect[], suggestedManiMatch,
  suggestedPediMatch, proStylistTip }.

SEED DATA (src/data/initialData.ts)
- 8 fixed 1.5-hour time slots from 8:00 AM to 8:30 PM with no gaps (08:00–09:30, 09:30–11:00,
  11:00–12:30, 1:00–2:30, 2:30–4:00, 4:00–5:30, 5:30–7:00, 7:00–8:30).
- 6 hair services ($110–$140, all 90 min): Hollywood Glam Waves $120, Elegant Homecoming Updo/Low
  Chignon $135, Silk Press & Glass Shine Finish $110, Half-Up Half-Down Glam Curls $115, Boho Braided
  Crown & Soft Waves $125, Custom Homecoming Specialty Hair $140 — each with a short glam description
  and an Unsplash photo; mark the first/second/fourth/sixth as "popularForHomecoming" ("Aggie
  Favorite" badge).
- 10 specific-hair-need checkboxes across 4 categories (clip-ins, tape/sew-ins, glitter spray, gem
  placement, extra-hold freeze spray, crown teasing/volume, crown/side braid accent, thermal
  shield/anti-frizz, thick-hair care, curl definition).
- 4 manicure add-ons (None $0, Gel Gloss $35/+30min, Acrylic Full Set w/ Art $60/+45min, Press-On
  Application $25/+20min) and 4 pedicure add-ons (None $0, Classic Express $40/+30min, Deluxe Gel Spa
  $65/+45min, Reflexology & Gloss $50/+35min).
- 2 sample confirmed appointments pre-seeded on 2026-10-10 (slots 2 and 5) so the dashboard and slot
  picker have realistic data on first load.

BOOKING WIZARD (client view, `activeView === 'booking'`)
- A 4-step wizard (state: currentStep 1–4) with a progress header showing "Step N of 4" and 4 clickable
  step tiles (Date & Slot / Hair & Needs / Mani & Pedi / Contact & Schedule) — a tile is only reachable
  by clicking if it's behind the current step or the current step's validation passes.
- Step 1: pick a homecoming date from 3 preset date cards (Fri Oct 9 "Pep Rally & Gala", Sat Oct 10
  "Main Aggie Homecoming" — default selected, Sat Oct 17 "Post-Homecoming Events") or a native date
  input; then pick one of the 8 time slots, rendered as a 1–4 column grid of cards that are disabled
  ("Booked") when `isBooked`/`isBlocked`, highlighted navy-with-gold-ring when selected, otherwise
  outlined "Open". Slot availability is recomputed from the live appointments list whenever the date
  or appointments change (an appointment on the same date/timeSlotId with status !== 'cancelled'
  marks that slot booked and shows the booker's name).
- Step 2: a 1–3 column grid of hair-service cards (photo with a bottom-right price chip and a top-left
  gold "Aggie Favorite" badge when popular; selecting ring-highlights the card and shows a check badge),
  then a checklist grid of the 10 specific-need checkboxes, then a free-text "Custom Hair Details"
  textarea and an optional "Inspiration Image URL" text input.
- Step 3: a 2-column grid of manicure cards and a 2-column grid of pedicure cards (each shows name,
  "+$N"/"No Add-On" price chip, description, additional minutes, and a check mark when selected).
  Only when a paid mani or pedi is selected, reveal a nail-shape button row (Almond/Coffin/Square/
  Oval/Stiletto/Natural) and a "Nail Polish / Art Notes (Matching Dress)" text input.
- Step 4: required Full Name / Phone / Email fields plus optional Instagram handle, University/Org
  name (default "Westlake High School"), and a free-text "Ready By" target time (default "3:30 PM").
  Inline red error text appears per-field if Confirm is pressed with any required field missing or
  the email has no "@".
- A sticky right-hand summary sidebar (visible on all 4 steps) recomputes live: total price = hair
  base price + mani price + pedi price; total duration = hair minutes + mani minutes + pedi minutes
  (shown as "Xh Ym"); shows the chosen date/slot, hair style (+ up to 3 need chips, "+N more" beyond
  that), and mani/pedi lines. A "Next Step" button advances (disabled until the current step
  validates); on step 4 it becomes "Confirm & Reserve Appointment" (disabled while submitting), and a
  "Previous Step" link appears once past step 1.
- Confirming POSTs the booking (id `"b-" + Date.now()`, bookingCode `"HOCO-" + random 4-digit`,
  createdAt now, status "confirmed") to `POST /api/appointments`; on success (or on fetch failure,
  falling back to a client-side-only booking) prepend it to the appointments list and open the
  confirmation modal. A "Book Another Appointment" action resets the wizard to step 1 and clears the
  form (keeping the selected date) without closing/reopening — the confirmation modal's own close
  button and its "new booking" button both reset state.

CONFIRMATION MODAL ("digital pass")
- Centered modal: success icon, "Aggie Homecoming Pass Reserved!" title, mono booking-code pill, then
  a pass card: salon name + total price header, a 2-column date/slot info box, the hair service name
  with its selected need chips and quoted custom-details text, mani/pedi lines with prices and nail
  notes if any, and a client/ready-by footer line. Below the card, a highlighted arrival notice
  ("N.C. A&T Aggie Salon, Student Union Beauty Hub Suite 200, Greensboro, NC... arrive 5 minutes
  before your slot with dry/washed hair"). Two actions: "Print Pass / Save PDF" (`window.print()`)
  and "Book Another Appointment".

AI STYLE CONSULTANT MODAL
- A button in the header ("Match Dress with AI") opens a modal with 4 inputs (Dress Color free text,
  default "Emerald Green"; Dress Style/Neckline free text, default "Strapless Sweetheart Satin";
  Homecoming Vibe select — Aggie Royalty Glam / Hollywood Red Carpet / Romantic & Soft Updo / Edgy
  Modern & Sleek; Hair Length select — Short/Medium/Long/Extra-Long) plus a hair-texture field.
- "Get AI Hair & Nail Recommendation" POSTs `{dressColor, dressStyle, vibe, hairLength, hairTexture}`
  to `POST /api/ai/recommendations`. Server logic: if no `GEMINI_API_KEY` (or it's still the
  placeholder "MY_GEMINI_API_KEY"), return a fixed fallback object built from the inputs:
    hairStyleSuggestion: "{vibe||'Glamorous'} Hollywood Waves with a subtle side part"
    whyItWorks: "Hollywood waves beautifully frame the neckline of a {dressColor||'homecoming'}
      {dressStyle||'gown'}, giving a timeless red-carpet silhouette that lasts through all-night
      homecoming photos and dancing."
    hairNeedsToSelect: ["Installing/Blending Clip-In Extensions", "All-Night Dance Extra-Hold Freeze
      Spray", "Pearl or Crystal Gem Hair Placement"]
    suggestedManiMatch: "High-shine Gel Gloss with a subtle glitter ombre tip matching your
      {dressColor||'homecoming'} dress."
    suggestedPediMatch: "Deluxe Gel Spa Pedicure in a neutral glossy nude or matching glossy accent
      polish."
    proStylistTip: "Book your 1.5-hour hair appointment at least 3 hours before pictures so your
      waves can set in setting clips while getting your dress on."
  Otherwise, call Gemini 2.5 Flash with a "celebrity homecoming hair stylist and luxury nail
  technician" prompt embedding all 5 inputs, instructing it to answer in pure JSON (no markdown
  fences) matching the AIStyleRecommendation shape exactly; strip any ```json fences defensively
  before `JSON.parse`. On any Gemini error, fall back to a second hardcoded recommendation (Hollywood
  Glam Waves w/ Side Sweep) rather than surfacing an error to the user.
- Render the recommendation as a result card: suggested style name + "Perfect Match" badge, a
  "Why it works" block, 2-column suggested-mani/suggested-pedi boxes, a highlighted pro-tip box, and
  an "Apply AI Style & Needs to Booking Form" button. Applying it: find the hair service whose name is
  contained in (or contains "waves" as a substring of) the recommendation's style suggestion, falling
  back to the first hair service; set it as the chosen service, set selectedHairNeeds to the
  recommendation's needs list, set the nail notes to `"{suggestedManiMatch} (Matched to {dressColor}
  dress)"`, jump the wizard to step 2, and close the modal.

STYLIST DASHBOARD (`activeView === 'dashboard'`, toggled from a header pill with a live appointment
count badge)
- A date picker filters all metrics/lists to that date. Three metric cards: Day Revenue (sum of
  totalPrice for that date), "1.5h Hair Slots" booked/total, and Beauty Add-ons ("N Mani • N Pedi"
  counts where price > 0).
- A "Master Schedule" list, one row per time slot (not per appointment) for the selected date, with a
  status filter (All/Confirmed/In-Progress/Completed/Cancelled) and a per-slot "Block Slot" toggle
  (lock icon) that marks a slot unavailable to clients without an appointment. A booked slot's row
  shows 3 columns: client name + mono booking code + phone + school + "Ready By" chip; hair service +
  need chips + quoted custom-details text; mani/pedi lines + total price + a status `<select>`
  (Confirmed/In-Progress/Completed/Cancelled, patched to the server on change) + a delete/cancel icon
  button. An empty slot shows "Open 1.5-hour slot available" or a blocked message.
- "Add Manual / Phone Booking" opens a modal for staff to log a walk-in/phone booking: name, phone,
  a slot `<select>` (disabling already-booked slots), a hair-service `<select>`, a free-text needs
  field, and mani/pedi `<select>`s — submits a confirmed booking the same way as the client wizard
  (client email defaults to a placeholder, school defaults to "Phone / Walk-In").

SERVER API
- GET /api/health -> {status:'ok', timestamp}.
- GET /api/appointments -> {appointments}. POST /api/appointments -> validates timeSlotId+client
  present, assigns id/bookingCode/createdAt/status if missing, prepends to the in-memory store,
  persists to appointments_data.json, returns 201. PATCH /api/appointments/:id -> shallow-merges
  updates (status, stylistNotes), persists, 404 if not found. DELETE /api/appointments/:id -> removes
  by id, persists, 404 if not found.
- POST /api/ai/recommendations -> the Gemini/fallback flow described above.

DESIGN SYSTEM
- Palette: Aggie Blue #004684 (primary, headers, selected states), Aggie Blue Dark #00315C (hover/
  active), Aggie Gold #FDB927 (CTAs, badges, accents on navy), page background #FDFCFB, body text
  #2D2926 / #0F172A for card text, neutral grays for secondary text (stone-400/500/600).
- Headings use a serif stack (Montserrat/Playfair Display/Georgia) via a `.font-serif` utility; body
  text uses Montserrat/Plus Jakarta Sans. Cards are white, `rounded-2xl`, `border-stone-200`, soft
  shadow. Selected/interactive states consistently use a navy ring + light-blue tint; primary CTAs are
  solid navy with gold text or solid gold with navy text; all uppercase, bold, tracked-out labels for
  section headers and buttons (brand voice: "Aggie", "Homecoming", "Glam" throughout copy).
- A persistent top header: a thin navy "Aggie pride" strip, the Aura Glam logo/title, an "AI Style
  Helper" gold button, and a two-way Book Hair / Stylist Portal switcher with a live booking-count
  badge.

QUALITY BAR
- Every price/duration total must always equal the sum of its parts (hair + mani + pedi) with no
  hidden fees. The booking flow must work end-to-end without a configured Gemini key (fallback AI,
  in-memory/file-backed appointments). Slot availability must never let two confirmed (non-cancelled)
  appointments occupy the same date+slot. Fully responsive down to mobile widths; no console errors.
```
