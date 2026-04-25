import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edu-events'
const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-in-production'
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH || '$2b$12$WTIyvC/QxZLW7ctTJemhDODG/6kgvcUawlUVCWXy8bMKb9qna6GAi'

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
)
app.use(express.json({ limit: '10mb' }))

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['active', 'past'], default: 'active' },
    isHighlighted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const Event = mongoose.model('Event', eventSchema)

const defaultEvents = [
  {
    title: 'Global EdTech & AI Leadership Summit',
    venue: 'Founders Auditorium',
    location: 'North Campus, Chennai',
    date: '2026-07-10',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description:
      'Connect with visionary educators and innovators shaping future-ready institutions.',
    isHighlighted: true,
  },
  {
    title: 'Faculty Excellence Conclave',
    venue: 'Blue Hall',
    location: 'Central Academic Block',
    date: '2026-08-02',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Workshops and keynote sessions for academic excellence, pedagogy, and research.',
    isHighlighted: true,
  },
  {
    title: 'Future Scholars Research Meet',
    venue: 'Innovation Hub',
    location: 'East Campus, Chennai',
    date: '2026-09-15',
    image:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1e2?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Students present cross-disciplinary research to faculty and industry mentors.',
    isHighlighted: false,
  },
  {
    title: 'Campus Startup Pitch Day',
    venue: 'Entrepreneurship Lab',
    location: 'West Campus, Chennai',
    date: '2026-09-28',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Student founders pitch ideas to investors, mentors, and incubator partners.',
    isHighlighted: true,
  },
  {
    title: 'International Language & Culture Expo',
    venue: 'Global Exchange Hall',
    location: 'Main Campus',
    date: '2026-10-05',
    image:
      'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Celebrate multilingual learning, cultural exchange, and global collaboration.',
    isHighlighted: false,
  },
  {
    title: 'Advanced Robotics Bootcamp',
    venue: 'Robotics Research Center',
    location: 'Tech Block, Chennai',
    date: '2026-10-18',
    image:
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Hands-on robotics build sessions guided by industry engineers and faculty experts.',
    isHighlighted: false,
  },
  {
    title: 'Digital Marketing Masterclass',
    venue: 'Business Innovation Hall',
    location: 'North Campus',
    date: '2026-11-03',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Practical strategy sessions on branding, analytics, and growth campaigns.',
    isHighlighted: false,
  },
  {
    title: 'National Coding Championship',
    venue: 'Smart Lab Complex',
    location: 'East Campus',
    date: '2026-11-20',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Top coders compete in algorithmic and full-stack rounds with live leaderboard.',
    isHighlighted: false,
  },
  {
    title: 'Design Thinking for Educators',
    venue: 'Creative Studio',
    location: 'Central Block',
    date: '2026-12-02',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Faculty workshop focused on student-centric curriculum and innovation methods.',
    isHighlighted: false,
  },
  {
    title: 'Data Science Career Fair',
    venue: 'Placement Convention Center',
    location: 'Main Campus',
    date: '2026-12-15',
    image:
      'https://images.unsplash.com/photo-1551281044-8b2f1f7b5d8d?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Meet hiring teams, attend career talks, and explore internships in analytics.',
    isHighlighted: false,
  },
  {
    title: 'Sustainability & Green Campus Forum',
    venue: 'Eco Innovation Hall',
    location: 'South Campus',
    date: '2027-01-08',
    image:
      'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1400&q=80',
    status: 'active',
    description: 'Panel discussions and projects on renewable practices and sustainable education.',
    isHighlighted: false,
  },
  {
    title: 'Innovation Fest 2025',
    venue: 'Open Learning Arena',
    location: 'South Campus',
    date: '2025-12-12',
    image:
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=80',
    status: 'past',
    description: 'Showcase of student projects, prototypes, and multidisciplinary collaboration.',
    isHighlighted: false,
  },
]

function signAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token) {
    return res.status(401).json({ message: 'Admin token missing' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    req.user = payload
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body || {}

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Password is required' })
  }

  const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid admin credentials' })
  }

  return res.json({ token: signAdminToken() })
})

app.get('/api/events', async (_req, res) => {
  const events = await Event.find().sort({ date: 1, createdAt: -1 }).lean()
  return res.json(events)
})

app.post('/api/events', requireAdmin, async (req, res) => {
  const payload = req.body || {}
  const created = await Event.create(payload)
  return res.status(201).json(created)
})

app.put('/api/events/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const payload = req.body || {}

  const updated = await Event.findByIdAndUpdate(id, payload, {
    returnDocument: 'after',
    runValidators: true,
  })
  if (!updated) {
    return res.status(404).json({ message: 'Event not found' })
  }
  return res.json(updated)
})

app.patch('/api/events/:id/highlight', requireAdmin, async (req, res) => {
  const { id } = req.params
  console.log(`[ADMIN] PATCH /api/events/${id}/highlight received. Body:`, req.body)
  
  const body = req.body || {}
  // Handle both boolean and string "true"/"false" just in case
  let isHighlighted = body.isHighlighted
  if (typeof isHighlighted === 'string') isHighlighted = isHighlighted === 'true'
  if (typeof isHighlighted !== 'boolean') isHighlighted = true

  console.log(`[ADMIN] Calculated isHighlighted for ${id}: ${isHighlighted}`)

  const updated = await Event.findByIdAndUpdate(
    id, 
    { $set: { isHighlighted } }, 
    { returnDocument: 'after' }
  )
  
  if (!updated) {
    console.log(`[ADMIN] Event ${id} not found for highlight update`)
    return res.status(404).json({ message: 'Event not found' })
  }
  
  console.log(`[ADMIN] Successfully updated event ${id}. New isHighlighted: ${updated.isHighlighted}`)
  return res.json(updated)
})

app.patch('/api/events/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}

  if (!['active', 'past'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  const updated = await Event.findByIdAndUpdate(id, { status }, { returnDocument: 'after', runValidators: true })
  if (!updated) {
    return res.status(404).json({ message: 'Event not found' })
  }
  return res.json(updated)
})

app.delete('/api/events/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const deleted = await Event.findByIdAndDelete(id)
  if (!deleted) {
    return res.status(404).json({ message: 'Event not found' })
  }
  return res.json({ success: true })
})

async function bootstrap() {
  await mongoose.connect(MONGODB_URI)
  const count = await Event.countDocuments()
  if (count === 0) {
    await Event.insertMany(defaultEvents)
  } else {
    // Ensure all existing documents have the isHighlighted field
    await Event.updateMany({ isHighlighted: { $exists: false } }, { isHighlighted: false })
    
    const existingTitles = new Set((await Event.find({}, { title: 1 }).lean()).map((event) => event.title))
    const missingDefaults = defaultEvents.filter((event) => !existingTitles.has(event.title))
    if (missingDefaults.length > 0) {
      await Event.insertMany(missingDefaults)
    }
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`)
  })
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error)
  process.exit(1)
})
