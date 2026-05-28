"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { navItems, stats } from "@/lib/content";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";

const iconPaths: Record<string, React.ReactNode> = {
  architecture: (
    <>
      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" />
      <path d="M12 7v10M8.5 9l7 4M15.5 9l-7 4" />
    </>
  ),
  light_mode: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </>
  ),
  dark_mode: <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  warning: (
    <>
      <path d="M12 3 22 20H2L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
  arrow_forward: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrow_right_alt: <path d="M4 12h16M14 6l6 6-6 6" />,
  mail: (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  calendar: (
    <>
      <path d="M8 2v4M16 2v4M3 10h18" />
      <path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4V9h4v2" />
      <path d="M2 9h4v11H2zM4 4h.01" />
    </>
  ),
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-6a5.5 5.5 0 0 0-1.5-4 5 5 0 0 0-.1-3.5s-1.2-.4-4 1.5a13.4 13.4 0 0 0-7 0C4.6.6 3.4 1 3.4 1a5 5 0 0 0-.1 3.5A5.5 5.5 0 0 0 2 8.5c0 4 3 6 6 6a4.8 4.8 0 0 0-1 3.5v4" />
      <path d="M9 18c-4.5 2-5-2-7-2" />
    </>
  ),
  notifications_active: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4M4 4 2.5 5.5M20 4l1.5 1.5" />
    </>
  ),
  verified: (
    <>
      <path d="M12 2 15 5.2l4.2.8.8 4.2L23 12l-3 1.8-.8 4.2-4.2.8L12 22l-3-3.2-4.2-.8-.8-4.2L1 12l3-1.8.8-4.2L9 5.2 12 2Z" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
};

const infrastructureCards = [
  { name: "ThingsBoard", level: "Expert", tone: "orange", glyph: "grid" },
  { name: "Angular", level: "Advanced", tone: "cyan", glyph: "code" },
  { name: "MQTT / AWS", level: "Expert", tone: "cyan", glyph: "signal" },
  { name: "Node-RED", level: "Advanced", tone: "amber", glyph: "nodes" },
  { name: "REST APIs", level: "Expert", tone: "orange", glyph: "diamond" },
  { name: "InfluxDB", level: "Proficient", tone: "cyan", glyph: "server" },
  { name: "Docker", level: "Proficient", tone: "cyan", glyph: "cube" },
  { name: "TypeScript", level: "Advanced", tone: "orange", glyph: "ts" }
];

const terminalSession = [
  { text: "$ tb-cli device ping --all", tone: "command" },
  { text: "OK 12 devices responding (avg 23ms)", tone: "success" },
  { text: "WARN 1 device high latency: Node-09 (340ms)", tone: "warning" },
  { text: "$ tb-cli telemetry stream --device=node_04", tone: "command" },
  { text: '{ temp: 38.2, humidity: 61, status: "stable" }', tone: "data" },
  { text: "$ curl -X POST /api/v1/telemetry/normalize", tone: "command" },
  { text: "POST 200 OK  payload validated in 42ms", tone: "success" },
  { text: "response.map -> temp_c, humidity_pct, battery_v", tone: "data" },
  { text: "retry.policy -> exponential backoff enabled", tone: "warning" },
  { text: "queue.publish -> alarms.node_04.threshold", tone: "data" },
  { text: "notify.dispatch -> email + push + dashboard toast", tone: "success" }
];

const adminEmail = "sohankumawat2829@gmail.com";

async function sendContactRequest(payload: Record<string, string>) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return response.ok;
}

