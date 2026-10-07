"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

/* =====================================================================
   EDIT YOUR INFO HERE — everything on the page comes from this section
   ===================================================================== */

const profile = {
  name: "Ammar Taeha",
  role: "Software Engineer, Machine Learning",
  tagline: "I build reliable software and the data systems that machine learning runs on.",
  photo: "/profile.jpg",
  resume: "/resume.pdf",
  email: "ammartaha99@gmail.com",
  github: "ammartaha99",
  linkedin: "https://www.linkedin.com/in/ammar-taeha-263357220/",
};

const about = [
  "I'm a Computer Science student at Sacramento State concentrating in Intelligence and Modeling/Simulations. I've interned as a software engineer at Intel, where I automated regression testing and profiled multi-threaded workloads, and at District Hut, where I scaled data pipelines processing 3 TB a week and helped automate model retraining.",
  "I like work where software engineering and machine learning meet: systems that stay reliable in production and models that are measured honestly. Outside of engineering, I've led teams as a gym team lead, worked as a licensed realtor, and refereed competitive soccer, which taught me to communicate clearly and stay calm under pressure.",
];

const skills = [
  "Python", "Java", "C++", "C", "JavaScript", "SQL", "React", "Node.js",
  "Spring Boot", "AWS", "Git", "Pandas", "NumPy", "Scikit-learn",
];

const experience = [
  {
    dates: "Jun 2025 — Dec 2025",
    role: "Information Technologist Student Assistant",
    org: "FI$Cal",
    bullets: [
      "Supported the Fiscal Department with database management, network troubleshooting, and employee support.",
      "Managed data and records systems to keep database updates accurate and fiscal operations running smoothly.",
    ],
    tags: ["Databases", "Networking", "IT Support"],
  },
  {
    dates: "May 2024 — Jul 2025",
    role: "Software Engineering Intern (Machine Learning)",
    org: "District Hut",
    bullets: [
      "Scaled distributed data pipelines processing 3 TB per week across cloud infrastructure, improving throughput and reliability.",
      "Revamped SQL data-integrity checks, preventing 5 critical production data-corruption issues and automating 75% of validation tasks with 100% test coverage.",
      "Worked with 3 engineers to automate model retraining agents, saving 6 hours of manual work per week.",
    ],
    tags: ["SQL", "Data Pipelines", "Cloud", "ML Automation"],
  },
  {
    dates: "May 2023 — Dec 2023",
    role: "Software Engineering Intern",
    org: "Intel Corporation, Folsom",
    bullets: [
      "Built and optimized C++ and Python benchmarking scripts to evaluate performance and hardware-software integration on client computing platforms.",
      "Automated regression test suites with Python and Git, cutting validation runtimes by 20% and speeding up CI deployment cycles.",
      "Analyzed low-level telemetry and execution metrics to find memory overhead and thread bottlenecks in multi-threaded workloads.",
    ],
    tags: ["C++", "Python", "Git", "CI/CD", "Performance"],
  },
];

