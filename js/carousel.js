// ===============================================================
// PORTFÓLIO PESSOAL - COMPONENTE CARROSSEL
// ===============================================================

const PortfolioCarousel = (function () {
  'use strict';

  let projects = [];
  let modal;
  let header;

  // ===============================================================
  // DADOS DOS PROJETOS
  // ===============================================================
  async function loadProjectData() {
    try {
      const devResponse = await fetch('./database/dev-projects.json');
      const devProjects = await devResponse.json();

      const designResponse = await fetch('./database/design-projects.json');
      const designProjects = await designResponse.json();

      projects = [...devProjects, ...designProjects];

      initializeCarousels();
      setupCarouselControls();

      return true;
    } catch (error) {
      console.error('Erro ao carregar dados dos projetos:', error);
      return false;
    }
  }

  // ===============================================================
  // ELEMENTO NO CARROSSEL
  // ===============================================================
  function createCarouselItem(project) {
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';
    carouselItem.setAttribute('data-id', project.id);
    carouselItem.setAttribute('data-category', project.category);

    carouselItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="carousel-item-overlay">
              <h4>${project.title}</h4>
              <p>${project.shortDescription}</p>
              <button class="btn btn-primary view-project">Ver Detalhes</button>
            </div>
          `;

    carouselItem.querySelector('.view-project').addEventListener('click', () => {
      openProjectModal(project);
    });

    return carouselItem;
  }

  // ===============================================================
  // ELEMENTO NA GRADE
  // ===============================================================
  function createGridItem(project) {
    const gridItem = document.createElement('div');
    gridItem.className = 'carousel-item';
    gridItem.setAttribute('data-id', project.id);
    gridItem.setAttribute('data-category', project.category);

    gridItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="carousel-item-overlay">
              <h4>${project.title}</h4>
              <p>${project.shortDescription}</p>
              <button class="btn btn-primary view-project">Ver Detalhes</button>
            </div>
          `;

    gridItem.querySelector('.view-project').addEventListener('click', () => {
      openProjectModal(project);
    });

    return gridItem;
  }

  // ===============================================================
  // INICIALIZAR CARROSSEIS
  // ===============================================================
  function initializeCarousels() {
    const devCarousel = document.getElementById('dev-carousel');
    const designCarousel = document.getElementById('design-carousel');
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (!devCarousel || !designCarousel || !portfolioGrid) return;

    devCarousel.innerHTML = '';
    designCarousel.innerHTML = '';
    portfolioGrid.innerHTML = '';

    projects.forEach((project) => {
      if (project.category === 'dev') {
        devCarousel.appendChild(createCarouselItem(project));
      } else if (project.category === 'design') {
        designCarousel.appendChild(createCarouselItem(project));
      }

      portfolioGrid.appendChild(createGridItem(project));
    });
  }

  // ===============================================================
  // CONTROLES DO CARROSSEL
  // ===============================================================
  function setupCarouselControls() {
    const carousels = [
      {
        container: document.getElementById('dev-carousel'),
        prevBtn: document.getElementById('dev-prev'),
        nextBtn: document.getElementById('dev-next'),
        seeMoreBtn: document.getElementById('dev-see-more'),
      },
      {
        container: document.getElementById('design-carousel'),
        prevBtn: document.getElementById('design-prev'),
        nextBtn: document.getElementById('design-next'),
        seeMoreBtn: document.getElementById('design-see-more'),
      },
    ];

    carousels.forEach((carousel) => {
      if (!carousel.container || !carousel.prevBtn || !carousel.nextBtn) return;

      let currentPosition = 0;
      const itemWidth = carousel.container.querySelector('.carousel-item')?.offsetWidth + 20;

      function updateCarouselPosition() {
        carousel.container.style.transform = `translateX(${-currentPosition * itemWidth}px)`;
      }

      carousel.prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
          currentPosition--;
          updateCarouselPosition();
        }
      });

      carousel.nextBtn.addEventListener('click', () => {
        const maxPosition = Math.max(0, carousel.container.children.length - getVisibleItems());
        if (currentPosition < maxPosition) {
          currentPosition++;
          updateCarouselPosition();
        }
      });

      if (carousel.seeMoreBtn) {
        carousel.seeMoreBtn.addEventListener('click', togglePortfolioGrid);
      }

      window.addEventListener('resize', () => {
        currentPosition = 0;
        updateCarouselPosition();
      });
    });
  }

  function getVisibleItems() {
    const width = window.innerWidth;
    if (width < 576) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  // ===============================================================
  // ALTERNAR PARA GRID COMPLETO DO PORTFÓLIO
  // ===============================================================
  function togglePortfolioGrid() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const devSection = document.getElementById('dev-section');
    const designSection = document.getElementById('design-section');

    if (portfolioGrid.classList.contains('hidden')) {
      portfolioGrid.classList.remove('hidden');
      devSection.style.display = 'none';
      designSection.style.display = 'none';
      document.querySelectorAll('.portfolio-btn').forEach((btn) => {
        btn.innerHTML = 'Voltar <i class="fas fa-arrow-left"></i>';
      });
    } else {
      portfolioGrid.classList.add('hidden');
      devSection.style.display = 'block';
      designSection.style.display = 'block';
      document.querySelectorAll('.portfolio-btn').forEach((btn) => {
        btn.innerHTML = 'Ver Todos <i class="fas fa-arrow-right"></i>';
      });
    }

    window.scrollTo({
      top: document.getElementById('portfolio').offsetTop - header.offsetHeight,
      behavior: 'smooth',
    });
  }

  // ===============================================================
  // FILTRAR PORTFÓLIO POR CATEGORIA
  // ===============================================================
  function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const devSection = document.getElementById('dev-section');
    const designSection = document.getElementById('design-section');
    const portfolioGrid = document.getElementById('portfolio-grid');

    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        if (portfolioGrid.classList.contains('hidden')) {
          if (category === 'all') {
            devSection.style.display = 'block';
            designSection.style.display = 'block';
          } else if (category === 'dev') {
            devSection.style.display = 'block';
            designSection.style.display = 'none';
          } else if (category === 'design') {
            devSection.style.display = 'none';
            designSection.style.display = 'block';
          }
        } else {
          const items = portfolioGrid.querySelectorAll('.carousel-item');
          items.forEach((item) => {
            if (category === 'all') {
              item.style.display = 'block';
            } else {
              if (item.getAttribute('data-category') === category) {
                item.style.display = 'block';
              } else {
                item.style.display = 'none';
              }
            }
          });
        }
      });
    });
  }

  // ===============================================================
  // MODAL DO PORTFÓLIO
  // ===============================================================
  function setupModal() {
    modal = document.getElementById('portfolio-modal');
    const closeModal = document.querySelector('.close-modal');

    if (closeModal) {
      closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  function openProjectModal(project) {
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
            <div class="project-details">
              <div class="project-details-image">
                <img src="${project.image}" alt="${project.title}">
              </div>
              <div class="project-details-content">
                <h3>${project.title}</h3>
                <div class="project-details-info">
                  <p><strong>Cliente:</strong> ${project.client}</p>
                  <p><strong>Data:</strong> ${project.date}</p>
                  <p><strong>Tecnologias:</strong> ${project.technologies}</p>
                </div>
                <div class="project-details-description">
                  <p>${project.fullDescription}</p>
                </div>
                <div class="project-details-link">
                  <a href="${project.url}" class="btn btn-primary" target="_blank">Ver Projeto <i class="fas fa-external-link-alt"></i></a>
                </div>
              </div>
            </div>
          `;

    modal.classList.add('active');
  }

  // ===============================================================
  // INICIALIZAÇÃO
  // ===============================================================
  async function init(headerElement) {
    header = headerElement;

    setupModal();
    setupCategoryFilter();

    const dataLoaded = await loadProjectData();

    if (!dataLoaded) {
      console.error('Falha ao carregar dados dos projetos. Verifique os arquivos JSON.');
    }
  }

  return {
    init: init,
    getProjects: () => projects,
    toggleGrid: togglePortfolioGrid,
  };
})();

// ===============================================================
// EXPORTAÇÃO
// ===============================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioCarousel;
} else {
  window.PortfolioCarousel = PortfolioCarousel;
}
