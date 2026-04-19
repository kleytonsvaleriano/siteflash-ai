/**
 * SiteFlash AI - Gerador de HTML
 * 
 * Gera código HTML/CSS/JS limpo e responsivo
 * a partir do conteúdo gerado pelo motor de IA.
 * Otimizado para conversão e SEO.
 */

/**
 * Gera o HTML completo do site
 * @param {Object} content - Conteúdo gerado pelo contentGenerator
 * @param {Object} projectData - Dados brutos do projeto
 * @param {boolean} withWatermark - Se deve aplicar marca d'água (plano gratuito)
 * @returns {string} HTML completo do site
 */
const generateHTML = (content, projectData, withWatermark = true) => {
  const { hero, about, services, testimonials, contact, meta, palette } = content;
  const { company_name, city, maps_link, logo_url } = projectData;

  const isDark = palette.bg.startsWith('#0') || palette.bg.startsWith('#1');
  const fontStyle = getFontByStyle(projectData.style);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(meta.description)}">
  <meta name="keywords" content="${escapeHtml(meta.keywords)}">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:type" content="website">
  <title>${escapeHtml(meta.title)}</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontStyle.import}&display=swap" rel="stylesheet">
  
  <!-- Estilos -->
  <style>
    /* ===== RESET & BASE ===== */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --primary: ${palette.primary};
      --secondary: ${palette.secondary};
      --accent: ${palette.accent};
      --bg: ${palette.bg};
      --surface: ${palette.surface};
      --text: ${palette.text};
      --text-muted: ${palette.textMuted};
      --radius: 12px;
      --shadow: 0 4px 24px rgba(0,0,0,0.15);
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: ${fontStyle.family};
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* ===== TYPOGRAPHY ===== */
    h1, h2, h3, h4 {
      line-height: 1.2;
      font-weight: 700;
    }

    /* ===== UTILITIES ===== */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .section {
      padding: 5rem 0;
    }

    .section-alt {
      background-color: var(--surface);
    }

    .section-title {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      text-align: center;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .section-subtitle {
      text-align: center;
      color: var(--text-muted);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto 3rem;
    }

    /* ===== BUTTONS ===== */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 2rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: var(--transition);
      white-space: nowrap;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    }

    .btn-outline {
      background: transparent;
      color: var(--text);
      border: 2px solid var(--text-muted);
    }

    .btn-outline:hover {
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px);
    }

    /* ===== NAVBAR ===== */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1rem 0;
      transition: var(--transition);
    }

    .navbar.scrolled {
      background: ${isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)'};
      backdrop-filter: blur(20px);
      box-shadow: 0 1px 20px rgba(0,0,0,0.15);
      padding: 0.75rem 0;
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-logo {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .navbar-logo span {
      color: var(--primary);
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
      list-style: none;
    }

    .navbar-nav a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition);
    }

    .navbar-nav a:hover {
      color: var(--primary);
    }

    .navbar-cta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0.25rem;
    }

    .mobile-menu-btn span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--text);
      transition: var(--transition);
    }

    /* ===== HERO ===== */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      padding-top: 80px;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: ${isDark 
        ? `linear-gradient(135deg, ${palette.bg} 0%, ${palette.surface} 50%, ${palette.bg} 100%)` 
        : `linear-gradient(135deg, ${palette.bg} 0%, #f0f4ff 50%, ${palette.bg} 100%)`
      };
    }

    .hero-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 8s infinite ease-in-out;
    }

    .hero-orb-1 {
      width: 600px;
      height: 600px;
      background: var(--primary);
      top: -200px;
      right: -200px;
    }

    .hero-orb-2 {
      width: 400px;
      height: 400px;
      background: var(--accent);
      bottom: -100px;
      left: -100px;
      animation-delay: -4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 750px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
      padding: 0.4rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      margin-bottom: 1.5rem;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .hero-title .highlight {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-muted);
      margin-bottom: 2.5rem;
      max-width: 560px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero-stats {
      display: flex;
      gap: 2.5rem;
      margin-top: 3.5rem;
      padding-top: 2rem;
      border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
      flex-wrap: wrap;
    }

    .hero-stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary);
    }

    .hero-stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* ===== SERVICES ===== */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .service-card {
      background: var(--surface);
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
      border-radius: var(--radius);
      padding: 2rem;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .service-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      opacity: 0;
      transition: var(--transition);
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
      border-color: var(--primary);
    }

    .service-card:hover::before {
      opacity: 1;
    }

    .service-icon {
      width: 48px;
      height: 48px;
      color: var(--primary);
      margin-bottom: 1.25rem;
    }

    .service-name {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--text);
    }

    .service-desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.7;
    }

    /* ===== ABOUT ===== */
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .about-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.35rem 1rem;
      border-radius: 50px;
      margin-bottom: 1.25rem;
    }

    .about-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      margin-bottom: 1.25rem;
      color: var(--text);
    }

    .about-text {
      color: var(--text-muted);
      margin-bottom: 2rem;
      line-height: 1.8;
      font-size: 1.05rem;
    }

    .about-highlights {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .about-highlight {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text);
      font-weight: 500;
    }

    .about-highlight-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    .about-visual {
      position: relative;
    }

    .about-image-placeholder {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 20px;
      height: 420px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .about-image-placeholder::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    }

    .about-float-card {
      position: absolute;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'white'};
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 1rem 1.5rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }

    .about-float-card.card-1 {
      bottom: -1rem;
      left: -2rem;
    }

    .about-float-card.card-2 {
      top: 2rem;
      right: -2rem;
    }

    /* ===== TESTIMONIALS ===== */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .testimonial-card {
      background: var(--surface);
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
      border-radius: var(--radius);
      padding: 2rem;
      transition: var(--transition);
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
    }

    .testimonial-stars {
      color: #f59e0b;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .testimonial-text {
      color: var(--text-muted);
      font-style: italic;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .testimonial-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .testimonial-name {
      font-weight: 600;
      color: var(--text);
      font-size: 0.95rem;
    }

    .testimonial-role {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    /* ===== CONTACT ===== */
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .contact-info h3 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .contact-info p {
      color: var(--text-muted);
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .contact-item-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .contact-form {
      background: var(--surface);
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
      border-radius: 20px;
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: var(--text);
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'};
      border-radius: 10px;
      color: var(--text);
      font-size: 1rem;
      font-family: inherit;
      transition: var(--transition);
      outline: none;
    }

    .form-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px ${palette.primary}33;
    }

    .form-input::placeholder {
      color: var(--text-muted);
    }

    textarea.form-input {
      resize: vertical;
      min-height: 120px;
    }

    .map-embed {
      border-radius: 16px;
      overflow: hidden;
      height: 250px;
      margin-top: 1.5rem;
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
    }

    /* ===== FOOTER ===== */
    .footer {
      background: ${isDark ? '#0a0f1a' : '#1e293b'};
      color: #94a3b8;
      padding: 3rem 0 1.5rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 2rem;
    }

    .footer-brand-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.75rem;
    }

    .footer-brand-desc {
      font-size: 0.9rem;
      line-height: 1.7;
      max-width: 300px;
    }

    .footer-heading {
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      transition: var(--transition);
    }

    .footer-links a:hover {
      color: var(--primary);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    /* ===== WATERMARK ===== */
    .watermark-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
      color: white;
      text-align: center;
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 9999;
      letter-spacing: 0.02em;
    }

    .watermark-bar a {
      color: white;
      text-decoration: underline;
      margin-left: 0.5rem;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .navbar-nav { display: none; }
      .mobile-menu-btn { display: flex; }

      .hero-actions { flex-direction: column; }
      .hero-stats { gap: 1.5rem; }

      .about-grid,
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .about-visual { display: none; }

      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }

      .section { padding: 3.5rem 0; }
    }

    /* ===== ANIMATIONS ===== */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-in {
      opacity: 0;
      animation: fadeInUp 0.7s ease forwards;
    }

    .animate-delay-1 { animation-delay: 0.1s; }
    .animate-delay-2 { animation-delay: 0.2s; }
    .animate-delay-3 { animation-delay: 0.3s; }
    .animate-delay-4 { animation-delay: 0.4s; }
  </style>
