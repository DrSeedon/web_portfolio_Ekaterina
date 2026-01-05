import { projectsData } from './data.js';

export function setupSliders() {
    document.querySelectorAll('.project-slider').forEach(slider => {
        const id = slider.closest('.project-card').dataset.project;
        const data = projectsData[id];
        if (!data || !data.images?.length || data.images.length <= 1) return;

        let currentIdx = 0;
        const imgElement = slider.querySelector('.slides img');

        const update = () => {
            imgElement.style.opacity = '0';
            setTimeout(() => {
                imgElement.src = `assets/images/portfolio/${id}/${data.images[currentIdx]}`;
                imgElement.style.opacity = '1';
            }, 200);
        };

        const prev = slider.querySelector('.prev-btn');
        const next = slider.querySelector('.next-btn');

        if (prev) prev.onclick = (e) => {
            e.stopPropagation();
            currentIdx = (currentIdx > 0) ? currentIdx - 1 : data.images.length - 1;
            update();
        };

        if (next) next.onclick = (e) => {
            e.stopPropagation();
            currentIdx = (currentIdx < data.images.length - 1) ? currentIdx + 1 : 0;
            update();
        };
    });
}