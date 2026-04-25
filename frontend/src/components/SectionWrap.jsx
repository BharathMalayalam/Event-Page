import { motion } from 'framer-motion'

function SectionWrap({ title, subtitle, children }) {
  const isStringTitle = typeof title === 'string'

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-8 py-12"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between lg:gap-8">
        <div className="max-w-3xl space-y-2">
          {isStringTitle ? (
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
          ) : (
            <div>{title}</div>
          )}
          {subtitle && (
            <p className="text-base text-slate-500 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Decorative line for style */}
        <div className="hidden h-px flex-1 bg-gradient-to-r from-sky-100 to-transparent md:block" />
      </div>
      
      <div className="relative">
        {children}
      </div>
    </motion.section>
  )
}

export default SectionWrap
