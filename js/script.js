// ===============================================================
// PORTFÓLIO PESSOAL - SCRIPT PRINCIPAL
// ===============================================================

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ===============================================================
  // PRELOADER
  // ===============================================================
  const preloader = document.querySelector('.preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    }, 800);
  });

  // ===============================================================
  // HEADER FIXO NA ROLAGEM
  // ===============================================================
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ===============================================================
  // MENU MOBILE
  // ===============================================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbar = document.getElementById('navbar');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navbar.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // ===============================================================
  // ROLAGEM SUAVE
  // ===============================================================
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navLinks.forEach((item) => item.classList.remove('active'));
      this.classList.add('active');

      if (navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - header.offsetHeight,
          behavior: 'smooth',
        });
      }
    });
  });

  // ===============================================================
  // DESTACAR AO ROLAR
  // ===============================================================
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + header.offsetHeight + 10;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ===============================================================
  // BOTÃO VOLTAR
  // ===============================================================
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('active');
    } else {
      backToTop.classList.remove('active');
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // ===============================================================
  // ENVIAR FORMULÁRIO VIA FORMSUBMIT
  // ===============================================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject:
          document.getElementById('subject').value || 'Nova mensagem do formulário de contato',
        message: document.getElementById('message').value,
      };

      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      submitButton.disabled = true;
      submitButton.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('_captcha', 'false');
      formDataToSend.append('_template', 'table');

      fetch('https://formsubmit.co/ajax/mail.jr@gmail.com', {
        method: 'POST',
        body: formDataToSend,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro no envio do formulário');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success === 'true' || data.success === true) {
            // Mostrar mensagem de sucesso
            alert(`Mensagem enviada com sucesso! Obrigado, ${formData.name}!`);
            contactForm.reset();
          } else {
            throw new Error('Falha no envio do formulário');
          }
        })
        .catch((error) => {
          console.error('Erro:', error);
          alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.');
        })
        .finally(() => {
          // Restaurar botão
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        });
    });
  }

  // ===============================================================
  // INICIALIZAR COMPONENTES
  // ===============================================================
  PortfolioCarousel.init(header);
});
