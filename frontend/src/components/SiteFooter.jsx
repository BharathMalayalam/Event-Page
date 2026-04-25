import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { motion } from 'framer-motion'

const links = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
  { icon: FaXTwitter, href: 'https://x.com', label: 'X' },
  { icon: FaInstagram, href: 'https://www.instagram.com', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://www.youtube.com', label: 'YouTube' },
]

function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t border-sky-100 bg-white/40 py-12 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black tracking-tighter text-slate-900">
              GREENFIELD<span className="text-sky-600">.EVENTS</span>
            </h3>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Crafting Digital Experiences Since 2024
            </p>
          </div>

          <div className="flex items-center gap-4">
            {links.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-600 shadow-sm transition-all hover:border-sky-300 hover:text-sky-700 hover:shadow-xl hover:shadow-sky-100"
                aria-label={label}
              >
                <Icon className="text-lg" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sky-50 pt-8 text-[11px] font-bold uppercase tracking-widest text-slate-400 md:flex-row">
          <p>© 2026 Greenfield Institution. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-sky-600">Privacy Policy</a>
            <a href="#" className="hover:text-sky-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
