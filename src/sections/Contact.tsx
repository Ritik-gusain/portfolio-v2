import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiCode, FiExternalLink, FiTwitter, FiSend } from 'react-icons/fi'

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/Ritik-gusain', icon: FiGithub, color: '#ffffff' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/ritik-gusain-7640a9334', icon: FiLinkedin, color: '#0a66c2' },
  { name: 'X / Twitter', url: 'https://x.com', icon: FiTwitter, color: '#ffffff' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/munnigusain29684', icon: FiCode, color: '#ffa116' },
  { name: 'Portfolio', url: 'https://ritikg-portfolio.vercel.app', icon: FiExternalLink, color: '#00d9ff' },
  { name: 'Email', url: 'mailto:munnigusain29684@gmail.com', icon: FiMail, color: '#ff2a6d' },
]

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}
    >
      <span className="mr-3">{type === 'success' ? '✓' : '✗'}</span>
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="ml-4 text-white hover:opacity-70 text-lg">×</button>
    </motion.div>
  )
}

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { setToast({ message: 'Please enter your name', type: 'error' }); return }
    if (!formData.email.trim() || !validateEmail(formData.email)) { setToast({ message: 'Please enter a valid email', type: 'error' }); return }
    if (!formData.message.trim()) { setToast({ message: 'Please enter a message', type: 'error' }); return }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setToast({ message: 'Message sent successfully!', type: 'success' })
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' })
    } finally {
      setIsLoading(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center justify-center py-24 overflow-hidden"
    >
      {/* Aurora blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.15), transparent 70%)', filter: 'blur(80px)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,42,109,0.15), transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="relative z-10 w-full px-6 lg:px-12 max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-['Space_Mono'] text-cyan-400 tracking-[0.3em] uppercase mb-4">
            // 08. REACH OUT
          </p>
          <h2
            className="font-['Space_Grotesk'] font-extrabold leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
          >
            Let's Build{' '}
            <span className="gradient-text">Something</span>
          </h2>
          <p className="text-gray-500 font-['Space_Mono'] text-sm">
            Open to internships &amp; remote roles · Delhi-NCR
          </p>
        </motion.div>

        {/* Cyberpunk Terminal Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-14"
        >
          {/* Terminal header bar */}
          <div
            className="rounded-t-2xl px-5 py-3 flex items-center gap-3"
            style={{
              background: 'rgba(0,217,255,0.08)',
              border: '1px solid rgba(0,217,255,0.2)',
              borderBottom: 'none'
            }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
            <span className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
            <span className="ml-4 text-xs text-cyan-400 font-['Space_Mono']">
              ~/ritik/contact — bash
            </span>
            <span className="terminal-cursor" />
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-b-2xl p-8 md:p-10"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,217,255,0.15)', backdropFilter: 'blur(20px)' }}
          >
            {/* Prompt lines */}
            <div className="mb-2 text-xs font-['Space_Mono'] text-gray-600">
              <span className="text-cyan-500">❯</span> initiate_transmission --secure
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-5">
              {/* Name */}
              <div className="flex-1 relative">
                <label className="block text-xs font-['Space_Mono'] text-cyan-400 mb-1 ml-1">name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="your_name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  className="w-full rounded-xl"
                  disabled={isLoading}
                  style={{ borderColor: focused === 'name' ? '#00d9ff' : undefined }}
                />
              </div>
              {/* Email */}
              <div className="flex-1 relative">
                <label className="block text-xs font-['Space_Mono'] text-cyan-400 mb-1 ml-1">email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full rounded-xl"
                  disabled={isLoading}
                  style={{ borderColor: focused === 'email' ? '#00d9ff' : undefined }}
                />
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-xs font-['Space_Mono'] text-cyan-400 mb-1 ml-1">message</label>
              <textarea
                name="message"
                placeholder="your_message_here..."
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={4}
                className="w-full rounded-xl resize-none"
                disabled={isLoading}
                style={{ borderColor: focused === 'message' ? '#00d9ff' : undefined }}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-['Space_Mono']">
                <span className="text-green-400">✓</span> end-to-end encrypted
              </span>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,217,255,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span className="font-['Space_Mono']">transmitting...</span>
                  </>
                ) : (
                  <>
                    <FiSend />
                    <span className="font-['Space_Mono']">send_message()</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Social Links — color-coded icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.1, y: -6 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hoverable transition-colors neon-border"
              style={{ borderColor: `${link.color}33` }}
            >
              <link.icon style={{ color: link.color }} />
              <span className="text-gray-300 text-sm font-['Space_Mono']">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
