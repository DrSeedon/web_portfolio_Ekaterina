import { projectsData } from './data.js';
import { getCurrentLang } from './i18n.js';

const modal = document.getElementById('project-modal');
const archiveModal = document.getElementById('archive-modal');
let currentModalProj = null;
let currentModalImgIdx = 0;
let openedFromArchive = false;

export function setupModals() {
    // Open project modal
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card && !e.target.closest('.slider-controls') && !e.target.closest('.project-link')) {
            const projId = card.dataset.project;
            if (projId) {
                // Check if we are opening from inside the archive
                if (e.target.closest('#archive-modal')) {
                    openedFromArchive = true;
                } else {
                    openedFromArchive = false;
                }
                openModal(projId);
            }
        }

        // Open archive modal
        if (e.target.id === 'view-all-btn' || e.target.closest('#view-all-btn')) {
            openedFromArchive = false;
            openArchive();
        }
    });

    // Close project modal
    const closeProjectBtn = modal.querySelector('.close-modal');
    if (closeProjectBtn) {
        closeProjectBtn.onclick = () => {
            modal.style.display = 'none';
            if (openedFromArchive) {
                archiveModal.style.display = 'block';
                openedFromArchive = false;
            } else {
                document.body.style.overflow = 'auto';
            }
        };
    }

    // Close archive modal
    const closeArchiveBtn = archiveModal.querySelector('.close-archive');
    if (closeArchiveBtn) {
        closeArchiveBtn.onclick = () => {
            archiveModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            openedFromArchive = false;
        };
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            if (openedFromArchive) {
                archiveModal.style.display = 'block';
                openedFromArchive = false;
            } else {
                document.body.style.overflow = 'auto';
            }
        }
        if (e.target === archiveModal) {
            archiveModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            openedFromArchive = false;
        }
    });

    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');

    if (prevBtn) prevBtn.onclick = () => {
        const imgs = projectsData[currentModalProj].images;
        currentModalImgIdx = (currentModalImgIdx > 0) ? currentModalImgIdx - 1 : imgs.length - 1;
        updateModalImage();
    };

    if (nextBtn) nextBtn.onclick = () => {
        const imgs = projectsData[currentModalProj].images;
        currentModalImgIdx = (currentModalImgIdx < imgs.length - 1) ? currentModalImgIdx + 1 : 0;
        updateModalImage();
    };
}

export function openArchive() {
    renderArchive();
    archiveModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    if(window.refreshCursorHover) window.refreshCursorHover();
}

function renderArchive() {
    const container = document.getElementById('archive-list');
    if (!container) return;

    const lang = getCurrentLang();
    const sorted = Object.entries(projectsData).sort((a, b) => b[1].year - a[1].year);

    container.innerHTML = sorted.map(([id, data]) => {
        const title = lang === 'en' ? data.title_en : data.title;
        const tags = (lang === 'en' ? (data.tags_en || data.tags) : data.tags).join(', ');
        const dateStr = lang === 'en' ? (data.year_en || data.year) : data.year;
        
        // Handle missing images
        const hasImages = data.images && data.images.length > 0;
        const thumb = hasImages ? `assets/images/portfolio/${id}/${data.images[0]}` : 'assets/images/placeholder.svg';
        
        return `
            <div class="archive-item project-card" data-project="${id}">
                <div class="archive-thumb ${!hasImages ? 'no-image' : ''}">
                    <img src="${thumb}" alt="${title}" loading="lazy" ${!hasImages ? 'style="opacity:1;"' : ''}>
                </div>
                <div class="archive-info">
                    <div class="archive-year">${dateStr}</div>
                    <h3>${title}</h3>
                    <p>${tags}</p>
                </div>
                <div class="archive-action">
                    <i data-lucide="arrow-right"></i>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function openModal(id) {
    const data = projectsData[id];
    if (!data) return;
    
    // Close archive if it was open
    archiveModal.style.display = 'none';
    
    currentModalProj = id;
    currentModalImgIdx = 0;

    const lang = getCurrentLang();
    const title = lang === 'en' ? data.title_en : data.title;
    const desc = lang === 'en' ? data.desc_en : data.desc;
    const tags = lang === 'en' ? (data.tags_en || data.tags) : data.tags;
    const dateStr = lang === 'en' ? (data.year_en || data.year) : data.year;

    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-year').innerText = dateStr;
    document.getElementById('modal-full-desc').innerHTML = desc;
    document.getElementById('modal-tags').innerHTML = tags.map(t => `<span>${t}</span>`).join('');
    document.getElementById('modal-links').innerHTML = (data.links || []).map(l => 
        `<a href="${l.url}" class="btn btn--primary" target="_blank">${l.text} <i data-lucide="${l.icon}"></i></a>`
    ).join('');

    const controls = document.querySelector('.modal-gallery-controls');
    if (controls) {
        controls.style.display = (data.images && data.images.length > 1) ? 'flex' : 'none';
    }

    updateModalImage();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
    if(window.refreshCursorHover) window.refreshCursorHover();
}

function updateModalImage() {
    const data = projectsData[currentModalProj];
    const container = document.querySelector('.modal-slides');
    const gallery = document.querySelector('.modal-gallery');
    
    if(!container || !gallery) return;

    // Reset container and hide loader if no images
    if (!data || !data.images?.length) {
        container.innerHTML = `<img src="assets/images/placeholder.svg" class="loaded" style="width:100%; height:100%; object-fit:contain; opacity:1;">`;
        gallery.classList.remove('loading');
        return;
    }

    // Show loader
    gallery.classList.add('loading');
    
    const imgPath = `assets/images/portfolio/${currentModalProj}/${data.images[currentModalImgIdx]}`;
    
    // Preload image
    const tempImg = new Image();
    tempImg.onload = () => {
        container.innerHTML = `<img src="${imgPath}" class="loaded" style="width:100%; height:100%; object-fit:contain;">`;
        gallery.classList.remove('loading');
    };
    tempImg.onerror = () => {
        console.error("Failed to load image:", imgPath);
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:10px; color:var(--text-dim);">
                <i data-lucide="image-off" style="width:40px; height:40px;"></i>
                <span style="font-size:0.9rem;">Image not found</span>
            </div>
        `;
        gallery.classList.remove('loading');
        lucide.createIcons();
    };
    tempImg.src = imgPath;
}