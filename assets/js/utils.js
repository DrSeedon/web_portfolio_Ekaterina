import { projectsData } from './data.js';
import { translations } from './translations.js';
import { getCurrentLang, t } from './i18n.js';

/**
 * UTILS MODULE
 */

export function setupTypewriter() {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;
    const subText = subtitle.innerText;
    subtitle.innerText = '';
    let charIdx = 0;
    function typeWriter() {
        if (charIdx < subText.length) {
            subtitle.innerHTML += subText.charAt(charIdx);
            charIdx++;
            setTimeout(typeWriter, 30);
        }
    }
    setTimeout(typeWriter, 1000);
}

export function setupObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return observer;
}

export function setupCursor() {
    const glow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if(glow) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }
    });
    
    const addHover = () => {
        document.querySelectorAll('.btn, .project-card, .comp-card, .interest-card, .faq-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(glow) glow.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                if(glow) glow.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    };
    addHover();
    window.refreshCursorHover = addHover;
}

export function setupFAQ() {
    const faqContainer = document.querySelector('.faq-accordion');
    if (!faqContainer) return;

    faqContainer.addEventListener('click', (e) => {
        const question = e.target.closest('.faq-question');
        if (!question) return;

        const item = question.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all items
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
}

function gatherResumeData() {
    const tr = translations[getCurrentLang()] || translations.ru;
    const name = "Екатерина Степанова";
    
    let data = `========================================\n`;
    data += `${name.toUpperCase()}\n`;
    data += `${tr.hero_badge}\n`;
    data += `========================================\n\n`;
    data += `Telegram: @ketarond\nEmail: krtvkrrt@mail.ru\nVK: https://vk.com/iskra_lit_rus\n\n`;
    return data;
}

export function setupCopyButton() {
    const btn = document.getElementById('copy-all-data');
    const ghost = document.querySelector('.ghost-text');
    if (!btn) return;

    btn.onclick = async () => {
        const data = gatherResumeData();
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(data);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = data;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            if (ghost) {
                ghost.classList.add('active');
                setTimeout(() => ghost.classList.remove('active'), 2500);
            }
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };
}
