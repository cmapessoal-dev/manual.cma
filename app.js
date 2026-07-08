
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const search = document.getElementById('manual-search');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      const sections = Array.from(document.querySelectorAll('.manual-section'));
      const menuButtons = Array.from(document.querySelectorAll('#manual-menu button'));
      if (!q) {
        sections.forEach(sec => sec.classList.add('search-visible'));
        menuButtons.forEach(btn => btn.style.display = 'flex');
        return;
      }
      sections.forEach(sec => {
        const match = sec.innerText.toLowerCase().includes(q);
        sec.classList.toggle('search-visible', match);
      });
      menuButtons.forEach(btn => {
        const sectionId = (btn.getAttribute('onclick') || '').match(/'([^']+)'/)?.[1];
        const sec = sectionId ? document.getElementById(sectionId) : null;
        const match = btn.innerText.toLowerCase().includes(q) || (sec && sec.innerText.toLowerCase().includes(q));
        btn.style.display = match ? 'flex' : 'none';
      });
    });
  }
});

function showSection(sectionId, buttonElement) {
  const sections = document.querySelectorAll('.manual-section');
  sections.forEach(sec => sec.classList.add('hidden'));
  sections.forEach(sec => sec.classList.remove('active'));
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');
  }
  const menuButtons = document.querySelectorAll('#manual-menu button');
  menuButtons.forEach(btn => {
    btn.classList.remove('bg-blue-50', 'text-blue-950', 'border-l-4', 'border-blue-950', 'font-semibold');
    btn.classList.add('text-gray-600', 'font-medium', 'border-transparent');
  });
  if (buttonElement) {
    buttonElement.classList.remove('text-gray-600', 'font-medium', 'border-transparent');
    buttonElement.classList.add('bg-blue-50', 'text-blue-950', 'border-l-4', 'border-blue-950', 'font-semibold');
  }
  if (window.innerWidth < 1024) {
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleExplainer(explainerId) {
  const expBlock = document.getElementById(explainerId);
  if (expBlock) expBlock.classList.toggle('hidden');
}
