/* ============================================================
   MAWULONM IRÈNE AMOUSSOU ZANDA — PORTFOLIO
   JavaScript vanilla uniquement — aucune dépendance externe.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Menu hamburger / navigation mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
  }

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  navToggle.addEventListener('click', toggleMenu);

  // Ferme le menu mobile après le clic sur un lien (navigation vers une section)
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 800) closeMenu();
    });
  });

  /* ---------- 2. Lien de navigation actif selon la section visible ---------- */
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('is-active', matches);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ---------- 3. Apparition animée au défilement (scroll reveal) ---------- */
  const revealTargets = document.querySelectorAll('.reveal');

  // Révèle immédiatement les éléments déjà visibles au chargement de la page
  function revealIfInViewport(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('is-visible');
      return true;
    }
    return false;
  }

  const remainingRevealTargets = [];
  revealTargets.forEach((el) => {
    if (!revealIfInViewport(el)) {
      remainingRevealTargets.push(el);
    }
  });

  if ('IntersectionObserver' in window && remainingRevealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    remainingRevealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    remainingRevealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 4. Barre de progression de scroll ---------- */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------- 5. Bouton retour en haut ---------- */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 6. Défilement fluide pour les navigateurs sans support CSS natif ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- 7. Formulaire de contact : validation + envoi via FormSubmit.co ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = contactForm.querySelector('.form__submit');
    const submitLabel = contactForm.querySelector('.form__submit-label');

    function setError(inputEl, errorId, message) {
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.textContent = message;
      if (inputEl) inputEl.classList.toggle('invalid', !!message);
    }

    function isValidEmail(value) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value);
    }

    function validateForm() {
      let isValid = true;

      if (!fullNameInput.value.trim()) {
        setError(fullNameInput, 'err-fullName', 'Merci d’indiquer votre nom.');
        isValid = false;
      } else {
        setError(fullNameInput, 'err-fullName', '');
      }

      if (!emailInput.value.trim()) {
        setError(emailInput, 'err-email', 'Merci d’indiquer votre email.');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setError(emailInput, 'err-email', 'Adresse email invalide.');
        isValid = false;
      } else {
        setError(emailInput, 'err-email', '');
      }

      if (!messageInput.value.trim()) {
        setError(messageInput, 'err-message', 'Merci d’écrire un message.');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        setError(messageInput, 'err-message', 'Votre message est un peu court (10 caractères min.).');
        isValid = false;
      } else {
        setError(messageInput, 'err-message', '');
      }

      return isValid;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) {
        formSuccess.textContent = '';
        formSuccess.style.color = '';
        return;
      }

      if (submitBtn) submitBtn.setAttribute('disabled', 'true');
      if (submitLabel) submitLabel.textContent = 'Envoi en cours...';
      formSuccess.textContent = '';

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then((response) => {
          if (response.ok) {
            formSuccess.style.color = '';
            formSuccess.textContent = 'Merci ' + fullNameInput.value.trim() + ' ! Votre message a bien été envoyé. Je reviendrai vers vous très vite.';
            contactForm.reset();
          } else {
            throw new Error('Réponse invalide du service d’envoi.');
          }
        })
        .catch(() => {
          formSuccess.style.color = '#111111';
          formSuccess.textContent = 'Une erreur est survenue lors de l’envoi. Merci de réessayer, ou d’écrire directement par email / WhatsApp.';
        })
        .finally(() => {
          if (submitBtn) submitBtn.removeAttribute('disabled');
          if (submitLabel) submitLabel.textContent = 'Envoyer le message';
          setTimeout(() => {
            formSuccess.textContent = '';
          }, 9000);
        });
    });

    // Nettoie l'erreur au fur et à mesure que l'utilisateur corrige
    [fullNameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
      });
    });
  }

});
