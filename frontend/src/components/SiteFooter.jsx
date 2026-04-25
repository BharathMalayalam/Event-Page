import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6'

const links = [
  { icon: FaLinkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
  { icon: FaXTwitter, href: 'https://x.com', label: 'X' },
  { icon: FaInstagram, href: 'https://www.instagram.com', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://www.youtube.com', label: 'YouTube' },
]

function SiteFooter() {
  return (
    <footer className="border-t border-sky-100 bg-white/70 py-8 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">Greenfield Institution Events</p>
        <div className="flex items-center gap-3">
          {links.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-sky-200 bg-white p-2.5 text-sky-600 transition hover:shadow-[0_0_20px_rgba(56,189,248,0.55)]"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
