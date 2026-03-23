import { motion } from 'framer-motion'
import { FiBook, FiAward } from 'react-icons/fi'

const education = [
  {
    id: 1,
    degree: 'BCA_COMPUTER_SCIENCE',
    institution: 'IITM_JANAKPURI_DELHI',
    period: '2023 – 2026',
    grade: 'CGPA_8.49/10',
    icon: FiBook,
    subjects: ['DSA', 'DBMS', 'OS', 'COMPUTER_NETWORKS', 'WEB_TECH'],
    color: '#f0ff00'
  },
  {
    id: 2,
    degree: 'SENIOR_SECONDARY_CBSE',
    institution: 'SPRING_MEADOWS_DELHI',
    period: '2023',
    grade: '12th:_60% · 10th:_72%',
    icon: FiAward,
    subjects: ['PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'COMP_SCI'],
    color: '#ff6b00'
  }
]

export default function Education() {
  return (
    <section
      id="education"
      className="relative min-h-screen w-full flex items-center py-24 bg-[#050810] overflow-hidden"
    >
      {/* Background sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-t from-[#ff2a6d] to-transparent" />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        {/* Section Title - Busted style */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center md:text-right"
        >
          <p className="text-xs font-['Space_Mono'] text-[#f0ff00] tracking-[0.5em] uppercase mb-3 font-black">
            // STATUS: ACADEMIC_MODULE
          </p>
          <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter" data-text="KNOWLEDGE_BASE">
            KNOWLEDGE_<span className="text-[#f0ff00]">BASE</span>
          </h2>
          <div className="mt-4 w-64 h-2 bg-[#f0ff00] skew-x-[-20deg] mx-auto md:mr-0" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line - Skewed & Intense */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-2 bg-white/10 transform md:-translate-x-1/2 skew-x-[-20deg]" />

          {/* Education Entries */}
          <div className="space-y-32">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  x: index % 2 === 0 ? -100 : 100 
                }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start gap-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Box */}
                <div 
                  className="absolute left-8 md:left-1/2 top-0 w-12 h-12 flex items-center justify-center transform -translate-x-1/2 z-10 skew-x-[-12deg]"
                  style={{ 
                    backgroundColor: edu.color,
                    boxShadow: `0 0 30px ${edu.color}66`
                  }}
                >
                   <edu.icon size={24} className="text-black skew-x-[12deg]" />
                </div>

                {/* Content Card - Busted style */}
                <div className={`ml-20 md:ml-0 md:w-[45%] ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? -1 : 1 }}
                    className="bg-white/5 border-l-8 p-8 md:p-10 skew-x-[-4deg] group relative overflow-hidden"
                    style={{ borderColor: edu.color }}
                  >
                    {/* Header */}
                    <div className={`flex items-center gap-6 mb-6 skew-x-[4deg] ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}>
                      <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                        <h4 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-black italic tracking-tighter uppercase" style={{ color: edu.color }}>
                          {edu.degree}
                        </h4>
                        <p className="text-white font-black font-['Space_Mono'] uppercase tracking-widest text-xs opacity-60 mt-1">{edu.institution}</p>
                      </div>
                    </div>

                    {/* Period & Grade - Skewed tags */}
                    <div className={`flex flex-wrap items-center gap-4 mb-8 skew-x-[4deg] ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}>
                      <span className="px-4 py-1 text-[10px] font-black font-['Space_Mono'] bg-white/10 text-white uppercase italic">
                        {edu.period}
                      </span>
                      <span 
                        className="px-4 py-1 text-[10px] font-black font-['Space_Mono'] text-black uppercase italic"
                        style={{ backgroundColor: edu.color }}
                      >
                        {edu.grade}
                      </span>
                    </div>

                    {/* Subjects - Aggressive tags */}
                    <div className={`flex flex-wrap gap-3 skew-x-[4deg] ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}>
                      {edu.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-1 text-[10px] font-black font-['Space_Mono'] border-2 uppercase tracking-tighter"
                          style={{ color: edu.color, borderColor: `${edu.color}33` }}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
