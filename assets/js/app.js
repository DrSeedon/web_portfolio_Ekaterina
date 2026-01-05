import { projectsData } from './data.js';
import { setupSliders } from './slider.js';
import { setupModals } from './modal.js';
import { setupTypewriter, setupObserver, setupCursor, setupCopyButton, setupFAQ } from './utils.js';
import { initI18n, getCurrentLang, t } from './i18n.js';

let imagesManifest = {};

async function initApp() {
    // 1. Сначала инициализируем i18n
    initI18n();

    // 2. Инициализируем UI компоненты, которые не зависят от манифеста
    setupFAQ();
    setupCopyButton();
    setupTypewriter();
    setupCursor();
    
    // 3. Пытаемся загрузить манифест изображений
    try {
        const response = await fetch('assets/images_manifest.json');
        if (response.ok) {
            imagesManifest = await response.json();
            Object.keys(imagesManifest).forEach(key => {
                if (projectsData[key]) {
                    projectsData[key].images = imagesManifest[key];
                }
            });
        }
    } catch (e) {
        console.warn("Manifest load failed, using fallback.");
    }

    // 4. Рендерим портфолио и модалки
    renderPortfolio();
    setupModals();
    
    // 5. Запускаем обсервер ПОСЛЕ того как всё отрендерили
    setupObserver();
    lucide.createIcons();

    // Слушаем смену языка
    window.addEventListener('langChanged', () => {
        renderPortfolio();
        lucide.createIcons();
        setupObserver();
        setupFAQ();
        if(window.refreshCursorHover) window.refreshCursorHover();
    });
}

function createProjectCard(id, data) {
    const lang = getCurrentLang();
    const title = lang === 'en' ? data.title_en : data.title;
    const tags = lang === 'en' ? (data.tags_en || data.tags) : data.tags;
    const dateStr = lang === 'en' ? (data.year_en || data.year) : data.year;

    const hasMultipleImages = data.images && data.images.length > 1;
    const firstImg = (data.images && data.images.length) ? `assets/images/portfolio/${id}/${data.images[0]}` : 'assets/images/placeholder.svg';
    const linksHtml = (data.links || []).map(l => 
        `<a href="${l.url}" class="project-link btn btn--secondary" target="_blank" style="padding: 0.5rem 1rem; font-size: 0.8rem;">${l.text} <i data-lucide="${l.icon}" style="width:14px;height:14px;"></i></a>`
    ).join('');

    return `
        <div class="project-card reveal" data-project="${id}">
            <div class="project-slider">
                <div class="slides">
                    <img src="${firstImg}" alt="${title}" loading="lazy" onerror="this.src='assets/images/placeholder.svg'; this.style.opacity='1';">
                </div>
                ${hasMultipleImages ? `
                <div class="slider-controls">
                    <button class="btn btn--nav prev-btn"><i data-lucide="chevron-left"></i></button>
                    <button class="btn btn--nav next-btn"><i data-lucide="chevron-right"></i></button>
                </div>` : ''}
            </div>
            <div class="project-info">
                <div class="project-year">${dateStr}</div>
                <h3>${title}</h3>
                <div class="project-tags">
                    ${tags.map(t => `<span>${t}</span>`).join('')}
                </div>
                <div class="card-footer">
                    <div style="display:flex; gap:0.5rem;">${linksHtml}</div>
                    <span class="view-details" style="cursor:pointer; font-weight:800; color:var(--accent);">${t('portfolio_more')}</span>
                </div>
            </div>
        </div>
    `;
}

function renderPortfolio() {
    const container = document.getElementById('portfolio-grid');
    if (!container) return;
    
    const entries = Object.entries(projectsData);
    
    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column:1/-1; opacity:0.5;">Кейсы скоро появятся...</p>';
        return;
    }

    container.innerHTML = entries
        .map(([id, data]) => createProjectCard(id, data))
        .join('');
    
    setupSliders();
    lucide.createIcons();
}

initApp();
