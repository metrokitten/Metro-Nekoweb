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
  if (section.id === 'notfound' || section.id === 'thankyou') return;
  const inner = section.querySelector('.section-inner');
  if (!inner) return;

  // Find the heading
  const heading = inner.querySelector('h2');
  if (!heading) return;

  // Create a flex container for heading and button
  const headerDiv = document.createElement('div');
  headerDiv.className = 'section-header';

  // Move the heading into the headerDiv
  headerDiv.appendChild(heading);

  // Create the button
  const btn = document.createElement('button');
  btn.textContent = 'Hide';
  btn.className = 'toggle-section-btn';

  btn.addEventListener('click', () => {
    const content = Array.from(inner.children).filter(
      el => el !== headerDiv
    );
    const hidden = btn.textContent === 'Show';
    content.forEach(el => el.style.display = hidden ? '' : 'none');
    btn.textContent = hidden ? 'Hide' : 'Show';
  });

  headerDiv.appendChild(btn);

  // Insert the headerDiv at the top of section-inner
  inner.insertBefore(headerDiv, inner.firstChild);
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

let visualiserBars = 10;
let visualiserPhases = [];
let visualiserSpeeds = [];
let visualiserRAF;
let startTime = 0;

function showVisualiser() {
  const vis = document.getElementById("lastfm-visualiser");
  if (!vis) return;
  vis.innerHTML = "";
  visualiserPhases = [];
  visualiserSpeeds = [];
  for (let i = 0; i < visualiserBars; i++) {
    const bar = document.createElement("span");
    bar.className = "lastfm-bar";
    vis.appendChild(bar);
    visualiserPhases.push(Math.random() * Math.PI * 2);
    visualiserSpeeds.push(Math.random() * 4);
  }
  vis.style.display = "inline-flex";

  if (visualiserRAF) cancelAnimationFrame(visualiserRAF);
  startTime = performance.now();
  animateVisualiser(vis);
}

function animateVisualiser(vis) {
  const min = 4;
  const max = 30;
  const range = max - min;
  const t = (performance.now() - startTime) / 1000;
  const bars = vis.children;
  for (let i = 0; i < bars.length; i++) {
    const phase = visualiserPhases[i];
    const speed = visualiserSpeeds[i];
    const wave = Math.sin(t * speed + phase);
    const normalized = (wave + 1) / 2;
    const height = min + normalized * range;
    const scale = height / max;
    bars[i].style.transform = `scaleY(${scale})`;
  }
  visualiserRAF = requestAnimationFrame(() => animateVisualiser(vis));
}

showVisualiser();

function hideVisualiser() {
  const vis = document.getElementById("lastfm-visualiser");
  if (vis) vis.style.display = "none";
  if (visualiserInterval) {
    clearInterval(visualiserInterval);
    visualiserRAF = null;
  }
}

async function updateLastfmStatus() {
  try {
    const res = await fetch(LASTFM_URL);
    const data = await res.json();
    const track = data.recenttracks.track[0];
    const el = document.getElementById("lastfm-status");
    if (!el || !track) {
      hideVisualiser();
      return;
    }

    const isPlaying = track['@attr']?.nowplaying === "true";

    if (isPlaying) {
      el.innerHTML = `<a href="${track.url}" target="_blank" style="font-weight:bold;text-decoration:none;color:#ff4e50;">${track.name}</a> — ${track.artist['#text']}`;
      showVisualiser();
    } else {
      el.textContent = "Not listening to anything";
      hideVisualiser();
    }
  } catch (err) {
    console.error("Last.fm widget error:", err);
    hideVisualiser();
  }
}

// Initial call + interval (every 15 seconds)
await updateLastfmStatus();
setInterval(updateLastfmStatus, 15000);