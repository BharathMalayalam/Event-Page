import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaSchool } from 'react-icons/fa'

function EventFeatureCard({ event, onInquire }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8, scale: 1.01, boxShadow: '0 20px 40px rgba(29, 78, 216, 0.22)' }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-2xl border border-sky-100 bg-white/75 shadow-lg backdrop-blur-xl"
    >
      <div className="overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-lg font-semibold text-slate-800">{event.title}</h3>
        <p className="text-sm text-slate-600">{event.description}</p>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <FaSchool className="text-sky-600" /> {event.venue}
        </p>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <FaMapMarkerAlt className="text-sky-600" /> {event.location}
        </p>
        <button
          type="button"
          onClick={() => onInquire(event)}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Inquiry
        </button>
      </div>
    </motion.article>
  )
}

export default EventFeatureCard