const projects = [
  {
    dates: "2026",
    name: "Personal Portfolio Website",
    context: "Solo project",
    link: "https://github.com/ammartaha99/portfolio",
    bullets: [
      "Designed and built this site with a cursor spotlight, scroll animations, and an interactive phoenix mascot rendered with SVG and a particle system on HTML canvas.",
      "Integrated the GitHub REST API to load my latest repositories live, deployed with continuous delivery on Vercel.",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Canvas", "Vercel"],
  },
  {
    dates: "May 2025 — Dec 2025",
    name: "HVAC Client Scheduling Web App",
    context: "Team Lead, Senior Project (CSC 190/191)",
    bullets: [
      "Led the team building a client-facing app for HVAC customers to book appointments and service requests.",
      "Architected backend logic and database workflows, and owned debugging and system design documentation through deployment.",
    ],
    tags: ["Full-Stack", "Databases", "System Design"],
  },
  {
    dates: "Aug 2024 — May 2025",
    name: "Audiology Externship Portal",
    context: "Team Lead",
    bullets: [
      "Led development of an externship portal with secure payment processing, survey approvals, and an admin panel.",
    ],
    tags: ["Python", "React", "Agile"],
  },
  {
    dates: "Jan 2025 — May 2025",
    name: "Machine Learning & Data Preprocessing",
    context: "Coursework projects",
    bullets: [
      "Built regression and classification models (linear and multiple regression, decision trees) with feature selection, PCA/SVD reduction, and evaluation.",
    ],
    tags: ["Python", "Pandas", "Scikit-learn"],
  },
];

const education = {
  dates: "Expected Dec 2026", // confirm this matches your actual graduation term
  school: "California State University, Sacramento",
  degree: "B.S. Computer Science, concentrations in Intelligence and Modeling/Simulations",
  coursework:
    "Data Structures & Algorithms, Operating Systems, Computer Networks, Computer Organization, Software Engineering, Data Analytics & Mining, Computational Biology, Cloud Computing & Security, Information Security, Software Testing & QA",
};

const leadership = [
  {
    dates: "Feb 2024 — Aug 2025",
    role: "Team Lead, InShape Family Fitness",
    summary: "Directed daily operations and led staff to keep service standards high.",
  },
  {
    dates: "Aug 2021 — May 2023",
    role: "Licensed Realtor",
    summary: "Managed client relationships, property marketing campaigns, and contract negotiations.",
  },
  {
    dates: "Aug 2017 — May 2024",
    role: "Soccer Referee",
    summary: "Officiated 90-minute matches leading 3-person referee teams in high-pressure games.",
  },
];

// What the phoenix says as you scroll into each section
const mascotLines: Record<string, string> = {
  about: "Click me. I dare you.",
  experience: "Intel and District Hut. Hot stuff.",
  projects: "He led the team on two of these.",
  education: "Sac State CS. Go Hornets!",
  leadership: "Team lead, realtor, referee.",
  contact: "Go on, say hi.",
};
const mascotHoverLine = "Click me to see me fly.";

// Choose which GitHub repos to show, by exact name, e.g. ["portfolio", "ml-project"].
// Leave empty to show your 6 most recently updated repos.
const pinnedRepos: string[] = [];

/* ===================================================================== */

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "leadership", label: "Leadership" },
  { id: "contact", label: "Contact" },
];

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  fork: boolean;
  pushed_at: string;
};

type EmitOptions = { count?: number; spread?: number; speed?: number; size?: number };
type Emit = (x: number, y: number, angle: number, opts?: EmitOptions) => void;

const PHOENIX = 140; // phoenix size in pixels
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- Data hooks ---------- */

function useGitHubRepos() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${profile.github}/repos?sort=pushed&per_page=100`)
      .then((res) => {
        if (res.status === 404)
          throw new Error("GitHub user not found. Check the username at the top of app/page.tsx.");
        if (!res.ok) throw new Error("GitHub isn't responding right now. Refresh in a few minutes.");
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

/* ---------- Effects: spotlight, progress bar, reveal ---------- */

function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      ref.current?.style.setProperty("--x", `${e.clientX}px`);
      ref.current?.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      style={{
        background:
          "radial-gradient(600px circle at var(--x, 50%) var(--y, 30%), rgba(243, 194, 122, 0.07), transparent 80%)",
      }}
    />
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
    />
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Fire: a particle system drawn on a full-screen canvas ---------- */

function FireCanvas({ emitter }: { emitter: React.RefObject<Emit | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; violet: boolean };
    const particles: Particle[] = [];

    emitter.current = (x, y, angle, { count = 30, spread = 0.5, speed = 6, size = 14 } = {}) => {
      for (let i = 0; i < count; i++) {
        const a = angle + (Math.random() - 0.5) * spread;
        const s = speed * (0.5 + Math.random());
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          max: 30 + Math.random() * 30,
          size: size * (0.6 + Math.random() * 0.8),
          violet: Math.random() < 0.12,
        });
      }
      if (particles.length > 1500) particles.splice(0, particles.length - 1500);
    };

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.max) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 - 0.08; // flames rise
        const t = p.life / p.max;
        const r = p.size * (1 - t * 0.6);
        const hue = p.violet ? 265 : 50 - t * 45; // yellow fading to red
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        glow.addColorStop(0, `hsla(${hue + 10}, 100%, ${85 - t * 30}%, ${0.9 * (1 - t)})`);
        glow.addColorStop(0.4, `hsla(${hue}, 100%, 55%, ${0.6 * (1 - t)})`);
        glow.addColorStop(1, `hsla(${hue - 10}, 100%, 40%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      emitter.current = null;
    };
  }, [emitter]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[45]" />;
}

