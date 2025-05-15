// Animaciones de fade-in con IntersectionObserver
function initCardAnimations() {
  const cards = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(card => observer.observe(card));
  } else {
    // Fallback: mostrar todo
    cards.forEach(card => card.classList.add('visible'));
  }
}

// Botón de volver arriba
function initScrollTopBtn() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Sistema de comentarios
function initCommentSystem() {
  document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nameInput = form.querySelector('input');
      const textArea = form.querySelector('textarea');
      const name = nameInput.value.trim();
      const message = textArea.value.trim();
      if (!name || !message) return;

      const comment = document.createElement('div');
      comment.className = 'comment';
      comment.innerHTML = `<strong>${name}:</strong> ${message}`;

      const commentList = form.nextElementSibling;
      commentList.appendChild(comment);

      form.reset();
    });
  });
}

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initCardAnimations();
  initScrollTopBtn();
  initCommentSystem();
});
