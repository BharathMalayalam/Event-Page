import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaSchool } from 'react-icons/fa'
import { apiFetch, TOKEN_KEY, formatDate } from '../utils/api'

const emptyForm = {
  title: '',
  venue: '',
  location: '',
  date: '',
  image: '',
  status: 'active',
  description: '',
}

export default function AdminPage({ events, refreshEvents }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  const sorted = useMemo(() => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)), [events])

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage])

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
      setError('Required: Title, Venue, Location, Date, Image.')
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
      const msg = editingId ? 'Experience updated successfully' : 'New experience launched'
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
    if (!window.confirm('Permanent delete? This cannot be undone.')) return
    setProcessingId(id)
    try {
      await apiFetch(`/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      await refreshEvents()
      setStatusMessage('Event permanently removed')
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function toggleStatus(event) {
    setProcessingId(`${event._id}-status`)
    try {
      await apiFetch(`/events/${event._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: event.status === 'active' ? 'past' : 'active',
        }),
        headers: { Authorization: `Bearer ${token}` },
      })
      await refreshEvents()
      setStatusMessage(`Event moved to ${event.status === 'active' ? 'Archive' : 'Active'}`)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function setHighlighted(id, currentHighlightStatus) {
    setProcessingId(`${id}-highlight`)
    const nextStatus = !currentHighlightStatus
    try {
      await apiFetch(`/events/${id}/highlight`, {
        method: 'PATCH',
        body: JSON.stringify({ isHighlighted: nextStatus }),
        headers: { Authorization: `Bearer ${token}` },
      })
      await refreshEvents()
      setStatusMessage(nextStatus ? 'Hero highlight enabled' : 'Hero highlight disabled')
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setProcessingId(null)
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
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Secure Console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Master Key</label>
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
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed left-1/2 top-10 z-[100] flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 shadow-2xl shadow-slate-200"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest text-white">{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
        </section>

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
                    <img src={event.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
                        event.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                      }`}>
                        {event.status}
                      </span>
                      {event.isHighlighted && (
                        <span className="rounded-full bg-sky-500 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-lg">
                          Hero Featured
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
                      <button 
                        onClick={() => handleEdit(event)} 
                        className="rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:bg-sky-600 hover:text-white"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleStatus(event)} 
                        disabled={processingId === `${event._id}-status`}
                        className="rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-900 hover:text-white disabled:opacity-50"
                      >
                        {processingId === `${event._id}-status` ? '...' : (event.status === 'active' ? 'Archive' : 'Activate')}
                      </button>
                      <button 
                        onClick={() => setHighlighted(event._id, event.isHighlighted)} 
                        disabled={processingId === `${event._id}-highlight`}
                        className="rounded-xl bg-slate-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:indigo-600 hover:text-white disabled:opacity-50"
                      >
                        {processingId === `${event._id}-highlight` ? '...' : (event.isHighlighted ? 'Unhighlight' : 'Highlight')}
                      </button>
                      <button 
                        onClick={() => handleDelete(event._id)} 
                        disabled={processingId === event._id}
                        className="rounded-xl bg-red-50 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                      >
                        {processingId === event._id ? '...' : 'Delete'}
                      </button>
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
