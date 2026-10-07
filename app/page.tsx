"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";

/* =====================================================================
   EDIT YOUR INFO HERE — everything on the page comes from this section
   ===================================================================== */

const profile = {
  name: "Ammar Taeha",
  firstName: "Ammar",
  role: "Software Engineer, Machine Learning",
  location: "Folsom, CA",
  photo: "/profile.jpg", // put your photo in the /public folder with this name
  resume: "/resume.pdf", // put your resume in the /public folder with this name
  resumeUpdated: "Updated October 2026",
  email: "ammartaha99@gmail.com",
  github: "ammartaha99",
  linkedin: "https://www.linkedin.com/in/ammartaha99/",
};

const about = [
  "I'm a Computer Science student at Sacramento State concentrating in Intelligence and Modeling/Simulations. I've interned as a software engineer at Intel, where I automated regression testing and profiled multi-threaded workloads, and at District Hut, where I scaled data pipelines processing 3 TB a week and helped automate model retraining.",
  "I like work where software engineering and machine learning meet: systems that stay reliable in production and models that are measured honestly. Outside of engineering, I've led teams as a gym team lead, worked as a licensed realtor, and refereed competitive soccer, which taught me to communicate clearly and stay calm under pressure.",
];

const education = [
  {
    school: "California State University, Sacramento",
    detail: "B.S. Computer Science, concentrations in Intelligence and Modeling/Simulations",
    dates: "Expected Dec 2026", // confirm this matches your actual graduation term
    coursework:
      "Data Structures & Algorithms, Operating Systems, Computer Networks, Computer Organization, Software Engineering, Data Analytics & Mining, Computational Biology, Cloud Computing & Security, Information Security, Software Testing & QA",
  },
];

const experience = [
  {
    role: "Software Engineering Intern (Machine Learning)",
    org: "District Hut",
    dates: "May 2024 – Jul 2025",
    bullets: [
      "Scaled distributed data pipelines processing 3 TB per week across cloud infrastructure, improving throughput and reliability.",
      "Revamped SQL data-integrity checks, preventing 5 critical production data-corruption issues and automating 75% of validation tasks with 100% test coverage.",
      "Worked with 3 engineers to automate model retraining agents, saving 6 hours of manual work per week.",
    ],
  },
  {
    role: "Information Technologist Student Assistant",
    org: "FI$Cal",
    dates: "Jun 2025 – Dec 2025",
    bullets: [
      "Supported the Fiscal Department with database management, network troubleshooting, and employee support.",
      "Managed data and records systems to keep database updates accurate and fiscal operations running smoothly.",
    ],
  },
  {
    role: "Software Engineering Intern",
    org: "Intel Corporation, Folsom",
    dates: "May 2023 – Dec 2023",
    bullets: [
      "Built and optimized C++ and Python benchmarking scripts to evaluate performance and hardware-software integration on client computing platforms.",
      "Automated regression test suites with Python and Git, cutting validation runtimes by 20% and speeding up CI deployment cycles.",
      "Analyzed low-level telemetry and execution metrics to find memory overhead and thread bottlenecks in multi-threaded workloads.",
    ],
  },
];

const projects = [
  {
    name: "HVAC Client Scheduling Web App",
    context: "Team Lead, Senior Project (CSC 190/191)",
    dates: "May 2025 – Dec 2025",
    tech: "Full-stack web, databases",
    bullets: [
      "Led the team building a client-facing app for HVAC customers to book appointments and service requests.",
      "Architected backend logic and database workflows, and owned debugging and system design documentation through deployment.",
    ],
  },
  {
    name: "Audiology Externship Portal",
    context: "Team Lead",
    dates: "Aug 2024 – May 2025",
    tech: "Python, React, Agile",
    bullets: [
      "Led development of an externship portal with secure payment processing, survey approvals, and an admin panel.",
    ],
  },
  {
    name: "Machine Learning & Data Preprocessing",
    context: "Coursework projects",
    dates: "Jan 2025 – May 2025",
    tech: "Python, Pandas, Scikit-learn",
    bullets: [
      "Built regression and classification models (linear and multiple regression, decision trees) with feature selection, PCA/SVD reduction, and evaluation.",
    ],
  },
];

const skills = [
  { group: "Languages", items: "Python, Java, C++, C, JavaScript, SQL, HTML/CSS, Swift, MATLAB" },
  { group: "Web & backend", items: "React, Node.js, Spring Boot, Bootstrap" },
  { group: "Data & ML", items: "Pandas, NumPy, Scikit-learn, Jupyter Notebooks" },
  { group: "Cloud & tools", items: "AWS, Git, Agile/Scrum" },
];

const leadership = [
  {
    role: "Team Lead, InShape Family Fitness",
    dates: "Feb 2024 – Aug 2025",
    summary: "Directed daily operations and led staff to keep service standards high.",
  },
  {
    role: "Licensed Realtor",
    dates: "Aug 2021 – May 2023",
    summary: "Managed client relationships, property marketing campaigns, and contract negotiations.",
  },
  {
    role: "Soccer Referee",
    dates: "Aug 2017 – May 2024",
    summary: "Officiated 90-minute matches leading 3-person referee teams in high-pressure games.",
  },
];

