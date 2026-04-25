import { motion } from 'framer-motion'

function GlassButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl border border-white/40 bg-white/20 px-5 py-2.5 font-semibold text-white shadow-lg backdrop-blur-md transition ${className}`}
    >
      {children}
    </motion.button>
  )
}

export default GlassButton
