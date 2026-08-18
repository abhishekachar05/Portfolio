(function() {
    'use strict';

    var overlay, input, list, items = [],
        filtered = [],
        selected = 0,
        isOpen = false;

    function lang() {
        return 'en';
    }

    function build() {
        overlay = document.createElement('div');
        overlay.className = 'cmdk-overlay';
        overlay.setAttribute('data-lenis-prevent', '');
        overlay.innerHTML =
            '<div class="cmdk-panel" role="dialog" aria-modal="true">' +
            '<input class="cmdk-input" type="text" autocomplete="off" spellcheck="false">' +
            '<div class="cmdk-list"></div>' +
            '</div>';
        document.body.appendChild(overlay);
        input = overlay.querySelector('.cmdk-input');
        list = overlay.querySelector('.cmdk-list');
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) close();
        });
        overlay.addEventListener('wheel', function(e) {
            e.stopPropagation();
            if (!list.contains(e.target)) e.preventDefault();
        }, {
            passive: false
        });
        input.addEventListener('input', filter);
        input.addEventListener('keydown', onKey);
    }

    function commands() {
        var cmds = [];
        var sections = [
            ['journey', 'Journey'],
            ['skills', 'Skills'],
            ['projects', 'Projects'],
            ['support', 'Support']
        ];
        sections.forEach(function(s) {
            var el = document.getElementById(s[0]);
            if (el) cmds.push({
                icon: 'fa-solid fa-arrow-right-long',
                type: 'Section',
                label: s[1],
                run: function() {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        if (typeof toolsData !== 'undefined') {
            toolsData.forEach(function(t, idx) {
                var info = t.en || t.vi || {};
                cmds.push({
                    icon: 'fa-solid fa-layer-group',
                    type: 'Tool',
                    label: info.title,
                    run: (function(index) {
                        return function() {
                            // 1. Scroll to projects section
                            var section = document.getElementById('projects');
                            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });

                            // 2. Highlight the matching card after scroll settles
                            setTimeout(function() {
                                var cards = document.querySelectorAll('#tools-container .scroll-item');
                                var card = cards[index];
                                if (!card) return;
                                card.classList.add('cmdk-highlight');
                                setTimeout(function() {
                                    card.classList.remove('cmdk-highlight');
                                }, 2000);
                            }, 600);
                        };
                    })(idx)
                });
            });
        }
        cmds.push({
            icon: 'fa-solid fa-envelope',
            type: 'Action',
            label: 'Copy email',
            run: function() {
                if (navigator.clipboard) navigator.clipboard.writeText('abhishekachar0005@gmail.com');
            }
        });
        cmds.push({
            icon: 'fa-brands fa-whatsapp',
            type: 'Action',
            label: 'WhatsApp',
            run: function() {
                window.open('https://wa.me/918296540658', '_blank');
            }
        });
        cmds.push({
            icon: 'fa-brands fa-github',
            type: 'Link',
            label: 'GitHub',
            run: function() {
                window.open('https://github.com/abhishekachar05', '_blank');
            }
        });
        return cmds;
    }

    function render() {
        list.innerHTML = '';
        if (!filtered.length) {
            list.innerHTML = '<div class="cmdk-empty">No results</div>';
            return;
        }
        filtered.forEach(function(c, i) {
            var row = document.createElement('div');
            row.className = 'cmdk-item' + (i === selected ? ' active' : '');
            row.innerHTML = '<i class="' + c.icon + ' cmdk-icon"></i><span class="cmdk-label"></span><span class="cmdk-type"></span>';
            row.querySelector('.cmdk-label').textContent = c.label;
            row.querySelector('.cmdk-type').textContent = c.type;
            row.addEventListener('click', function() {
                run(i);
            });
            row.addEventListener('mousemove', function() {
                if (selected !== i) {
                    selected = i;
                    paintActive();
                }
            });
            list.appendChild(row);
        });
    }

    function paintActive() {
        for (var i = 0; i < list.children.length; i++) {
            list.children[i].classList.toggle('active', i === selected);
        }
    }

    function filter() {
        var q = input.value.trim().toLowerCase();
        filtered = !q ? items.slice() : items.filter(function(c) {
            return c.label.toLowerCase().indexOf(q) !== -1 || c.type.toLowerCase().indexOf(q) !== -1;
        });
        selected = 0;
        render();
    }

    function run(i) {
        var c = filtered[i];
        if (!c) return;
        close();
        c.run();
    }

    function scrollToSel() {
        var el = list.children[selected];
        if (el && el.scrollIntoView) el.scrollIntoView({
            block: 'nearest'
        });
    }

    function onKey(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selected = Math.min(filtered.length - 1, selected + 1);
            paintActive();
            scrollToSel();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selected = Math.max(0, selected - 1);
            paintActive();
            scrollToSel();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            run(selected);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
    }

    function openPalette() {
        if (!overlay) build();
        input.placeholder = 'Type a command or search…';
        items = commands();
        input.value = '';
        filtered = items.slice();
        selected = 0;
        render();
        overlay.classList.add('visible');
        isOpen = true;
        setTimeout(function() {
            input.focus();
        }, 20);
    }

    function close() {
        if (!overlay) return;
        overlay.classList.remove('visible');
        isOpen = false;
    }

    document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (isOpen) close();
            else openPalette();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        var btn = document.getElementById('cmdk-open');
        if (btn) btn.addEventListener('click', openPalette);
    });
})();