function openMailFallback(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields).map(([label, value]) => `${label}: ${value}`).join("\n");
  window.location.href = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block h-[1em] w-[1em] shrink-0 ${className}`}
  >
    {iconPaths[name] ?? <circle cx="12" cy="12" r="8" />}
  </svg>
);

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="group relative grid size-10 place-items-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface transition hover:border-secondary hover:text-secondary"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -45, opacity: 0, scale: 0.75 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} className="text-[19px]" />
      </motion.span>
    </button>
  );
}

export function ScheduleConsultationButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || "button-primary"}>
        Schedule Consultation
      </button>
      {open ? <ConsultationModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ConsultationModal({ onClose }: { onClose: () => void }) {
  function submitConsultation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = String(form.get("date") ?? "");
    const time = String(form.get("time") ?? "");
    const payload = {
      type: "Consultation Request",
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      datetime: `${date} ${time} IST`.trim()
    };

    sendContactRequest(payload)
      .then((ok) => {
        if (ok) onClose();
        else openMailFallback("Portfolio consultation request", payload);
      })
      .catch(() => openMailFallback("Portfolio consultation request", payload));
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Schedule consultation">
      <div className="consultation-modal">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
              Consultation
            </p>
            <h2 className="text-2xl font-semibold">Schedule a call</h2>
          </div>
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close consultation form">
            ×
          </button>
        </div>
        <form onSubmit={submitConsultation} className="space-y-4">
          <FormField name="name" label="Name" required />
          <FormField name="email" label="Email" type="email" required />
          <FormField name="phone" label="Phone Number" type="tel" required />
          <ConsultationDateTimePicker />
          <button type="submit" className="button-primary w-full justify-center">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function ConsultationDateTimePicker() {
  const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"];

  return (
    <div className="consultation-picker">
      <div className="consultation-picker-head">
        <span className="consultation-picker-icon">
          <Icon name="calendar" className="text-[18px]" />
        </span>
        <span>
          <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
            Preferred Schedule
          </span>
          <strong className="mt-1 block text-sm text-on-surface">India Standard Time</strong>
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.1fr]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-on-surface">Date</span>
          <input name="date" type="date" required className="form-input consultation-date-input" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-on-surface">Time</span>
          <span className="consultation-time-select">
            <Icon name="clock" className="text-[18px] text-secondary" />
            <select name="time" required defaultValue="" aria-label="Preferred consultation time">
              <option value="" disabled>
                Select a slot
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>
    </div>
  );
}

function FormField({
  name,
  label,
  type = "text",
  required = false,
  multiline = false
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const sharedClass = "form-input";

  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </span>
      {multiline ? (
        <textarea name={name} required={required} rows={5} className={sharedClass} />
      ) : (
        <input name={name} type={type} required={required} className={sharedClass} />
      )}
    </label>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-5xl -translate-x-1/2 sm:top-6 sm:w-[calc(100%-40px)]"
    >
      <div className="glass-kinetic flex items-center justify-between gap-4 rounded-full px-4 py-3 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="brand-mark">
            SB
          </span>
          <span className="truncate text-[17px] font-semibold tracking-tight sm:text-[18px]">
            Sohanlal.dev
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link relative font-mono text-[13px] uppercase tracking-[0.05em] transition-colors hover:text-secondary ${
                pathname === item.href ? "nav-link-active text-on-surface" : "text-on-surface-variant"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}

function HeroWidget() {
  return (
    <motion.div
      variants={scaleIn}
      className="hero-widget relative z-10"
    >
      <div className="hero-widget-frame glass-kinetic overflow-hidden rounded-[30px] p-3 shadow-2xl sm:rounded-[34px] sm:p-5 lg:p-6">
        <div className="overflow-hidden rounded-[22px] bg-terminal shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-terminal-soft px-4 py-3 sm:px-6">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-error" />
              <span className="size-3 rounded-full bg-amber" />
              <span className="size-3 rounded-full bg-green" />
            </div>
            <span className="font-mono text-[10px] text-muted-readout sm:text-[11px]">
              iot-dashboard-v2.1
            </span>
          </div>
          <div className="grid grid-cols-1 divide-y divide-outline-variant/50 sm:grid-cols-2 sm:divide-x">
            <MetricPanel label="Devices Online" value="12" trend="up 2 since last hour" live />
            <AlarmPanel />
            <ChartPanel />
            <NotificationPanel />
          </div>
        </div>
      </div>
      <div className="hero-orbit hero-orbit-inner" />
      <div className="hero-orbit hero-orbit-outer" />
    </motion.div>
  );
}

function MetricPanel({
  label,
  value,
  trend,
  live
}: {
  label: string;
  value: string;
  trend: string;
  live?: boolean;
}) {
  return (
    <div className="min-h-[154px] space-y-3 p-5 sm:p-6">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-readout">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[44px] font-bold leading-none text-white sm:text-[48px]">{value}</span>
        {live ? <span className="live-dot size-2.5 rounded-full bg-green shadow-[0_0_10px_#27c93f]" /> : null}
      </div>
      <span className="text-[12px] font-medium text-teal">â†‘ {trend}</span>
    </div>
  );
}

function AlarmPanel() {
  return (
    <div className="min-h-[154px] space-y-3 overflow-hidden p-5 sm:p-6">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-readout">Active Alarms</span>
      <span className="block text-[44px] font-bold leading-none text-secondary sm:text-[48px]">03</span>
      {["Temp threshold exceeded - Node 04", "Device offline - Node 09", "Humidity critical - Node 11"].map(
        (alarm, index) => (
          <motion.div
            key={alarm}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.15 }}
            className="flex items-center gap-2"
          >
            <Icon name="warning" className="text-[14px] text-secondary" />
            <span className="truncate text-[10px] text-white/60">{alarm}</span>
          </motion.div>
        )
      )}
    </div>
  );
}

function ChartPanel() {
  return (
    <div className="min-h-[154px] space-y-4 p-5 sm:p-6">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-readout">Temperature Â· 24h</span>
      <svg className="h-20 w-full" preserveAspectRatio="none" viewBox="0 0 200 60" aria-hidden="true">
        <path
          d="M0,50 Q25,20 50,45 T100,25 T150,40 T200,30"
          fill="none"
          stroke="var(--color-teal)"
          strokeLinecap="round"
          strokeWidth="2"
          className="draw-line"
        />
      </svg>
      <div className="flex justify-between font-mono text-[8px] text-muted-readout">
        <span>00:00</span>
        <span>08:00</span>
        <span>16:00</span>
        <span>20:00</span>
      </div>
    </div>
  );
}

function NotificationPanel() {
  return (
    <div className="min-h-[154px] space-y-4 overflow-hidden p-5 sm:p-6">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-readout">Notifications</span>
      <div className="h-20 overflow-hidden">
        <div className="notification-ticker space-y-4">
          {["Email sent|user@plant.io", "SMS alert|+91 98XXX XXXXX", "Report exported|06:00 AM"].map((item) => {
            const [title, subtitle] = item.split("|");
            return (
              <div key={item} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-secondary" />
                <span className="flex flex-col">
                  <span className="text-[10px] text-white/80">{title}</span>
                  <span className="text-[9px] text-white/40">{subtitle}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.35], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.28], [1, 0.35]);

  return (
    <header id="home" className="hero-section relative overflow-hidden pb-20 pt-36 sm:pb-24 sm:pt-40">
      <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
        <div className="hero-grid absolute inset-0" />
        <div className="hero-split-panel absolute right-0 top-0 h-full w-[52%]" />
        <div className="absolute left-8 top-1/4 size-64 rounded-full bg-secondary-container/30 blur-[100px]" />
      </motion.div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-site grid-cols-1 items-center gap-12 px-mobile sm:px-10 lg:grid-cols-12 lg:px-desktop"
      >
        <div className="space-y-8 lg:col-span-6">
          <motion.div variants={fadeUp} className="status-chip">
            <span className="size-2 rounded-full bg-secondary animate-pulse" />
            <span>Available for IoT dashboard projects</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="max-w-[760px] text-[clamp(2.8rem,5.8vw,4.9rem)] font-bold leading-[1.02] tracking-[-0.02em] text-on-surface"
          >
            ThingsBoard IoT
            <span className="block font-light text-secondary">Dashboard Engineer</span>
            <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-2 bg-secondary animate-pulse" />
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-xl text-lg leading-[1.65] text-on-surface-variant">
            I build production-ready ThingsBoard dashboards, custom widgets, rule-engine workflows,
            telemetry pipelines, and web interfaces for industrial IoT systems.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            {["NistantriTech", "ThingsBoard Specialist", "Ahmedabad, India"].map((item) => (
              <span key={item} className="rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                {item}
              </span>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Link href="/projects" className="button-primary group">
              View Projects
              <Icon name="arrow_forward" className="text-[22px] transition group-hover:translate-x-1" />
            </Link>
            <Link href="/experience" className="button-secondary">
              Experience
            </Link>
          </motion.div>
        </div>
        <div className="lg:col-span-6">
          <HeroWidget />
        </div>
      </motion.div>
    </header>
  );
}

function StatsStrip() {
  return (
    <section className="bg-inverse py-10 text-inverse-text sm:py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto grid max-w-site grid-cols-2 gap-8 px-mobile sm:px-10 md:grid-cols-4 lg:px-desktop"
      >
        {stats.map((stat) => (
          <motion.div variants={fadeUp} key={stat.label} className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-secondary">{stat.label}</span>
            <span className="text-[34px] font-bold leading-none text-white sm:text-[40px]">{stat.value}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function ProjectGrid() {
  return (
    <section id="projects" className="mx-auto max-w-site px-mobile py-20 sm:px-10 sm:py-24 lg:px-desktop">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
      >
        <motion.div variants={fadeUp} className="max-w-xl">
          <h2 className="mb-4 text-[32px] font-semibold leading-tight sm:text-[40px]">Precision Architecture</h2>
          <p className="text-lg leading-relaxed text-on-surface-variant">
            IoT data products built for real-world monitoring, alerting, and control.
          </p>
        </motion.div>
        <motion.a variants={fadeUp} href="#" className="group inline-flex items-center gap-2 self-start border-b border-primary/20 pb-1 font-mono text-[13px] uppercase tracking-[0.05em] text-primary">
          View All Case Studies
          <Icon name="arrow_right_alt" className="text-[18px] transition group-hover:translate-x-1" />
        </motion.a>
      </motion.div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-8 md:grid-cols-12"
      >
        <MainProjectCard />
        <PlantSyncCard />
        <AlertingCard />
        <ComponentCard />
      </motion.div>
    </section>
  );
}

function Tag({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
        inverse ? "bg-white/10 text-white" : "bg-chip text-chip-text"
      }`}
    >
      {children}
    </span>
  );
}

