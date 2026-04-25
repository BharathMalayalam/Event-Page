import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaSchool } from 'react-icons/fa'
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
  const { headers, ...rest } = options
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...rest,
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
    }, 6000)
    return () => clearInterval(timer)
  }, [events])

  useEffect(() => {
    setIndex(0)
  }, [events.length])

  if (!activeEvent) return null

  return (
    <section className="relative mx-4 overflow-hidden rounded-[3rem] border border-white/40 shadow-2xl shadow-sky-200/50 sm:mx-8">
      <div className="relative h-[500px] w-full overflow-hidden sm:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvent._id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0"
          >
            <img
              src={activeEvent.image}
              alt={activeEvent.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center">
          <div className="ml-6 max-w-2xl space-y-6 sm:ml-12">
            <motion.div
              key={`text-${activeEvent._id}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Featured Experience</span>
              </div>
              
              <h1 className="text-4xl font-black leading-tight text-white sm:text-7xl">
                {activeEvent.title}
              </h1>
              
              <p className="text-sm font-medium leading-relaxed text-sky-100/90 sm:text-lg">
                {activeEvent.description}
              </p>
            </motion.div>

            <motion.div
              key={`meta-${activeEvent._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-white/80"
            >
              <span className="flex items-center gap-2.5"><FaCalendarAlt className="text-sky-400" /> {formatDate(activeEvent.date)}</span>
              <span className="flex items-center gap-2.5"><FaSchool className="text-sky-400" /> {activeEvent.venue}</span>
            </motion.div>

            <motion.div
              key={`btn-${activeEvent._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-4"
            >
              <button
                onClick={() => eventInquiry(activeEvent.title)}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-sky-500 hover:text-white"
              >
                <span>Register Now</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pagination indicators (Horizontal Lines) */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3 sm:left-auto sm:right-10 sm:translate-x-0">
        {events.map((_, eventIndex) => (
          <button
            key={eventIndex}
            type="button"
            onClick={() => setIndex(eventIndex)}
            className="group relative h-1.5 w-12 overflow-hidden rounded-full bg-white/20 transition-all hover:bg-white/40"
            aria-label={`Go to slide ${eventIndex + 1}`}
          >
            <motion.div
              initial={false}
              animate={{ width: index === eventIndex ? '100%' : '0%' }}
              className="absolute inset-0 bg-white"
            />
          </button>
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={muted ? { y: -5 } : { y: -8 }}
      className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
        muted 
          ? 'border-slate-100 bg-slate-50/50 grayscale-[0.5] hover:grayscale-0' 
          : 'border-sky-100 bg-white'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
            {muted ? 'Archive' : 'Active'}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5">
             <FaCalendarAlt className="text-sky-400" /> {formatDate(event.date)}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-sky-700">
          {event.title}
        </h3>
        
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
          {event.description}
        </p>

        <div className="flex items-center gap-4 pt-2 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1.5"><FaSchool className="text-sky-300" /> {event.venue}</span>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => eventInquiry(event.title)}
            className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-sky-700"
          >
            Enquire
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Details
          </button>
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Decorative background for the active events section */}
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-sky-100/40 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-50/30 blur-[100px]" />

        <SectionWrap
          title={
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-sky-500">Featured Now</span>
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Upcoming Experiences</span>
            </div>
          }
          subtitle="Discover curated events designed to inspire, educate, and connect our community."
        >
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { 
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                } 
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="relative z-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => <EventSkeleton key={`active-skeleton-${idx}`} />)
              : active.map((event) => (
                  <motion.div
                    key={event._id}
                    variants={{
                      hidden: { opacity: 0, y: 40, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <EventFeatureCard
                      event={event}
                      onInquire={() => eventInquiry(event.title)}
                    />
                  </motion.div>
                ))}
          </motion.div>

          {!loading && active.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-sky-200 bg-sky-50/50 py-20 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl shadow-sky-100">
                <FaCalendarAlt className="text-3xl text-sky-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No active events found</h3>
              <p className="mt-2 text-slate-500">Check back later for new opportunities!</p>
            </div>
          )}
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sorted = useMemo(() => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)), [events])

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
      .then((data) => {
        sessionStorage.setItem(TOKEN_KEY, data.token)
        setToken(data.token)
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
    setError('')
    setStatusMessage('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.title || !formData.venue || !formData.location || !formData.date || !formData.image) {
      setError('Please fill in all required fields (Title, Venue, Location, Date, Image).')
      return
    }

    setIsSubmitting(true)
    setError('')
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
      const msg = editingId ? 'Event updated successfully.' : 'Event added successfully.'
      resetForm()
      setStatusMessage(msg)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(eventItem) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    if (!window.confirm('Are you sure you want to delete this event?')) return
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
      setStatusMessage('Highlight status updated.')
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8 rounded-[2.5rem] border border-white bg-white/70 p-10 shadow-2xl shadow-sky-100 backdrop-blur-2xl"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Admin Login</h2>
            <p className="text-sm font-medium text-slate-500">Secure access to events management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-100 bg-white px-5 py-4 text-slate-900 shadow-sm outline-none ring-sky-500 transition-all focus:ring-2"
              />
            </div>
            {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 py-4 font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-sky-700 hover:shadow-sky-100 active:scale-[0.98]"
            >
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Experience Console</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-[0.2em]">Manage your institutional events and highlights</p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(TOKEN_KEY)
            setToken('')
          }}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-50 hover:text-red-500"
        >
          Logout Session
        </button>
      </header>

      <div className="space-y-12">
        {/* Top Section: Form (Full Width) */}
        <section className="rounded-[3rem] border border-white bg-white/70 p-10 shadow-2xl shadow-sky-100 backdrop-blur-2xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {editingId ? 'Edit Event Details' : 'Deploy New Experience'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs font-bold uppercase tracking-widest text-sky-600 hover:text-sky-800">
                Discard Changes
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full lg:col-span-1 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Annual Tech Symposium" className="w-full rounded-2xl border border-slate-100 bg-white/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-2xl border border-slate-100 bg-white/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category / Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-2xl border border-slate-100 bg-white/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="active">Active Now</option>
                  <option value="past">Archive / Past</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Venue</label>
                <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Main Auditorium" className="w-full rounded-2xl border border-slate-100 bg-white/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="North Wing" className="w-full rounded-2xl border border-slate-100 bg-white/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>

              <div className="lg:col-span-1 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Banner Image Source</label>
                <div className="flex gap-2">
                  <input name="image" value={formData.image} onChange={handleChange} placeholder="URL or Upload ->" className="flex-1 rounded-2xl border border-slate-100 bg-white/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="flex cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-6 text-white transition hover:bg-sky-600">
                    <FaSchool />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">About the Event</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Provide a brief summary of the event activities and goals..." rows={2} className="w-full rounded-2xl border border-slate-100 bg-white/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isHighlighted || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isHighlighted: e.target.checked }))}
                  className="h-6 w-6 rounded-lg border-slate-200 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm font-bold text-slate-700">Display this experience in the homepage Hero slider</span>
              </label>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-slate-900 px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-sky-700 hover:shadow-sky-100 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : editingId ? 'Update Information' : 'Publish Experience'}
                </button>
              </div>
            </div>
          </form>

          {error && <p className="mt-6 text-sm font-bold text-red-500">{error}</p>}
          {statusMessage && <p className="mt-6 text-sm font-bold text-emerald-600">{statusMessage}</p>}
        </section>

        {/* Bottom Section: Grid of Events */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Live Inventory</h2>
            <div className="h-px flex-1 mx-8 bg-slate-100" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{sorted.length} Total Items</p>
          </div>
          
          {sorted.length === 0 ? (
            <div className="rounded-[3rem] border border-dashed border-slate-200 bg-white/50 py-24 text-center">
              <FaCalendarAlt className="mx-auto mb-4 text-4xl text-slate-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Your inventory is currently empty</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((event) => (
                <motion.div
                  layout
                  key={event._id}
                  className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-white bg-white/60 shadow-xl shadow-sky-50/50 transition-all hover:shadow-sky-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest backdrop-blur-md ${
                        event.status === 'active' ? 'bg-emerald-500/80 text-white' : 'bg-slate-500/80 text-white'
                      }`}>
                        {event.status}
                      </span>
                      {event.isHighlighted && (
                        <span className="rounded-full bg-sky-500/80 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-black leading-tight text-slate-900">{event.title}</h3>
                      <p className="text-xs font-bold text-slate-500">{event.venue} • {formatDate(event.date)}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                      <button onClick={() => handleEdit(event)} className="rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:bg-sky-600 hover:text-white">Edit</button>
                      <button onClick={() => toggleStatus(event)} className="rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-900 hover:text-white">
                        {event.status === 'active' ? 'Archive' : 'Activate'}
                      </button>
                      <button onClick={() => setHighlighted(event._id, event.isHighlighted)} className="rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:bg-indigo-600 hover:text-white">
                        {event.isHighlighted ? 'Unhighlight' : 'Highlight'}
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="rounded-xl bg-red-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition hover:bg-red-600 hover:text-white">Delete</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
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
