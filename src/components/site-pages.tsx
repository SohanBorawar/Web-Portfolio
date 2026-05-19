"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer, Icon, Navbar, ScheduleConsultationButton } from "@/components/home-page";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";

const projects = [
  {
    title: "Smart Factory Monitor",
    body: "Real-time temperature and humidity monitoring across 48 industrial nodes with threshold-based alarm escalation.",
    tags: ["ThingsBoard", "Angular", "MQTT"],
    meta: "48 nodes active",
    visual: "factory"
  },
  {
    title: "Fleet GPS Tracker",
    body: "Live vehicle telemetry with geofencing alarms, route optimization, and real-time fleet status dashboards.",
    tags: ["ThingsBoard", "WebSockets", "REST API"],
    meta: "Live",
    visual: "fleet"
  },
  {
    title: "Agricultural IoT Hub",
    body: "Multi-sensor soil and weather dashboard for precision agriculture with predictive analytics and automated irrigation.",
    tags: ["ThingsBoard", "Node-RED", "InfluxDB"],
    meta: "Multi-sensor",
    visual: "agri"
  }
];

const experiences = [
  {
    years: "Jan 2024 - Present",
    title: "Software Engineer",
    company: "NistantriTech, Ahmedabad",
    points: [
      "Developed and customized IoT dashboards on ThingsBoard",
      "Designed and implemented custom Rule Engine workflows",
      "Created and managed custom widgets",
      "Configured devices, telemetry, alarms, and data pipelines"
    ]
  },
  {
    years: "Sep 2024 - Apr 2025",
    title: "Python Full Stack Developer",
    company: "TOPS Technologies Pvt. Ltd, Ahmedabad",
    points: [
      "Built Python full-stack fundamentals across backend and frontend workflows",
      "Worked with database-backed web application patterns",
      "Strengthened API handling, validation, and deployment-ready coding practices"
    ]
  },
  {
    years: "Feb 2023 - Apr 2023",
    title: "Web Development Intern",
    company: "TechAdapt.io",
    points: [
      "Improved problem-solving, code quality, and professional delivery habits",
      "Worked in an agile development environment",
      "Built practical web development foundations"
    ]
  },
  {
    years: "May 2019 - May 2023",
    title: "Bachelor of Engineering",
    company: "Silver Oak College of Engineering & Technology",
    points: [
      "Electronics and Communication Engineering",
      "Built a strong foundation in systems, communication, and programming",
      "Focused professional direction around IoT platforms and dashboard engineering"
    ]
  }
];

const contactLinks = [
  ["Email", "sohankumawat2829@gmail.com", "mailto:sohankumawat2829@gmail.com", "mail"],
  ["LinkedIn", "Sohanlal Borawar", "https://www.linkedin.com/in/sohanlal-borawar-b485781a1/", "linkedin"],
  ["GitHub", "Sohanlal Borawar", "https://github.com/sohanlal-borawar", "github"]
];

async function sendContactRequest(payload: Record<string, string>) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return response.ok;
}

