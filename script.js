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
        anchor.addEventListener('click', function(e) {
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

    window.addEventListener('scroll', function() {
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
    });
}

document.addEventListener('DOMContentLoaded', initializeSliders);