function MainProjectCard() {
  return (
    <motion.article variants={scaleIn} className="kinetic-card group relative min-h-[520px] overflow-hidden rounded-[32px] bg-inverse md:col-span-8 md:aspect-[16/10] md:min-h-0">
      <div className="absolute inset-0 flex flex-col sm:flex-row">
        <div className="flex-1 bg-terminal-soft p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="size-2 rounded-full bg-secondary" />
            <span className="font-mono text-[11px] text-white/50">IoT Assistant</span>
          </div>
          <div className="space-y-4 text-[12px]">
            <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-none bg-secondary p-3 text-white">
              What is the current temperature of Node 04?
            </div>
            <div className="max-w-[82%] rounded-2xl rounded-tl-none bg-surface-container-high p-3 text-teal">
              Node 04 is currently at 38.2Â°C. Should I set an alarm?
            </div>
            <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-none bg-secondary p-3 text-white">
              Yes, trigger alert if it goes above 40Â°C.
            </div>
            <div className="flex max-w-[82%] items-center gap-1 rounded-2xl rounded-tl-none bg-surface-container-high p-3 text-teal">
              Confirmed. Alert active.
              <span className="h-4 w-0.5 animate-pulse bg-teal" />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 border-l border-white/5 bg-inverse p-5 sm:p-6">
          {[
            ["TEMP", "38.2Â°C"],
            ["DEVICES", "12"],
            ["ALARMS", "03"]
          ].map(([label, value], index) => (
            <div key={label} className="flip-card rounded-xl bg-surface-container-high p-4" style={{ animationDelay: `${index * 1.3}s` }}>
              <span className="text-[10px] uppercase text-on-surface-variant">{label}</span>
              <span className={`block text-2xl font-semibold ${index === 1 ? "text-white" : "text-secondary"}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-inverse via-inverse/50 to-transparent p-7 sm:p-10">
        <div className="mb-4 flex flex-wrap gap-2">
          {["ThingsBoard", "AI Chatbot", "Python", "Alarms"].map((tag) => (
            <Tag inverse key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3 className="mb-2 text-[28px] font-semibold leading-tight text-white sm:text-[32px]">
          IoT AI Insight Dashboard
        </h3>
        <p className="max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
          Conversational AI interface for live IoT data, instant telemetry insights, and alert actions in natural language.
        </p>
      </div>
    </motion.article>
  );
}

function PlantSyncCard() {
  return (
    <motion.article variants={scaleIn} className="kinetic-card flex flex-col justify-between rounded-[32px] border border-outline-variant bg-surface-container-low p-7 md:col-span-4 md:p-8">
      <div>
        <div className="mb-6 rounded-xl border border-outline-variant bg-terminal-soft p-4 shadow-lg">
          <div className="mb-3 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-error" />
            <span className="size-2 rounded-full bg-amber" />
            <span className="size-2 rounded-full bg-green" />
            <span className="ml-2 truncate font-mono text-[9px] text-muted-readout">plantsync.app/dashboard</span>
          </div>
          <svg className="h-24 w-full" viewBox="0 0 200 60" aria-hidden="true">
            <path d="M0,50 Q25,20 50,45 T100,25 T150,40 T200,30" fill="none" stroke="var(--color-secondary)" strokeWidth="2" className="draw-line repeat" />
          </svg>
          <div className="glass-kinetic mt-4 rounded-lg p-3">
            <div className="typing-line overflow-hidden whitespace-nowrap font-mono text-[9px] text-white">
              <span className="text-secondary">GET</span> /api/sensors
            </div>
            <div className="font-mono text-[9px] text-teal">200 OK</div>
          </div>
        </div>
        <h3 className="mb-3 text-2xl font-semibold">PlantSync Web App</h3>
        <p className="leading-relaxed text-on-surface-variant">
          Full-stack monitoring web app with live sensor feeds, user dashboards, and smart notification management.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {["Web App", "REST API", "JavaScript"].map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </motion.article>
  );
}

function AlertingCard() {
  return (
    <motion.article variants={scaleIn} className="kinetic-card overflow-hidden rounded-[32px] border border-outline-variant bg-tertiary-container p-7 text-white md:col-span-5 md:p-10">
      <div className="mb-8 flex h-48 items-center justify-center [perspective:1000px]">
        <div className="stack-container relative h-40 w-64">
          <div className="card-email absolute inset-0 z-10 rounded-xl border-l-[3px] border-secondary bg-terminal-soft p-3 shadow-lg">
            <div className="mb-2 flex items-center gap-2">
              <Icon name="mail" className="text-sm text-secondary" />
              <div className="h-2 w-16 rounded bg-white/10" />
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded bg-white/10" />
              <div className="h-1.5 w-4/5 rounded bg-white/10" />
            </div>
          </div>
          <div className="card-push absolute left-4 right-4 top-4 z-20 flex items-center gap-3 rounded-full bg-surface-container-high p-2 shadow-xl">
            <span className="grid size-6 place-items-center rounded-full bg-secondary">
              <Icon name="notifications_active" className="text-xs text-white" />
            </span>
            <div className="h-2 flex-1 rounded-full bg-white/15" />
          </div>
          <div className="absolute -bottom-4 left-6 right-6 z-30 rounded-xl bg-terminal-soft p-4 shadow-2xl">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-tight text-teal">Weekly Insight</div>
            {["Efficiency up 12%", "Predictive: Node 04", "Report generated."].map((line, index) => (
              <div key={line} className="mb-3 flex items-center gap-2 last:mb-0">
                <span className="insight-bar h-1 rounded-full bg-teal" style={{ width: `${[60, 45, 80][index]}%` }} />
                <span className="font-mono text-[8px] text-white/55">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <h3 className="mb-4 text-[30px] font-semibold leading-tight sm:text-[32px]">Notification & Alerting Engine</h3>
      <p className="leading-relaxed text-white/70">
        Multi-channel intelligent alert delivery through email reports, mobile push notifications, and AI-generated insights.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex w-fit rounded-xl bg-teal px-5 py-3 text-base font-semibold text-on-tertiary-fixed">
          LIVE TELEMETRY
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-white/45">
          Email Alerts Â· Push Notify Â· Python Â· Reports
        </span>
      </div>
    </motion.article>
  );
}

function ComponentCard() {
  return (
    <motion.article variants={scaleIn} className="kinetic-card overflow-hidden rounded-[32px] border border-outline-variant bg-surface-container-high md:col-span-7">
      <div className="component-grid relative flex h-[320px] items-center justify-center overflow-hidden bg-terminal-soft p-6 sm:p-8">
        <div className="relative z-10 grid aspect-video w-full max-w-[440px] grid-cols-6 gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="component-float col-span-6 h-6 rounded-sm bg-secondary/80" />
          <div className="component-float col-span-2 row-span-4 rounded-md border border-white/10 bg-white/5 [animation-delay:.5s]" />
          <div className="col-span-4 space-y-3">
            <div className="flex gap-2">
              <div className="component-float flex h-6 w-12 items-center rounded-full bg-secondary px-1 [animation-delay:1s]">
                <div className="ml-auto size-4 rounded-full bg-white" />
              </div>
              <div className="flex h-6 items-center rounded border border-white/15 bg-white/10 px-4 font-mono text-[8px] text-white/45">
                BUTTON
              </div>
            </div>
            <div className="component-float flex h-6 items-center rounded border border-white/10 bg-white/5 px-3 [animation-delay:.2s]">
              <div className="relative h-0.5 w-full bg-white/10">
                <span className="slider-knob absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_10px_var(--color-secondary)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="component-float h-16 rounded border border-white/10 bg-white/5 [animation-delay:1.5s]" />
              <div className="component-float h-16 rounded border border-secondary/40 bg-secondary/20 [animation-delay:.8s]" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-20 -mt-6 rounded-t-[32px] bg-surface-container-high p-7 backdrop-blur-xl sm:p-10">
        <h3 className="mb-2 text-[28px] font-semibold leading-tight sm:text-[32px]">
          Web Engineering - Component Orchestration Variant
        </h3>
        <div className="mb-6 h-1 w-12 bg-secondary" />
        <p className="mb-8 leading-relaxed text-on-surface-variant">
          Architecting scalable design systems and reusable component libraries that synchronize design tokens with production-ready code.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Storybook", "Tailwind", "Figma", "React"].map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function EngineeringInfrastructure() {
  return (
    <section id="stack" className="engineering-section bg-surface-container-lowest py-20 sm:py-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mx-auto max-w-site px-mobile sm:px-10 lg:px-desktop"
      >
        <motion.div variants={fadeUp} className="mb-12 max-w-2xl">
          <h2 className="mb-5 text-[34px] font-semibold leading-tight sm:text-[44px]">
            Engineering Infrastructure
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
            Core technologies and platforms powering production-grade IoT solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-20">
          <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {infrastructureCards.map((card, index) => (
              <motion.div
                variants={fadeUp}
                key={card.name}
                className="infra-tech-card group"
                style={{ animationDelay: `${index * 0.14}s` }}
              >
                <TechGlyph type={card.glyph} tone={card.tone} />
                <h3 className="mt-5 text-base font-semibold text-on-surface">{card.name}</h3>
                <span className={`mt-3 block font-mono text-[10px] font-bold ${card.level === "Expert" ? "text-green" : card.level === "Advanced" ? "text-amber" : "text-on-surface-variant"}`}>
                  {card.level}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={scaleIn} className="infra-terminal overflow-hidden rounded-[18px] border border-outline-variant bg-terminal-soft shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/60 px-5 py-4">
              <div className="flex gap-2">
                <span className="size-3 rounded-full bg-error" />
                <span className="size-3 rounded-full bg-amber" />
                <span className="size-3 rounded-full bg-green" />
              </div>
              <span className="font-mono text-[11px] text-muted-readout">system@iot-stack:~$</span>
            </div>
            <div className="min-h-[360px] p-6 font-mono text-[12px] leading-relaxed sm:p-8 sm:text-[13px]">
              <TerminalReplay />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function TerminalReplay() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCycle((current) => current + 1);
    }, 9000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div key={cycle} className="terminal-session">
      {terminalSession.map((line, index) => (
        <p
          key={`${line.text}-${index}`}
          className={`terminal-line terminal-line-${line.tone}`}
          style={{ animationDelay: `${0.35 + index * 0.55}s` }}
        >
          {line.text}
        </p>
      ))}
      <span className="terminal-cursor" />
    </div>
  );
}

function TechGlyph({ type, tone }: { type: string; tone: string }) {
  return (
    <span className="tech-glyph" data-tone={tone} aria-hidden="true">
      {type === "grid" ? (
        <svg viewBox="0 0 24 24"><path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" /></svg>
      ) : type === "code" ? (
        <svg viewBox="0 0 24 24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4" /></svg>
      ) : type === "signal" ? (
        <svg viewBox="0 0 24 24"><path d="M8 16a6 6 0 0 1 0-8M16 8a6 6 0 0 1 0 8M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14M12 12h.01" /></svg>
      ) : type === "nodes" ? (
        <svg viewBox="0 0 24 24"><path d="M5 6h5v5H5zM14 13h5v5h-5zM10 8h4M12 8v7M8 16h6" /></svg>
      ) : type === "diamond" ? (
        <svg viewBox="0 0 24 24"><path d="m12 3 4 4-4 4-4-4 4-4ZM5 10l4 4-4 4-4-4 4-4ZM19 10l4 4-4 4-4-4 4-4ZM12 13l4 4-4 4-4-4 4-4Z" /></svg>
      ) : type === "server" ? (
        <svg viewBox="0 0 24 24"><path d="M4 5h16v5H4zM4 14h16v5H4zM8 7h.01M8 16h.01" /></svg>
      ) : type === "cube" ? (
        <svg viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9" /></svg>
      ) : (
        <span className="font-mono text-[13px] font-black">JS</span>
      )}
    </span>
  );
}

function CTA() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(520px circle at ${mouseX}px ${mouseY}px, color-mix(in srgb, var(--color-secondary) 18%, transparent), transparent 48%)`;

  return (
    <section className="bg-cta-section px-mobile py-20 sm:px-10 sm:py-24 lg:px-desktop">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="group relative mx-auto max-w-5xl"
      >
        <div className="absolute inset-0 rotate-1 scale-105 rounded-[40px] bg-secondary opacity-10 transition duration-500 group-hover:rotate-0 sm:rounded-[48px]" />
        <motion.div
          style={{ background }}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            mouseX.set(event.clientX - rect.left);
            mouseY.set(event.clientY - rect.top);
          }}
          className="relative overflow-hidden rounded-[40px] border border-outline-variant bg-inverse p-8 text-center text-white shadow-2xl sm:rounded-[48px] sm:p-16"
        >
          <div className="absolute right-0 top-0 -mr-20 -mt-20 size-80 rounded-full bg-secondary/20 blur-[100px]" />
          <h2 className="relative mb-6 text-[42px] font-bold leading-tight tracking-[-0.02em] sm:text-[64px]">
            Ready to Build?
          </h2>
          <p className="relative mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/70 sm:mb-12">
            Whether you are scaling an industrial network or architecting a consumer device interface, let&apos;s make the system secure and future-ready.
          </p>
          <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <ScheduleConsultationButton className="button-primary w-full justify-center sm:w-auto" />
            <Link href="/contact" className="button-ghost w-full justify-center sm:w-auto">
              Contact
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-footer py-10 sm:py-12">
      <div className="mx-auto flex max-w-site flex-col items-center justify-between gap-8 px-mobile text-center sm:px-10 md:flex-row md:text-left lg:px-desktop">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="brand-mark">SB</span>
            <span className="text-[18px] font-semibold">Sohanlal.dev</span>
          </Link>
          <p className="font-mono text-[12px] uppercase text-on-surface-variant">Â© 2026 IoT Dashboard Developer</p>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="font-mono text-[11px] uppercase tracking-widest">Built with precision</span>
          <Icon name="bolt" className="text-[16px] text-secondary" />
        </div>
      </div>
    </footer>
  );
}

function HomeContent() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <ProjectGrid />
        <EngineeringInfrastructure />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export function HomePage() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}


