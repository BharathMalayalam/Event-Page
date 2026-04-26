import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaArrowUp, FaCalendarAlt } from 'react-icons/fa'
import HighlightHero from '../components/HighlightHero'
import EventSkeleton from '../components/EventSkeleton'
import EventFeatureCard from '../components/EventFeatureCard'
import PastEventsCarousel from '../components/PastEventsCarousel'
import SectionWrap from '../components/SectionWrap'
import SiteFooter from '../components/SiteFooter'
import FloatingBlobs from '../components/FloatingBlobs'

export default function UserPage({ events, loading }) {
  const navigate = useNavigate()
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
  const active = sorted.filter((event) => event.status === 'active')
  const past = sorted.filter((event) => event.status === 'past')
  const highlightedEvents = active.filter((event) => event.isHighlighted)
  const topHighlights = highlightedEvents

  return (
    <main className="relative w-full space-y-12 py-6 sm:py-10">
      <FloatingBlobs />
      
      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-[100] rounded-full bg-sky-400 p-3 text-white shadow-2xl transition-all hover:bg-sky-500 hover:scale-110 active:scale-95 sm:bottom-10 sm:right-10 sm:p-4"
      >
        <FaArrowUp size={20} className="sm:size-6" />
      </button>

      <section className="relative z-10 mx-auto max-w-7xl space-y-3 px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600 sm:text-sm">
          Institution Events
        </p>
        <h2 className="max-w-3xl text-2xl font-black tracking-tight text-sky-950 sm:text-4xl">
          Crafted experiences for <br className="hidden sm:block" /> learning communities
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
                      onInquire={() => navigate(`/event/${event._id}`)}
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
          {loading ? (
             <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
               {Array.from({ length: 3 }).map((_, idx) => <EventSkeleton key={`past-skeleton-${idx}`} />)}
             </div>
          ) : (
            <PastEventsCarousel events={past} />
          )}
        </SectionWrap>
      </div>

      <SiteFooter />
    </main>
  )
}
