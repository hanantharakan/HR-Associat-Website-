/**
 * HR ASSOCIATE – THE COMPLETE WASTE MANAGEMENT SOLUTION
 * Client-Side Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initLightbox();
  initContactForm();
  initYear();
});

// Mobile Navigation & Active Link Management
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-overlay');
  const navLinks = document.querySelectorAll('.mobile-drawer .nav-link');

  function openMenu() {
    drawer?.classList.add('is-active');
    overlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer?.classList.remove('is-active');
    overlay?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('is-active')) {
      closeMenu();
    }
  });

  // Highlight active page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'index.html' && href === './')) {
      link.classList.add('active');
    }
  });
}

// Sticky Header Dynamic Styling
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

// Lightbox for Project Showcase & Images
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('[data-lightbox]');

  if (!lightbox || !lightboxImg) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-lightbox-src') || trigger.getAttribute('src') || trigger.querySelector('img')?.getAttribute('src');
      const caption = trigger.getAttribute('data-lightbox-caption') || trigger.getAttribute('alt') || 'HR Associate Showcase';

      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = caption;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 200);
  }

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

// Contact Form Validation and Submission
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successBox = document.getElementById('form-success-alert');
  const errorBox = document.getElementById('form-error-alert');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = form.elements['fullName'];
    const phoneInput = form.elements['phone'];
    const emailInput = form.elements['email'];
    const serviceInput = form.elements['service'];
    const messageInput = form.elements['message'];

    // Reset validations
    [nameInput, phoneInput, emailInput, serviceInput, messageInput].forEach(input => {
      if (input) {
        input.classList.remove('is-invalid');
      }
    });

    if (errorBox) errorBox.style.display = 'none';
    if (successBox) successBox.style.display = 'none';

    // Validate Full Name
    if (!nameInput || nameInput.value.trim().length < 2) {
      nameInput?.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Phone (At least 10 digits)
    const phoneVal = phoneInput?.value.replace(/\D/g, '') || '';
    if (!phoneInput || phoneVal.length < 10) {
      phoneInput?.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
      emailInput?.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Selected Product / Service
    if (!serviceInput || !serviceInput.value.trim()) {
      serviceInput?.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Message
    if (!messageInput || messageInput.value.trim().length < 5) {
      messageInput?.classList.add('is-invalid');
      isValid = false;
    }

    if (!isValid) {
      if (errorBox) {
        errorBox.textContent = 'Please fill out all required fields correctly before submitting.';
        errorBox.style.display = 'block';
      }
      return;
    }

    // Form is valid! Generate enquiry payload
    const enquiry = {
      id: 'HRA-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      service: serviceInput.value.trim(),
      message: messageInput.value.trim()
    };

    // Store in localStorage for audit & persistence
    try {
      const existing = JSON.parse(localStorage.getItem('hra_enquiries') || '[]');
      existing.push(enquiry);
      localStorage.setItem('hra_enquiries', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage not accessible:', err);
    }

    // Compose formatted WhatsApp link for instant forwarding
    const waText = encodeURIComponent(
      `*New Enquiry from Website*\n` +
      `*Ref:* ${enquiry.id}\n` +
      `*Name:* ${enquiry.name}\n` +
      `*Phone:* ${enquiry.phone}\n` +
      `*Email:* ${enquiry.email}\n` +
      `*Subject:* ${enquiry.service}\n` +
      `*Message:* ${enquiry.message}`
    );
    const waUrl = `https://api.whatsapp.com/send/?phone=%2B919048555332&text=${waText}&type=phone_number&app_absent=0`;

    // Show Success Box with action button
    if (successBox) {
      successBox.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div style="font-weight:700; font-size:1.05rem; display:flex; align-items:center; gap:0.5rem; color:#065F46;">
            <span>✓</span> Thank you, ${escapeHtml(enquiry.name)}! Your enquiry has been received.
          </div>
          <p style="margin:0; font-size:0.9rem; color:#047857;">
            Reference ID: <strong>${enquiry.id}</strong>. Our technical support team in Malappuram will contact you shortly.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:0.75rem; margin-top:0.25rem;">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display:inline-flex; align-items:center; gap:0.4rem;">
              <span>Forward directly to WhatsApp</span> ↗
            </a>
            <button type="button" class="btn btn-secondary btn-sm" onclick="this.closest('#form-success-alert').style.display='none'; document.getElementById('contact-form').reset();">
              Submit Another Enquiry
            </button>
          </div>
        </div>
      `;
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast(`Enquiry ${enquiry.id} logged successfully!`);
    form.reset();
  });
}

// Global Toast Notification Helper
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <span>${escapeHtml(message)}</span>`;
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 4000);
}

// Year auto-update
function initYear() {
  const elements = document.querySelectorAll('.copyright-year');
  const year = new Date().getFullYear();
  elements.forEach(el => {
    el.textContent = '2026'; // Brand standard from spec: © 2026 HR Associate
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
