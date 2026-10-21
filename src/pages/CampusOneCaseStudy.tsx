import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { SITE_CONFIG } from '../data/config';
import Reveal from '../components/Reveal';
import { Headline } from '../components/Motion';
import ThemeToggle from '../components/ThemeToggle';

/**
 * CampusOne case study (/work/campusone).
 * Everything here comes from what is already stated about the project — no invented
 * user counts or metrics. Add real numbers to `FACTS` once they are available.
 */
const project = PROJECTS.find((p) => p.id === 'campusone')!;

const FACTS = [
  { label: 'Built for', value: 'Kamel Education Society' },
  { label: 'Product', value: 'Multi-tenant school ERP (SaaS)' },
  { label: 'Status', value: 'In development' },
  { label: 'Access', value: 'Five roles · three portals' },
];

const PORTALS = [
  { title: 'Super admin', text: 'The society’s view across every school: approving schools, overseeing records and reports.' },
  { title: 'School staff', text: 'Day-to-day operations for one school: students, attendance, fees, exams, ID cards and notices.' },
  { title: 'Parents', text: 'One guardian account for all linked children — attendance, fees, homework, timetable and results.' },
];

const DECISIONS = [
  {
    title: 'Tenant isolation lives in the database',
    text: 'Every school’s data is separated with PostgreSQL Row-Level Security, so isolation and role checks for all five roles are enforced by the database itself rather than trusted to UI code — and covered by automated SQL security tests.',
  },
  {
    title: 'QR codes never carry student data',
    text: 'ID-card QR codes resolve to a server-issued verification token. Scanning one opens a public verification page; the code itself contains no personal information.',
  },
  {
    title: 'Money gets an audit trail',
    text: 'Receipts use sequential, school-scoped numbers. Discounts and concessions require permission and are written to audit logs.',
  },
  {
    title: 'Corrections are recorded, not overwritten',
    text: 'Attendance changes go through an authorised correction workflow with an audit trail, and historical academic records are preserved across promotions.',
  },
  {
    title: 'Messaging never fakes success',
    text: 'Notices go out over WhatsApp, email and SMS through one shared provider adapter, with explicit queued / sent / delivered / failed / unconfigured states.',
  },
];

const MODULES = [
  {
    title: 'Academic management',
    items: [
      'Academic years, classes, divisions and subjects',
      'Teacher-to-class and teacher-to-subject assignments',
      'Timetables and homework/assignment tracking',
      'Exams, marks entry, grading rules and report cards',
    ],
  },
  {
    title: 'Attendance',
    items: [
      'Daily, class-wise Present / Absent / Late / Leave',
      'Authorised corrections with an audit trail',
      'Daily and monthly summaries, per-student history',
      'Attendance percentage and CSV/PDF reports',
    ],
  },
  {
    title: 'Fees & accounting',
    items: [
      'Fee structures by academic year and class, with instalments',
      'Permissioned discounts and concessions, logged',
      'Sequential, school-scoped receipt numbers',
      'Defaulter lists and outstanding-balance reports',
    ],
  },
  {
    title: 'ID cards',
    items: [
      'Reusable templates with live preview for students, staff and management',
      'QR codes that resolve to a verification token',
      'Single and bulk, class-wise A4 PDF generation',
    ],
  },
  {
    title: 'Parent portal',
    items: [
      'One guardian account, multiple linked children',
      'Only their own children’s records',
      'Leave applications with status tracking',
    ],
  },
  {
    title: 'Communication',
    items: [
      'Notices targeted by class, staff group or whole school',
      'WhatsApp, email and SMS through one adapter',
      'Honest delivery states — never a false success',
    ],
  },
];

