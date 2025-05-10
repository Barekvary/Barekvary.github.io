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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    document.querySelectorAll('.page').forEach(section => {
      if (!section.id.startsWith('project-')) return;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const anchor = section.querySelector('a[id^="test-project"]');
      if (!anchor) return;
      const navLink = document.querySelector(`.nav-links a[href="#${anchor.id}"]`);
      if (!navLink) return;

      if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionTop + sectionHeight - 200) {
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    });

    if (scrollPosition < 400) {
      document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
      const infoLink = document.querySelector('.nav-links a[rel="top"]');
      if (infoLink) infoLink.classList.add('active');
    }
  });

  setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
}

document.addEventListener('DOMContentLoaded', initializeSmoothScroll);

// Gallery slider with dynamic buttons
function initializeSliders() {
  document.querySelectorAll('.gallery-wrapper').forEach(wrapper => {
    const gallery = wrapper.querySelector('.project-gallery');
    const slides  = Array.from(gallery.children);
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
