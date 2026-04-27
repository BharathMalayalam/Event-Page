import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowRight, FaCalendarAlt, FaSchool } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function formatDate(dateValue) {
  if (!dateValue) return 'TBA'
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function HighlightHero({ events }) {
  const navigate = useNavigate()
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
              loading="lazy"
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
              
              <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
                {activeEvent.title}
              </h1>
              
              <p className="text-sm font-bold leading-relaxed text-sky-900 sm:text-xl">
                {activeEvent.description || "Join us for an exclusive journey through innovation and institutional excellence."}
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
              onClick={() => navigate(`/event/${activeEvent._id}`)}
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-sky-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-100"
            >
              <span>Explore & Register</span>
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