/** Simple, readable architecture diagram drawn with theme colours. */
function ArchitectureDiagram() {
  const box = 'fill-[var(--paper)] stroke-[var(--line)]';
  return (
    <figure className="frame overflow-x-auto rounded-xl bg-paper p-4 sm:p-6">
      <svg
        viewBox="0 0 960 372"
        role="img"
        aria-labelledby="arch-title arch-desc"
        className="mx-auto block h-auto w-full min-w-[640px]"
      >
        <title id="arch-title">CampusOne architecture</title>
        <desc id="arch-desc">
          A React and TypeScript web app serves three portals. It authenticates with Supabase Auth and reads and
          writes PostgreSQL, where Row-Level Security isolates each school. Edge Functions issue QR verification
          tokens and send messages through one provider adapter. ID cards are generated as A4 PDFs in the browser.
        </desc>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-[var(--muted)]" />
          </marker>
        </defs>
        <g fontFamily="Inter, system-ui, sans-serif" className="fill-[var(--ink)]">
          {/* Portals */}
          {['Super admin', 'School staff', 'Parents'].map((t, i) => (
            <g key={t}>
              <rect x={30} y={40 + i * 70} width={170} height={48} rx={10} className={box} strokeWidth={1.5} />
              <text x={115} y={69 + i * 70} textAnchor="middle" fontSize={15} fontWeight={600}>{t}</text>
            </g>
          ))}
          <text x={115} y={268} textAnchor="middle" fontSize={12} className="fill-[var(--muted)]">Three portals</text>

          {/* Web app */}
          <rect x={270} y={40} width={230} height={188} rx={12} className={box} strokeWidth={1.5} />
          <text x={385} y={72} textAnchor="middle" fontSize={16} fontWeight={700}>Web app</text>
          {['React 19 · TypeScript · Vite', 'React Router v7', 'React Hook Form + Zod', 'jsPDF → A4 ID-card sheets'].map((t, i) => (
            <text key={t} x={385} y={104 + i * 28} textAnchor="middle" fontSize={13} className="fill-[var(--ink-soft)]">{t}</text>
          ))}

          {/* Supabase */}
          <rect x={570} y={24} width={360} height={232} rx={12} fill="none" className="stroke-[#E8622C]" strokeWidth={1.5} strokeDasharray="6 5" />
          <text x={750} y={48} textAnchor="middle" fontSize={13} fontWeight={600} fill="#E8622C">Supabase</text>
          <rect x={595} y={62} width={150} height={52} rx={10} className={box} strokeWidth={1.5} />
          <text x={670} y={93} textAnchor="middle" fontSize={14} fontWeight={600}>Auth</text>
          <rect x={765} y={62} width={145} height={52} rx={10} className={box} strokeWidth={1.5} />
          <text x={837} y={86} textAnchor="middle" fontSize={14} fontWeight={600}>Edge Functions</text>
          <text x={837} y={104} textAnchor="middle" fontSize={11} className="fill-[var(--muted)]">Deno</text>
          <rect x={595} y={132} width={315} height={104} rx={10} className={box} strokeWidth={1.5} />
          <text x={752} y={160} textAnchor="middle" fontSize={15} fontWeight={700}>PostgreSQL</text>
          <text x={752} y={184} textAnchor="middle" fontSize={13} fill="#E8622C" fontWeight={600}>Row-Level Security per school</text>
          <text x={752} y={206} textAnchor="middle" fontSize={12} className="fill-[var(--muted)]">5 roles · audit logs · SQL security tests</text>

          {/* Outside services */}
          <rect x={765} y={300} width={165} height={56} rx={10} className={box} strokeWidth={1.5} />
          <text x={847} y={324} textAnchor="middle" fontSize={13} fontWeight={600}>WhatsApp · Email · SMS</text>
          <text x={847} y={342} textAnchor="middle" fontSize={11} className="fill-[var(--muted)]">one provider adapter</text>
          <rect x={530} y={300} width={190} height={56} rx={10} className={box} strokeWidth={1.5} />
          <text x={625} y={324} textAnchor="middle" fontSize={13} fontWeight={600}>Public verification page</text>
          <text x={625} y={342} textAnchor="middle" fontSize={11} className="fill-[var(--muted)]">QR → token, no raw data</text>

          {/* Arrows */}
          <g className="stroke-[var(--muted)]" strokeWidth={1.5} fill="none" markerEnd="url(#arrow)">
            <path d="M200 64 L268 90" />
            <path d="M200 134 L268 134" />
            <path d="M200 204 L268 180" />
            <path d="M500 100 L593 88" />
            <path d="M500 160 L593 178" />
            {/* Edge Functions → messaging, routed around the database box */}
            <path d="M910 88 H946 V328 H934" />
            {/* Database → public verification page (token lookup) */}
            <path d="M680 238 L640 298" />
          </g>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted">How CampusOne fits together</figcaption>
    </figure>
  );
}

