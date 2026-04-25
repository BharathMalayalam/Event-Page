import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaSchool } from 'react-icons/fa'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EventFeatureCard from './components/EventFeatureCard'
import FloatingBlobs from './components/FloatingBlobs'
import GlassButton from './components/GlassButton'
import SectionWrap from './components/SectionWrap'
import SiteFooter from './components/SiteFooter'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'edu-admin-token'

const emptyForm = {
  title: '',
  venue: '',
  location: '',
  date: '',
  image: '',
  status: 'active',
  description: '',
}

const cardMotion = {
  rest: { y: 0, boxShadow: '0 12px 24px rgba(13, 76, 133, 0.08)' },
  hover: { y: -6, boxShadow: '0 24px 34px rgba(13, 76, 133, 0.16)' },
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.message || 'Request failed')
  }

  return response.json()
}

function formatDate(dateValue) {
  if (!dateValue) return 'TBA'
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function eventInquiry(eventTitle) {
  window.open(`mailto:events@greenfield.edu?subject=Inquiry about ${eventTitle}`, '_blank')
}

function HighlightHero({ events }) {
  const [index, setIndex] = useState(0)
  const activeEvent = events[index] || null

  useEffect(() => {
    if (events.length <= 1) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [events])

  useEffect(() => {
    setIndex(0)
  }, [events.length])

  if (!activeEvent) return null

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/50 shadow-2xl shadow-sky-200/45">
      <FloatingBlobs />
      <div className="relative">
        <motion.div
          key={activeEvent._id}
          initial={{ x: 120, opacity: 0.4 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -120, opacity: 0.4 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="relative"
        >
          <img
            src={activeEvent.image}
            alt={activeEvent.title}
            className="h-[420px] w-full object-cover sm:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-sky-900/15 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 flex items-end">
          <div className="m-4 max-w-3xl space-y-4 rounded-2xl border border-white/35 bg-white/15 p-6 text-white shadow-xl backdrop-blur-xl sm:m-8 sm:p-8">
            <p className="inline-flex rounded-full border border-sky-200/30 bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
              Top Highlights
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{activeEvent.title}</h1>
            <p className="max-w-2xl text-sm text-sky-50 sm:text-base">{activeEvent.description}</p>
            <div className="grid gap-2 text-sm sm:grid-cols-3 sm:text-base">
              <p className="flex items-center gap-2"><FaCalendarAlt />{formatDate(activeEvent.date)}</p>
              <p className="flex items-center gap-2"><FaSchool />{activeEvent.venue}</p>
              <p className="flex items-center gap-2"><FaMapMarkerAlt />{activeEvent.location}</p>
            </div>
            <GlassButton onClick={() => eventInquiry(activeEvent.title)} className="text-sky-900">
              Register Now
            </GlassButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-8 z-20 flex gap-2">
        {events.map((_, eventIndex) => (
          <button
            key={eventIndex}
            type="button"
            onClick={() => setIndex(eventIndex)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === eventIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${eventIndex + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

function EventSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-sky-100 bg-white p-4">
      <div className="h-44 rounded-lg bg-sky-100" />
      <div className="mt-4 h-4 w-1/2 rounded bg-sky-100" />
      <div className="mt-2 h-4 w-3/4 rounded bg-sky-100" />
      <div className="mt-3 h-3 w-full rounded bg-sky-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-sky-100" />
    </div>
  )
}

function EventCard({ event, muted = false }) {
  return (
    <motion.article
      initial="rest"
      whileHover={muted ? 'rest' : 'hover'}
      variants={cardMotion}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`group overflow-hidden rounded-2xl border ${
        muted ? 'border-slate-200 bg-slate-50/90' : 'border-sky-200 bg-white'
      }`}
    >
      <div className="overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              muted ? 'bg-slate-200 text-slate-600' : 'bg-sky-100 text-sky-700'
            }`}
          >
            {muted ? 'Completed' : 'Active'}
          </span>
          <span className="text-sm text-slate-500">{formatDate(event.date)}</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-800">{event.title}</h3>
        <p className="text-sm text-slate-600">{event.description}</p>
        <p className="flex items-center gap-2 text-sm text-slate-600"><FaSchool />{event.venue}</p>
        <p className="flex items-center gap-2 text-sm text-slate-600"><FaMapMarkerAlt />{event.location}</p>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => eventInquiry(event.title)}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Enquire
          </button>
          {muted ? (
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View Details
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

function UserPage({ events, loading }) {
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
  const active = sorted.filter((event) => event.status === 'active')
  const past = sorted.filter((event) => event.status === 'past')
  const highlightedEvents = active.filter((event) => event.isHighlighted)
  const topHighlights = highlightedEvents

  return (
    <main className="relative w-full space-y-10 py-8">
      <FloatingBlobs />
      <section className="relative z-10 mx-auto max-w-7xl space-y-3 px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600">
          Institution Events
        </p>
        <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
          Crafted experiences for learning communities
        </h2>
      </section>

      {loading ? (
        <div className="mx-4 h-[420px] animate-pulse rounded-2xl bg-sky-100 sm:mx-6 sm:h-[480px] lg:mx-8" />
      ) : (
        <HighlightHero events={topHighlights} />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrap
          title="Event Highlights"
          subtitle="High-priority opportunities for students and faculty"
        >
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => <EventSkeleton key={`active-skeleton-${idx}`} />)
              : active.map((event) => (
                  <EventFeatureCard
                    key={event._id}
                    event={event}
                    onInquire={() => eventInquiry(event.title)}
                  />
                ))}
          </motion.div>
        </SectionWrap>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrap
          title="Past Events"
          subtitle="Completed events and institutional highlights"
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => <EventSkeleton key={`past-skeleton-${idx}`} />)
              : past.map((event) => <EventCard key={event._id} event={event} muted />)}
          </div>
        </SectionWrap>
      </div>

      <SiteFooter />
    </main>
  )
}

function AdminPage({ events, refreshEvents }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const sorted = useMemo(() => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)), [events])

  function handleLogin(e) {
    e.preventDefault()
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
      .then((data) => {
        sessionStorage.setItem(TOKEN_KEY, data.token)
        setToken(data.token)
        setError('')
      })
      .catch((apiError) => setError(apiError.message))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: String(reader.result || '') }))
    }
    reader.readAsDataURL(file)
  }

  function resetForm() {
    setEditingId(null)
    setFormData(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.title || !formData.venue || !formData.location || !formData.date || !formData.image) return

    try {
      if (editingId) {
        await apiFetch(`/events/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await apiFetch('/events', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      await refreshEvents()
      resetForm()
      setStatusMessage(editingId ? 'Event updated.' : 'Event added.')
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  function handleEdit(eventItem) {
    setEditingId(eventItem._id)
    setFormData({
      title: eventItem.title,
      venue: eventItem.venue,
      location: eventItem.location,
      date: eventItem.date,
      image: eventItem.image,
      status: eventItem.status,
      description: eventItem.description || '',
      isHighlighted: eventItem.isHighlighted || false,
    })
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      await refreshEvents()
      setStatusMessage('Event deleted.')
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  async function toggleStatus(event) {
    try {
      await apiFetch(`/events/${event._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: event.status === 'active' ? 'past' : 'active',
        }),
        headers: { Authorization: `Bearer ${token}` },
      })
      await refreshEvents()
      setError('')
      setStatusMessage('Event status updated.')
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  async function setHighlighted(id, currentHighlightStatus) {
    const nextStatus = !currentHighlightStatus
    try {
      await apiFetch(`/events/${id}/highlight`, {
        method: 'PATCH',
        body: JSON.stringify({ isHighlighted: nextStatus }),
        headers: { Authorization: `Bearer ${token}` },
      })
      await refreshEvents()
      setError('')
      setStatusMessage('Highlight status updated.')
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-[75vh] max-w-md items-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full space-y-4 rounded-2xl border border-sky-200 bg-white p-6 shadow-xl shadow-sky-100"
        >
          <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
          <p className="text-sm text-slate-500">Secure endpoint: /admin</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded-xl border border-sky-200 px-4 py-2.5 outline-none ring-sky-400 focus:ring-2"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-xl bg-sky-600 py-2.5 font-semibold text-white hover:bg-sky-700">
            Login
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1.1fr_1fr]">
      <section className="space-y-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-xl shadow-sky-100">
        <h2 className="text-2xl font-bold text-slate-800">{editingId ? 'Edit Event' : 'Add Event'}</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Event title" className="rounded-xl border border-sky-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Short event description" rows={3} className="rounded-xl border border-sky-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" className="rounded-xl border border-sky-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="rounded-xl border border-sky-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="rounded-xl border border-sky-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL (optional when uploading file)" className="rounded-xl border border-sky-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="rounded-xl border border-sky-200 px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:font-semibold file:text-sky-700" />
          <select name="status" value={formData.status} onChange={handleChange} className="rounded-xl border border-sky-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400">
            <option value="active">Active</option>
            <option value="past">Past</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.isHighlighted || false}
              onChange={(e) => setFormData((prev) => ({ ...prev, isHighlighted: e.target.checked }))}
            />
            Set as highlighted event
          </label>
          <div className="flex flex-wrap gap-2 pt-2">
            <button type="submit" className="rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white hover:bg-sky-700">
              {editingId ? 'Update Event' : 'Add Event'}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {statusMessage ? <p className="text-sm text-emerald-700">{statusMessage}</p> : null}
      </section>

      <section className="space-y-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-xl shadow-sky-100">
        <h2 className="text-2xl font-bold text-slate-800">Manage Events</h2>
        <div className="space-y-3">
          {sorted.map((event) => (
            <div key={event._id} className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
              <h3 className="font-semibold text-slate-800">{event.title}</h3>
              <p className="text-sm text-slate-600">{event.venue}</p>
              <p className="text-sm text-slate-500">{formatDate(event.date)}</p>
              {event.isHighlighted ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-sky-700">Highlighted</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => handleEdit(event)} className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-700">Edit</button>
                <button type="button" onClick={() => toggleStatus(event)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-white">
                  {event.status === 'active' ? 'Move to Past' : 'Move to Active'}
                </button>
                <button type="button" onClick={() => setHighlighted(event._id, event.isHighlighted)} className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-100">
                  {event.isHighlighted ? 'Unhighlight' : 'Highlight'}
                </button>
                <button type="button" onClick={() => handleDelete(event._id)} className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  async function refreshEvents() {
    setLoading(true)
    try {
      const data = await apiFetch(`/events?t=${Date.now()}`)
      setEvents(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshEvents()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Routes>
          <Route path="/" element={<UserPage events={events} loading={loading} />} />
          <Route path="/admin" element={<AdminPage events={events} refreshEvents={refreshEvents} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
