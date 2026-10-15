import Reveal from '../components/Reveal';
import { Headline } from '../components/Motion';

const skillCategories = [
  {
    title: 'Frontend Development',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Bootstrap', 'Zustand', 'Responsive Design']
  },
  {
    title: 'Backend Development',
    skills: ['Node.js', 'Express', 'PHP', 'Laravel', 'Lumen', 'REST APIs']
  },
  {
    title: 'Databases',
    skills: ['MongoDB', 'Mongoose', 'MySQL', 'SQLite', 'Firebase']
  },
  {
    title: 'Programming Languages',
    skills: ['JavaScript', 'TypeScript', 'PHP', 'Java', 'Python', 'OOP Principles']
  },
  {
    title: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Vite', 'Postman', 'VS Code', 'Adobe Photoshop', 'Adobe Illustrator', 'Microsoft Office']
  },
  {
    title: 'Technical Support',
    skills: ['Hardware Support', 'OS Troubleshooting', 'Wi-Fi & LAN Networking', 'Debugging', 'CampusOne ERP Support']
  }
];

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">02</span>
          <span className="eyebrow">Skills</span>
        </header>

        <Headline id="skills-title" className="h-section max-w-[20ch]">
            The tools I work with, grouped by discipline.
          </Headline>

        <div className="mt-12 grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {skillCategories.map((group, i) => (
            <Reveal key={group.title} delay={(i % 3) * 0.05} className="border-t border-line pt-6 pb-10">
              <div className="flex items-baseline gap-3">
                <span className="section-index text-sm">0{i + 1}</span>
                <h3 className="font-serif text-[1.35rem] leading-snug text-ink">{group.title}</h3>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
