// Clock / timer function
function initializeClock() {
    function updateClock() {
        const now = new Date();
        document.getElementById('hour').textContent = String(now.getHours()).padStart(2, '0');
        document.getElementById('minute').textContent = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('second').textContent = String(now.getSeconds()).padStart(2, '0');
    }

    updateClock();
    setInterval(updateClock, 1000);
}

document.addEventListener('DOMContentLoaded', initializeClock);

// Smooth scroll and active link highlighting
function initializeSmoothScroll() {
    document.querySelectorAll('.nav-links a, a[rel="top"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#' || this.getAttribute('rel') === 'top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        const pages = Array.from(document.querySelectorAll('.pages .page'));
        pages.forEach((sec, i) => {
            const top = sec.offsetTop,
                half = sec.offsetHeight / 2,
                isInfo = i === 0;
            let link = isInfo ?
                document.querySelector('.nav-links a[rel="top"]') :
                (() => {
                    const a = sec.querySelector('a[id^="test-project"]');
                    return a && document.querySelector(`.nav-links a[href="#${a.id}"]`);
                })();
            if (!link) return;

            const start = i === 0 ? 0 : pages[i - 1].offsetTop + pages[i - 1].offsetHeight / 2;
            const end = i === pages.length - 1 ? Infinity : top + half;

            if (scrollY >= start && scrollY < end) {
                document.querySelectorAll('.nav-links a')
                    .forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
}

document.addEventListener('DOMContentLoaded', initializeSmoothScroll);

// Gallery slider with dynamic buttons
function initializeSliders() {
    document.querySelectorAll('.gallery-wrapper').forEach(wrapper => {
        const gallery = wrapper.querySelector('.project-gallery');
        const slides = Array.from(gallery.children);
        let index = 0;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav gallery-prev';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.textContent = '‹';
        wrapper.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav gallery-next';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.textContent = '›';
        wrapper.appendChild(nextBtn);

        const maxBtn = document.createElement('button');
        maxBtn.className = 'gallery-maximize';
        maxBtn.setAttribute('aria-label', 'Maximize to fullscreen');
        maxBtn.textContent = '⤢';
        wrapper.appendChild(maxBtn);

        const openFsCallback = () => {
            // Only open fullscreen if not on mobile (check width > 768px)
            if (window.innerWidth > 768) {
                openFullscreen(slides, index);
            }
        };

        maxBtn.addEventListener('click', openFsCallback);

        // Also add click listener to images directly
        slides.forEach(slide => {
            const media = slide.querySelector('img, video');
            if (media) {
                media.style.cursor = 'zoom-in'; // Indicate magnifying glass
                media.addEventListener('click', openFsCallback);
            }
        });

        const pagination = document.createElement('div');
        pagination.className = 'gallery-pagination';
        wrapper.appendChild(pagination);

        // create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent opening fullscreen
                index = i;
                update();
            });
            pagination.appendChild(dot);
        });

        function update() {
            gallery.style.transform = `translateX(-${index * 100}% )`;
            // update dots
            Array.from(pagination.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        prevBtn.addEventListener('click', () => {
            index = index > 0 ? index - 1 : slides.length - 1;
            update();
        });

        nextBtn.addEventListener('click', () => {
            index = index < slides.length - 1 ? index + 1 : 0;
            update();
        });

        update();
        let startX = 0;
        const threshold = wrapper.clientWidth * 0.2;

        wrapper.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0)
                    index = index > 0 ? index - 1 : slides.length - 1;
                else
                    index = index < slides.length - 1 ? index + 1 : 0;
                update();
            }
        }, { passive: true });
    });
}

document.addEventListener('DOMContentLoaded', initializeSliders);

