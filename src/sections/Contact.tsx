import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiCode, FiExternalLink, FiTwitter, FiSend } from 'react-icons/fi'

const socialLinks = [
  { name: 'GITHUB', url: 'https://github.com/Ritik-gusain', icon: FiGithub, color: '#ffffff' },
  { name: 'LINKEDIN', url: 'https://linkedin.com/in/ritik-gusain-7640a9334', icon: FiLinkedin, color: '#0a66c2' },
  { name: 'X_CORP', url: 'https://x.com', icon: FiTwitter, color: '#ffffff' },
  { name: 'LEETCODE', url: 'https://leetcode.com/u/munnigusain29684', icon: FiCode, color: '#f0ff00' },
  { name: 'PORTFOLIO', url: 'https://ritikg-portfolio.vercel.app', icon: FiExternalLink, color: '#ff6b00' },
  { name: 'EMAIL', url: 'mailto:munnigusain29684@gmail.com', icon: FiMail, color: '#ff2a6d' },
]

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, skewX: 20 }}
      animate={{ opacity: 1, x: 0, skewX: -12 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed bottom-8 right-8 z-[100] px-8 py-4 font-black font-['Space_Mono'] uppercase italic flex items-center gap-4 ${
        type === 'success' ? 'bg-[#f0ff00] text-black' : 'bg-[#ff2a6d] text-white'
      }`}
    >
      <span className="text-xl skew-x-[12deg]">{type === 'success' ? '✓' : '✗'}</span>
      <p className="flex-1 skew-x-[12deg]">{message}</p>
      <button onClick={onClose} className="ml-4 skew-x-[12deg] hover:opacity-50">×</button>
    </motion.div>
  )
}

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [_focused, setFocused] = useState<string | null>(null)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { setToast({ message: 'NAME_REQUIRED', type: 'error' }); return }
    if (!formData.email.trim() || !validateEmail(formData.email)) { setToast({ message: 'INVALID_EMAIL_PROTOCOL', type: 'error' }); return }
    if (!formData.message.trim()) { setToast({ message: 'MESSAGE_EMPTY', type: 'error' }); return }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setToast({ message: 'TRANSMISSION_SUCCESSFUL', type: 'success' })
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setToast({ message: 'TRANSMISSION_FAILED', type: 'error' })
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
      className="relative min-h-screen w-full flex items-center justify-center py-24 bg-[#050810] overflow-hidden"
    >
      {/* Background accents */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #ff2a6d 0%, transparent 70%)', filter: 'blur(100px)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #f0ff00 0%, transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="relative z-10 w-full px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Branding & Info */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <p className="text-xs font-['Space_Mono'] text-[#f0ff00] tracking-[0.5em] uppercase mb-4 font-black">
                // STATUS: UPLINK_AVAILABLE
              </p>
              <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter leading-none" data-text="ESTABLISH_CONTACT">
                ESTABLISH_<span className="text-[#f0ff00]">CONTACT</span>
              </h2>
              <div className="mt-6 w-48 h-4 bg-[#f0ff00] skew-x-[-20deg]" />
            </div>

            <div className="space-y-6">
              <p className="text-xl md:text-2xl font-['Space_Grotesk'] font-black text-white/60 italic leading-tight uppercase">
                OPEN_TO_INTERNSHIPS // REMOTE_ROLES // BLOCKCHAIN_EXPLOITS // AI_AUTOMATION
              </p>
              <div className="flex items-center gap-4 text-[#f0ff00] font-['Space_Mono'] font-black uppercase italic">
                <span className="w-3 h-3 bg-[#f0ff00] animate-ping" />
                <span>GRID_LOCATION: DELHI-NCR_INDIA</span>
              </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, backgroundColor: link.color, color: link.color === '#ffffff' ? '#000' : '#fff' }}
                  className="flex items-center gap-3 px-4 py-3 border-2 border-white/10 skew-x-[-12deg] group transition-colors duration-200"
                >
                  <link.icon className="skew-x-[12deg]" />
                  <span className="text-[10px] font-black font-['Space_Mono'] skew-x-[12deg]">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Aggressive Form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#f0ff00] skew-x-[-4deg] translate-x-4 translate-y-4 -z-10 opacity-20" />
            
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white/5 border-2 border-white/10 p-8 md:p-12 skew-x-[-4deg] relative overflow-hidden group"
            >
              <div className="skew-x-[4deg] space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Name */}
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-black font-['Space_Mono'] text-[#f0ff00] uppercase tracking-widest">_IDENTIFIER</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="YOUR_ENTITY_NAME"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-white/5 border-2 border-white/10 px-4 py-3 font-['Space_Mono'] font-black text-white focus:border-[#f0ff00] focus:outline-none transition-colors uppercase italic"
                      disabled={isLoading}
                    />
                  </div>
                  {/* Email */}
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-black font-['Space_Mono'] text-[#ff6b00] uppercase tracking-widest">_UPLINK_ADDR</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="ENTITY@GRID.COM"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-white/5 border-2 border-white/10 px-4 py-3 font-['Space_Mono'] font-black text-white focus:border-[#ff6b00] focus:outline-none transition-colors uppercase italic"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black font-['Space_Mono'] text-[#ff2a6d] uppercase tracking-widest">_TRANSMISSION_PAYLOAD</label>
                  <textarea
                    name="message"
                    placeholder="ENTER_ENCRYPTED_MESSAGE..."
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    className="w-full bg-white/5 border-2 border-white/10 px-4 py-3 font-['Space_Mono'] font-black text-white focus:border-[#ff2a6d] focus:outline-none transition-colors uppercase italic resize-none"
                    disabled={isLoading}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-[#f0ff00] text-black font-black font-['Space_Mono'] uppercase italic text-xl flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 opacity-30" />
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                      <span>UPLOADING...</span>
                    </>
                  ) : (
                    <>
                      <FiSend />
                      <span>EXECUTE_TRANSMISSION</span>
                    </>
                  )}
                </motion.button>

                <p className="text-center text-[8px] font-black font-['Space_Mono'] text-white/20 tracking-[0.4em]">
                  END-TO-END_ENCRYPTION_ACTIVE // SECURE_SOCKET_LAYER_V2
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
