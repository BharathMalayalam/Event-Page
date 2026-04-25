import { motion } from 'framer-motion'
import { FaArrowRight, FaMapMarkerAlt, FaSchool } from 'react-icons/fa'

function EventFeatureCard({ event, onInquire }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group relative h-full overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 p-4 shadow-2xl shadow-sky-200/50 backdrop-blur-2xl transition-all duration-500 hover:shadow-sky-300/60"
    >
      {/* Decorative gradient background inside the card */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-200/20 blur-3xl transition-colors duration-500 group-hover:bg-sky-300/30" />
      
      <div className="relative h-full space-y-4">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-inner">
          <motion.img
            src={event.image}
            alt={event.title}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          {/* Status Badge */}
          <div className="absolute right-4 top-4">
            <span className="flex items-center gap-1.5 rounded-full border border-white/50 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Live Now
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-2 pb-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-sky-700">
              {event.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
              {event.description}
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                <FaSchool />
              </div>
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                <FaMapMarkerAlt />
              </div>
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onInquire(event)}
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-200"
          >
            <span>Reserve Your Spot</span>
            <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

export default EventFeatureCard
