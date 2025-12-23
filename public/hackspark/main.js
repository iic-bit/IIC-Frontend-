function showAuthToast(message) {
  const body = document.getElementById('authToastBody');
  if (!body) return;
  body.textContent = message;
  const toastEl = document.getElementById('authToast');
  const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
  bsToast.show();
}

function openEligibilityModalIfNeeded() {
  const answered = localStorage.getItem('collegeType');
  if (!answered) {
    const modal = new bootstrap.Modal(
      document.getElementById('eligibilityModal')
    );
    modal.show();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('eligibilityForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selected = document.querySelector(
      'input[name="collegeType"]:checked'
    );

    if (!selected) return;

    localStorage.setItem('collegeType', selected.value);

    const modalEl = document.getElementById('eligibilityModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  });
});


/******************** AUTH UI STATE ********************/
function refreshAuthUI(user) {
  const regNotice = document.getElementById('regNotice');
  const btnLoginTop = document.getElementById('btnLoginTop');
  const btnSignupTop = document.getElementById('btnSignupTop');
  const btnRegisterTop = document.getElementById('btnRegisterTop');
  const btnLogoutTop = document.getElementById('btnLogoutTop');

  let primaryCta = document.getElementById('getStartedBtn');
  if (!primaryCta) return;

  /* 🔥 HARD RESET CTA BUTTON (removes old listeners completely) */
  const freshBtn = primaryCta.cloneNode(true);
  primaryCta.parentNode.replaceChild(freshBtn, primaryCta);
  primaryCta = freshBtn;

  if (user) {
    /* ---------- LOGGED IN ---------- */
    regNotice?.classList.remove('d-none');
    btnLoginTop?.classList.add('d-none');
    btnSignupTop?.classList.add('d-none');
    btnRegisterTop?.classList.remove('d-none');
    btnLogoutTop?.classList.remove('d-none');

    primaryCta.textContent = 'Register for event';

    btnRegisterTop.onclick = () => {
      const collegeType = localStorage.getItem('collegeType');

      if (!collegeType) {
        openEligibilityModalIfNeeded();
        return;
      }

      let formURL = '#';

      if (collegeType === 'TSEC') {
        formURL = 'https://forms.gle/T9KR3DhuxF9w8fCn7';
      } else if (collegeType === 'TPOLY') {
        formURL = 'https://forms.gle/T9KR3DhuxF9w8fCn7';
      } else {
        formURL = 'https://forms.gle/A3YKqHiZhEzanJBe7';
      }

      window.open(formURL, '_blank');
    };



    // Prefill registration modal (if used elsewhere)
    const regEmail = document.getElementById('reg_email');
    const regName = document.getElementById('reg_name');
    if (regEmail && !regEmail.value) regEmail.value = user.email || '';
    if (regName && !regName.value) regName.value = user.displayName || '';

  } else {
    /* ---------- LOGGED OUT ---------- */
    regNotice?.classList.add('d-none');
    btnLoginTop?.classList.remove('d-none');
    btnSignupTop?.classList.remove('d-none');
    btnRegisterTop?.classList.add('d-none');
    btnLogoutTop?.classList.add('d-none');

    primaryCta.textContent = 'Get Started';

    primaryCta.onclick = () => {
      const loginModal = new bootstrap.Modal(
        document.getElementById('loginModal')
      );
      loginModal.show();
    };
  }
}

/* -------------------- Firebase detection -------------------- */
const firebaseAvailable = (typeof firebase !== 'undefined') && firebase && firebase.apps !== undefined;

/* We'll track when a signup flow is actively running to suppress the login toast */
let signupInProgress = false;

/* -------------------- Firebase flows (if available) -------------------- */
if (firebaseAvailable) {
  const auth = firebase.auth();
  const db = firebase.database();

  auth.onAuthStateChanged(user => {
    refreshAuthUI(user);

    if (user) {
      setTimeout(openEligibilityModalIfNeeded, 500);
    }

    if (signupInProgress) return;
    if (user) showAuthToast('Login was successful');
  });


  // Signup flow (unchanged behavior)
  (function signupFlow() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      signupInProgress = true;
      const name = document.getElementById('su_name').value.trim();
      const email = document.getElementById('su_email').value.trim().toLowerCase();
      const password = document.getElementById('su_password').value;
      if (!name || !email || !password) { alert('Please fill all fields'); signupInProgress = false; return; }
      try {
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        try { if (userCred.user && userCred.user.updateProfile) await userCred.user.updateProfile({ displayName: name }); } catch (updErr) { console.warn('DisplayName update failed:', updErr); }
        let profileSaved = false;
        try {
          await db.ref('users/' + userCred.user.uid).set({ name, email, createdAt: firebase.database.ServerValue.TIMESTAMP });
          profileSaved = true;
        } catch (dbErr) { console.warn('Profile DB write failed (likely rules):', dbErr); }
        try { await auth.signOut(); } catch (soErr) { console.warn('Sign out after signup failed:', soErr); }
        try { const modalEl = document.getElementById('signupModal'); const bsModal = bootstrap.Modal.getInstance(modalEl); if (bsModal) bsModal.hide(); } catch (mErr) { console.warn('Failed to close signup modal:', mErr); }
        showAuthToast(profileSaved ? 'Account created. Please log in.' : 'Account created. Please log in. (Profile not saved — DB permission denied)');
        form.reset();
      } catch (err) {
        console.error('Signup error:', err);
        alert('Signup error: ' + (err.message || err));
      } finally { signupInProgress = false; }
    });

    const switchLogin = document.getElementById('switchToLogin');
    if (switchLogin) {
      switchLogin.addEventListener('click', ev => {
        ev.preventDefault();
        const sm = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        if (sm) sm.hide();
        bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal')).show();
      });
    }
  })();

  // Login flow
  (function loginFlow() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('li_email').value.trim().toLowerCase();
      const password = document.getElementById('li_password').value;
      if (!email || !password) { alert('Please fill all fields'); return; }
      try {
        await auth.signInWithEmailAndPassword(email, password);
        const modalEl = document.getElementById('loginModal');
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      } catch (err) {
        console.error('Login error:', err);
        alert('Login error: ' + (err.message || err));
      }
    });

    const switchSignup = document.getElementById('switchToSignup');
    if (switchSignup) {
      switchSignup.addEventListener('click', ev => {
        ev.preventDefault();
        const lm = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (lm) lm.hide();
        bootstrap.Modal.getOrCreateInstance(document.getElementById('signupModal')).show();
      });
    }
  })();

  // Logout
  (function logoutFlow() {
    const btn = document.getElementById('btnLogoutTop');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await auth.signOut();
        localStorage.removeItem('collegeType');
        refreshAuthUI(null);
        showAuthToast('Logout was successful');
      } catch (err) {
        console.error('Logout error:', err);
        alert('Logout error: ' + (err.message || err));
      }
    });
  })();

  // Registration saving to Realtime DB (requires auth)
  (function registration() {
    const form = document.getElementById('regForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to register for the event.');
        return;
      }
      const data = {
        name: document.getElementById('reg_name').value.trim(),
        email: document.getElementById('reg_email').value.trim(),
        college: document.getElementById('reg_college').value.trim(),
        phone: document.getElementById('reg_phone').value.trim(),
        idea: document.getElementById('reg_idea').value.trim(),
        uid: user.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };
      if (!data.name || !data.email || !data.college) { alert('Please fill required fields'); return; }
      try {
        await db.ref('registrations').push(data);
        const modal = bootstrap.Modal.getInstance(document.getElementById('regModal'));
        if (modal) modal.hide();
        showAuthToast('Registration saved');
        form.reset();
      } catch (err) {
        console.error('Error saving registration:', err);
        alert('Error saving registration: ' + (err.message || err));
      }
    });
  })();

} else {
  /* Fallback stubs if Firebase not configured */
  (function stubs() {
    const sf = document.getElementById('signupForm');
    if (sf) sf.addEventListener('submit', e => { e.preventDefault(); alert('Firebase not configured.'); });

    const lf = document.getElementById('loginForm');
    if (lf) lf.addEventListener('submit', e => { e.preventDefault(); alert('Firebase not configured.'); });

    const rf = document.getElementById('regForm');
    if (rf) rf.addEventListener('submit', e => { e.preventDefault(); alert('Firebase not configured.'); });

    const lb = document.getElementById('btnLogoutTop');
    if (lb) lb.addEventListener('click', () => { showAuthToast('Logout (local)'); refreshAuthUI(null); });
  })();
}