// Choose which GitHub repos to show, by exact name, e.g. ["my-app", "ml-project"].
// Leave empty to show your 6 most recently updated repos.
const pinnedRepos: string[] = [];

/* ===================================================================== */

const sections = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "leadership", label: "Leadership" },
  { id: "contact", label: "Contact" },
];

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  pushed_at: string;
};

function useGitHubRepos() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${profile.github}/repos?sort=pushed&per_page=100`)
      .then((res) => {
        if (res.status === 404)
          throw new Error("GitHub user not found. Check the username at the top of app/page.tsx.");
        if (!res.ok)
          throw new Error("GitHub isn't responding right now. Refresh in a few minutes.");
        return res.json();
      })
      .then((data: Repo[]) => {
        let list = data.filter((r) => !r.fork);
        if (pinnedRepos.length) {
          list = pinnedRepos
            .map((name) => list.find((r) => r.name === name))
            .filter((r): r is Repo => Boolean(r));
        }
        setRepos(list.slice(0, 6));
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  return { repos, error };
}

function useActiveSection() {
  const [active, setActive] = useState("about");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

/* ---------- Small building blocks ---------- */

function Avatar() {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  if (failed) {
    return (
      <div className="mx-auto flex aspect-square w-40 items-center justify-center rounded-xl bg-tan font-serif text-5xl text-muted">
        {initials}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={img}
      src={profile.photo}
      alt={profile.name}
      onError={() => setFailed(true)}
      className="mx-auto aspect-square w-40 rounded-xl object-cover object-top"
    />
  );
}

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-10 border-t border-line py-12 first:border-t-0 first:pt-0 last:pb-0"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <h2 className="mt-2 font-serif text-[2.1rem] leading-[1.15] tracking-[-0.01em]">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Row({
  title,
  subtitle,
  meta,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="font-semibold text-[15px]">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {meta && <span className="shrink-0 font-mono text-[12px] text-muted">{meta}</span>}
      </div>
      {subtitle && <p className="mt-1 text-[14px] text-muted">{subtitle}</p>}
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 max-w-[66ch] space-y-2 text-[14.5px] leading-relaxed text-ink/80">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

const icons = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.110-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
  email: (
    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.6-8-5.6ZM5.6 7 12 11.5 18.4 7H5.6Z" />
  ),
};

function IconLink({ href, label, icon }: { href: string; label: string; icon: keyof typeof icons }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-tan-edge bg-tan text-ink/80 transition-colors hover:bg-tan-hover hover:text-ink"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        {icons[icon]}
      </svg>
    </a>
  );
}

function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; the address is still visible to copy by hand
    }
  };
  return { copied, copy };
}

function EmailButton() {
  const [open, setOpen] = useState(false);
  const { copied, copy } = useCopyEmail();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const clickOutside = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label="Show email address"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-tan-edge bg-tan text-ink/80 transition-colors hover:bg-tan-hover hover:text-ink"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          {icons.email}
        </svg>
      </button>
      {open && (
        <div className="absolute left-1/2 top-11 z-10 w-max -translate-x-1/2 rounded-xl border border-line bg-paper px-4 py-3 text-center shadow-lg">
          <p className="select-all text-[13px] font-medium">{profile.email}</p>
          <button
            type="button"
            onClick={copy}
            className="mt-1.5 text-[12px] text-muted underline underline-offset-4 hover:text-ink"
          >
            {copied ? "Copied" : "Copy address"}
          </button>
        </div>
      )}
    </div>
  );
}

function CopyEmailButton() {
  const { copied, copy } = useCopyEmail();
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-xl border border-tan-edge bg-tan px-5 py-2.5 text-sm font-medium transition-colors hover:bg-tan-hover"
    >
      {copied ? "Copied to clipboard" : "Copy email address"}
    </button>
  );
}

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

/* ---------- The page ---------- */

export default function Home() {
  const active = useActiveSection();
  const { repos, error } = useGitHubRepos();
  const githubUrl = `https://github.com/${profile.github}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:py-10">
        <div className="mx-auto grid max-w-[1160px] gap-6 lg:grid-cols-[272px_1fr]">
          {/* Sidebar */}
          <motion.aside
            {...enter(0)}
            className="self-start rounded-2xl border border-line bg-card p-6 lg:sticky lg:top-10"
          >
            <Avatar />
            <h1 className="mt-5 text-center font-serif text-[1.6rem] leading-tight">{profile.name}</h1>
            <p className="mt-1 text-center text-[13px] text-muted">{profile.role}</p>
            <p className="mt-0.5 text-center text-[13px] text-muted">{profile.location}</p>

            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block rounded-xl border border-tan-edge bg-tan px-4 py-3 text-center transition-colors hover:bg-tan-hover"
            >
              <span className="block text-sm font-medium">Resume</span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-muted">
                {profile.resumeUpdated}
              </span>
            </a>
            <a
              href="#contact"
              className="mt-3 block rounded-xl border border-line bg-paper px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-tan"
            >
              Contact me
            </a>

            <div className="mt-5 flex justify-center gap-2">
              <IconLink href={profile.linkedin} label="LinkedIn" icon="linkedin" />
              <IconLink href={githubUrl} label="GitHub" icon="github" />
              <EmailButton />
            </div>

            <nav className="mt-6 hidden border-t border-line pt-4 lg:block">
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`block rounded-lg px-3 py-2 text-[14px] transition-colors ${
                    active === id ? "bg-tan font-medium text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </motion.aside>

          {/* Main content */}
          <motion.main
            {...enter(0.15)}
            className="rounded-2xl border border-line bg-card px-6 py-10 sm:px-12 lg:px-16 lg:py-14"
          >
            <Section id="about" label="About" title={`Hi, I'm ${profile.firstName}.`}>
              <div className="max-w-[64ch] space-y-4 text-[15.5px] leading-[1.75] text-ink/85">
                {about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Section>

            <Section id="education" label="Education" title="Where I've studied.">
              {education.map((e) => (
                <Row key={e.school} title={e.school} subtitle={e.detail} meta={e.dates}>
                  <p className="mt-3 max-w-[66ch] text-[14px] leading-relaxed text-ink/75">
                    <span className="font-medium text-ink">Relevant coursework: </span>
                    {e.coursework}
                  </p>
                </Row>
              ))}
            </Section>

            <Section id="experience" label="Experience" title="Where I've worked.">
              {experience.map((x) => (
                <Row key={x.role + x.org} title={x.role} subtitle={x.org} meta={x.dates}>
                  <Bullets items={x.bullets} />
                </Row>
              ))}
            </Section>

            <Section id="projects" label="Projects" title="What I've built.">
              {projects.map((p) => (
                <Row key={p.name} title={p.name} subtitle={p.context} meta={p.dates}>
                  <p className="mt-2 font-mono text-[12px] text-muted">{p.tech}</p>
                  <Bullets items={p.bullets} />
                </Row>
              ))}

              <h3 className="mt-12 text-[13px] font-medium text-muted">Latest on GitHub</h3>
              <div className="mt-5">
                {error && <p className="text-[14.5px] text-muted">{error}</p>}
                {!error && !repos && (
                  <p className="text-[14.5px] text-muted">Loading projects from GitHub…</p>
                )}
                {repos && repos.length === 0 && (
                  <p className="text-[14.5px] text-muted">
                    No public repositories yet. Push a project to GitHub and it will show up here.
                  </p>
                )}
                {repos?.map((r) => (
                  <Row
                    key={r.id}
                    title={r.name}
                    href={r.html_url}
                    meta={new Date(r.pushed_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  >
                    {r.description && (
                      <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-relaxed text-ink/80">
                        {r.description}
                      </p>
                    )}
                    <p className="mt-2 flex gap-4 font-mono text-[12px] text-muted">
                      {r.language && <span>{r.language}</span>}
                      {r.stargazers_count > 0 && <span>★ {r.stargazers_count}</span>}
                    </p>
                  </Row>
                ))}
              </div>
              {repos && repos.length > 0 && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-block text-[14px] font-medium underline underline-offset-4 hover:text-muted"
                >
                  See everything on GitHub
                </a>
              )}
            </Section>

            <Section id="skills" label="Skills" title="What I work with.">
              <div className="divide-y divide-line">
                {skills.map((s) => (
                  <div
                    key={s.group}
                    className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[150px_1fr] sm:gap-6"
                  >
                    <p className="text-[14px] font-semibold">{s.group}</p>
                    <p className="text-[14.5px] leading-relaxed text-ink/80">{s.items}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="leadership" label="Leadership" title="Beyond engineering.">
              {leadership.map((l) => (
                <Row key={l.role} title={l.role} meta={l.dates}>
                  <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-relaxed text-ink/80">
                    {l.summary}
                  </p>
                </Row>
              ))}
            </Section>

            <Section id="contact" label="Contact" title="Let's talk.">
              <p className="max-w-[62ch] text-[15.5px] leading-[1.75] text-ink/85">
                I&apos;m open to software engineering and machine learning roles. You can reach me
                at <span className="select-all font-medium text-ink">{profile.email}</span>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CopyEmailButton />
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-line bg-paper px-5 py-2.5 text-sm font-medium transition-colors hover:bg-tan"
                >
                  View my LinkedIn
                </a>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-line bg-paper px-5 py-2.5 text-sm font-medium transition-colors hover:bg-tan"
                >
                  View my GitHub
                </a>
              </div>
            </Section>
          </motion.main>
        </div>

        <footer className="mx-auto mt-8 max-w-[1160px] pb-4 text-center font-mono text-[12px] text-muted">
          © 2026 {profile.name}        </footer>
      </div>
    </MotionConfig>
  );
}