document.addEventListener('DOMContentLoaded', function () {
  // ===============================================================
  // BOTÃO DE MUDANÇA DE TEMA
  // ===============================================================
  const themeToggle = document.createElement('div');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';

  const themeToggleLi = document.createElement('li');
  themeToggleLi.className = 'theme-toggle-li';
  themeToggleLi.appendChild(themeToggle);

  const navbarUl = document.querySelector('#navbar ul');
  navbarUl.appendChild(themeToggleLi);

  // ===============================================================
  // ALTERNAR TEMA
  // ===============================================================
  themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

  // ===============================================================
  // APLICAR TEMA DE PREFERÊNCIA
  // ===============================================================
  const prefersDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    }
  });
});