// Fullscreen functionality
// Fullscreen functionality
function initializeFullscreen() {
    const modal = document.getElementById('fullscreen-modal');
    const closeBtn = document.getElementById('fullscreen-close');
    const prevBtn = document.getElementById('fullscreen-prev');
    const nextBtn = document.getElementById('fullscreen-next');
    const contentWrapper = document.getElementById('fullscreen-content-wrapper');

    if (!modal || !closeBtn || !contentWrapper) return;

    let currentSlides = [];
    let currentIndex = 0;

    function showSlide(index) {
        if (!currentSlides.length) return;

        // Wrap index
        if (index < 0) index = currentSlides.length - 1;
        if (index >= currentSlides.length) index = 0;

        currentIndex = index;

        const slide = currentSlides[currentIndex];
        const mediaElement = slide.querySelector('img, video');

        if (mediaElement) {
            contentWrapper.innerHTML = '';
            const clone = mediaElement.cloneNode(true);

            // Ensure controls are enabled for video in fullscreen
            if (clone.tagName.toLowerCase() === 'video') {
                clone.controls = true;
                clone.muted = false;
                clone.play().catch(e => console.log('Autoplay blocked', e));
            }

            // Ensure object-fit: contain is preserved or enforced
            clone.style.objectFit = 'contain';
            clone.style.width = '100%';
            clone.style.height = '100%';

            contentWrapper.appendChild(clone);
        }
    }

    window.openFullscreen = function (slides, startIndex) {
        currentSlides = slides;
        currentIndex = startIndex;

        showSlide(currentIndex);

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    function closeFullscreen() {
        modal.classList.add('hidden');
        contentWrapper.innerHTML = '';
        document.body.style.overflow = '';
        currentSlides = []; // specific reference clear
    }

    closeBtn.addEventListener('click', closeFullscreen);

    // Navigation events
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentIndex + 1);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === contentWrapper) {
            closeFullscreen();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;

        switch (e.key) {
            case 'Escape':
                closeFullscreen();
                break;
            case 'ArrowLeft':
                showSlide(currentIndex - 1);
                break;
            case 'ArrowRight':
                showSlide(currentIndex + 1);
                break;
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeFullscreen);

// ========== Dota 2 Match Found Overlay (Asset-Aware & Embedded) ==========

document.addEventListener('DOMContentLoaded', () => {
    const AssetLoader = {
        images: [
            'acceptmatchbutton.png',
            'acceptmatchbuttonhover.png',
            'smokeparticle.png',
            'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/backgrounds/featured.jpg',
            'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_horiz.png',
            'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/valve_logo.png',
            'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/footer_logo.png'
        ],
        audio: [
            'start.mpeg',
            'meepmap.mpeg',
            'matchready.mp3'
        ],
        readyPromise: null,
        assets: {},

        init() {
            if (this.readyPromise) return this.readyPromise;
            this.readyPromise = Promise.all([
                ...this.images.map(src => new Promise(res => {
                    const img = new Image();
                    img.onload = () => {
                        this.assets[src] = img;
                        res();
                    };
                    img.onerror = () => res();
                    img.src = src;
                })),
                ...this.audio.map(src => new Promise(res => {
                    const a = new Audio();
                    a.oncanplaythrough = a.onerror = () => res();
                    a.src = src;
                }))
            ]);
            return this.readyPromise;
        }
    };

    const ParticleSystem = {
        canvas: null,
        ctx: null,
        particles: [],
        isSpawning: true,
        animationId: null,
        fadeMult: 1.0,
        introFade: 0.0,

        init() {
            this.canvas = document.getElementById('match-particles');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            const cW = this.canvas.width || window.innerWidth || 1920;
            const cH = this.canvas.height || window.innerHeight || 1080;
            window.addEventListener('resize', () => this.resize());
            this.isSpawning = true;
            this.particles = [];
            this.fadeMult = 1.0;
            this.introFade = 0.0;
            // Increased count to support 3x smoke
            for (let i = 0; i < 600; i++) {
                this.particles.push(this.spawn(true));
            }
            this.animate();
        },
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },
        spawn(isInitial = false) {
            if (!this.isSpawning && !isInitial) return null;
            
            const cW = this.canvas.width || window.innerWidth || 1920;
            const cH = this.canvas.height || window.innerHeight || 1080;
            
            // Shard count kept ~300, Smoke count tripled (~300)
            const type = Math.random() > 0.5 ? 'smoke' : 'shard';
            const angle = Math.random() * Math.PI * 2;
            
            // INCREASED SPEED: Faster particles
            const speed = type === 'smoke' ? (1.2 + Math.random() * 3.5) : (3.5 + Math.random() * 8.0);
            
            // Smoke scale tripled (approx 45-135 range), Shard scale increased (max +50%)
            // Shards: min 2.0, max 8.625 (was 5.75)
            const maxR = type === 'smoke' ? (45 + Math.random() * 90) : (2.0 + Math.random() * 6.625);

            let shrink = 0.05;
            if (type === 'smoke') {
                shrink = 0.01; // Faster fade via radius shrink as well
            } else {
                const absCos = Math.abs(Math.cos(angle));
                const absSin = Math.abs(Math.sin(angle));
                // EXTENDED RANGE: Distance traveled 30% larger (Horizontal 715, Vertical 286)
                const distToFade = Math.min(715 / (absCos || 0.001), 286 / (absSin || 0.001));
                shrink = (maxR * speed) / distToFade;
            }
            
            return {
                type: type,
                x: cW / 2,
                y: cH / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                // Refined start radius to avoid 'popping'
                r: isInitial ? Math.random() * maxR : (type === 'smoke' ? (maxR * 0.4) : maxR),
                maxR: maxR,
                phase: Math.random() * Math.PI * 2,
                waftSpeed: 0,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0, 
                color: type === 'smoke' ? '102,199,148' : (Math.random() > 0.4 ? '255,255,255' : '102,199,148'),
                shrink: shrink,
                expansion: 0
            };
        },
        animate() {
            if (!this.ctx) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Faster intro fade (approx 0.6s)
            if (this.introFade < 1.0) {
                this.introFade += 0.025;
                if (this.introFade > 1.0) this.introFade = 1.0;
            }

            if (!this.isSpawning) {
                this.fadeMult -= 0.015;
                if (this.fadeMult <= 0) this.fadeMult = 0;
            }

            const currentAlpha = this.introFade * this.fadeMult;
            const smokeImg = AssetLoader.assets['smokeparticle.png'];

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];

                if (p.type === 'smoke') {
                    p.y -= 0.3; // Faster drift
                }

                p.x += p.vx;
                p.y += p.vy;
                p.r -= p.shrink;

                // Box-normalized distance fade for smoke (follows rectangle shape)
                let distAlpha = 1.0;
                if (p.type === 'smoke') {
                    const rectW = 510;
                    const rectH = 298;
                    const dx = Math.abs(p.x - this.canvas.width / 2);
                    const dy = Math.abs(p.y - this.canvas.height / 2);
                    const normDist = Math.max(dx / (rectW / 2), dy / (rectH / 2));
                    // SHORTER FADE RANGE: 1.0 to 1.3
                    distAlpha = Math.max(0, Math.min(1.0, 1.0 - (normDist - 1.0) / 0.3));
                }

                if (p.r <= 0 || (p.type === 'smoke' && distAlpha <= 0)) {
                    const next = this.spawn();
                    if (next) this.particles[i] = next;
                    else this.particles.splice(i, 1);
                    continue;
                }

                let alpha = Math.max(0, Math.min(0.7, (p.r / p.maxR) * 0.7)) * currentAlpha * distAlpha;
                
                if (p.type === 'smoke' && smokeImg) {
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rotation);
                    // Greener and more opaque smoke
                    this.ctx.globalAlpha = alpha * 0.75;
                    this.ctx.drawImage(smokeImg, -p.r, -p.r, p.r * 2, p.r * 2);
                    this.ctx.globalCompositeOperation = 'source-atop';
                    this.ctx.fillStyle = 'rgba(102, 199, 148, 0.8)';
                    this.ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
                    this.ctx.restore();
                } else {
                    this.ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
            if (this.particles.length > 0 || this.isSpawning) {
                this.animationId = requestAnimationFrame(() => this.animate());
            }
        },
        stopSpawning() {
            this.isSpawning = false;
        },
        stopFull() {
            cancelAnimationFrame(this.animationId);
        }
    };

    let interactionAllowed = false;
    let acceptInProgress = false;
    let triggered = false;

    function showOverlay() {
        if (triggered) return;
        triggered = true;
        
        // Play sound RIGHT at the beginning of the reveal
        const audio = document.getElementById('matchready-audio');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }

        const overlay = document.getElementById('match-found-overlay');
        overlay.classList.add('visible');
        overlay.classList.remove('hidden');
        
        ParticleSystem.init();
        
        setTimeout(() => {
            interactionAllowed = true;
        }, 500);
    }

    async function onFirstInteraction(e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
        
        window.removeEventListener('click', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
        
        // Show overlay first, then handle loading in background if needed (though it's fast)
        // But the user wants sound IMMEDIATELY. ShowOverlay does that.
        await AssetLoader.init();
        showOverlay();
    }

    window.addEventListener('click', onFirstInteraction);
    window.addEventListener('keydown', onFirstInteraction);

    const acceptBtn = document.getElementById('match-accept-btn');

    function handleAcceptVisuals(isPressed) {
        if (!acceptBtn) return;
        if (isPressed && !acceptInProgress) {
            acceptBtn.classList.add('pressed');
        } else {
            acceptBtn.classList.remove('pressed');
        }
    }

    async function handleAccept() {
        if (acceptInProgress || !interactionAllowed) return;
        acceptInProgress = true;
        
        if (acceptBtn) acceptBtn.classList.add('pressed');
        
        const inner = document.getElementById('match-found-inner');
        const faceFront = document.querySelector('.match-found-face.front');
        const faceTop = document.querySelector('.match-found-face.top');
        
        // No sound here as requested

        setTimeout(() => {
            if (inner) inner.classList.add('rotating');
            if (faceFront) faceFront.classList.remove('glow-active');
            setTimeout(() => faceTop && faceTop.classList.add('glow-active'), 100);
            if (acceptBtn) acceptBtn.classList.remove('pressed');
            startReadySequence();
        }, 150);
    }

    function startReadySequence() {
        const icons = document.querySelectorAll('.status-icon');
        const countLabel = document.getElementById('accepted-count');
        let currentIndex = 0;
        let delay = 50;

        function activateNext() {
            if (currentIndex < icons.length) {
                icons[currentIndex].classList.add('active');
                currentIndex++;
                if (countLabel) countLabel.innerText = currentIndex + ' / 10 ПРИНЯТЫ';
                
                if (currentIndex < icons.length) {
                    delay *= 1.5;
                    setTimeout(activateNext, delay);
                } else {
                    setTimeout(finishSequence, 800);
                }
            }
        }
        activateNext();
    }

    function finishSequence() {
        const startAudio = new Audio('start.mpeg');
        startAudio.play().catch(() => {});
        
        ParticleSystem.stopSpawning();
        const dialog = document.getElementById('match-found-dialog');
        const overlay = document.getElementById('match-found-overlay');
        
        // 1. Start cinematic shrink animation (3s total, opacity hits zero at 1.5s)
        if (dialog) dialog.style.animation = 'dotaShrink 3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        
        // 2. Wait for modal to hit 0 opacity (1.5s mark)
        setTimeout(() => {
            // 3. Now fade in the dota site AND simultaneously fade out the overlay backdrop
            document.body.classList.add('dota-active');
            if (overlay) overlay.classList.add('fading-out');
        }, 1500);

        // 4. Final cleanup (3s mark)
        setTimeout(() => {
            if (overlay) overlay.style.display = 'none';
            ParticleSystem.stopFull();
        }, 3000);
    }

    // Button Events
    if (acceptBtn) {
        acceptBtn.addEventListener('mousedown', () => handleAcceptVisuals(true));
        acceptBtn.addEventListener('click', handleAccept);
    }
    window.addEventListener('mouseup', () => handleAcceptVisuals(false));

    // Hotkeys
    window.addEventListener('keydown', (e) => {
        if (!interactionAllowed || acceptInProgress) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAcceptVisuals(true);
        }
    });

    window.addEventListener('keyup', (e) => {
        if (!interactionAllowed || acceptInProgress) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAccept();
        }
    });

    // Decline: play meepmap sound
    const declineBtn = document.getElementById('match-decline');
    if (declineBtn) {
        declineBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const meepAudio = new Audio('meepmap.mpeg');
            meepAudio.currentTime = 0;
            meepAudio.play().catch(() => {});
        });
    }

    // Start preloading immediately
    AssetLoader.init();
});