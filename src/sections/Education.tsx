import Reveal from '../components/Reveal';

interface EducationItem {
  degree: string;
  institution: string;
  field: string;
  period: string;
  status: string;
  desc: string;
}

const educationData: EducationItem[] = [
  {
    degree: 'Bachelor of Technology (B.Tech)',
    institution: 'PES College of Engineering, Aurangabad / DBATU',
    field: 'Electronics & Computer Engineering',
    period: '2022 — 2026',
    status: 'Expected 2026',
    desc: 'Engineering education covering computing architectures, embedded systems, software engineering, algorithms, data structures, and digital circuits.'
  },
  {
    degree: 'Master of Business Administration (MBA)',
    institution: 'Dr. D. Y. Patil Vidyapeeth, Pune',
    field: 'Artificial Intelligence & Machine Learning (Online MBA)',
    period: '2026 — 2028',
    status: 'Currently pursuing',
    desc: 'Postgraduate curriculum on machine learning foundations, enterprise AI applications, predictive analytics, and technology management.'
  },
  {
    degree: 'Bachelor of Arts (B.A.)',
    institution: 'Yashwantrao Chavan Maharashtra Open University (YCMOU)',
    field: 'Humanities & Social Sciences',
    period: '2026',
    status: 'Completed',
    desc: 'Undergraduate degree providing a foundation in communication, organisational behaviour, sociology, and analytical thought.'
  }
];

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="section">
      <div className="wrap">
        <header className="section-head">
          <span className="section-index">06</span>
          <span className="eyebrow">Education</span>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 id="education-title" className="h-section">Academic background.</h2>
          </Reveal>

          <ol className="lg:col-span-8 border-t border-ink">
            {educationData.map((edu, i) => (
              <Reveal
                as="li"
                key={edu.degree}
                delay={i * 0.05}
                className="grid grid-cols-1 gap-3 border-b border-line py-8 md:grid-cols-[12rem_1fr] md:gap-10"
              >
                <div className="text-sm">
                  <p className="font-medium text-ink">{edu.period}</p>
                  <p className="mt-1 text-muted">{edu.status}</p>
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-[1.45rem] leading-snug text-ink">{edu.degree}</h3>
                  <p className="mt-1 text-[0.9375rem] text-ink-soft">{edu.field}</p>
                  <p className="mt-0.5 text-sm text-muted">{edu.institution}</p>
                  <p className="mt-4 max-w-[38rem] text-[0.9375rem] leading-relaxed text-muted">{edu.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
