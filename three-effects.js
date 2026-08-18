(function() {
    'use strict';

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(function(el) {
        observer.observe(el);
    });

    if (typeof THREE === 'undefined') return;

    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    var vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    var fragmentShader = `
        precision highp float;
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        varying vec2 vUv;

        void main() {
            vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
            vec2 m = mouse * 2.0;

            float fade = 0.0;
            for(int i=1; i<8; i++){
                float fi = float(i);
                p.x += 0.4 / fi * sin(fi * 2.0 * p.y + time * 0.6 + m.x);
                p.y += 0.4 / fi * cos(fi * 2.0 * p.x + time * 0.6 + m.y);
            }

            vec3 color1 = vec3(0.01, 0.02, 0.08);
            vec3 color2 = vec3(0.4, 0.9, 1.0);
            vec3 color3 = vec3(0.6, 0.4, 1.0);
            vec3 color4 = vec3(0.8, 1.0, 0.6);

            float r = 0.5 + 0.5 * sin(p.x + p.y + time * 0.2);
            float g = 0.5 + 0.5 * sin(p.x - p.y + time * 0.3 + 2.0);
            float b = 0.5 + 0.5 * cos(p.x * p.y + time * 0.4 + 4.0);

            vec3 base = mix(color1, color2, r);
            base = mix(base, color3, g * 0.8);
            base = mix(base, color4, b * 0.4);

            float vignette = 1.0 - length(vUv - 0.5) * 0.5;
            gl_FragColor = vec4(base * vignette, 1.0);
        }
    `;

    var scene = new THREE.Scene();
    var camera = new THREE.Camera();
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: false,
        powerPreference: 'high-performance'
    });

    var material = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                value: 0
            },
            resolution: {
                value: new THREE.Vector2()
            },
            mouse: {
                value: new THREE.Vector2(0, 0)
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    function render() {
        renderer.render(scene, camera);
    }

    function resize() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        renderer.setSize(w, h);
        material.uniforms.resolution.value.set(w, h);
        render();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function(e) {
        var x = (e.clientX / window.innerWidth) * 2 - 1;
        var y = -(e.clientY / window.innerHeight) * 2 + 1;
        material.uniforms.mouse.value.set(x, y);
    });

    canvas.addEventListener('webglcontextlost', function(e) {
        e.preventDefault();
    });
    canvas.addEventListener('webglcontextrestored', function() {
        resize();
    });

    var prefersReduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resize();

    if (!prefersReduced) {
        var lenis = null;
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.4,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true
            });
        }

        var rafId = null;

        function raf(time) {
            rafId = requestAnimationFrame(raf);
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                resize();
            }
            if (lenis) lenis.raf(time);
            material.uniforms.time.value = time * 0.001;
            render();
        }

        rafId = requestAnimationFrame(raf);

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            } else if (rafId === null) {
                rafId = requestAnimationFrame(raf);
            }
        });
    }

})();