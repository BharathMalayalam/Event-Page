import { motion } from 'framer-motion'

function Blob({ className, duration, delay }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{ y: [0, -24, 0], x: [0, 10, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function FloatingBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Blob className="-top-20 left-0 h-64 w-64 bg-sky-300/35" duration={7} delay={0} />
      <Blob className="right-10 top-8 h-52 w-52 bg-cyan-200/45" duration={8} delay={0.3} />
      <Blob className="bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 bg-blue-200/30" duration={6.5} delay={0.5} />
    </div>
  )
}

export default FloatingBlobs
