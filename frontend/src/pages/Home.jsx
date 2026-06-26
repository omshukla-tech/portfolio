import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';

// Default fallback data if API is not accessible
const fallbackProjects = [
  {
    id: 1,
    name: "Vlog Verse - Real-Time Blog Website",
    bio: "A full-stack blogging platform built with Flask, SQLAlchemy, and PostgreSQL. Features secure user authentication, email OTP verification, password recovery, trending posts, a role-based admin panel, and an elegant glassmorphism UI.",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    previewLink: "#",
    codeLink: "https://github.com/omshukla-tech/vlog-verse"
  },
  {
    id: 2,
    name: "Online Job Portal System",
    bio: "A dual-interface platform for employers and job seekers built with Flask, SQLAlchemy, and PostgreSQL (Neon). Features secure Role-Based Access Control (RBAC), password hashing, resume uploads, advanced job filtering, and Vercel serverless deployment.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    previewLink: "#",
    codeLink: "https://github.com/omshukla-tech/job-portal"
  }
];

const fallbackSkills = [
  // Languages
  { id: 1, name: "Python", category: "primary", icon_class: "fab fa-python" },
  { id: 2, name: "JavaScript", category: "primary", icon_class: "fab fa-js" },
  { id: 3, name: "SQL", category: "primary", icon_class: "fas fa-database" },
  { id: 4, name: "C Language", category: "primary", icon_class: "fas fa-code" },
  
  // Frontend
  { id: 5, name: "HTML5 & CSS3", category: "secondary", icon_class: "fab fa-html5" },
  { id: 6, name: "Bootstrap", category: "secondary", icon_class: "fab fa-bootstrap" },
  { id: 7, name: "React.js", category: "secondary", icon_class: "fab fa-react" },
  
  // Backend & Databases
  { id: 8, name: "Flask & Jinja2", category: "backend", icon_class: "fas fa-server" },
  { id: 9, name: "PostgreSQL", category: "backend", icon_class: "fas fa-database" },
  { id: 10, name: "SQLite & MongoDB", category: "backend", icon_class: "fas fa-leaf" },
  
  // Core Concepts
  { id: 11, name: "REST API Development", category: "strength", icon_class: "fas fa-project-diagram" },
  { id: 12, name: "Authentication & Sessions", category: "strength", icon_class: "fas fa-user-lock" },
  { id: 13, name: "CRUD Operations", category: "strength", icon_class: "fas fa-tasks" },
  { id: 14, name: "Database Design & Security", category: "strength", icon_class: "fas fa-shield-alt" },
  
  // Certifications
  { id: 15, name: "Google for Startups (Prompt to Prototype)", category: "certification", icon_class: "fab fa-google" },
  { id: 16, name: "Deloitte Cyber Job Simulation", category: "certification", icon_class: "fas fa-user-shield" },
  { id: 17, name: "Simplilearn Python for Beginners", category: "certification", icon_class: "fas fa-certificate" }
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', text: '' }); // 'success', 'error', 'loading'

  // Fetch Projects and Skills from Flask API, with fallbacks
  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('API server returned error');
        return res.json();
      })
      .then(data => setProjects(data.length > 0 ? data : fallbackProjects))
      .catch(() => setProjects(fallbackProjects));

    fetch('/api/skills')
      .then(res => {
        if (!res.ok) throw new Error('API server returned error');
        return res.json();
      })
      .then(data => setSkills(data.length > 0 ? data : fallbackSkills))
      .catch(() => setSkills(fallbackSkills));
  }, []);

  // Global scroll reveal and micro-focus scaling observers
  useEffect(() => {
    // 1. Reveal hidden elements (Fade + Slide)
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target); // Reveal once
          }
        });
      },
      { threshold: 0.05 }
    );

    // 2. Micro-focus scaling observer (Magnification at center focal point)
    const focusObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('focused');
          } else {
            entry.target.classList.remove('focused');
          }
        });
      },
      {
        rootMargin: "-20% 0px -20% 0px", // Triggers when element is in the middle 60% of viewport
        threshold: 0.1
      }
    );

    // Observe targets (runs after data updates have populated the DOM)
    const revealElements = document.querySelectorAll('.reveal-hidden');
    revealElements.forEach(el => revealObserver.observe(el));

    const focusElements = document.querySelectorAll('.focus-scale');
    focusElements.forEach(el => focusObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      focusObserver.disconnect();
    };
  }, [projects, skills]); // Re-bind observers when dynamic database content changes!

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', text: 'All fields are required.' });
      return;
    }

    setFormStatus({ type: 'loading', text: 'Sending your message...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({ type: 'success', text: 'Message sent! Thank you for reaching out.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus({ type: 'error', text: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setFormStatus({ type: 'error', text: 'Unable to connect to the server. Please try again later.' });
    }
  };

  // Group skills by category
  const skillsByCategory = {
    primary: skills.filter(s => s.category === 'primary'),
    secondary: skills.filter(s => s.category === 'secondary'),
    backend: skills.filter(s => s.category === 'backend'),
    strength: skills.filter(s => s.category === 'strength'),
    certification: skills.filter(s => s.category === 'certification'),
  };

  const handleExploreClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 52;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="hero">
        <ScrollReveal>
          <span className="hero-subtitle reveal-hidden">Om Shukla</span>
          <h1 className="hero-title reveal-hidden">Full Stack Backend Developer & Python Engineer</h1>
          <p className="hero-desc reveal-hidden">
            Developing clean, secure server architectures. Crafting dynamic RESTful APIs and modern frontend interfaces.
          </p>
          <div className="hero-cta reveal-hidden">
            <a href="#projects" onClick={(e) => handleExploreClick(e, 'projects')} className="btn-primary">
              View Projects
            </a>
            <a href="#contact" onClick={(e) => handleExploreClick(e, 'contact')} className="btn-secondary">
              Get in Touch
            </a>
          </div>
        </ScrollReveal>
        
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-indicator-dot" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <ScrollReveal>
          <span className="section-label reveal-hidden">01 / Introduction</span>
          <h2 className="section-title reveal-hidden">About Me</h2>
          
          <div className="about-grid">
            <div className="about-lead reveal-hidden">
              <h3>
                Dedicated software engineer focused on building robust backends, secure APIs, and responsive layouts.
              </h3>
              <p style={{ marginTop: '20px', fontSize: '15px', color: 'var(--text-secondary)' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: 'var(--accent)' }} />
                Akbarpur, Kanpur Dehat, Uttar Pradesh
              </p>
            </div>
            <div className="about-text reveal-hidden">
              <p>
                I am a Full Stack Backend Developer specializing in **Python, Flask, SQL, and database design**. 
                I focus heavily on building scalable server structures, implementing secure session handling loops, 
                and writing structured RESTful APIs that connect seamlessly to modern frontend layouts.
              </p>
              <p>
                My educational and professional internships have equipped me with hands-on experience in dynamic routing, 
                database modeling (SQLAlchemy, PostgreSQL, SQLite), and web security simulations (including cyber simulation simulates 
                from Deloitte). I hold a passion for clean, modular code bases and 100% optimized rendering performance.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <ScrollReveal>
          <span className="section-label reveal-hidden">02 / Capabilities</span>
          <h2 className="section-title reveal-hidden">Technical Skills & Matrix</h2>

          <div className="skills-wrapper">
            {skillsByCategory.primary.length > 0 && (
              <div className="skills-category">
                <h3 className="skills-cat-title reveal-hidden">Programming Languages</h3>
                <div className="skills-list">
                  {skillsByCategory.primary.map(skill => (
                    <div key={skill.id} className="skill-tag reveal-hidden">
                      <i className={skill.icon_class || "fas fa-code"} />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillsByCategory.secondary.length > 0 && (
              <div className="skills-category">
                <h3 className="skills-cat-title reveal-hidden">Frontend Frameworks</h3>
                <div className="skills-list">
                  {skillsByCategory.secondary.map(skill => (
                    <div key={skill.id} className="skill-tag reveal-hidden">
                      <i className={skill.icon_class || "fab fa-react"} />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillsByCategory.backend.length > 0 && (
              <div className="skills-category">
                <h3 className="skills-cat-title reveal-hidden">Backend & Databases</h3>
                <div className="skills-list">
                  {skillsByCategory.backend.map(skill => (
                    <div key={skill.id} className="skill-tag reveal-hidden">
                      <i className={skill.icon_class || "fas fa-server"} />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillsByCategory.strength.length > 0 && (
              <div className="skills-category">
                <h3 className="skills-cat-title reveal-hidden">Core Concepts</h3>
                <div className="skills-list">
                  {skillsByCategory.strength.map(skill => (
                    <div key={skill.id} className="skill-tag reveal-hidden">
                      <i className={skill.icon_class || "fas fa-project-diagram"} />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skillsByCategory.certification.length > 0 && (
              <div className="skills-category">
                <h3 className="skills-cat-title reveal-hidden">Certifications & Simulation</h3>
                <div className="skills-list">
                  {skillsByCategory.certification.map(skill => (
                    <div key={skill.id} className="skill-tag reveal-hidden">
                      <i className={skill.icon_class || "fas fa-certificate"} />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <ScrollReveal>
          <span className="section-label reveal-hidden">03 / Works</span>
          <h2 className="section-title reveal-hidden">Selected Projects</h2>

          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card reveal-hidden focus-scale">
                <div className="project-img-wrapper">
                  <img 
                    src={project.img} 
                    alt={project.name} 
                    className="project-img"
                    loading="lazy"
                  />
                </div>
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-bio">{project.bio}</p>
                  <div className="project-links">
                    {project.previewLink && project.previewLink !== '#' && (
                      <a 
                        href={project.previewLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link"
                      >
                        Preview <i className="fas fa-external-link-alt" />
                      </a>
                    )}
                    {project.codeLink && (
                      <a 
                        href={project.codeLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link"
                      >
                        Code <i className="fab fa-github" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Journey/Timeline Section */}
      <section id="journey" className="section">
        <ScrollReveal>
          <span className="section-label reveal-hidden">04 / Experience</span>
          <h2 className="section-title reveal-hidden">Professional Journey</h2>
          
          <div className="timeline">
            <div className="timeline-item reveal-hidden">
              <div className="timeline-dot" />
              <div className="timeline-date">Jun 2026 – Present</div>
              <h3 className="timeline-title">Full Stack Backend Developer Intern</h3>
              <h4 className="timeline-subtitle">Cognevance Technology</h4>
              <p className="timeline-desc">
                Developing full-stack web applications utilizing Python, Flask, and SQL. 
                Focusing on building secure authentication filters, session handling validation loops, 
                and crafting robust RESTful APIs.
              </p>
            </div>
            
            <div className="timeline-item reveal-hidden">
              <div className="timeline-dot" />
              <div className="timeline-date">Jun 2026 – Jul 2026</div>
              <h3 className="timeline-title">Python Developer Intern</h3>
              <h4 className="timeline-subtitle">Codec Technologies</h4>
              <p className="timeline-desc">
                Engineered Flask web applications utilizing dynamic routing structures and Jinja2 templates. 
                Designed relational database schemas with SQLite, and managed backend CRUD operations cleanly.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <ScrollReveal>
          <span className="section-label reveal-hidden">05 / Connection</span>
          <h2 className="section-title reveal-hidden">Get In Touch</h2>
          
          <div className="contact-container reveal-hidden">
            <div>
              <h3 className="contact-info-title">Let's build something exceptional.</h3>
              <p className="contact-info-desc">
                I'm always open to discussing new projects, API design setups, web security simulations, or full-stack backend roles. Feel free to shoot a message.
              </p>
              
              <div className="contact-methods">
                <div className="contact-method-item">
                  <i className="fas fa-envelope" />
                  <a href="mailto:omshukla2609@gmail.com">omshukla2609@gmail.com</a>
                </div>
                <div className="contact-method-item">
                  <i className="fab fa-github" />
                  <a href="https://github.com/omshukla-tech" target="_blank" rel="noopener noreferrer">
                    github.com/omshukla-tech
                  </a>
                </div>
                <div className="contact-method-item">
                  <i className="fab fa-linkedin" />
                  <a href="https://linkedin.com/in/om-shukla-dev" target="_blank" rel="noopener noreferrer">
                    linkedin.com/in/om-shukla-dev
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-panel contact-form">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="form-control" 
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={formStatus.type === 'loading'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-control" 
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={formStatus.type === 'loading'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    className="form-control" 
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={formStatus.type === 'loading'}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary submit-btn"
                  disabled={formStatus.type === 'loading'}
                >
                  {formStatus.type === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {formStatus.text && (
                  <div className={`form-status ${formStatus.type}`}>
                    {formStatus.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
