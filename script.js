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
/*  Last.fm Now Playing Widget   */
/* ============================= */

const LASTFM_USERNAME = "metr_";
const LASTFM_API_KEY = "1a1bcab18af9b9c038fbd5f9cbed8a90";
const LASTFM_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

async function updateLastfmStatus() {
  try {
    const res = await fetch(LASTFM_URL);
    const data = await res.json();
    const track = data.recenttracks.track[0];
    const el = document.getElementById("lastfm-status");
    if (!el || !track) return;

    const isPlaying = track['@attr']?.nowplaying === "true";

    if (isPlaying) {
      el.innerHTML = `<a href="${track.url}" target="_blank" style="font-weight:bold;text-decoration:none;color:#ff4e50;">${track.name}</a> — ${track.artist['#text']}`;
    } else {
      el.textContent = "Not listening to anything";
    }
  } catch (err) {
    console.error("Last.fm widget error:", err);
  }
}

// Initial call + interval (every 15 seconds)
await updateLastfmStatus();
setInterval(updateLastfmStatus, 15000);