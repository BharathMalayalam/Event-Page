import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'
import { formatDate } from '../utils/api'

export default function EventDetailPage({ events }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = events.find(e => e._id === id)

  if (!event) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Experience Not Found</h2>
        <button onClick={() => navigate('/')} className="text-sky-400 underline">Return Home</button>
      </div>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full overflow-hidden bg-white text-sky-950"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0">
        <img src={event.image} alt="" className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white" />
      </div>

      {/* Side Progress Indicator */}
      <div className="absolute left-6 top-1/2 h-32 w-px -translate-y-1/2 bg-sky-900/20 sm:left-10 sm:h-40">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: '70%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full bg-sky-500"
        />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute left-6 top-6 z-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-900/50 transition hover:text-sky-500 sm:left-10 sm:top-10"
      >
        <FaChevronLeft /> Back to Exploration
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1 
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-6xl text-5xl font-black uppercase tracking-[-0.05em] leading-[0.85] text-sky-950 sm:text-8xl lg:text-9xl"
        >
          {event.title.split(' ').map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </motion.h1>

        {/* Bottom Actions */}
        <div className="absolute bottom-10 left-6 right-6 flex flex-col items-end justify-between gap-8 sm:bottom-16 sm:left-20 sm:right-20 sm:flex-row sm:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-md text-left"
          >
            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-sky-600 mb-2">Experience Details</p>
            <p className="text-sm font-bold leading-relaxed text-sky-950 sm:text-lg">
              {event.description || "Step into a world of innovation. This curated experience brings together the best minds and ideas for a transformative institutional journey."}
            </p>
            <div className="mt-4 flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-sky-900/80">
               <span>{event.venue}</span>
               <span className="h-1.5 w-1.5 rounded-full bg-sky-900/30" />
               <span>{formatDate(event.date)}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3"
          >
            <button className="rounded-full border border-sky-100 bg-white/60 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-sky-900 backdrop-blur-xl transition hover:bg-sky-50">
              About event
            </button>
            <button className="rounded-full bg-sky-500 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-sky-100 transition hover:bg-sky-600 hover:scale-105 active:scale-95">
              Register now!
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
