import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight, BookOpen, Brain, Users, Sparkles,
  GraduationCap, Lightbulb, Rocket, ChevronDown,
  Code2, Database, Network, Monitor, Bot, Calculator,
  Zap, Shield, Target,
} from 'lucide-react';
import logo from './assets/logo.png';
import './Landing.css';

/* ═══════════════════════════════════════════════════════════════════
   3D WEBGL PARTICLE FIELD — Using OGL (already in dependencies)
   Creates a living, breathing constellation of particles.
   ═══════════════════════════════════════════════════════════════════ */
const ParticleField = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl, program, posBuffer, velBuffer, positions, velocities;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 3000), 600);
    const dpr = Math.min(window.devicePixelRatio, 2);

    // Init WebGL
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
      if (!gl) return;
    } catch (e) { return; }

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Shaders
    const vertSrc = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_scroll;
      varying float v_alpha;
      varying float v_size;

      void main() {
        vec2 pos = a_position;

        // Scroll-driven vertical drift
        pos.y += u_scroll * 0.35;
        pos.y = mod(pos.y, u_resolution.y);

        float dist = distance(pos, u_mouse * u_resolution);
        float influence = smoothstep(300.0, 0.0, dist) * 0.2;
        pos += normalize(pos - u_mouse * u_resolution) * influence * 60.0;

        vec2 ndc = (pos / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);

        float wave = sin(u_time * 0.4 + a_position.x * 0.004) * 0.35 + 0.65;
        v_alpha = wave * smoothstep(0.0, 120.0, dist) * 1.0;
        v_size = mix(2.0, 5.0, wave);
        gl_PointSize = v_size * ${dpr.toFixed(1)};
      }
    `;

    const fragSrc = `
      precision mediump float;
      varying float v_alpha;

      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float circle = smoothstep(1.0, 0.2, d);
        gl_FragColor = vec4(0.55, 0.58, 1.0, v_alpha * circle * 0.95);
      }
    `;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertSrc);
    const fs = createShader(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;

    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Particle init
    positions = new Float32Array(PARTICLE_COUNT * 2);
    velocities = new Float32Array(PARTICLE_COUNT * 2);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 2] = Math.random() * width * dpr;
      positions[i * 2 + 1] = Math.random() * height * dpr;
      velocities[i * 2] = (Math.random() - 0.5) * 0.4;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.4;
    }

    posBuffer = gl.createBuffer();
    const aPos = gl.getAttribLocation(program, 'a_position');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uScroll = gl.getUniformLocation(program, 'u_scroll');

    gl.enableVertexAttribArray(aPos);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let time = 0;
    function render() {
      time += 0.016;
      const w = width * dpr;
      const h = height * dpr;

      // Update positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 2] += velocities[i * 2];
        positions[i * 2 + 1] += velocities[i * 2 + 1];
        // Wrap
        if (positions[i * 2] < 0) positions[i * 2] = w;
        if (positions[i * 2] > w) positions[i * 2] = 0;
        if (positions[i * 2 + 1] < 0) positions[i * 2 + 1] = h;
        if (positions[i * 2 + 1] > h) positions[i * 2 + 1] = 0;
      }

      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uScroll, scrollRef.current);

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    const onMouse = (e) => {
      mouseRef.current = { x: e.clientX / width, y: e.clientY / height };
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY * dpr;
    };
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-field-canvas"
      aria-hidden="true"
    />
  );
};

/* ── Line connections overlay (CSS animated) ── */
const ConnectionLines = () => {
  const lines = Array.from({ length: 24 }, (_, i) => ({
    x1: Math.random() * 100,
    y1: Math.random() * 100,
    x2: Math.random() * 100,
    y2: Math.random() * 100,
    delay: Math.random() * 5,
    dur: 8 + Math.random() * 12,
  }));

  return (
    <svg className="connection-lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="rgba(120,130,255,0.12)"
          strokeWidth="0.18"
          style={{
            animation: `lineFade ${l.dur}s ease-in-out ${l.delay}s infinite alternate`,
          }}
        />
      ))}
    </svg>
  );
};

/* ── Animated counter ── */
const Counter = ({ end, duration = 2, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Smooth reveal wrapper ── */
const Reveal = ({ children, className = '', delay = 0, direction = 'up', ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const dirMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 50 },
    right: { x: -50 },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* ── Typewriter ── */
const TypewriterText = ({ text, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 18);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, text, delay]);

  return (
    <span ref={ref}>
      {displayed}
      {inView && displayed.length < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </span>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   SUBJECTS — 6 core subjects from syllabus
   ═══════════════════════════════════════════════════════════════════ */
const ALL_SUBJECTS = [
  { name: 'DAA', icon: <Calculator size={22} />, color: '#6366f1', label: 'Algorithms & Complexity' },
  { name: 'Operating Systems', icon: <Monitor size={22} />, color: '#a855f7', label: 'Process & Memory Mgmt' },
  { name: 'DBMS', icon: <Database size={22} />, color: '#ec4899', label: 'SQL & Database Design' },
  { name: 'Computer Networks', icon: <Network size={22} />, color: '#06b6d4', label: 'TCP/IP & Routing' },
  { name: 'Machine Learning', icon: <Bot size={22} />, color: '#10b981', label: 'AI & Neural Networks' },
  { name: 'Software Engineering', icon: <Code2 size={22} />, color: '#f59e0b', label: 'SDLC & Patterns' },
];

const FEATURES = [
  {
    icon: <Brain size={28} />,
    title: 'AI-Powered Learning',
    desc: 'Instant, intelligent answers drawn from real GCTC exam papers and curated study materials.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Organized Resources',
    desc: 'Every past paper, subject, and topic — structured so you find what you need in seconds.',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    icon: <Target size={28} />,
    title: 'Subject-Wise Mastery',
    desc: 'Dive deep into any subject with focused, subject-specific AI study paths.',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  },
  {
    icon: <Zap size={28} />,
    title: 'Instant Answers',
    desc: 'Ask a question and receive precise, exam-relevant responses immediately.',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    icon: <Shield size={28} />,
    title: 'Exam-Ready Prep',
    desc: 'Content aligned to your actual syllabus and examination patterns.',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    icon: <Users size={28} />,
    title: 'Community Driven',
    desc: 'Built by students, for students — powered by GDG on Campus GCTC.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  },
];

const STEPS = [
  { num: '01', title: 'Sign Up', desc: 'Create your free account in seconds — email or Google sign-in.', icon: <Sparkles size={24} /> },
  { num: '02', title: 'Choose Subject', desc: 'Pick the subject you want to master from our growing library.', icon: <BookOpen size={24} /> },
  { num: '03', title: 'Ask & Learn', desc: 'Chat with AI, explore past papers, and deepen your understanding.', icon: <Brain size={24} /> },
  { num: '04', title: 'Ace Your Exams', desc: 'Walk into the exam hall confident, prepared, and ready to excel.', icon: <Rocket size={24} /> },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 30, mass: 0.5 });
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth spring config for all page animations
  const springConfig = { stiffness: 60, damping: 20, mass: 0.8 };

  return (
    <div className="landing-page" ref={containerRef}>
      {/* ═══ 3D Particle Background ═══ */}
      <ParticleField />
      <ConnectionLines />

      {/* ═══ Ambient Gradient Orbs ═══ */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* ═══ Scroll Progress ═══ */}
      <motion.div className="scroll-progress-bar" style={{ width: progressWidth }} />

      {/* ═══ NAV ═══ */}
      <nav className={`landing-nav ${navScrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logo} alt="GCTC Study Hub" />
            <span>GCTC Study Hub</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#subjects">Subjects</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <button className="nav-cta" onClick={() => navigate('/login')}>
            Get Started <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
           PHASE 1 — HERO / THRESHOLD
         ═══════════════════════════════════════ */}
      <motion.section
        className="hero-section"
      >
        <div className="hero-glow" />

        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sparkles size={14} />
          <span>Powered by AI · Built by GDG on Campus GCTC</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Your mind is about to
          <br />
          <span className="hero-gradient-text">learn smarter with AI.</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          GCTC Study Hub is your AI-powered study companion — ask questions,
          explore past papers, and master every subject with confidence.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="btn-primary" onClick={() => navigate('/signup')}>
            Start Studying Free <ArrowRight size={18} />
          </button>
          <a href="#features" className="btn-ghost">
            Explore Features <ChevronDown size={18} />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="stat-pill">
            <span className="stat-value"><Counter end={100} suffix="+" /></span>
            <span className="stat-label">Exam Questions</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-value"><Counter end={6} /></span>
            <span className="stat-label">Subjects</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-value"><Counter end={24} />/7</span>
            <span className="stat-label">AI Available</span>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════
           PHASE 2 — FEATURES
         ═══════════════════════════════════════ */}
      <section className="section features-section" id="features">
        <Reveal className="section-header">
          <span className="section-tag">
            <Lightbulb size={14} />
            Why GCTC Study Hub
          </span>
          <h2 className="section-title">
            Everything you need to
            <span className="text-gradient"> excel academically</span>
          </h2>
          <p className="section-desc">
            A unified platform combining AI intelligence with curated academic
            content to transform how you prepare for exams.
          </p>
        </Reveal>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <div className="feature-icon-wrap" style={{ background: f.gradient }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
           PHASE 3 — AI ENGINE DEMO
         ═══════════════════════════════════════ */}
      <section className="section engine-section">
        <Reveal className="section-header">
          <span className="section-tag">
            <Zap size={14} />
            The Intelligence Within
          </span>
          <h2 className="section-title">
            See the AI
            <span className="text-gradient"> in action</span>
          </h2>
          <p className="section-desc">
            Ask any exam question and get precise, source-referenced
            answers drawn directly from GCTC materials.
          </p>
        </Reveal>

        <Reveal className="engine-demo-wrapper">
          <div className="engine-demo">
            <div className="engine-demo-glow" />
            <div className="engine-query">
              <div className="query-dot" />
              <div className="query-text">
                "Explain the time complexity of Merge Sort and why it is preferred
                over Quick Sort in worst-case scenarios."
              </div>
            </div>
            <div className="engine-response">
              <div className="response-head">
                <div className="response-pulse" />
                <span className="response-label">GCTC Study Hub AI</span>
              </div>
              <div className="response-body">
                <TypewriterText
                  text="Merge Sort guarantees O(n log n) time complexity in all cases — best, average, and worst — because it always divides the array into two halves and takes linear time to merge. Quick Sort, while averaging O(n log n), degrades to O(n²) when the pivot selection is poor (e.g., already sorted arrays). For exam preparation, remember: Merge Sort trades space for consistency, Quick Sort trades consistency for speed."
                  delay={400}
                />
              </div>
              <motion.div
                className="response-sources"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2, duration: 0.6 }}
              >
                <span className="source-chip" style={{ '--chip-color': '#6366f1' }}>DAA Unit 3</span>
                <span className="source-chip" style={{ '--chip-color': '#a855f7' }}>2024 Paper Q4</span>
                <span className="source-chip" style={{ '--chip-color': '#ec4899' }}>Sorting Analysis</span>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════
           PHASE 4 — SUBJECTS (expanded, no limit)
         ═══════════════════════════════════════ */}
      <section className="section subjects-section" id="subjects">
        <Reveal className="section-header">
          <span className="section-tag">
            <GraduationCap size={14} />
            Subject Library
          </span>
          <h2 className="section-title">
            Deep dive into your
            <span className="text-gradient"> core subjects</span>
          </h2>
          <p className="section-desc">
            Every subject organized with past papers, AI Q&A, and
            study materials aligned to your GCTC syllabus — and growing.
          </p>
        </Reveal>

        <div className="subjects-grid">
          {ALL_SUBJECTS.map((s, i) => (
            <motion.div
              key={i}
              className="subject-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                delay: i * 0.05,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.04,
                y: -4,
                transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <div className="subject-icon" style={{ color: s.color, background: `${s.color}15` }}>
                {s.icon}
              </div>
              <div className="subject-info">
                <h4>{s.name}</h4>
                <span>{s.label}</span>
              </div>
              <ArrowRight size={15} className="subject-arrow" style={{ color: s.color }} />
            </motion.div>
          ))}
        </div>

        <Reveal className="subjects-expanding" delay={0.2}>
          <div className="expanding-dots">
            <span className="expand-dot" />
            <span className="expand-dot" />
            <span className="expand-dot" />
          </div>
          <span>and many more subjects being added</span>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════
           PHASE 5 — HOW IT WORKS
         ═══════════════════════════════════════ */}
      <section className="section steps-section" id="how-it-works">
        <Reveal className="section-header">
          <span className="section-tag">
            <Rocket size={14} />
            How It Works
          </span>
          <h2 className="section-title">
            From sign-up to
            <span className="text-gradient"> exam success</span>
          </h2>
          <p className="section-desc">
            Four simple steps between you and academic confidence.
          </p>
        </Reveal>

        <div className="steps-track">
          <div className="steps-connector" />
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="step-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: i * 0.15,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="step-num">{step.num}</div>
              <div className="step-icon-wrap">{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
           PHASE 6 — IDENTITY / SOCIAL PROOF
         ═══════════════════════════════════════ */}
      <section className="section identity-section">
        <Reveal className="identity-card">
          <div className="identity-glow" />
          <h2 className="identity-lead">
            You already know <span className="soft">what needs to change.</span>
            <br />This is where it starts.
          </h2>
          <p className="identity-body">
            Built by students from GDG on Campus GCTC who sat in the same
            classrooms, faced the same exams, and built the tool they wished
            existed. Free. Intelligent. Yours.
          </p>
          <div className="identity-origin">
            <div className="origin-pulse" />
            <span>GDG on Campus GCTC — Students building for students</span>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════
           PHASE 7 — FINAL CTA
         ═══════════════════════════════════════ */}
      <section className="section cta-section">
        <div className="cta-glow" />

        {/* Convergence rings */}
        <div className="convergence-rings">
          <div className="c-ring" />
          <div className="c-ring" />
          <div className="c-ring" />
        </div>

        <Reveal className="cta-content">
          <h2>
            Ready to transform your
            <span className="text-gradient"> study experience?</span>
          </h2>
          <p>
            Join GCTC Study Hub today. It's free, it's smart, and it's built
            entirely for you.
          </p>
          <div className="cta-actions">
            <button className="btn-primary btn-lg" onClick={() => navigate('/signup')}>
              Create Free Account <ArrowRight size={20} />
            </button>
            <button className="btn-outline btn-lg" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </Reveal>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={logo} alt="GCTC Study Hub" />
            <span>GCTC Study Hub</span>
          </div>
          <p>© 2026 GDG on Campus GCTC. Built with purpose for students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
