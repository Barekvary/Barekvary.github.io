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
            openFullscreen(slides, index);
        };

        maxBtn.addEventListener('click', openFsCallback);

        // Also add click listener to images directly
        slides.forEach(slide => {
            const media = slide.querySelector('img, video');
            if (media) {
                media.style.cursor = 'pointer'; // Indicate clickable
                media.addEventListener('click', openFsCallback);
            }
        });

        function update() {
            gallery.style.transform = `translateX(-${index * 100}% )`;
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