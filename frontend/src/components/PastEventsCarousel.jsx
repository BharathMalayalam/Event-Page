import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function formatDate(dateValue) {
  if (!dateValue) return 'TBA'
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PastEventsCarousel({ events }) {
  const [index, setIndex] = useState(0)
  const [winWidth, setWinWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!events || events.length === 0) return null

  const next = () => setIndex((prev) => (prev + 1) % events.length)
  const prev = () => setIndex((prev) => (prev - 1 + events.length) % events.length)

  const isMobile = winWidth < 640
  const cardWidth = isMobile ? 300 : 500
  const containerX = -index * cardWidth

  return (
    <div className="relative py-12">
      <div className="flex items-center justify-center overflow-hidden">
        <div className="relative h-[420px] w-full sm:h-[550px]">
          {/* Moving Track */}
          <motion.div 
            animate={{ x: containerX }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="absolute left-1/2 flex items-center"
            style={{ marginLeft: -cardWidth / 2 }}
          >
            {events.map((item, i) => {
              const isCenter = index === i
              const distance = Math.abs(index - i)
              
              return (
                <motion.div
                  key={item._id}
                  animate={{ 
                    scale: isCenter ? 1 : 0.85,
                    opacity: distance === 0 ? 1 : (distance === 1 ? 0.4 : 0),
                    filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative shrink-0 overflow-hidden rounded-[2.5rem] shadow-2xl"
                  style={{ width: cardWidth - (isMobile ? 20 : 40), margin: isMobile ? '0 10px' : '0 20px' }}
                >
                  <div className="relative h-[380px] w-full sm:h-[500px]">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
                    
                    <AnimatePresence>
                      {isCenter && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md"
                        >
                          Date: {formatDate(item.date)}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="absolute bottom-8 left-6 right-6 text-white sm:left-10 sm:right-10">
                      <h3 className="text-xl font-black leading-tight sm:text-3xl">{item.title}</h3>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-300 sm:text-xs">{item.venue}, {item.location}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 z-40 flex -translate-y-1/2 justify-between px-4 sm:px-10">
        <button 
          onClick={prev}
          className="rounded-full bg-sky-400/90 p-3 text-white shadow-xl transition hover:bg-sky-500"
        >
          <FaChevronLeft size={16} className="sm:size-5" />
        </button>
        <button 
          onClick={next}
          className="rounded-full bg-sky-400/90 p-3 text-white shadow-xl transition hover:bg-sky-500"
        >
          <FaChevronRight size={16} className="sm:size-5" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="mt-8 flex justify-center gap-1.5">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? 'w-8 bg-sky-500' : 'w-1.5 bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  )
}
