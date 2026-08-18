document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const lang = 'en';

    function applyTranslations() {
        if (typeof translations === 'undefined') return;
        const t = translations[lang] || translations.en;
        document.documentElement.lang = 'en';

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (t[key]) el.innerText = t[key];
        });
        document.querySelectorAll('[data-translate-content]').forEach(el => {
            const key = el.getAttribute('data-translate-content');
            if (t[key]) el.setAttribute('content', t[key]);
        });

        document.querySelectorAll('[data-translate-title]').forEach(el => {
            const key = el.getAttribute('data-translate-title');
            if (t[key]) el.setAttribute('title', t[key]);
        });

        renderJourney();
        renderSkills();
        renderTools();
        alignHeroAvatar();
    }

    function alignHeroAvatar() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        const avatar = hero.querySelector('.hero-avatar-wrap');
        const headline = hero.querySelector('.massive-text');
        if (!avatar || !headline) return;
        let top = headline.offsetHeight / 2;
        let el = headline;
        while (el && el !== hero) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        avatar.style.top = top + 'px';
    }

    function renderJourney() {
        const container = document.getElementById('journey-container');
        if (!container || typeof translations === 'undefined') return;
        const t = translations[lang];
        container.innerHTML = '';

        const journeyItems = [
            {
                role: "Available  for  Full-Time  Opportunities",
                date: "2026 - Present",
                current: true,
                desc: "Actively seeking full-time opportunities in Full Stack Web Development, MERN Stack, and Software Engineering."
            },
            {
                role: "Junior  Web  Development  Intern",
                date: "2026",
                current: false,
                desc: "Built responsive websites using modern web technologies."
            },
            {
                role: "Master  of  Computer  Applications (MCA)",
                date: "2024 - 2026",
                current: false,
                desc: "Bangalore Institute of Technology, Bengaluru."
            },
            {
                role: "Bachelor  of  Computer  Applications (BCA)",
                date: "2021 - 2024",
                current: false,
                desc: "Mangalore University."
            }
        ];

        journeyItems.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'reveal active';
            div.style.transitionDelay = (idx * 0.1) + 's';
            div.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 border-b border-white/10 pb-8 hover:border-primary/50 transition-colors group">
                    <div class="md:col-span-4 font-headline font-bold text-3xl ${item.current ? 'text-primary opacity-100' : 'outlined-text opacity-80 group-hover:opacity-100'} transition-opacity whitespace-nowrap">
                        ${item.date}
                    </div>
                    <div class="md:col-span-8">
                        <h3 class="text-2xl font-headline font-bold mb-2 ${item.current ? 'text-gradient' : ''}" style="white-space: pre-wrap;">${item.role}</h3>
                        <p class="text-dim max-w-xl font-body">${item.desc}</p>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function renderSkills() {
        const container = document.getElementById('skills-container');
        if (!container || typeof translations === 'undefined') return;
        container.innerHTML = '';

        const skills = [
            { label: 'Python', icon: 'fa-brands fa-python', className: 'skill-card-cyan' },
            { label: 'Java', icon: 'fa-brands fa-java', className: 'skill-card-cyan' },
            { label: 'JavaScript', icon: 'fa-brands fa-js', className: 'skill-card-violet' },
            { label: 'PHP', icon: 'fa-brands fa-php', className: 'skill-card-violet' },
            { label: 'React', icon: 'fa-brands fa-react', className: 'skill-card-violet' },
            { label: 'HTML5', icon: 'fa-brands fa-html5', className: 'skill-card-cyan' },
            { label: 'CSS3', icon: 'fa-brands fa-css3-alt', className: 'skill-card-cyan' },
            { label: 'Node.js', icon: 'fa-brands fa-node-js', className: 'skill-card-cyan' },
            { label: 'API', icon: 'fa-solid fa-code', className: 'skill-card-cyan' },
            { label: 'MongoDB', icon: 'fa-solid fa-database', className: 'skill-card-violet' },
            { label: 'FastAPI', icon: 'fa-solid fa-bolt', className: 'skill-card-violet' },
            { label: 'Pandas', icon: 'fa-solid fa-table', className: 'skill-card-cyan' },
            { label: 'NumPy', icon: 'fa-solid fa-calculator', className: 'skill-card-cyan' },
            { label: 'AI / ML', icon: 'fa-solid fa-robot', className: 'skill-card-violet' },
            { label: 'Generative AI', icon: 'fa-solid fa-wand-magic-sparkles', className: 'skill-card-violet' },
            { label: 'MySQL', icon: 'fa-solid fa-database', className: 'skill-card-cyan' },
            { label: 'JWT', icon: 'fa-solid fa-key', className: 'skill-card-violet' },
            { label: 'DSA', icon: 'fa-solid fa-diagram-project', className: 'skill-card-violet' },
            { label: 'Git', icon: 'fa-brands fa-git-alt', className: 'skill-card-cyan' },
            { label: 'GitHub', icon: 'fa-brands fa-github', className: 'skill-card-cyan' },
        ];

        skills.forEach((s, idx) => {
            const div = document.createElement('div');
            div.className = `liquid-card ${s.className || 'skill-card-cyan'} flex items-center justify-center rounded-2xl reveal active group transition-all duration-300 hover:scale-110 cursor-pointer`;
            div.style.transitionDelay = (idx * 0.02) + 's';
            div.setAttribute('title', s.label);
            div.setAttribute('aria-label', s.label);

            let iconHtml;
            if (s.svg) {
                iconHtml = `<div class="w-12 h-12 flex items-center justify-center">${s.svg}</div>`;
            } else if (s.icon.startsWith('fa-')) {
                iconHtml = `<i class="${s.icon.includes(' ') ? s.icon : 'fa-solid ' + s.icon} text-4xl sm:text-[2.75rem] text-white group-hover:scale-110 transition-transform duration-300"></i>`;
            } else {
                iconHtml = `<i class="${s.icon} text-4xl sm:text-[2.75rem] text-white group-hover:scale-110 transition-transform duration-300"></i>`;
            }

            const tooltipHtml = `<span class="skill-tooltip">${s.label}</span>`;

            div.innerHTML = iconHtml + tooltipHtml;
            container.appendChild(div);
        });
    }

    function renderTools() {
        const container = document.getElementById('tools-container');
        if (!container || typeof toolsData === 'undefined') return;
        container.innerHTML = '';

        toolsData.forEach((tool, idx) => {
            const t = tool[lang] || tool['en'];
            const div = document.createElement('div');
            div.className = 'scroll-item reveal active';
            div.style.transitionDelay = (idx * 0.1) + 's';

            const techPills = (t.technologies || []).map(tech =>
                `<span class="project-tech-pill">${tech}</span>`
            ).join('');

            const linkHref = tool.link && tool.link !== '#' ? tool.link : null;
            const cardTag = linkHref ? 'a' : 'div';
            const cardAttrs = linkHref ? `href="${linkHref}" target="_blank"` : '';

            div.innerHTML = `
                <${cardTag} ${cardAttrs} class="liquid-card project-card group">
                    <div class="project-card-header">
                        <div class="project-meta">
                            <span class="project-category">${t.category || ''}</span>
                            <h3 class="project-title">${t.title}</h3>
                        </div>
                        ${linkHref ? '<i class="fa-solid fa-arrow-up-right-from-square project-link-icon"></i>' : ''}
                    </div>
                    <p class="project-desc">${t.description}</p>
                    <div class="project-tech-wrap">${techPills}</div>
                </${cardTag}>
            `;

            container.appendChild(div);
        });
    }


    function showToast(message, anchorEl) {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.style.cssText = 'position:fixed;z-index:300;background:rgba(15,15,20,0.95);border:1px solid var(--primary);color:#fff;padding:0.9rem 1.6rem;border-radius:0.75rem;font-weight:700;font-size:0.85rem;letter-spacing:0.02em;line-height:1.4;box-shadow:0 8px 30px rgba(0,0,0,0.5);opacity:0;transition:opacity .3s ease, transform .3s ease;pointer-events:none;backdrop-filter:blur(8px);max-width:min(90vw,320px);text-align:center;';
            document.body.appendChild(toast);
        }
        toast.textContent = message;

        const r = anchorEl.getBoundingClientRect();
        toast.style.left = (r.left + r.width / 2) + 'px';
        toast.style.top = (r.top + r.height / 2) + 'px';
        toast.style.transform = 'translate(-50%, -50%) scale(0.95)';

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -50%) scale(0.95)';
        }, 2600);
    }

    function initModals() {
        const trigger = document.getElementById('qr-bank-trigger');
        const modal = document.getElementById('qr-bank-modal');
        const closeBtn = document.getElementById('close-modal');

        if (trigger && modal) {
            trigger.onclick = () => modal.style.display = 'flex';
            modal.onclick = (e) => {
                if (e.target === modal || e.target === closeBtn) modal.style.display = 'none';
            };
        }
    }

    function initCryptoCopy() {
        document.querySelectorAll('.crypto-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const addr = btn.getAttribute('data-address');
                const icon = btn.querySelector('i');
                const originalIconClass = icon.className;

                navigator.clipboard.writeText(addr).then(() => {
                    icon.className = 'fa-solid fa-check text-primary animate-bounce';
                    btn.style.borderColor = 'var(--primary)';

                    setTimeout(() => {
                        icon.className = originalIconClass;
                        btn.style.borderColor = '';
                    }, 2000);
                });
            });
        });
    }

    applyTranslations();
    initModals();
    initCryptoCopy();

    window.addEventListener('resize', alignHeroAvatar);
    window.addEventListener('load', alignHeroAvatar);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(alignHeroAvatar);
    }
});