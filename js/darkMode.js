const toggleThemeButton = document.querySelector('#toggle-theme');

function toggleTheme() {
  document.documentElement.classList.toggle('dark'); // Alterna a classe 'dark' no <html>
  const isDarkMode = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

toggleThemeButton.addEventListener('click', toggleTheme);
loadTheme();