/* -------------------- UI / Animation Enhancements -------------------- */

/* Smooth parallax for blobs and sparks using GSAP (if available) */
(function parallaxScene() {
  if (!window.gsap) return;
  const b1 = document.querySelector('.b1');
  const b2 = document.querySelector('.b2');
  const b3 = document.querySelector('.b3');
  const sparks = document.querySelectorAll('.spark');

  // gentle infinite drift already exists — add slow rotation and depth subtlety
  if (b1) gsap.to(b1, { rotation: 2, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  if (b2) gsap.to(b2, { rotation: -3, duration: 26, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3 });
  if (b3) gsap.to(b3, { rotation: 1.5, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 });

  // slightly vary spark z movement to create depth
  sparks.forEach((s, i) => {
    const depth = 6 + Math.random() * 18;
    gsap.to(s, { z: depth, duration: 6 + Math.random() * 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 3 });
  });

  // container parallax based on mouse position
  const container = document.querySelector('.container-main');
  if (!container) return;
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // move blobs subtly
    if (b1) gsap.to(b1, { x: px * 20, y: py * 12, duration: 0.9, ease: 'power2.out' });
    if (b2) gsap.to(b2, { x: px * -18, y: py * -10, duration: 0.9, ease: 'power2.out' });
    if (b3) gsap.to(b3, { x: px * 12, y: py * 8, duration: 0.9, ease: 'power2.out' });
    // parallax for snippets (if any)
    document.querySelectorAll('.snippet').forEach((el, i) => {
      gsap.to(el, { x: px * (6 + i * 3), y: py * (6 + i * 2), duration: 0.9, ease: 'power2.out' });
    });
  });

  // gentle reset on leave
  container.addEventListener('mouseleave', () => {
    if (b1) gsap.to(b1, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' });
    if (b2) gsap.to(b2, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' });
    if (b3) gsap.to(b3, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' });
  });
})();

/* Tilt/3D effect for cards, logos & gallery thumbs (light, mouse-driven) */
(function tiltInteractions() {
  const supportsPointer = window.PointerEvent !== undefined;
  const tiltTargets = [...document.querySelectorAll('.glass-card'), ...document.querySelectorAll('.logo-circle'), ...document.querySelectorAll('.gallery-thumb img')];

  function applyTilt(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const rx = (dy / rect.height) * -6; // rotateX
    const ry = (dx / rect.width) * 8; // rotateY
    const tz = 12; // translateZ
    el.style.transform = `perspective(900px) translateZ(${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  function resetTilt(el) {
    el.style.transform = '';
  }

  if ('ontouchstart' in window) return; // avoid tilt on touch devices

  tiltTargets.forEach(el => {
    el.classList.add('tilt-enabled');
    el.addEventListener('mousemove', (ev) => applyTilt(el, ev.clientX, ev.clientY));
    el.addEventListener('mouseleave', () => resetTilt(el));
    el.addEventListener('mousedown', () => { el.style.transform += ' translateY(2px)'; });
    el.addEventListener('mouseup', () => { el.style.transform = el.style.transform.replace(' translateY(2px)', ''); });
  });
})();

/* Enhance gallery carousel with depth on slide events */
(function galleryDepth() {
  const carouselEl = document.getElementById('galleryCarousel');
  if (!carouselEl || !window.gsap) return;
  const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
  carouselEl.addEventListener('slide.bs.carousel', (ev) => {
    const outgoing = ev.from;
    const incoming = ev.to;
    // make outgoing zoom out a little
    const items = carouselEl.querySelectorAll('.carousel-item');
    const outItem = items[outgoing];
    const inItem = items[incoming];
    if (outItem) gsap.to(outItem.querySelector('img'), { scale: 0.98, rotationY: -6, duration: 0.6, ease: 'power2.out' });
    if (inItem) gsap.fromTo(inItem.querySelector('img'), { scale: 1.04, rotationY: 6 }, { scale: 1, rotationY: 0, duration: 0.7, ease: 'power2.out' });
  });
})();

/* -------------------- Existing animations preserved below -------------------- */

/* sparks creation (slightly updated to use creamy tints) */
(function createSparks() {
  const sparkLayer = document.getElementById('sparkLayer');
  if (!sparkLayer) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const size = 4 + Math.floor(Math.random() * 10);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = (Math.random() * 100) + '%';
    s.style.top = (Math.random() * 100) + '%';
    s.style.opacity = 0.05 + Math.random() * 0.45;
    s.style.background = 'radial-gradient(circle, rgba(255,245,220,0.95) 0%, rgba(255,200,140,0.6) 40%, rgba(255,170,100,0.1) 100%)';
    s.style.transform = `translate3d(0,0,0)`;
    sparkLayer.appendChild(s);
    if (window.gsap) {
      gsap.to(s, {
        duration: 3 + Math.random() * 6,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        opacity: 0.02 + Math.random() * 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });
    }
  }
})();

/* subtle blob motion (unchanged core) */
(function animateBlobs() {
  if (!window.gsap) return;
  gsap.to('.b1', { duration: 18, x: 40, y: -30, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.b2', { duration: 22, x: -30, y: 30, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 });
  gsap.to('.b3', { duration: 20, x: 18, y: -24, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
})();

/* countdown (unchanged) */
(function countdown() {
  const target = new Date('2026-02-20T09:00:00');
  function update() {
    const now = new Date();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60)); diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60)); diff -= mins * (1000 * 60);
    const secs = Math.floor(diff / 1000);
    const elDays = document.getElementById('cd-days'); if (elDays) elDays.textContent = String(days).padStart(2, '0');
    const elHours = document.getElementById('cd-hours'); if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    const elMins = document.getElementById('cd-mins'); if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    const elSecs = document.getElementById('cd-secs'); if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
  }
  update(); setInterval(update, 1000);
})();

/* terminal typing effect (unchanged) */
(function terminal() {
  const termEl = document.getElementById('termLine');
  if (!termEl) return;
  const lines = [
    "> Initializing HackSpark 2.0...",
    "> Powered by TSEC IIC",
    "> Teams assembling...",
    "> rendering scene: 'ArtOfFiction'",
    "> mentors connected",
    "> 24-hour innovation begins",
    "> Code. Create. Compete."
  ];
  let li = 0, ci = 0;
  function typeLoop() {
    const l = lines[li];
    termEl.textContent = l.slice(0, ci);
    ci++;
    if (ci > l.length) {
      setTimeout(() => { ci = 0; li = (li + 1) % lines.length; setTimeout(typeLoop, 320); }, 900);
    } else {
      setTimeout(typeLoop, 45);
    }
  }
  typeLoop();
})();

/* snippet floating (unchanged) */
(function snippetFloat() {
  const snippets = document.querySelectorAll('.snippet');
  if (!snippets.length || !window.gsap) return;
  snippets.forEach((el, i) => {
    const dur = 3.5 + i * 0.8 + Math.random() * 1.2;
    const distance = 6 + i * 4;
    gsap.to(el, { y: `-=${distance}`, duration: dur, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2 });
    gsap.to(el, { x: `+=${(i % 2 ? 1 : -1) * (6 + Math.random() * 8)}`, duration: dur * 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.5 });
  });
})();

/* GSAP entrance animations (unchanged) */
(function entrance() {
  if (!window.gsap) return;
  gsap.from('.logo-badge', { y: -12, opacity: 0, duration: 0.8, ease: 'power2.out' });
  gsap.from('.title', { y: 18, opacity: 0, duration: 0.9, delay: 0.18 });
  gsap.from('.glass-card', { y: 12, opacity: 0, duration: 0.9, stagger: 0.08, delay: 0.28 });
})();

/* reveal on scroll (unchanged) */
(function revealOnScroll() {
  const elems = document.querySelectorAll('.reveal');
  if (!elems.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  elems.forEach(el => obs.observe(el));
})();

/* Make GET STARTED open the login modal (unchanged) */
document.getElementById("getStartedBtn")?.addEventListener("click", () => {
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();
});

// FIX: Remove stuck modal backdrop & restore scrolling
document.addEventListener('hidden.bs.modal', function () {
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');

  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(bd => bd.remove());
});

// Highlight gallery: jump to clicked slide
const highlightModal = document.getElementById('highlightModal');

if (highlightModal) {
  highlightModal.addEventListener('show.bs.modal', function (event) {
    const trigger = event.relatedTarget;
    const slideTo = trigger?.getAttribute('data-slide-to');
    const carousel = document.getElementById('highlightCarousel');

    if (slideTo !== null && carousel) {
      const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carousel);
      bsCarousel.to(Number(slideTo));
    }
  });
}

/* ================= ABOUT US SLIDER LOGIC ================= */
(function () {
  const slider = document.getElementById('aboutSlider');
  const prev = document.getElementById('aboutPrev');
  const next = document.getElementById('aboutNext');

  if (!slider || !prev || !next) return;

  let index = 0;

  function getVisibleCount() {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  function updateSlider() {
    const slide = slider.querySelector('.about-slide');
    if (!slide) return;

    const gap = 24;
    const slideWidth = slide.offsetWidth + gap;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  next.addEventListener('click', () => {
    const visible = getVisibleCount();
    if (index < slider.children.length - visible) {
      index++;
      updateSlider();
    }
  });

  prev.addEventListener('click', () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  window.addEventListener('resize', updateSlider);
})();
