import { projectsData } from './data.js';
import { translations } from './translations.js';
import { getCurrentLang, t } from './i18n.js';

/**
 * UTILS MODULE
 * Encapsulates core UI logic and utility helpers
 */

export function setupTypewriter() {
    const subtitle = document.querySelector('.subtitle');
    const subText = subtitle ? subtitle.innerText : '';
    if (subtitle) {
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
        document.querySelectorAll('.btn, .project-card, .comp-card, .timeline-item').forEach(el => {
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

/**
 * REFACTORED COPY LOGIC
 */
function cleanHTMLForClipboard(html) {
    if (!html) return '';
    
    // Replace common tags with plain text equivalents
    let text = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<li>/gi, '  • ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<h4>/gi, '\n--- ')
        .replace(/<\/h4>/gi, ' ---\n')
        .replace(/<strong>/gi, '')
        .replace(/<\/strong>/gi, '');

    // Strip all other tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    // Clean up multiple newlines and trim
    return tempDiv.textContent
        .split('\n')
        .map(line => line.trim())
        .filter((line, i, arr) => line !== '' || (arr[i-1] !== ''))
        .join('\n')
        .trim();
}

function gatherResumeData() {
    const lang = getCurrentLang();
    const tr = translations[lang];
    const name = document.querySelector('h1').innerText;
    
    let resume = `========================================\n`;
    resume += `${name.toUpperCase()}\n`;
    resume += `${tr.hero_badge}\n`;
    resume += `========================================\n\n`;
    
    resume += `${tr.hero_subtitle}\n\n`;
    
    // Skills
    resume += `[ ${tr.skills_title.toUpperCase()} ]\n`;
    document.querySelectorAll('.comp-card').forEach(card => {
        const title = card.querySelector('h3').innerText;
        const desc = card.querySelector('p').innerText;
        resume += `• ${title}: ${desc}\n`;
    });
    
    // Experience
    resume += `\n[ ${tr.exp_title.toUpperCase()} ]\n`;
    document.querySelectorAll('.timeline-item').forEach(item => {
        const time = item.querySelector('.time').innerText;
        const title = item.querySelector('h3').innerText;
        const desc = item.querySelector('p').innerText;
        resume += `${time} | ${title}\n  ${desc}\n`;
    });
    
    // Education
    const eduSection = document.querySelector('.education-section');
    if (eduSection) {
        resume += `\n[ ${tr.edu_title.toUpperCase()} ]\n`;
        const eduTitle = eduSection.querySelector('h3').innerText;
        const eduDesc = eduSection.querySelector('p').innerText;
        resume += `${eduTitle}\n  ${eduDesc}\n`;
    }
    
    // Portfolio
    resume += `\n[ ${tr.portfolio_title.toUpperCase()} ]\n`;
    Object.values(projectsData).forEach(proj => {
        const title = lang === 'en' ? proj.title_en : proj.title;
        const rawDesc = lang === 'en' ? proj.desc_en : proj.desc;
        const cleanDesc = cleanHTMLForClipboard(rawDesc);
        const tags = (lang === 'en' ? (proj.tags_en || proj.tags) : proj.tags).join(', ');
        
        resume += `> ${proj.year} - ${title} [${tags}]\n`;
        resume += `  ${cleanDesc.replace(/\n/g, '\n  ')}\n\n`;
    });
    
    // Contacts
    resume += `\n[ CONTACTS ]\n`;
    resume += `Telegram: https://t.me/DrSeedon\n`;
    resume += `GitHub: https://github.com/DrSeedon\n`;
    resume += `Email: maxim-as@bk.ru\n`;
    resume += `LinkedIn: https://www.linkedin.com/in/максим-астраханцев-13a9391b9/\n`;
    
    return resume;
}

export function setupCopyButton() {
    const btn = document.getElementById('copy-all-data');
    const ghost = document.querySelector('.ghost-text');
    let ghostTimeout;
    let iconTimeout;

    if (!btn) return;

    btn.onclick = async () => {
        const data = gatherResumeData();
        
        try {
            // Priority 1: Modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(data);
            } else {
                // Priority 2: Fallback
                const textArea = document.createElement("textarea");
                textArea.value = data;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            // GHOST TEXT RESTART LOGIC
            if (ghost) {
                clearTimeout(ghostTimeout);
                ghost.classList.remove('active');
                void ghost.offsetWidth; // Force reflow to restart CSS transition
                ghost.classList.add('active');
                ghostTimeout = setTimeout(() => ghost.classList.remove('active'), 2500);
            }

            // ICON RESTART LOGIC
            const icon = btn.querySelector('i');
            const originalIcon = icon.getAttribute('data-lucide');
            
            clearTimeout(iconTimeout);
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons();
            
            iconTimeout = setTimeout(() => {
                icon.setAttribute('data-lucide', originalIcon);
                lucide.createIcons();
            }, 2000);

        } catch (err) {
            console.error('Copy failed:', err);
        }
    };
}