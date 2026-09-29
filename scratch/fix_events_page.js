const fs = require('fs');

const cleanEventsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>School Events & Announcements | Bhavan's Vivekananda Vidya Mandir, Manvila</title>
  <meta name="description" content="Explore verified school events, cultural competitions, and academic functions at Bhavan's Vivekananda Vidya Mandir, Manvila.">

  <!-- Google Fonts: Plus Jakarta Sans & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/home.css">
  <link rel="stylesheet" href="css/responsive.css">

  <link rel="icon" type="image/png" href="assets/images/bvb-manvila-logo.png">
</head>
<body>
  <!-- 1. TOP UTILITY BAR -->
  <header class="top-bar">
    <div class="container-wide top-bar-inner">
      <div class="top-bar-left">
        <div class="top-bar-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Phone: 0471 2594559 / 8590066808</span>
        </div>
        <div class="top-bar-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <a href="mailto:bhavansvvm@gmail.com">bhavansvvm@gmail.com</a>
        </div>
        <div class="top-bar-item">
          <span class="top-bar-badge">CBSE Affiliation No: 930460</span>
        </div>
      </div>
      <div class="top-bar-right">
        <a href="admissions.html" class="top-bar-link ">Admissions</a>
        <a href="events.html" class="top-bar-link active">Notice</a>
        <a href="http://bvbmva.amserp.in/index.php/user/login" target="_blank" rel="noopener" class="top-bar-link">Parent Login</a>
        <a href="mandatory-disclosure.html" class="top-bar-link ">Mandatory Disclosure</a>
        <a href="contact.html" class="top-bar-link ">Contact</a>
      </div>
    </div>
  </header>

  <!-- 2. MAIN STICKY HEADER -->
  <nav class="main-header" id="mainHeader">
    <div class="container-wide header-container">
      <a href="index.html" class="header-logo" aria-label="Bhavan's Vivekananda Vidya Mandir Home">
        <img src="assets/images/bvb-manvila-logo.png" alt="Bhavan's Vivekananda Vidya Mandir Logo" width="60" height="60">
        <div class="header-logo-text">
          <span class="logo-top-text">Bharatiya Vidya</span>
          <span class="logo-title-bhavan">Bhavan</span>
          <span class="logo-sub">MANVILA, TVM • CBSE AFFILIATED</span>
        </div>
      </a>

      <!-- Desktop Navigation Menu -->
      <ul class="nav-menu">
        <li class="nav-item "><a href="index.html" class="nav-link">Home</a></li>
        <li class="nav-item ">
          <a href="about.html" class="nav-link">About</a>
          <div class="nav-dropdown">
            <a href="about.html#our-story" class="dropdown-link">Our Story</a>
            <a href="campus.html#our-journey" class="dropdown-link">Our Journey</a>
            <a href="about.html#vision-mission" class="dropdown-link">Vision & Mission</a>
            <a href="about.html#history" class="dropdown-link">School History</a>
            <a href="leadership.html" class="dropdown-link">Leadership & Management</a>
          </div>
        </li>
        <li class="nav-item ">
          <a href="academics.html" class="nav-link">Academics</a>
          <div class="nav-dropdown">
            <a href="academics.html#curriculum" class="dropdown-link">CBSE Curriculum</a>
            <a href="academics.html#streams" class="dropdown-link">Science & Commerce Streams</a>
            <a href="academics.html#academic-environment" class="dropdown-link">Academic Environment</a>
            <a href="academics.html#staff-details" class="dropdown-link">Staff Details</a>
            <a href="academics.html#fee-structure" class="dropdown-link">Fees Structure</a>
            <a href="academics.html#tc" class="dropdown-link">Transfer Certificate (TC)</a>
            <a href="academics.html#clubs" class="dropdown-link">Clubs & Activities</a>
          </div>
        </li>
        <li class="nav-item "><a href="campus.html" class="nav-link">Campus</a></li>
        <li class="nav-item "><a href="student-life.html" class="nav-link">Student Life</a></li>
        <li class="nav-item "><a href="achievements.html" class="nav-link">Achievements</a></li>
        <li class="nav-item "><a href="gallery.html" class="nav-link">Gallery</a></li>
        <li class="nav-item "><a href="contact.html" class="nav-link">Contact</a></li>
      </ul>

      <!-- Header Action CTA -->
      <div class="header-actions">
        <a href="admissions.html" class="btn btn-primary btn-pill header-cta-desktop">ADMISSION 2027–28</a>
        <button class="mobile-toggle" aria-label="Toggle navigation menu">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- PAGE BANNER -->
  <div class="page-banner">
    <div class="container">
      <h1>School Events & Campus Happenings</h1>
      <div class="breadcrumbs">
        <a href="index.html">Home</a>
        <span class="divider">/</span>
        <span class="current">Events</span>
      </div>
    </div>
  </div>

  <main>
    <section class="section-padding bg-white">
      <div class="container">
        <!-- Events Grid (Loaded dynamically from Admin Panel uploads) -->
        <div class="events-columns" id="publicEventsColumns"></div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-bottom-inner" style="color: rgba(255,255,255,0.85);">
        <div><strong>Bhavan's Vivekananda Vidya Mandir</strong> | Manvila, Pangappara P.O., Thiruvananthapuram – 695581</div>
        <div>Phone: 0471 2594559 | Email: bhavansvvm@gmail.com</div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <div>© Bhavan's Vivekananda Vidya Mandir, Manvila. All Rights Reserved.</div>
        <div class="footer-bottom-links">
          <a href="mandatory-disclosure.html">Mandatory Disclosure</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="js/dynamic-sections.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
`;

fs.writeFileSync('events.html', cleanEventsHtml, 'utf8');
console.log('events.html cleanly rewritten!');
