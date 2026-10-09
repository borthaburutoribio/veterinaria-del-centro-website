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

// Compartir: Web Share en celular, copiar link en compu
const share = document.getElementById('share');
if (share) {
  const label = share.innerHTML;
  share.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(location.href);
      share.textContent = 'Link copiado';
      setTimeout(() => { share.innerHTML = label; }, 2200);
    } catch (e) { /* canceló */ }
  });
}

// Estado en vivo (hora de Buenos Aires). Horario: lun–vie 10–13 y 16–19, sáb 10:30–14.
const HOURS = { 1: [[10, 13], [16, 19]], 2: [[10, 13], [16, 19]], 3: [[10, 13], [16, 19]], 4: [[10, 13], [16, 19]], 5: [[10, 13], [16, 19]], 6: [[10.5, 14]], 0: [] };
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const fmt = h => { const m = Math.round((h % 1) * 60); return Math.floor(h) + (m ? ':' + String(m).padStart(2, '0') : ''); };

function nowBA() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, h: Number(get('hour')) + Number(get('minute')) / 60 };
}

function nextOpening(day, h) {
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const slot = HOURS[d].find(([a]) => i > 0 || a > h);
    if (slot) return { d, a: slot[0], i };
  }
}

function paintStatus() {
  const { day, h } = nowBA();
  const title = document.getElementById('status-title');
  const sub = document.getElementById('status-sub');
  const dot = document.getElementById('status-dot');
  const track = document.querySelector('.dayline-track');
  const marker = document.getElementById('dayline-now');
  if (!title) return;

  const today = HOURS[day];
  track.innerHTML = today.map(([a, b]) => `<i style="--a:${a};--b:${b}"></i>`).join('');
  if (h >= 8 && h <= 21) { marker.style.display = 'block'; marker.style.left = `${(h - 8) / 13 * 100}%`; }

  const open = today.find(([a, b]) => h >= a && h < b);
  if (open) {
    dot.className = 'status-dot is-open';
    title.textContent = 'Abierto ahora';
    sub.textContent = `Hoy hasta las ${fmt(open[1])}`;
  } else {
    dot.className = 'status-dot is-closed';
    const n = nextOpening(day, h);
    const midday = today.length > 1 && h >= today[0][1] && h < today[1][0];
    title.textContent = midday ? 'Cerrado al mediodía' : 'Cerrado ahora';
    const when = n.i === 0 ? 'hoy' : n.i === 1 ? 'mañana' : `el ${DAYS[n.d]}`;
    sub.textContent = `Abre ${when} a las ${fmt(n.a)}`;
  }

  document.querySelectorAll('.week-row').forEach(r => r.classList.toggle('is-today', Number(r.dataset.day) === day));
}
paintStatus();
setInterval(paintStatus, 60000);
