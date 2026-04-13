// Simple Lightbox for Gallery
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.masonry-item');
  
  if (galleryItems.length > 0) {
    // Create Lightbox Container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-close">&times;</div>
      <img src="" alt="Lightbox Image">
    `;
    document.body.appendChild(lightbox);
    
    // Add CSS for lightbox dynamically to keep it self-contained
    const style = document.createElement('style');
    style.textContent = `
      .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .lightbox.active {
        opacity: 1;
        pointer-events: auto;
      }
      .lightbox img {
        max-width: 90%;
        max-height: 90vh;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      }
      .lightbox-close {
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        line-height: 1;
      }
    `;
    document.head.appendChild(style);
    
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    });
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
