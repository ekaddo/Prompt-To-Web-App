```text
Build a 2-page vanilla HTML/CSS/JS web app: "Aggie Tailgate Services" — a parking-slot reservation
site for a single game day, plus a staffing/cost simulator for the crews that service it.

TECH
- Two self-contained pages, no build step, no framework: index.html (reservations) and
  simulation.html (staffing simulation), linked by a shared top nav ("Slot Reservations" /
  "Staffing Simulation") with the current page marked `.active`.
- Google Fonts "Outfit" (weights 400/600/700/800) via <link>, no other font.
- jsPDF 2.5.1 via cdnjs (`jspdf.umd.min.js`) loaded only on index.html, used for client-side
  invoice generation — no server, no backend, no persistence (reservations live in memory only
  and reset on reload).
- All CSS inline in a <style> block per page; all JS inline in an IIFE `(() => { 'use strict'; ... })()`
  per page. No external JS libraries besides jsPDF.

DESIGN TOKENS (CSS custom properties, identical on both pages)
- --gold:#FFC72C --gold-dark:#D4A017 --blue:#003B71 --blue-light:#1565C0
- --bg:#0f1117 --surface:#1a1d27 --surface-2:#242836 (simulation.html adds --surface-3:#2e3245)
- --text:#e8eaed --text-dim:#9aa0b0 --radius:10px --shadow:0 8px 32px rgba(0,0,0,.45)
- simulation.html also adds status colors --green:#4caf50 --orange:#ff9800 --red:#ef5350 --cyan:#26c6da
- Body: dark background, 'Outfit' font, var(--text) color.
- Header on every page: diagonal gradient var(--blue)→#00264d, centered title in var(--gold) with a
  soft text-shadow glow, 4px solid var(--gold) bottom border, and a faint radial gold glow positioned
  top-left via a ::before pseudo-element (ellipse at 30% 0%, rgba(255,199,44,.12)→transparent).
- Nav bar directly under the header: pill-shaped links, dim text, gold background+text on hover and
  on `.active`.
- Footer: small dim centered copyright text, "© 2026 Aggie Tailgate Services. All rights reserved."
- Mobile breakpoint at 600px: shrink header title, tighten grid gaps, stack config columns to 1.

PAGE 1 — index.html (Slot Reservations)
- Header subtitle: "October 28, 2026 — Reserve Your Premium Tailgate Spot!" plus a pill badge
  "⏰ Sign-up deadline: April 28, 2026".
- A full-width red banner ("🚫 Sign-ups are closed. The registration deadline was April 28, 2026.")
  that is hidden by default and shown only when `new Date() >= DEADLINE` (DEADLINE = 2026-04-28T23:59:59,
  exactly 6 months before the Oct 28 event).
- Parking lot: 100 numbered slots, 1–100, rendered into 10 sub-row `<div>` grid containers (5 for
  "Row A" slots 1–50, 5 for "Row B" slots 51–100), each sub-row a CSS grid of `repeat(10, 1fr)`.
  Between Row A and Row B, render a horizontal "lot-road" bar with centered dim-letter-spaced text
  "— — — R O A D — — —". Build all 100 slot `<div>`s in JS: square aspect-ratio tiles, bold centered
  number, `.available` (gold fill, dark text, hover scales 1.12x with a gold glow) or `.reserved`
  (blue-light fill, white text, no hover). Clicking a slot opens the reservation modal via
  `openModal(num)`, routed into the correct sub-row container with `Math.ceil(i/10)-1`.
- Legend above the grid: gold swatch "Available", blue swatch "Reserved".
- Stats bar below the grid: "Available: N", "Reserved: N" (both recomputed from the in-memory
  reservations object), and a static "Space: $80".
- Reservation modal (overlay + centered card, blurred backdrop, slide-up keyframe entrance):
  title "Reserve Your Spot", slot label "Slot #N", a form with required Name (text), Email (email),
  Phone (tel) inputs, then an "Add-On Services" checkbox list:
    Ice Delivery $20, Setup Service $150, Cleanup Service $150
  (base Tailgate Space price is $80, always included). A live total line recomputes on every
  checkbox change: `total = 80 + sum(checked addon prices)`, shown as `$NN.NN`. Submit button:
  "Reserve & Download Invoice". Inline error text ("Please fill in all required fields.") shown if
  any required field is blank. Clicking the slot while sign-ups are closed, or re-clicking an
  already-reserved slot, shows a toast instead of opening the modal.
- On valid submit: store the reservation in an in-memory `reservations[slotNum]` object (name,
  email, phone, chosen addons, total), flip that slot's class from `.available` to `.reserved`,
  update the stats bar, close the modal, show a success toast ("✅ Slot #N reserved for {name}!"),
  and generate a PDF invoice.
- PDF invoice (jsPDF, A4 default): a full-width Aggie-Blue header bar (0,59,113) with gold title
  "Aggie Tailgate Services", white "Event: October 28, 2026" and "INVOICE" lines; invoice number
  `INV-<Date.now() base36 uppercase>` and a long-form invoice date on the next line; a "Bill To:"
  block with name/email/phone; a blue table header row ("Description" / "Amount"); zebra-striped
  line items — base "Tailgate Space — Slot #N" at $80 plus one row per selected add-on — a ruled
  total line in Aggie Blue bold ("Total Due: $NN.NN"); and a small gray footer thank-you line plus
  a contact email. Auto-download as `AggieTailgate_Slot{N}_Invoice.pdf`.
- A reusable bottom-centered toast (`.toast`/`.toast.show`) slides up and fades in/out (400ms) for
  all user feedback messages, auto-hiding after 3s.

PAGE 2 — simulation.html (Staffing & Logistics Simulation)
- Header subtitle: "Staffing & Logistics Simulation" (no deadline badge).
- A config panel with a responsive `auto-fit, minmax(280px,1fr)` grid of 4 labeled groups, each a
  surface-2 card with a 4px gold left border and an emoji+title heading:
  1) 📋 General — Total Slots to Service (100), Work Day Start 24h (8), Work Day End 24h (20,
     "12-hour working day" hint), Labor Rate $/hr (20).
  2) 🔧 Setup Crews — Number of Crews (3), People per Crew (2), Minutes per Slot (20).
  3) 🧊 Ice Delivery — Pickup Trucks (2), Staff per Truck (2, hint "1 driver + 1 offloader"),
     Delivery Frequency in hours (2), Minutes per Slot Delivery (3).
  4) 🧹 Cleanup Crews — Number of Crews (3), People per Crew (2), Minutes per Slot (30).
  All inputs are `<input type="number">` with sane min/max and the stated defaults. A centered
  gold gradient "▶ Run Simulation" button triggers the calculation; results stay hidden until run.
- Calculation on click (read every field, coercing to a positive int, default 1 on invalid input):
  - workHours = workEnd − workStart (min 1).
  - SETUP: slotsPerCrewPerHour = 60/setupMinutes; slotsPerHour = crews × that; loop hour-by-hour
    across the work window (wrapping into "Day 2", "Day 3", ... once a day's hours run out) until
    all slots are done, recording per-hour slots completed, cumulative completed, and % progress.
    Total staff = crews × people. Total labor-hours = total staff × hours actually worked;
    labor cost = labor-hours × rate.
  - ICE: rounds/day = floor(workHours / frequency); slots one truck can cover per round =
    floor(60×frequency / minutesPerSlot); slots per round = trucks × that. For each round, show
    the time window it covers, slots served vs. total, and a "✅ Full coverage" / "⚠️ N slots
    unserved" flag. Also compute trucksNeeded = ceil(totalSlots / slotsPerTruckPerRound) for the
    summary card. Ice staff work the full event day, so labor-hours = (trucks×staffPerTruck) ×
    workHours; cost = that × rate.
  - CLEANUP: identical shape to Setup (its own minutes/crews/people, its own day-wrapping loop,
    its own labor-hours and cost).
  - Grand totals: totalStaff = setup+ice+cleanup staff; totalLaborCost = sum of the three costs;
    totalLaborHours = sum of the three labor-hours.
- Results (hidden until first run, then revealed and smooth-scrolled into view):
  - 5 summary cards in a responsive grid, each with an icon, uppercase label, big gold value, and
    small detail lines, color-coded top border (green=setup, cyan=ice, orange=cleanup, gold=total):
    🔧 Setup Crew (headcount, "N crews × N people", "N days to complete (N work hrs)", cost);
    🧊 Ice Service (headcount, "N trucks × N staff", "N rounds/day, every Nh", coverage flag, cost);
    🧹 Cleanup Crew (mirrors Setup); 👥 Total Staff (combined headcount, breakdown by department,
    working-hours window); 💵 Total Labor Cost (grand total, total labor-hours @ rate, one-line
    per-department cost breakdown), this last card's border forced to green regardless of the
    shared `.total` class.
  - 3 hour-by-hour timeline tables (Setup, Ice, Cleanup), each inside a card with a colored dot +
    heading. Setup/Cleanup tables: columns Time Block ("Day N " prefix once multi-day) / Crew
    Active (pill badge "N crews × N ppl") / Slots This Hour / Cumulative ("done / total") /
    Progress (animated gradient fill bar with the % printed inside it). Ice table: columns
    Delivery Window ("Round N: 8:00 AM–10:00 AM") / Crew Active (pill "N trucks × N staff") /
    Slots Served ("N / total slots") / Coverage (✅/⚠️ text) / Capacity Used (same style progress
    bar). Format all clock hours via a 12-hour `fmtHour` helper (0/12 → 12, else mod 12, AM/PM).
    Format all money via `toLocaleString` with exactly 2 decimals and a leading "$".

QUALITY BAR
- No backend, no persistence — a page refresh resets both the parking lot and the simulation.
- All arithmetic must be derivable purely from the visible config inputs (no hidden state); the
  summary cards and the timeline tables must always agree with each other and with the formulas
  above for any input combination, including edge cases like 1 slot or a 1-hour work day.
- Fully responsive down to ~360px width; works with no JavaScript framework and no network access
  beyond the Google Font and (on index.html) the jsPDF CDN script.
```
