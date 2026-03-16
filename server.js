require('dotenv').config();
const express = require('express');

const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security Middleware ──

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files ──
app.use(express.static(path.join(__dirname, 'public')));

// ── Rate Limiting ──
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' }
});

const membershipLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// ── In-Memory Data Store (replace with DB in production) ──
const db = {
  contacts: [],
  memberships: [],
  newsletter: [],
  stats: { members: 12847, programs: 150, trainers: 20, retention: 98 }
};

// ══════════════════════════════════════════
// API ROUTES
// ══════════════════════════════════════════

// GET /api/stats — live gym stats
app.get('/api/stats', (req, res) => {
  res.json({ success: true, data: db.stats });
});

// GET /api/programs — all fitness programs
app.get('/api/programs', (req, res) => {
  const programs = [
    { id: 1, name: 'Strength & Powerlifting', category: 'strength', icon: '🏋️', duration: '60 min', level: 'All Levels', sessions: '5x/week', description: 'Build raw power and muscle mass with progressive overload programming.' },
    { id: 2, name: 'HIIT Cardio Burn', category: 'cardio', icon: '⚡', duration: '45 min', level: 'Intermediate+', sessions: '4x/week', description: 'High-intensity intervals that torch fat and skyrocket your endurance.' },
    { id: 3, name: 'Yoga & Mobility', category: 'flexibility', icon: '🧘', duration: '60 min', level: 'All Levels', sessions: '3x/week', description: 'Restore, recover and move better with expert-guided mobility work.' },
    { id: 4, name: 'Boxing & MMA', category: 'combat', icon: '🥊', duration: '75 min', level: 'Beginner–Advanced', sessions: '4x/week', description: 'Learn real fighting technique while burning up to 900 calories per session.' },
    { id: 5, name: 'CrossFit Circuits', category: 'cardio', icon: '🔥', duration: '50 min', level: 'Intermediate', sessions: '5x/week', description: 'Functional movements at high intensity — the ultimate full-body challenge.' },
    { id: 6, name: 'Spin & Cycling', category: 'cardio', icon: '🚴', duration: '45 min', level: 'All Levels', sessions: '6x/week', description: 'Rhythm-based cycling sessions that build legs, lungs and mental grit.' }
  ];
  const { category } = req.query;
  const filtered = category && category !== 'all'
    ? programs.filter(p => p.category === category)
    : programs;
  res.json({ success: true, data: filtered });
});

// GET /api/trainers — trainer profiles
app.get('/api/trainers', (req, res) => {
  const trainers = [
    { id: 1, name: 'Marcus Kane', specialty: 'Strength Coach', experience: '12 Years', certifications: ['NSCA-CPT', 'CSCS'], badge: 'Head Coach', initials: 'MK', color: '#3d1015', rating: 5.0 },
    { id: 2, name: 'Sara Chen', specialty: 'HIIT Specialist', experience: '8 Years', certifications: ['ACE-CPT', 'HIIT Pro'], badge: '5★ Rated', initials: 'SC', color: '#0f2218', rating: 4.9 },
    { id: 3, name: 'Dev Joshi', specialty: 'Boxing & MMA', experience: '15 Years', certifications: ['Pro Boxer', 'MMA Coach'], badge: 'Pro Athlete', initials: 'DJ', color: '#151533', rating: 5.0 },
    { id: 4, name: 'Anya Larson', specialty: 'Yoga & Mobility', experience: '10 Years', certifications: ['RYT-500', 'FMS Level 2'], badge: 'Certified', initials: 'AL', color: '#3d2d0e', rating: 4.8 }
  ];
  res.json({ success: true, data: trainers });
});