/* ---------- The phoenix ---------- */

function PhoenixArt({ flap }: { flap: number }) {
  const wing = (dir: 1 | -1) => ({
    animate: { rotate: [-4 * dir, 16 * dir, -4 * dir] },
    transition: { duration: flap, repeat: Infinity, ease: "easeInOut" as const },
  });

  return (
    <svg
      viewBox="0 0 200 200"
      width={PHOENIX}
      height={PHOENIX}
      aria-hidden
      className="overflow-visible drop-shadow-[0_0_18px_rgba(255,140,40,0.55)]"
    >
      <defs>
        <linearGradient id="px-wing-l" x1="1" y1="0.6" x2="0" y2="0.2">
          <stop offset="0" stopColor="#fff1a8" />
          <stop offset="0.35" stopColor="#ffb02e" />
          <stop offset="0.7" stopColor="#ff4d1f" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="px-wing-r" x1="0" y1="0.6" x2="1" y2="0.2">
          <stop offset="0" stopColor="#fff1a8" />
          <stop offset="0.35" stopColor="#ffb02e" />
          <stop offset="0.7" stopColor="#ff4d1f" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="px-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset="1" stopColor="#ffd166" />
        </linearGradient>
        <linearGradient id="px-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="0.4" stopColor="#ffb02e" />
          <stop offset="0.8" stopColor="#ff5a1f" />
          <stop offset="1" stopColor="#c2185b" />
        </linearGradient>
        <linearGradient id="px-tail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a1f" />
          <stop offset="0.5" stopColor="#ff3b1f" />
          <stop offset="1" stopColor="#6d5dfc" />
        </linearGradient>
      </defs>

      {/* tail */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M100 130 C90 150, 110 162, 96 180 C90 188, 94 194, 86 198" stroke="url(#px-tail)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M100 130 C110 150, 92 165, 106 182 C110 190, 106 195, 114 198" stroke="url(#px-tail)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M100 130 C96 155, 104 172, 100 196" stroke="url(#px-tail)" strokeWidth="6" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* left wing */}
      <motion.g style={{ transformBox: "fill-box", transformOrigin: "100% 75%" }} {...wing(1)}>
        <path d="M92 82 C70 60, 45 45, 18 38 C35 52, 30 56, 22 60 C40 62, 38 68, 30 74 C50 72, 55 78, 50 86 C65 82, 75 88, 92 92 Z" fill="url(#px-wing-l)" />
        <path d="M94 84 C78 70, 60 62, 42 58 C55 66, 52 70, 48 74 C62 74, 66 80, 64 86 C74 84, 82 88, 94 92 Z" fill="url(#px-inner)" opacity="0.85" />
      </motion.g>

      {/* right wing */}
      <motion.g style={{ transformBox: "fill-box", transformOrigin: "0% 75%" }} {...wing(-1)}>
        <path d="M108 82 C130 60, 155 45, 182 38 C165 52, 170 56, 178 60 C160 62, 162 68, 170 74 C150 72, 145 78, 150 86 C135 82, 125 88, 108 92 Z" fill="url(#px-wing-r)" />
        <path d="M106 84 C122 70, 140 62, 158 58 C145 66, 148 70, 152 74 C138 74, 134 80, 136 86 C126 84, 118 88, 106 92 Z" fill="url(#px-inner)" opacity="0.85" />
      </motion.g>

      {/* body */}
      <path d="M100 62 C108 66, 110 80, 108 100 C106 118, 102 126, 100 136 C98 126, 94 118, 92 100 C90 80, 92 66, 100 62 Z" fill="url(#px-body)" />

      {/* crest */}
      <path d="M100 56 C97 48, 103 44, 100 36 C107 43, 107 50, 103 57 Z" fill="#ffb02e" />
      <path d="M97 57 C92 52, 93 47, 90 43 C97 46, 99 51, 99 57 Z" fill="#ff7a1f" />
      <path d="M103 57 C108 52, 107 47, 110 43 C103 46, 101 51, 101 57 Z" fill="#ff7a1f" />

      {/* head, eyes, beak */}
      <circle cx="100" cy="63" r="7.5" fill="#ffd166" />
      <circle cx="97" cy="62" r="1.3" fill="#2b0a00" />
      <circle cx="103" cy="62" r="1.3" fill="#2b0a00" />
      <path d="M98 66 L100 71 L102 66 Z" fill="#ff7a1f" />
    </svg>
  );
}

function Phoenix({ section, fire }: { section: string; fire: React.RefObject<Emit | null> }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const [flying, setFlying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [talking, setTalking] = useState(false);

  // Start in the bottom-right corner, and stay on screen when the window resizes
  useEffect(() => {
    x.set(window.innerWidth - PHOENIX - 24);
    y.set(window.innerHeight - PHOENIX - 24);
    const frame = requestAnimationFrame(() => setReady(true));
    const keepOnScreen = () => {
      x.set(Math.min(Math.max(16, x.get()), window.innerWidth - PHOENIX - 16));
      y.set(Math.min(Math.max(16, y.get()), window.innerHeight - PHOENIX - 16));
    };
    window.addEventListener("resize", keepOnScreen);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", keepOnScreen);
    };
  }, [x, y]);

  // Embers drip from the tail while it hovers
  useEffect(() => {
    if (!ready || flying || reduce) return;
    const id = setInterval(() => {
      fire.current?.(x.get() + 70 + (Math.random() - 0.5) * 10, y.get() + 128, Math.PI / 2, {
        count: 1,
        spread: 0.8,
        speed: 1,
        size: 7,
      });
    }, 140);
    return () => clearInterval(id);
  }, [ready, flying, reduce, fire, x, y]);

  // Says something when you scroll into a new section
  useEffect(() => {
    const show = setTimeout(() => setTalking(true), 300);
    const hide = setTimeout(() => setTalking(false), 3800);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      setTalking(false);
    };
  }, [section]);

  const breatheFire = (angle: number) => {
    for (let i = 0; i < 16; i++) {
      setTimeout(
        () => fire.current?.(x.get() + 70, y.get() + 50, angle, { count: 10, spread: 0.35, speed: 10, size: 16 }),
        i * 45
      );
    }
  };

  const fly = async () => {
    if (flying) return;
    setFlying(true);

    // 1. Breathe fire toward the middle of the screen
    const mouthX = x.get() + 70;
    const mouthY = y.get() + 50;
    breatheFire(Math.atan2(window.innerHeight / 2 - mouthY, window.innerWidth / 2 - mouthX));
    await wait(750);

    // 2. Pick a new spot that's a decent distance away
    const margin = 32;
    let targetX = x.get();
    let targetY = y.get();
    for (let tries = 0; tries < 12; tries++) {
      targetX = margin + Math.random() * (window.innerWidth - PHOENIX - margin * 2);
      targetY = margin + Math.random() * (window.innerHeight - PHOENIX - margin * 2);
      if (Math.hypot(targetX - x.get(), targetY - y.get()) > 260) break;
    }

    // 3. Fly there, leaving a trail of fire, then land with a burst
    if (reduce) {
      x.set(targetX);
      y.set(targetY);
    } else {
      const stopTrail = x.on("change", () =>
        fire.current?.(x.get() + 70, y.get() + 115, Math.PI / 2, { count: 2, spread: 1.4, speed: 1.6, size: 10 })
      );
      animate(rotate, Math.max(-25, Math.min(25, (targetX - x.get()) / 18)), { duration: 0.3 });
      await new Promise<void>((resolve) => {
        animate(y, targetY, { duration: 1.4, ease: "easeInOut" });
        animate(x, targetX, { duration: 1.4, ease: "easeInOut", onComplete: () => resolve() });
      });
      stopTrail();
      animate(rotate, 0, { duration: 0.5 });
      fire.current?.(targetX + 70, targetY + 60, -Math.PI / 2, { count: 40, spread: Math.PI * 2, speed: 3, size: 12 });
    }

    setFlying(false);
  };

  if (!ready) return null;

  const line = hovered ? mascotHoverLine : mascotLines[section];

  return (
    <motion.div
      style={{ x, y, rotate }}
      className="fixed left-0 top-0 z-[46] hidden md:block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {(talking || hovered) && !flying && line && (
          <motion.div
            key={hovered ? "hover" : section}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 mb-1 w-max max-w-[220px] -translate-x-1/2 rounded-xl border border-line bg-surface px-3.5 py-2 text-[13px] text-ink shadow-lg"
          >
            {line}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={fly}
        aria-label="Phoenix mascot. Click to make it breathe fire and fly."
        className="block cursor-pointer rounded-full"
      >
        <motion.div
          animate={flying ? { y: 0 } : { y: [0, -8, 0] }}
          transition={flying ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoenixArt flap={flying ? 0.35 : 1.6} />
        </motion.div>
      </button>
    </motion.div>
  );
}

/* ---------- Small building blocks ---------- */

function Avatar() {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface text-2xl font-semibold text-ink">
        AT
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
      className="h-20 w-20 rounded-full object-cover object-top ring-1 ring-line"
    />
  );
}

function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-label={label} className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
        <h2 className="text-sm font-bold uppercase tracking-widest text-ink">{label}</h2>
      </div>
      {children}
    </section>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none"
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Tags({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
      {items.map((t) => (
        <li key={t} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium leading-5 text-accent">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-4 before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Entry({
  dates,
  title,
  subtitle,
  href,
  tags,
  children,
}: {
  dates: string;
  title: string;
  subtitle?: string;
  href?: string;
  tags?: string[];
  children?: React.ReactNode;
}) {
  return (
    <li className="mb-12 last:mb-0">
      <Reveal>
        <div className="group relative grid transition-opacity duration-300 sm:grid-cols-8 sm:gap-6 lg:group-hover/list:opacity-50 lg:hover:opacity-100!">
          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-lg transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-surface/60 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)]" />
          <p className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-muted sm:col-span-2">
            {dates}
          </p>
          <div className="z-10 sm:col-span-6">
            <h3 className="font-medium leading-snug text-ink">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-baseline hover:text-accent focus-visible:text-accent"
                >
                  <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
                  <span>{title}</span>
                  <Arrow />
                </a>
              ) : (
                title
              )}
            </h3>
            {subtitle && <p className="mt-0.5 text-sm text-ink/60">{subtitle}</p>}
            {children}
            <Tags items={tags} />
          </div>
        </div>
      </Reveal>
    </li>
  );
}

