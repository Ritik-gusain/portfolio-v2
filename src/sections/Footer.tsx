import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full py-8 border-t border-gray-800">
      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            Ritik Gusain · Built with React, Three.js &{' '}
            <span className="text-pink-500">❤</span> · {currentYear}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
