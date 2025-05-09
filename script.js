
document.addEventListener('DOMContentLoaded', function() {
  function updateClock() {
    const now = new Date();
    document.getElementById('hour').textContent = String(now.getHours()).padStart(2, '0');
    document.getElementById('minute').textContent = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('second').textContent = String(now.getSeconds()).padStart(2, '0');
  }
  
  updateClock();
  setInterval(updateClock, 1000);
  
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
        const headerHeight = document.querySelector('#header-navigation').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('.page.stacked-page').forEach(section => {
      if (!section.id.startsWith('project-')) return;
      
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      const correspondingAnchor = section.querySelector('a[id^="test-project"]');
      if (!correspondingAnchor) return;
      
      const navLink = document.querySelector(`.nav-links a[href="#${correspondingAnchor.id}"]`);
      if (!navLink) return;
      
      if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionTop + sectionHeight - 200) {
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
        });
        
        navLink.classList.add('active');
      }
    });
    
    if (scrollPosition < 400) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
      });
      
      const infoLink = document.querySelector('.nav-links a[rel="top"]');
      if (infoLink) infoLink.classList.add('active');
    }
  });
  
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
  
  document.querySelectorAll('.gallery-slide img').forEach(img => {
    img.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease';
      this.style.transform = 'scale(1.02)';
    });
    
    img.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
});