export default function CampusOneCaseStudy() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      {/* Slim top bar for this page */}
      <header className="sticky top-0 z-50 border-b border-line bg-ivory/92 backdrop-blur-md">
        <div className="wrap flex h-[var(--nav-height)] items-center justify-between gap-4">
          <a href="/#projects" className="link-quiet inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to portfolio
          </a>
          <a href="/" className="flex items-center gap-3" aria-label="Kamel Shah — home">
            <img src={SITE_CONFIG.logo} alt="" width={320} height={127} className="h-6 w-auto" />
            <span className="hidden text-[0.8125rem] font-semibold tracking-[0.2em] text-ink sm:inline">KAMEL SHAH</span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* Intro */}
        <section className="wrap pt-12 pb-10 sm:pt-16">
          <p className="eyebrow">Case study · {project.category}</p>
          <h1 className="display mt-5 text-[clamp(2.8rem,8vw,6rem)] text-ink">{project.title}</h1>
          <p className="mt-4 max-w-[40rem] font-serif text-[clamp(1.25rem,2.4vw,1.6rem)] italic leading-snug text-ink-soft">
            {project.tagline}
          </p>

          <dl className="mt-10 grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {FACTS.map((f, i) => (
              <div key={f.label} className={`py-5 pr-4 ${i > 0 ? 'lg:border-l lg:border-line lg:pl-6' : ''} ${i % 2 === 1 ? 'border-l border-line pl-4 lg:pl-6' : ''}`}>
                <dt className="eyebrow">{f.label}</dt>
                <dd className="mt-2 font-serif text-lg leading-snug text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wrap pb-16">
          <Reveal from="up" blur={false}>
            <div className="frame aspect-[16/10] rounded-xl">
              <picture>
                {project.imageWebp && <source srcSet={project.imageWebp} type="image/webp" />}
                <img
                  src={project.image}
                  alt="CampusOne institutional dashboard with student ID badge generator, attendance roster and fee charts"
                  width={1586}
                  height={992}
                  fetchPriority="high"
                  className="h-full w-full object-contain object-top"
                />
              </picture>
            </div>
          </Reveal>
        </section>

        {/* Problem */}
        <section className="section">
          <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="eyebrow">01 · The problem</span>
              <Headline className="h-section mt-4">Many schools, one society, zero data leaks.</Headline>
            </div>
            <div className="lead space-y-5 lg:col-span-8">
              <p>
                Kamel Education Society runs several schools. Each one needs its own students, staff, fees, attendance,
                exams and parent communication — while the society needs oversight across all of them.
              </p>
              <p>
                The hard requirement is that no school can ever see another school’s data, and that every role only sees
                what it should. CampusOne is being built as one multi-tenant platform to do exactly that, with separate
                portals for super admins, school staff and parents.
              </p>
            </div>
          </div>
        </section>

        {/* Portals */}
        <section className="section">
          <div className="wrap">
            <span className="eyebrow">02 · Who uses it</span>
            <Headline className="h-section mt-4 max-w-[20ch]">Three portals, five roles.</Headline>
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {PORTALS.map((p) => (
                <li key={p.title} className="rounded-xl border border-line bg-paper p-6">
                  <h3 className="font-serif text-2xl text-ink">{p.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Architecture */}
        <section className="section">
          <div className="wrap">
            <span className="eyebrow">03 · Architecture</span>
            <Headline className="h-section mt-4 max-w-[22ch]">Security enforced where the data lives.</Headline>
            <div className="mt-10">
              <ArchitectureDiagram />
            </div>
          </div>
        </section>

        {/* Decisions */}
        <section className="section">
          <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="eyebrow">04 · Key decisions</span>
              <Headline className="h-section mt-4">The choices that matter.</Headline>
            </div>
            <ol className="border-t border-ink lg:col-span-8">
              {DECISIONS.map((d, i) => (
                <li key={d.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-7">
                  <span className="section-index pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-serif text-[1.45rem] leading-tight text-ink">{d.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{d.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Modules */}
        <section className="section">
          <div className="wrap">
            <span className="eyebrow">05 · What it does</span>
            <Headline className="h-section mt-4 max-w-[20ch]">Six modules, one platform.</Headline>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <div key={m.title} className="rounded-xl border border-line bg-paper p-6">
                  <h3 className="font-serif text-xl text-ink">{m.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {m.items.map((it) => (
                      <li key={it} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                        <span aria-hidden="true" className="mt-[0.2em] grid h-[1.1rem] w-[1.1rem] shrink-0 place-items-center rounded-full border border-line bg-ivory">
                          <Check size={10} strokeWidth={2.4} />
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stack + quality */}
        <section className="section">
          <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="eyebrow">06 · Stack &amp; quality</span>
              <Headline className="h-section mt-4">Built to be trusted.</Headline>
            </div>
            <div className="lg:col-span-8">
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {project.tech.map((t) => (
                  <li key={t} className="tag">{t}</li>
                ))}
              </ul>
              <p className="lead mt-6">
                Forms are validated with Zod schemas, unit tests run on Vitest, and the database’s Row-Level Security
                policies are checked by automated SQL security tests, so tenant isolation is tested rather than assumed.
              </p>
            </div>
          </div>
        </section>

        {/* Status + CTA */}
        <section className="section">
          <div className="wrap">
            <div className="rounded-2xl bg-ink p-8 text-ivory sm:p-12">
              <span className="eyebrow !text-ivory/60">Status</span>
              <p className="mt-4 max-w-[40rem] font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight">
                CampusOne is in active development for Kamel Education Society, where I also support its rollout as part
                of my IT role.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/#contact" className="btn bg-ivory text-ink hover:bg-paper">
                  Talk to me about it
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <a href="/#projects" className="btn border border-ivory/40 text-ivory hover:border-ivory">
                  See other work
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
