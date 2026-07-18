document.addEventListener('DOMContentLoaded', () => {
    // --- TRANSLATION & LANGUAGE SWITCHER ---
    const translations = {};

    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const supportedLangs = ['en', 'pt', 'uk', 'ru', 'nl', 'de', 'fr'];

    langBtn.addEventListener('click', (e) => { e.stopPropagation(); langDropdown.classList.toggle('show'); });
    document.addEventListener('click', (e) => { if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) { langDropdown.classList.remove('show'); } });

    langDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        if (lang) {
            setLanguage(lang);
            langDropdown.classList.remove('show');
        }
    });

    function getInitialLang() {
        const hash = window.location.hash;
        if (hash.startsWith('#!')) {
            const hashLang = hash.substring(2);
            if (supportedLangs.includes(hashLang)) { return hashLang; }
        }

        const savedLang = getCookie('lang');
        if (savedLang && supportedLangs.includes(savedLang)) { return savedLang; }
        const browserLang = navigator.language.split('-')[0];
        if (supportedLangs.includes(browserLang)) { return browserLang; }
        return 'en';
    }

    async function setLanguage(lang) {
        if (!supportedLangs.includes(lang)) return;
        if (!translations[lang]) {
            try {
                const response = await fetch(`resource/${lang}.json`);
                if (!response.ok) {
                    console.error(`Could not load translation file for ${lang}`);
                    return;
                }
                translations[lang] = await response.json();
            } catch (error) {
                console.error(`Error fetching translation for ${lang}:`, error);
                return;
            }
        }
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            const translation = translations[lang]?.[key];
            if (translation) {
                // Handle meta tags for SEO and social sharing
                if (el.tagName === 'META') {
                    el.setAttribute('content', translation);
                } else if (el.tagName === 'TITLE') {
                    el.textContent = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });
        langBtn.textContent = lang;
        document.querySelectorAll('.lang-switcher-dropdown a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('data-lang') === lang);
        });
        setCookie('lang', lang, 30);

        // Update URL with hashbang without adding to history
        history.replaceState(null, null, `#!${lang}`);
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    setLanguage(getInitialLang());

    // --- SCROLL WATCHER LOGIC FOR NAV HIGHLIGHTS ---
    const sections = document.querySelectorAll('section');
    const navA = document.querySelectorAll('nav ul li a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navA.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('nav a');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close the mobile nav when a link is clicked
            if (body.classList.contains('nav-open')) {
                body.classList.remove('nav-open');
            }
        });
    });

    // --- TECHNOLOGY CAROUSEL ---
    const carouselSlider = document.querySelector('.carousel-slider');
    if (carouselSlider) {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const slides = document.querySelectorAll('.carousel-slide');
        const slideCount = slides.length;
        let currentIndex = 0;

        const moveToSlide = (index) => {
            if (index < 0) {
                currentIndex = slideCount - 1;
            } else if (index >= slideCount) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            carouselSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
    }

    // --- GALLERY MODAL ---
    const galleryModal = document.getElementById('galleryModal');
    const galleryLink = document.querySelector('a[href="#gallery"]');
    const galleryCloseBtn = document.getElementById('galleryCloseBtn');
    const galleryGrid = document.getElementById('galleryGrid');
    let galleryPopulated = false;

    const imageFiles = [
        'about.jpg',
        'IMG_8624.jpg',
        'IMG_8653.jpg',
        'IMG_8667.jpg',
        'IMG_8678.jpg',
        'IMG_8715.jpg',
        'IMG_8727.jpg',
        'IMG_8752.jpg',
        'technology_1.jpg',
        'technology_2.jpg',
        'technology_3.jpg',
        'technology_4.jpg'
    ];

    function openGallery(e) {
        e.preventDefault();
        if (!galleryPopulated) {
            imageFiles.forEach(fileName => {
                const imgContainer = document.createElement('div');
                const img = document.createElement('img');
                img.src = `img/photos/${fileName}`;
                img.alt = `Gallery image: ${fileName.split('.')[0].replace('_', ' ')}`;
                img.loading = 'lazy';
                imgContainer.appendChild(img);
                galleryGrid.appendChild(imgContainer);
            });
            galleryPopulated = true;
        }
        galleryModal.classList.add('show');
        body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeGallery() {
        galleryModal.classList.remove('show');
        body.style.overflow = 'auto';
    }

    galleryLink.addEventListener('click', openGallery);
    galleryCloseBtn.addEventListener('click', closeGallery);
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) { // Close only if clicking on the background overlay
            closeGallery();
        }
    });

    // --- LIGHTBOX for Gallery ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

    function openLightbox(e) {
        if (e.target.tagName === 'IMG') {
            lightbox.style.display = 'block';
            lightboxImg.src = e.target.src;
            galleryModal.style.overflow = 'hidden'; // Prevent gallery modal from scrolling
        }
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        galleryModal.style.overflow = 'auto';
    }

    galleryGrid.addEventListener('click', openLightbox);
    lightboxCloseBtn.addEventListener('click', closeLightbox);
    // Close lightbox when clicking on the background (but not the image itself)
    lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) { closeLightbox(); } });
});

// --- FAQ MODAL ---
const faqModal = document.getElementById('faqModal');
const faqLink = document.getElementById('faqLink');
const faqCloseBtn = document.getElementById('faqCloseBtn');

if (faqLink) {
    faqLink.addEventListener('click', (e) => {
        e.preventDefault();
        faqModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

function closeFaqModal() {
    if (faqModal) {
        faqModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

if (faqCloseBtn) { faqCloseBtn.addEventListener('click', closeFaqModal); }

if (faqModal) {
    faqModal.addEventListener('click', (e) => { if (e.target === faqModal) { closeFaqModal(); } });
}