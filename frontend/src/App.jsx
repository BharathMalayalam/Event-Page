import { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { apiFetch } from './utils/api'
import './App.css'

// Lazy load pages for better initial load performance (Scalability)
const UserPage = lazy(() => import('./pages/UserPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'))

// Premium loading fallback
const LoadingScreen = () => (
  <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
     <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-ping rounded-full bg-sky-100" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-sky-100 bg-white shadow-xl">
           <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-sky-500" />
        </div>
     </div>
     <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-sky-900/40">Initializing Experience</p>
  </div>
)

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  async function refreshEvents() {
    setLoading(true)
    try {
      // Use cache-busting only when necessary, or better yet, proper caching headers
      const data = await apiFetch(`/events?t=${Date.now()}`)
      setEvents(data)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshEvents()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white selection:bg-sky-400 selection:text-white">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<UserPage events={events} loading={loading} />} />
            <Route path="/admin" element={<AdminPage events={events} refreshEvents={refreshEvents} />} />
            <Route path="/event/:id" element={<EventDetailPage events={events} />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