</head>

<body>
  <!-- NAVBAR -->
  <nav class="navbar" id="navbar">
    <div class="container">
      <div class="navbar-inner">
        <a href="#" class="navbar-logo">
          ${logo_url 
            ? `<img src="${logo_url}" alt="${escapeHtml(company_name)}" style="height:36px;object-fit:contain;">`
            : `${escapeHtml(company_name || 'Empresa')}`
          }
        </a>
        
        <ul class="navbar-nav">
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#depoimentos">Depoimentos</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>

        <div class="navbar-cta">
          <a href="#contato" class="btn btn-primary" style="padding:0.625rem 1.5rem;">
            ${escapeHtml(hero.cta_primary)}
          </a>
        </div>

        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero" id="inicio">
    <div class="hero-bg"></div>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge animate-in">
          ${escapeHtml(hero.badge)}
        </div>
        
        <h1 class="hero-title animate-in animate-delay-1">
          ${formatHeadline(hero.headline)}
        </h1>
        
        <p class="hero-subtitle animate-in animate-delay-2">
          ${escapeHtml(hero.subheadline)}
        </p>
        
        <div class="hero-actions animate-in animate-delay-3">
          <a href="#contato" class="btn btn-primary">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            ${escapeHtml(hero.cta_primary)}
          </a>
          <a href="#servicos" class="btn btn-outline">
            ${escapeHtml(hero.cta_secondary)}
          </a>
        </div>

        <div class="hero-stats animate-in animate-delay-4">
          <div>
            <div class="hero-stat-value">500+</div>
            <div class="hero-stat-label">Clientes Satisfeitos</div>
          </div>
          <div>
            <div class="hero-stat-value">5★</div>
            <div class="hero-stat-label">Avaliação Média</div>
          </div>
          <div>
            <div class="hero-stat-value">10+</div>
            <div class="hero-stat-label">Anos de Experiência</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICES -->
  <section class="section section-alt" id="servicos">
    <div class="container">
      <h2 class="section-title">${escapeHtml(services.title)}</h2>
      <p class="section-subtitle">${escapeHtml(services.subtitle)}</p>
      
      <div class="services-grid">
        ${services.items.map(service => `
        <div class="service-card">
          <div class="service-icon">
            ${service.icon}
          </div>
          <h3 class="service-name">${escapeHtml(service.name)}</h3>
          <p class="service-desc">${escapeHtml(service.description)}</p>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section class="section" id="sobre">
    <div class="container">
      <div class="about-grid">
        <div class="about-content">
          <span class="about-badge">Nossa História</span>
          <h2 class="about-title">${escapeHtml(about.title)}</h2>
          <p class="about-text">${escapeHtml(about.content)}</p>
          
          <div class="about-highlights">
            ${about.highlights.map(h => `
            <div class="about-highlight">
              <div class="about-highlight-icon">${h.icon}</div>
              <span>${escapeHtml(h.text)}</span>
            </div>
            `).join('')}
          </div>

          <div style="margin-top:2rem;">
            <a href="#contato" class="btn btn-primary">${escapeHtml(hero.cta_primary)}</a>
          </div>
        </div>

        <div class="about-visual">
          <div class="about-image-placeholder">
            <svg width="100" height="100" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>
            </svg>
            <div class="about-float-card card-1">
              <div style="font-weight:700;font-size:1.4rem;color:var(--primary)">500+</div>
              <div style="font-size:0.8rem;color:var(--text-muted)">Clientes atendidos</div>
            </div>
            <div class="about-float-card card-2">
              <div style="font-weight:700;font-size:1.4rem;color:var(--primary)">⭐ 4.9</div>
              <div style="font-size:0.8rem;color:var(--text-muted)">Avaliação média</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="section section-alt" id="depoimentos">
    <div class="container">
      <h2 class="section-title">${escapeHtml(testimonials.title)}</h2>
      <p class="section-subtitle">${escapeHtml(testimonials.subtitle)}</p>
      
      <div class="testimonials-grid">
        ${testimonials.items.map(t => `
        <div class="testimonial-card">
          <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
          <p class="testimonial-text">"${escapeHtml(t.text)}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${t.name.charAt(0)}</div>
            <div>
              <div class="testimonial-name">${escapeHtml(t.name)}</div>
              <div class="testimonial-role">${escapeHtml(t.role)}</div>
            </div>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section class="section" id="contato">
    <div class="container">
      <h2 class="section-title">${escapeHtml(contact.title)}</h2>
      <p class="section-subtitle">${escapeHtml(contact.subtitle)}</p>

      <div class="contact-grid">
        <div class="contact-info">
          <h3>Fale Conosco</h3>
          <p>Estamos prontos para atender você. Preencha o formulário ou entre em contato pelos nossos canais.</p>
          
          <div class="contact-item">
            <div class="contact-item-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
            </div>
            <div>
              <div style="font-weight:600;color:var(--text)">WhatsApp</div>
              <div style="color:var(--text-muted);font-size:0.9rem">(11) 9 9999-9999</div>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-item-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            </div>
            <div>
              <div style="font-weight:600;color:var(--text)">Email</div>
              <div style="color:var(--text-muted);font-size:0.9rem">contato@${(company_name || 'empresa').toLowerCase().replace(/\s+/g,'')}.com.br</div>
            </div>
          </div>

          ${city ? `
          <div class="contact-item">
            <div class="contact-item-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            </div>
            <div>
              <div style="font-weight:600;color:var(--text)">Localização</div>
              <div style="color:var(--text-muted);font-size:0.9rem">${escapeHtml(city)}</div>
            </div>
          </div>
          ` : ''}

          ${maps_link ? `
          <div class="map-embed">
            <iframe 
              src="${getEmbedUrl(maps_link)}"
              width="100%" 
              height="250" 
              style="border:0;border-radius:16px;" 
              allowfullscreen="" 
              loading="lazy">
            </iframe>
          </div>
          ` : `
          <div class="map-embed" style="color:var(--text-muted);flex-direction:column;gap:0.5rem;">
            <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>
            <span style="font-size:0.9rem">Mapa não configurado</span>
          </div>
          `}
        </div>

        <div class="contact-form">
          <h3 style="font-size:1.4rem;margin-bottom:1.5rem;color:var(--text)">Envie uma Mensagem</h3>
          
          <form id="contactForm" onsubmit="handleFormSubmit(event)">
            <div class="form-group">
              <label class="form-label">Seu Nome *</label>
              <input type="text" class="form-input" placeholder="João Silva" required>
            </div>
            <div class="form-group">
              <label class="form-label">Seu Email *</label>
              <input type="email" class="form-input" placeholder="joao@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Telefone / WhatsApp</label>
              <input type="tel" class="form-input" placeholder="(11) 9 9999-9999">
            </div>
            <div class="form-group">
              <label class="form-label">Mensagem *</label>
              <textarea class="form-input" placeholder="Como podemos ajudar você?" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">${escapeHtml(company_name || 'Empresa')}</div>
          <p class="footer-brand-desc">
            ${escapeHtml(content.about.content.substring(0, 120))}...
          </p>
        </div>
        <div>
          <div class="footer-heading">Links</div>
          <ul class="footer-links">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading">Contato</div>
          <ul class="footer-links">
            ${city ? `<li><a href="#">📍 ${escapeHtml(city)}</a></li>` : ''}
            <li><a href="#">📱 (11) 9 9999-9999</a></li>
            <li><a href="#">✉️ contato@empresa.com.br</a></li>
            <li><a href="#">💬 WhatsApp</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${escapeHtml(company_name || 'Empresa')}. Todos os direitos reservados.</span>
        <span>Desenvolvido com ❤️ por SiteFlash AI</span>
      </div>
    </div>
  </footer>

  ${withWatermark ? `
  <!-- WATERMARK -->
  <div class="watermark-bar">
    🚀 Site criado com SiteFlash AI — Plano Gratuito (com marca d'água)
    <a href="#">Desbloquear Site Completo →</a>
  </div>
  ` : ''}

  <!-- SCRIPTS -->
  <script>
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .testimonial-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    // Form submit handler
    function handleFormSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      btn.innerHTML = '✓ Mensagem Enviada!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg> Enviar Mensagem';
        btn.style.background = '';
        btn.disabled = false;
        e.target.reset();
      }, 3000);
    }
  </script>
