// Menú mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  const close = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// Botón compartir: Web Share en celular, copiar link en compu
const share = document.getElementById('share');
if (share) {
  share.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(location.href);
      share.textContent = 'Link copiado';
      setTimeout(() => { share.textContent = 'Compartir esta página'; }, 2200);
    } catch (e) { /* el usuario canceló */ }
  });
}