function sendMailto(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields).map(([label, value]) => `${label}: ${value}`).join("\n");
  window.location.href = `mailto:sohankumawat2829@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="min-h-screen pt-32 sm:pt-36">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}

function ProjectVisual({ type, meta }: { type: string; meta: string }) {
  return (
    <div className={`project-visual project-visual-${type}`}>
      {type === "factory" ? (
        <div className="factory-screen">
          <span />
          <span />
          <strong />
        </div>
      ) : type === "fleet" ? (
        <div className="fleet-line">
          <span />
          <span />
          <strong />
        </div>
      ) : (
        <div className="agri-bars">
          <span />
          <span />
          <span />
        </div>
      )}
      <p className="project-visual-meta">{meta}</p>
    </div>
  );
}

export function ProjectsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-site px-mobile pb-20 sm:px-10 sm:pb-24 lg:px-desktop">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mb-12 max-w-2xl">
          <motion.h1 variants={fadeUp} className="mb-4 text-[38px] font-semibold leading-tight sm:text-[52px]">
            Projects
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg leading-relaxed text-on-surface-variant">
            Production-grade IoT dashboards, telemetry systems, and alerting workflows built for live operations.
          </motion.p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.article variants={scaleIn} key={project.title} className="project-page-card">
              <ProjectVisual type={project.visual} meta={project.meta} />
              <div className="p-6 sm:p-7">
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-chip px-3 py-1 font-mono text-[10px] text-chip-text">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mb-3 text-2xl font-semibold">{project.title}</h2>
                <p className="mb-7 leading-relaxed text-on-surface-variant">{project.body}</p>
                <div className="flex items-center justify-between gap-4 font-mono text-[12px]">
                  <a href="#" className="text-on-surface-variant transition hover:text-secondary">
                    &lt;&gt; GitHub
                  </a>
                  <a href="#" className="font-bold text-secondary">
                    View Case Study →
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </PageShell>
  );
}

export function ExperiencePage() {
  return (
    <PageShell>
      <section className="experience-page mx-auto max-w-site px-mobile pb-20 sm:px-10 sm:pb-24 lg:px-desktop">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="experience-hero"
        >
          <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-secondary">
            Professional Profile
          </p>
          <h1 className="mt-4 text-[38px] font-semibold leading-tight sm:text-[52px]">
            Experience built around IoT delivery.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
            IoT Developer and ThingsBoard Dashboard Specialist with Angular, JavaScript, Python,
            IIoT, and CSS experience across dashboards, devices, telemetry, alarms, and data pipelines.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["2+ yrs", "IoT delivery"],
              ["ThingsBoard", "Dashboards"],
              ["Angular", "Widgets"],
              ["Python", "APIs"]
            ].map(([value, label]) => (
              <span key={value} className="experience-skill-chip">
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            ))}
          </div>
        </motion.div>
        <div className="professional-timeline">
          {experiences.map((item, index) => (
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.16, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              key={item.title}
              className={`experience-entry ${index % 2 === 0 ? "experience-entry-left" : "experience-entry-right"}`}
            >
              <span className="experience-dot" />
              <div className="experience-card-header">
                <p className="font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-secondary">
                  {item.years}
                </p>
                <span className="experience-index">0{index + 1}</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold sm:text-[28px]">{item.title}</h2>
              <p className="mt-2 text-lg text-on-surface-variant">{item.company}</p>
              <ul className="mt-6 space-y-3 text-on-surface-variant">
                {item.points.map((point) => (
                  <li key={point} className="experience-point">{point}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function ContactPage() {
  function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      type: "Contact Form",
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? "")
    };

    sendContactRequest(payload)
      .then((ok) => {
        if (!ok) sendMailto("Portfolio contact form submission", payload);
      })
      .catch(() => sendMailto("Portfolio contact form submission", payload));
  }

  return (
    <PageShell>
      <section className="mx-auto grid max-w-site grid-cols-1 gap-10 px-mobile pb-20 sm:px-10 sm:pb-24 lg:grid-cols-[0.92fr_1.08fr] lg:px-desktop">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="contact-profile-column">
          <motion.div variants={fadeUp} className="profile-card">
            <Image src="/images/profile.jpg" alt="Sohanlal Borawar" width={420} height={420} priority className="profile-card-image" />
            <div className="profile-card-body">
              <h2 className="text-2xl font-semibold">Sohanlal Borawar</h2>
              <p className="mt-2 text-on-surface-variant">
                IoT Developer · ThingsBoard Dashboard Specialist · Angular & JavaScript Web Developer · Python Programmer
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-secondary">
                Ahmedabad, Gujarat, India
              </p>
            </div>
          </motion.div>
          <motion.p variants={fadeUp} className="mb-4 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-secondary">
            Contact
          </motion.p>
          <motion.h1 variants={fadeUp} className="mb-6 text-[38px] font-semibold leading-tight sm:text-[52px]">
            Let&apos;s build a reliable IoT dashboard.
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
            I design ThingsBoard dashboards, custom widgets, rule-engine workflows, device telemetry,
            alarms, data pipelines, and full-stack web flows for production-grade IoT systems.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ScheduleConsultationButton className="button-primary justify-center" />
            <a href="https://www.linkedin.com/in/sohanlal-borawar-b485781a1/" className="button-secondary justify-center">
              LinkedIn Profile
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="contact-social-grid">
            {contactLinks.map(([label, value, href, icon]) => (
              <a key={label} href={href} className="contact-social-card">
                <Icon name={icon} className="text-[24px] text-secondary" />
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">
                    {label}
                  </span>
                  <strong className="mt-1 block text-base">{value}</strong>
                </span>
              </a>
            ))}
          </motion.div>

          <motion.form variants={fadeUp} onSubmit={submitContact} className="contact-panel p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput name="name" label="Name" required />
              <FormInput name="email" label="Email" type="email" required />
              <FormInput name="phone" label="Phone Number" type="tel" required />
              <div className="hidden sm:block" />
            </div>
            <div className="mt-4">
              <FormInput name="message" label="Details / Message" multiline required />
            </div>
            <button type="submit" className="button-primary mt-6 w-full justify-center">
              Send
            </button>
          </motion.form>
        </motion.div>
      </section>
    </PageShell>
  );
}

function FormInput({
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
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </span>
      {multiline ? (
        <textarea name={name} required={required} rows={6} className="form-input" />
      ) : (
        <input name={name} type={type} required={required} className="form-input" />
      )}
    </label>
  );
}
