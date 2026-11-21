import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { SAMPLE_APPOINTMENTS, DEFAULT_TIME_SLOTS } from './src/data/initialData.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple file-backed or in-memory state persistence
const DATA_FILE = path.join(process.cwd(), 'appointments_data.json');

function loadAppointments() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading appointments file, using default sample data:', err);
  }
  return SAMPLE_APPOINTMENTS;
}

function saveAppointments(appointments: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving appointments file:', err);
  }
}

let appointmentsStore = loadAppointments();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
  res.json({ appointments: appointmentsStore });
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  try {
    const newAppointment = req.body;
    if (!newAppointment || !newAppointment.timeSlotId || !newAppointment.client) {
      return res.status(400).json({ error: 'Missing required appointment fields' });
    }

    // Assign server-generated ID & code if missing
    if (!newAppointment.id) {
      newAppointment.id = 'b-' + Date.now();
    }
    if (!newAppointment.bookingCode) {
      newAppointment.bookingCode = 'HOCO-' + Math.floor(1000 + Math.random() * 9000);
    }
    newAppointment.createdAt = new Date().toISOString();
    newAppointment.status = 'confirmed';

    appointmentsStore.unshift(newAppointment);
    saveAppointments(appointmentsStore);

    return res.status(201).json({ success: true, appointment: newAppointment });
  } catch (error: any) {
    console.error('Failed to create appointment:', error);
    return res.status(500).json({ error: 'Internal server error creating appointment' });
  }
});

// Update appointment
app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const index = appointmentsStore.findIndex((a: any) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  appointmentsStore[index] = { ...appointmentsStore[index], ...updates };
  saveAppointments(appointmentsStore);

  return res.json({ success: true, appointment: appointmentsStore[index] });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = appointmentsStore.length;
  appointmentsStore = appointmentsStore.filter((a: any) => a.id !== id);
  
  if (appointmentsStore.length === initialLength) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  saveAppointments(appointmentsStore);
  return res.json({ success: true, message: 'Appointment cancelled' });
});

// AI Homecoming Hair & Nail Style Consultant
app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { dressColor, dressStyle, vibe, hairLength, hairTexture } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Fallback recommendation if no API key is set
      return res.json({
        recommendation: {
          hairStyleSuggestion: `${vibe || 'Glamorous'} Hollywood Waves with a subtle side part`,
          whyItWorks: `Hollywood waves beautifully frame the neckline of a ${dressColor || 'homecoming'} ${dressStyle || 'gown'}, giving a timeless red-carpet silhouette that lasts through all-night homecoming photos and dancing.`,
          hairNeedsToSelect: [
            'Installing/Blending Clip-In Extensions',
            'All-Night Dance Extra-Hold Freeze Spray',
            'Pearl or Crystal Gem Hair Placement'
          ],
          suggestedManiMatch: `High-shine Gel Gloss with a subtle glitter ombre tip matching your ${dressColor || 'homecoming'} dress.`,
          suggestedPediMatch: `Deluxe Gel Spa Pedicure in a neutral glossy nude or matching glossy accent polish.`,
          proStylistTip: `Book your 1.5-hour hair appointment at least 3 hours before pictures so your waves can set in setting clips while getting your dress on.`
        }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are a celebrity homecoming hair stylist and luxury nail technician.
A high school/college student is getting ready for Homecoming dance.
Their details:
- Dress Color: ${dressColor || 'Not specified'}
- Dress Style/Neckline: ${dressStyle || 'Not specified'}
- Desired Vibe: ${vibe || 'Glamorous and chic'}
- Hair Length: ${hairLength || 'Medium'}
- Hair Texture: ${hairTexture || 'Normal'}

Provide a personalized Homecoming Hair & Nail recommendation in pure JSON format with no markdown blocks:
{
  "hairStyleSuggestion": "Name of hair style",
  "whyItWorks": "1-2 sentences explaining why this hair style complements their dress neckline and vibe",
  "hairNeedsToSelect": ["Need 1 label", "Need 2 label"],
  "suggestedManiMatch": "Recommendation for manicure style/color",
  "suggestedPediMatch": "Recommendation for pedicure polish style",
  "proStylistTip": "1 helpful advice for their 1.5-hour hair booking and homecoming timeline"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const recommendation = JSON.parse(cleanJson);

    return res.json({ recommendation });
  } catch (error: any) {
    console.error('Error generating AI recommendation:', error);
    // Graceful fallback
    return res.json({
      recommendation: {
        hairStyleSuggestion: 'Hollywood Glam Waves with Side Sweep',
        whyItWorks: 'A classic, high-shine red carpet look that complements almost all homecoming dress necklines and holds up through dancing.',
        hairNeedsToSelect: ['All-Night Dance Extra-Hold Freeze Spray', 'Crown Teasing & High-Volume Boost'],
        suggestedManiMatch: 'Gel Gloss French manicure with subtle glitter accent',
        suggestedPediMatch: 'Deluxe Gel Pedicure in matching glossy nude',
        proStylistTip: 'Bring your dress photo or inspiration pictures to your 1.5-hour hair appointment for exact customization!'
      }
    });
  }
});

// Vite Middleware & Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Homecoming Hair Booking Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
