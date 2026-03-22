import { motion } from 'framer-motion'
import { FiBook, FiAward } from 'react-icons/fi'

const education = [
  {
    id: 1,
    degree: 'BCA Computer Science',
    institution: 'IITM Janakpuri, Delhi',
    period: '2023 – 2026',
    grade: 'CGPA 8.49/10',
    icon: FiBook,
    subjects: ['DSA', 'DBMS', 'OS', 'Computer Networks', 'Web Technologies'],
    color: '#00d9ff'
  },
  {
    id: 2,
    degree: 'Senior Secondary CBSE',
    institution: 'Spring Meadows Public School, Delhi',
    period: '2023',
    grade: '12th: 60% · 10th (2021): 72%',
    icon: FiAward,
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
    color: '#ff2a6d'
  }
]

export default function Education() {
  return (
    <section
      id="education"
      className="relative min-h-screen w-full flex items-center py-24"
    >
      <div className="w-full px-6 lg:px-12 max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 font-['Space_Grotesk']">
            Education
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-['Space_Grotesk'] font-bold">
            Academic <span className="gradient-text">Background</span>
          </h3>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-pink-500 transform md:-translate-x-1/2" />

          {/* Education Entries */}
          <div className="space-y-16">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ 
                  opacity: 0, 
                  x: index % 2 === 0 ? -50 : 50 
                }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div 
                  className="absolute left-8 md:left-1/2 top-0 w-4 h-4 rounded-full transform -translate-x-1/2 z-10"
                  style={{ 
                    backgroundColor: edu.color,
                    boxShadow: `0 0 20px ${edu.color}80`
                  }}
                />

                {/* Content Card */}
                <div className={`ml-20 md:ml-0 md:w-[45%] ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 md:p-8 rounded-2xl hoverable"
                  >
                    {/* Icon */}
                    <div className={`flex items-center gap-4 mb-4 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}>
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${edu.color}20`,
                          border: `1px solid ${edu.color}40`
                        }}
                      >
                        <edu.icon 
                          size={24} 
                          style={{ color: edu.color }}
                        />
                      </div>
                      <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                        <h4 className="text-xl md:text-2xl font-['Space_Grotesk'] font-bold">
                          {edu.degree}
                        </h4>
                        <p className="text-gray-400 text-sm">{edu.institution}</p>
                      </div>
                    </div>

                    {/* Period & Grade */}
                    <div className={`flex flex-wrap items-center gap-4 mb-4 ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}>
                      <span className="px-3 py-1 text-xs rounded-full glass text-gray-400">
                        {edu.period}
                      </span>
                      <span 
                        className="px-3 py-1 text-xs rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${edu.color}20`,
                          color: edu.color
                        }}
                      >
                        {edu.grade}
                      </span>
                    </div>

                    {/* Subjects */}
                    <div className={`flex flex-wrap gap-2 ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}>
                      {edu.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-1 text-xs rounded-full glass text-gray-300"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
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
