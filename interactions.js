(function() {
    'use strict';
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initTilt() {
        if (reduced) return;
        var active = null,
            rect = null;

        function reset(el) {
            el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            el.style.transform = '';
        }

        document.addEventListener('pointermove', function(e) {
            var card = (e.target && e.target.closest) ? e.target.closest('.liquid-card') : null;
            if (card !== active) {
                if (active) reset(active);
                active = card;
                rect = card ? card.getBoundingClientRect() : null;
            }
            if (!card || !rect) return;
            var px = (e.clientX - rect.left) / rect.width - 0.5;
            var py = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transition = 'transform 0.08s ease-out';
            card.style.transform = 'perspective(800px) rotateX(' + (-py * 12).toFixed(2) + 'deg) rotateY(' + (px * 12).toFixed(2) + 'deg) translateY(-6px) scale(1.02)';
        }, {
            passive: true
        });

        window.addEventListener('scroll', function() {
            if (active) {
                reset(active);
                active = null;
                rect = null;
            }
        }, {
            passive: true
        });
    }

    function initMagnetic() {
        if (reduced) return;
        var strength = 0.3;
        var els = document.querySelectorAll('.nav-links a, #social-cluster a, footer a, .crypto-copy-btn, #lang-toggle');
        els.forEach(function(el) {
            el.style.transition = 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)';
            el.addEventListener('pointermove', function(e) {
                var r = el.getBoundingClientRect();
                var dx = e.clientX - (r.left + r.width / 2);
                var dy = e.clientY - (r.top + r.height / 2);
                el.style.transform = 'translate(' + (dx * strength).toFixed(1) + 'px,' + (dy * strength).toFixed(1) + 'px)';
            });
            el.addEventListener('pointerleave', function() {
                el.style.transform = '';
            });
        });
    }

    function initScrollProgress() {
        var bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);

        function update() {
            var h = document.documentElement;
            var max = h.scrollHeight - h.clientHeight;
            var p = max > 0 ? (h.scrollTop || window.scrollY || 0) / max : 0;
            bar.style.transform = 'scaleX(' + p + ')';
        }
        window.addEventListener('scroll', update, {
            passive: true
        });
        window.addEventListener('resize', update);
        update();
    }

    function initStatus() {
        var clock = document.getElementById('status-clock') || document.getElementById('vn-clock');
        var text = document.getElementById('status-text');
        var dot = document.querySelector('.status-pill-dot');

        function tick() {
            try {
                var now = new Date();
                var time = now.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Kolkata'
                });
                var hour = parseInt(now.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Kolkata'
                }), 10);
                if (clock) clock.innerHTML = time + '<span class="status-pill-tz"> (IST)</span>';
                var available = hour >= 8 && hour < 20;
                if (dot) dot.classList.toggle('away', !available);
                if (text) {
                    var key = available ? 'statusAvailable' : 'statusAway';
                    text.setAttribute('data-translate', key);
                    var lang = 'en';
                    var t = (typeof translations !== 'undefined' && (translations[lang] || translations.en)) || {};
                    if (t[key]) text.textContent = t[key];
                }
            } catch (err) {}
        }
        tick();
        setInterval(tick, 20000);
    }

    function init() {
        initTilt();
        initMagnetic();
        initScrollProgress();
        initStatus();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();