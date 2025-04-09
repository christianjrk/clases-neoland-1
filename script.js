// Función para buscar animales en la página
function buscarAnimal() {
    const input = document.getElementById('search');
    const filter = input.value.toUpperCase();
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const title = section.querySelector('h2').textContent;
      if (title.toUpperCase().indexOf(filter) > -1) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });
  }
  