// GET /api/pricing — membership tiers
app.get('/api/pricing', (req, res) => {
  const plans = [
    {
      id: 1, name: 'Starter', price: { monthly: 29, annual: 23 }, featured: false,
      features: [
        { text: 'Full gym floor access', included: true },
        { text: '5 group classes/month', included: true },
        { text: 'Locker room access', included: true },
        { text: 'Personal trainer sessions', included: false },
        { text: 'Nutrition planning', included: false }
      ],
      cta: 'Get Started'
    },
    {
      id: 2, name: 'Elite', price: { monthly: 59, annual: 47 }, featured: true,
      features: [
        { text: 'Unlimited gym access', included: true },
        { text: 'All group classes', included: true },
        { text: '2 trainer sessions/month', included: true },
        { text: 'Body composition tracking', included: true },
        { text: 'Nutrition planning', included: false }
      ],
      cta: 'Go Elite'
    },
    {
      id: 3, name: 'Pro', price: { monthly: 99, annual: 79 }, featured: false,
      features: [
        { text: 'Everything in Elite', included: true },
        { text: 'Daily coaching access', included: true },
        { text: 'Custom nutrition plan', included: true },
        { text: 'Priority class booking', included: true },
        { text: 'Monthly progress report', included: true }
      ],
      cta: 'Go Pro'
    }
  ];
  res.json({ success: true, data: plans });
});

// GET /api/testimonials
app.get('/api/testimonials', (req, res) => {
  const testimonials = [
    { id: 1, name: 'Priya Sharma', duration: 'Member since 2022', result: '-18kg in 5 months', rating: 5, quote: 'Lost 18kg in 5 months with ForgeFit. The trainers don\'t let you quit — and that\'s exactly what I needed. Best investment I\'ve ever made in myself.' },
    { id: 2, name: 'Arjun Mehta', duration: 'Member since 2021', result: '+12kg muscle in 8 months', rating: 5, quote: 'Went from skinny to strong in under a year. Marcus\'s programming is elite level. This gym actually changes your body AND your mindset.' },
    { id: 3, name: 'Kavitha Nair', duration: 'Member since 2023', result: 'Completed first marathon', rating: 5, quote: 'Came in wanting to get fit. Left having completed a marathon. The HIIT and mobility classes here are genuinely world-class.' }
  ];
  res.json({ success: true, data: testimonials });
});

// POST /api/contact — contact form submission
app.post('/api/contact', contactLimiter, (req, res) => {
  const { firstName, lastName, email, goal, message } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !goal) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const contact = {
    id: Date.now(),
    firstName, lastName, email, goal,
    message: message || '',
    createdAt: new Date().toISOString()
  };
  db.contacts.push(contact);

  console.log(`📬 New contact: ${firstName} ${lastName} <${email}> — Goal: ${goal}`);

  res.json({
    success: true,
    message: `Thanks ${firstName}! We'll contact you within 24 hours to schedule your free consultation.`
  });
});

// POST /api/membership — membership sign-up
app.post('/api/membership', membershipLimiter, (req, res) => {
  const { name, email, plan, billing } = req.body;

  if (!name || !email || !plan) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const membership = {
    id: Date.now(),
    name, email, plan,
    billing: billing || 'monthly',
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  db.memberships.push(membership);

  console.log(`💪 New membership: ${name} → ${plan} (${billing || 'monthly'})`);

  res.json({
    success: true,
    message: `Welcome to ForgeFit, ${name.split(' ')[0]}! Your ${plan} membership is being set up. Check your email for next steps.`
  });
});

// POST /api/newsletter
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email required.' });
  }
  if (db.newsletter.find(e => e.email === email)) {
    return res.json({ success: true, message: 'You\'re already subscribed!' });
  }
  db.newsletter.push({ email, createdAt: new Date().toISOString() });
  res.json({ success: true, message: 'Subscribed! Expect fire content in your inbox.' });
});

// GET /api/admin/summary (simple admin endpoint)
app.get('/api/admin/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalContacts: db.contacts.length,
      totalMemberships: db.memberships.length,
      newsletterSubscribers: db.newsletter.length,
      recentContacts: db.contacts.slice(-5)
    }
  });
});

// ── Serve index.html for all non-API routes ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── 404 & Error Handlers ──
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🔥 ForgeFit Server running at http://localhost:${PORT}`);
  console.log(`📊 API endpoints ready at http://localhost:${PORT}/api\n`);
});

module.exports = app;