</body>
</html>`;
};

// Helpers
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const formatHeadline = (headline) => {
  // Destaca a última palavra em gradiente
  const words = escapeHtml(headline).split(' ');
  if (words.length < 2) return headline;
  const lastTwo = words.slice(-2).join(' ');
  const rest = words.slice(0, -2).join(' ');
  return `${rest} <span class="highlight">${lastTwo}</span>`;
};

const getEmbedUrl = (mapsLink) => {
  if (!mapsLink) return '';
  // Converte link do Google Maps para embed
  if (mapsLink.includes('maps/embed')) return mapsLink;
  if (mapsLink.includes('maps/place/') || mapsLink.includes('maps?')) {
    // Extrai query do link compartilhado
    const match = mapsLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d${match[2]}!3d${match[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt!2sbr`;
    }
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(mapsLink)}&output=embed`;
};

const getFontByStyle = (style) => {
  const fonts = {
    modern: { import: 'Outfit:wght@400;500;600;700;800', family: "'Outfit', sans-serif" },
    elegant: { import: 'Playfair+Display:wght@400;700&family=Inter:wght@400;500;600', family: "'Inter', sans-serif" },
    aggressive: { import: 'Barlow+Condensed:wght@400;600;700;800', family: "'Barlow Condensed', sans-serif" },
    minimal: { import: 'Inter:wght@300;400;500;600;700', family: "'Inter', sans-serif" },
  };
  return fonts[style] || fonts.modern;
};

module.exports = { generateHTML };
