// Ambient Parallax Background Effect
const ambientBg = document.querySelector('.ambient-bg');
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (ambientBg) {
                // Move the background slightly up as the user scrolls down
                const parallaxOffset = lastScrollY * 0.15; // 15% parallax speed
                ambientBg.style.transform = `translateY(-${parallaxOffset}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Optional: minimalists often prefer elements stay visible once shown
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');

        // Simple animation for the toggle icon itself could be added here
        // For now, toggle class handles it if CSS supports it
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
});

// Initialize animations on load
document.addEventListener('DOMContentLoaded', () => {
    // Select elements to animate
    const animateSelectors = [
        '.hero-title',
        '.hero-subtitle',
        '.hero-description',
        '.section-label',
        '.section-heading',
        '.text-block',
        '.experience-item',
        '.work-item',
        '.contact-heading',
        '.email-link'
    ];

    const elements = document.querySelectorAll(animateSelectors.join(', '));
    elements.forEach((el, index) => {
        el.classList.add('hidden');
        // Add staggered delay for initial load items
        if (el.closest('.hero')) {
            el.style.transitionDelay = `${index * 100}ms`;
        }
        observer.observe(el);
    });
});

// Case Study Modal Logic
// Case Study Modal Logic
const modal = document.getElementById('caseStudyModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalPlaceholder = document.querySelector('.modal-placeholder');

const caseStudies = {
    'corporate-card': {
        title: 'Corporate Card Platform',
        pdfUrl: './assets/GetShreddedV3_0.pdf' // Using provided PDF
    },
    'baas-platform': {
        title: 'Banking-as-a-Service (BaaS) Platform',
        pdfUrl: './assets/GetShreddedV3_0.pdf' // Using provided PDF
    }
};

window.openModal = function (id) {
    console.log('Opening modal for id:', id);
    const study = caseStudies[id];
    if (study) {
        console.log('Study found:', study);
        modalTitle.textContent = study.title;

        // Embed PDF directly
        // Fallback message included in iframe content
        modalContent.innerHTML = `
            <div class="pdf-container">
                <iframe src="${study.pdfUrl}" width="100%" height="800px" style="border: none;">
                    This browser does not support PDFs. Please download the PDF to view it: <a href="${study.pdfUrl}">Download PDF</a>.
                </iframe>
                <div class="pdf-fallback" style="text-align: center; margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                   <p>Don't see the PDF? <a href="${study.pdfUrl}" target="_blank" style="color: var(--accent-color);">Download here</a> instead.</p>
                </div>
            </div>
        `;

        // Hide placeholder if it exists (since we are replacing content area)
        if (modalPlaceholder) {
            modalPlaceholder.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

window.closeModal = function () {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Clear iframe source to stop loading/playing
    setTimeout(() => {
        if (modalContent) modalContent.innerHTML = '';
        if (modalPlaceholder) modalPlaceholder.style.display = 'flex'; // Reset for next time if needed
    }, 300);
}

// Close modal when clicking outside content
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('i');
        const originalText = btnText.textContent;
        const originalIcon = btnIcon.className;
        
        // Setup Loading State
        submitBtn.classList.add('loading');
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            number: document.getElementById('number').value,
            from_date: document.getElementById('from_date').value,
            till_date: document.getElementById('till_date').value,
            message: document.getElementById('message').value
        };

        const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwKIkkJUB3mDFV26D-Xz7bOTXVgwM-qOnPTpE6MCGad6VjQmwSBNOMAIc6qK7SjqAvh/exec';

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    // text/plain avoids CORS preflight error from Google Apps Script
                    'Content-Type': 'text/plain;charset=utf-8', 
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.textContent = 'Failed to send message. Please try again or email directly.';
            formStatus.classList.add('error');
        } finally {
            // Revert Button State
            submitBtn.classList.remove('loading');
            btnText.textContent = originalText;
            btnIcon.className = originalIcon;
        }
    });
}
