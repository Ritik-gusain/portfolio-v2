import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiCode, FiExternalLink, FiTwitter } from 'react-icons/fi'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Ritik-gusain',
    icon: FiGithub
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/ritik-gusain-7640a9334',
    icon: FiLinkedin
  },
  {
    name: 'X / Twitter',
    url: 'https://x.com',
    icon: FiTwitter
  },
  {
    name: 'LeetCode',
    url: 'https://leetcode.com/u/munnigusain29684',
    icon: FiCode
  },
  {
    name: 'Portfolio',
    url: 'https://ritikg-portfolio.vercel.app',
    icon: FiExternalLink
  },
  {
    name: 'Email',
    url: 'mailto:munnigusain29684@gmail.com',
    icon: FiMail
  }
]

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}
    >
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-white hover:opacity-70">
        ×
      </button>
    </motion.div>
  )
}

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      setToast({ message: 'Please enter your name', type: 'error' })
      return
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setToast({ message: 'Please enter a valid email', type: 'error' })
      return
    }
    if (!formData.message.trim()) {
      setToast({ message: 'Please enter a message', type: 'error' })
      return
    }

    setIsLoading(true)

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setToast({ message: 'Message sent successfully!', type: 'success' })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' })
    } finally {
      setIsLoading(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center justify-center py-24 overflow-hidden"
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 217, 255, 0.15) 0%, transparent 70%)'
        }}
      />

      {/* Animated Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 42, 109, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <div className="relative z-10 w-full px-6 lg:px-12 max-w-4xl mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 font-['Space_Grotesk']">
            Contact
          </h2>
          <h3 
            className="font-['Space_Grotesk'] font-extrabold leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
          >
            Let's Build{' '}
            <span className="gradient-text">Something</span>
          </h3>
          <p className="text-xl text-gray-400">
            Open to internships & remote roles · Delhi-NCR
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-12 rounded-3xl mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 rounded-xl"
              disabled={isLoading}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 rounded-xl"
              disabled={isLoading}
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl mb-6 resize-none"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <span>→</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full glass hoverable transition-colors hover:border-cyan-400"
            >
              <link.icon className="text-cyan-400" />
              <span className="text-gray-300">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
