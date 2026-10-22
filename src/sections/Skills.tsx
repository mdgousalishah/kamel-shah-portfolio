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

// Unique skills for the two auto-scrolling rows (the grid below stays the full, grouped list).
const unique = (list: string[]) => Array.from(new Set(list));
const ROW_ONE = unique(skillCategories.slice(0, 3).flatMap((g) => g.skills));
const ROW_TWO = unique(skillCategories.slice(3).flatMap((g) => g.skills)).filter((s) => !ROW_ONE.includes(s));
const MARQUEE_ROWS = [ROW_ONE, ROW_TWO];

function SkillMarquee() {
  return (
    // Decorative: every skill is also in the grouped grid, so screen readers skip this.
    <div aria-hidden="true" className="skill-marquee mt-10 lg:mt-12" data-pause-offscreen>
      {MARQUEE_ROWS.map((row, r) => (
        <div
          key={r}
          className={`skill-marquee__row ${r % 2 ? 'skill-marquee__row--reverse' : ''}`}
          style={{ ['--marquee-duration' as string]: `${row.length * 3.2}s` }}
        >
          {/* Two identical copies; the track slides by exactly one copy for a seamless loop. */}
          {[0, 1].map((copy) => (
            <ul key={copy} className="skill-marquee__track">
              {row.map((skill) => (
                <li key={skill} className="skill-marquee__item">
                  <span className="skill-marquee__dot" />
                  {skill}
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}

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

        <SkillMarquee />

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
