(function() {
    'use strict';
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var ring = document.createElement('div');
    ring.className = 'cursor-blend';
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add('custom-cursor');

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var interactive = 'a, button, [role="button"], input, label, .crypto-copy-btn, .liquid-card, .scroll-item';

    var tx = window.innerWidth / 2,
        ty = window.innerHeight / 2;
    var rx = tx,
        ry = ty,
        dx = tx,
        dy = ty;

    window.addEventListener('mousemove', function(e) {
        tx = e.clientX;
        ty = e.clientY;
        ring.classList.add('visible');
        dot.classList.add('visible');
        var hot = !!(e.target.closest && e.target.closest(interactive));
        ring.classList.toggle('grow', hot);
        dot.classList.toggle('grow', hot);
    });
    window.addEventListener('mousedown', function() {
        ring.classList.add('down');
    });
    window.addEventListener('mouseup', function() {
        ring.classList.remove('down');
    });
    document.addEventListener('mouseleave', function() {
        ring.classList.remove('visible');
        dot.classList.remove('visible');
    });
    document.addEventListener('mouseenter', function() {
        ring.classList.add('visible');
        dot.classList.add('visible');
    });

    function render() {
        if (reduced) {
            rx = tx;
            ry = ty;
            dx = tx;
            dy = ty;
        } else {
            rx += (tx - rx) * 0.16;
            ry += (ty - ry) * 0.16;
            dx += (tx - dx) * 0.55;
            dy += (ty - dy) * 0.55;
        }
        ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
        dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0) translate(-50%,-50%)';
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
})();