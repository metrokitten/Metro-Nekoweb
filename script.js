/* ============================= */
/*  Sidebar navigation (index)  */
/* ============================= */
const sidebarLinks = document.querySelectorAll('.sidebar-item[href^="#"]');

sidebarLinks.forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', `#${targetId}`);
    }
  });
});

/* ============================= */
/*  Section toggle buttons       */
/* ============================= */
document.querySelectorAll('section').forEach(section => {
  const inner = section.querySelector('.section-inner');
  if (!inner) return;

  const btn = document.createElement('button');
  btn.textContent = 'Hide';
  btn.className = 'toggle-section-btn';
  btn.style.marginBottom = '12px';
  btn.style.float = 'right';

  btn.addEventListener('click', () => {
    const content = Array.from(inner.children).filter(
      el => el.tagName !== 'H2' && el !== btn
    );

    const hidden = btn.textContent === 'Show';
    content.forEach(el => el.style.display = hidden ? '' : 'none');
    btn.textContent = hidden ? 'Hide' : 'Show';
  });

  inner.insertBefore(btn, inner.children[1]);
});

/* ============================= */
/*  Survey open confirmation    */
/* ============================= */

const surveyButton = document.getElementById('open-survey');
if (surveyButton) {
  surveyButton.addEventListener('click', function (e) {
    e.preventDefault();
    const confirmed = globalThis.confirm(
      'You are about to leave this site and open an external survey. Continue?'
    );
    if (confirmed) {
      window.open('https://form.jotform.com/253486079480063', '_blank');
    }
  });
}

/* ============================= */
/*  Spotify Now Playing          */
/* ============================= */

async function updateSpotifyStatus() {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/gh/metrokitten/Metro-Nekoweb/data/now-playing.json"
    );
    const data = await res.json();
    const el = document.getElementById("spotify-status");
    if (!el) return;

    if (data.isPlaying) {
      // Make the song a clickable link
      el.innerHTML = `<a href="${data.spotifyUrl}" target="_blank">${data.song}</a> — ${data.artist}`;
    } else {
      el.textContent = "Not listening to anything";
    }
  } catch (err) {
    console.error("Spotify widget error:", err);
  }
}

await updateSpotifyStatus();
setInterval(updateSpotifyStatus, 15000);