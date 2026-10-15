import Reveal from '../components/Reveal';

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  kind: string;
  location: string;
  tasks: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: 'IT & Technical Support Assistant',
    company: 'Kamel Education Society',
    period: 'June 2023 — Present',
    kind: 'Ongoing role',
    location: 'Parbhani, Maharashtra, India',
    tasks: [
      'Administer IT infrastructure across 5 institutional schools, maintaining 10–20 workstation computers, network switches, and peripherals.',
      'Diagnose and resolve hardware, operating system, and Wi-Fi/LAN connectivity issues for 100+ students and 10+ faculty members.',
      'Manage institutional digital student records and support administration platforms, including the rollout of the CampusOne ERP system.',
      'Provide technical setup, audiovisual support, and staging for educational workshops, conferences, and institutional events.'
    ]
  },
  {
    role: 'Developer Intern',
    company: 'Bilim Technologies',
    period: 'September 2025 — November 2025',
    kind: 'Internship · Completed',
    location: 'Remote',
    tasks: [
      'Built and integrated modular frontend components for live web platforms using HTML5, CSS3, JavaScript, and Bootstrap.',
      'Ensured cross-device responsiveness and accessibility across mobile, tablet, and desktop viewports.',
      'Gained hands-on codebase experience with PHP, Laravel, and MySQL by connecting UI components to backend controllers.',
      'Worked with REST API endpoints to bind dynamic server responses to client-side views.'
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">03</span>
          <span className="eyebrow">Experience</span>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 id="experience-title" className="h-section">
              Hands‑on roles in development and IT support.
            </h2>
          </Reveal>

          <ol className="lg:col-span-8 border-t border-ink">
            {experiences.map((exp, i) => (
              <Reveal
                as="li"
                key={exp.company}
                delay={i * 0.06}
                className="grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-[12rem_1fr] md:gap-10 md:py-10"
              >
                <div className="text-sm">
                  <p className="font-medium text-ink">{exp.period}</p>
                  <p className="mt-1 text-muted">{exp.kind}</p>
                  <p className="mt-1 text-muted">{exp.location}</p>
                </div>

                <div className="min-w-0">
                  <h3 className="font-serif text-[1.65rem] leading-tight text-ink sm:text-[1.85rem]">
                    {exp.role}
                  </h3>
                  <p className="mt-1 text-[0.9375rem] text-muted">{exp.company}</p>

                  <ul className="mt-5 space-y-2.5">
                    {exp.tasks.map((task) => (
                      <li key={task} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                        <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-muted" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