const icons = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
  email: (
    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.6-8-5.6ZM5.6 7 12 11.5 18.4 7H5.6Z" />
  ),
};

function SocialIcon({ icon }: { icon: keyof typeof icons }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      {icons[icon]}
    </svg>
  );
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
        className="block text-muted transition-colors hover:text-ink"
      >
        <SocialIcon icon="email" />
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 z-30 mb-3 w-max -translate-x-1/2 rounded-xl border border-line bg-surface px-4 py-3 text-center shadow-lg">
          <p className="select-all text-sm font-medium text-ink">{profile.email}</p>
          <button
            type="button"
            onClick={copy}
            className="mt-1.5 text-xs text-muted underline underline-offset-4 hover:text-accent"
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
      className="rounded-lg border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
    >
      {copied ? "Copied to clipboard" : "Copy email address"}
    </button>
  );
}

/* ---------- The page ---------- */

export default function Home() {
  const active = useActiveSection();
  const { repos, error } = useGitHubRepos();
  const fire = useRef<Emit | null>(null);
  const githubUrl = `https://github.com/${profile.github}`;

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Spotlight />
      <FireCanvas emitter={fire} />
      <Phoenix section={active} fire={fire} />

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-6 py-12 md:px-12 md:py-16 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-8">
          {/* Left side: stays put while you scroll on desktop */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[46%] lg:flex-col lg:justify-between lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Avatar />
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-5xl">{profile.name}</h1>
              <p className="mt-3 text-lg font-medium text-ink sm:text-xl">{profile.role}</p>
              <p className="mt-4 max-w-xs leading-normal">{profile.tagline}</p>

              <nav className="hidden lg:block" aria-label="In-page navigation">
                <ul className="mt-14 w-max">
                  {sections.map(({ id, label }) => {
                    const on = active === id;
                    return (
                      <li key={id}>
                        <a href={`#${id}`} className="group flex items-center py-2.5">
                          <span
                            className={`mr-4 h-px transition-all motion-reduce:transition-none ${
                              on ? "w-16 bg-ink" : "w-8 bg-muted group-hover:w-16 group-hover:bg-ink"
                            }`}
                          />
                          <span
                            className={`text-xs font-bold uppercase tracking-widest ${
                              on ? "text-ink" : "text-muted group-hover:text-ink"
                            }`}
                          >
                            {label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>

            <div className="mt-8 flex items-center gap-5">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-muted transition-colors hover:text-ink"
              >
                <SocialIcon icon="github" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-muted transition-colors hover:text-ink"
              >
                <SocialIcon icon="linkedin" />
              </a>
              <EmailButton />
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="group/link ml-2 inline-flex items-baseline text-sm font-semibold text-ink hover:text-accent"
              >
                Resume
                <Arrow />
              </a>
            </div>
          </header>

          {/* Right side: scrolling content */}
          <main className="pt-20 lg:w-[54%] lg:py-24">
            <Section id="about" label="About">
              <Reveal>
                <div className="space-y-4 leading-relaxed">
                  {about.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted">Tools I use</p>
                <Tags items={skills} />
              </Reveal>
            </Section>

            <Section id="experience" label="Experience">
              <ol className="group/list">
                {experience.map((x) => (
                  <Entry key={x.role} dates={x.dates} title={x.role} subtitle={x.org} tags={x.tags}>
                    <Bullets items={x.bullets} />
                  </Entry>
                ))}
              </ol>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="group/link mt-12 inline-flex items-baseline font-semibold text-ink hover:text-accent"
              >
                View full resume
                <Arrow />
              </a>
            </Section>

            <Section id="projects" label="Projects">
              <ol className="group/list">
                {projects.map((p) => (
                  <Entry
                    key={p.name}
                    dates={p.dates}
                    title={p.name}
                    subtitle={p.context}
                    href={p.link}
                    tags={p.tags}
                  >
                    <Bullets items={p.bullets} />
                  </Entry>
                ))}
              </ol>

              <h3 className="mb-8 mt-16 text-xs font-semibold uppercase tracking-wide text-muted">
                Latest on GitHub
              </h3>
              {error && <p className="text-sm">{error}</p>}
              {!error && !repos && <p className="text-sm">Loading projects from GitHub…</p>}
              {repos && repos.length === 0 && (
                <p className="text-sm">No public repositories yet. Push a project to GitHub and it will show up here.</p>
              )}
              {repos && repos.length > 0 && (
                <ol className="group/list">
                  {repos.map((r) => (
                    <Entry
                      key={r.id}
                      dates={new Date(r.pushed_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      title={r.name}
                      href={r.html_url}
                      tags={r.language ? [r.language] : undefined}
                    >
                      {r.description && <p className="mt-2 text-sm leading-relaxed">{r.description}</p>}
                    </Entry>
                  ))}
                </ol>
              )}
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="group/link mt-12 inline-flex items-baseline font-semibold text-ink hover:text-accent"
              >
                See everything on GitHub
                <Arrow />
              </a>
            </Section>

            <Section id="education" label="Education">
              <ol className="group/list">
                <Entry dates={education.dates} title={education.school} subtitle={education.degree}>
                  <p className="mt-2 text-sm leading-relaxed">
                    <span className="font-medium text-ink/80">Relevant coursework: </span>
                    {education.coursework}
                  </p>
                </Entry>
              </ol>
            </Section>

            <Section id="leadership" label="Leadership">
              <ol className="group/list">
                {leadership.map((l) => (
                  <Entry key={l.role} dates={l.dates} title={l.role}>
                    <p className="mt-2 text-sm leading-relaxed">{l.summary}</p>
                  </Entry>
                ))}
              </ol>
            </Section>

            <Section id="contact" label="Contact">
              <Reveal>
                <p className="text-2xl font-semibold tracking-tight text-ink">Let&apos;s talk.</p>
                <p className="mt-3 max-w-md leading-relaxed">
                  I&apos;m open to software engineering and machine learning roles. You can reach me at{" "}
                  <span className="select-all font-medium text-ink">{profile.email}</span>.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <CopyEmailButton />
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    View my LinkedIn
                  </a>
                </div>
              </Reveal>
            </Section>

            <footer className="max-w-md pb-16 text-sm text-muted sm:pb-0">
              Built with Next.js, Tailwind CSS, and Framer Motion. Deployed on Vercel. © 2026 {profile.name}.
            </footer>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}