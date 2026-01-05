import { translations } from './translations.js';

let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en');

export function initI18n() {
    updateLanguageUI();
    
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
        toggle.onclick = () => {
            const nextLang = currentLang === 'ru' ? 'en' : 'ru';
            setLanguage(nextLang);
        };
    }
}

export function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateLanguageUI();
    // Dispatch custom event to notify other modules
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
}

export function getCurrentLang() {
    return currentLang;
}

export function t(key) {
    return translations[currentLang][key] || key;
}

function updateLanguageUI() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[currentLang][key];
            } else {
                el.innerHTML = translations[currentLang][key];
            }
        }
    });

    // Update all elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (translations[currentLang][key]) {
            el.title = translations[currentLang][key];
        }
    });

    // Update active state of lang toggle
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
        toggle.classList.toggle('is-en', currentLang === 'en');
        const labels = toggle.querySelectorAll('.toggle-label');
        labels.forEach(label => {
            label.classList.toggle('active', label.dataset.lang === currentLang);
        });
    }

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Update Page Title
    if (translations[currentLang].page_title) {
        document.title = translations[currentLang].page_title;
    }
}