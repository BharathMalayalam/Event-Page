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
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected successfully to database.')

    // Ensure all existing documents have the isHighlighted field
    const updateResult = await Event.updateMany({ isHighlighted: { $exists: false } }, { isHighlighted: false })
    if (updateResult.modifiedCount > 0) {
      console.log(`Migrated ${updateResult.modifiedCount} events with missing highlight field.`)
    }

    const count = await Event.countDocuments()
    console.log(`Database ready. Current event count: ${count}`)

    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Critical Error during bootstrap:')
    console.error(error)
    process.exit(1)
  }
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error)
  process.exit(1)
})
