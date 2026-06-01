document.addEventListener('DOMContentLoaded', () => {
    // --- TRANSLATION & LANGUAGE SWITCHER ---
    const translations = {};

    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const supportedLangs = ['en', 'pt', 'uk', 'ru', 'nl'];

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
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) { el.innerHTML = translations[lang][key]; }
        });
        langBtn.textContent = lang;
        document.querySelectorAll('.lang-switcher-dropdown a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('data-lang') === lang);
        });
        setCookie('lang', lang, 30);
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
});