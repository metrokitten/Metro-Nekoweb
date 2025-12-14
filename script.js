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
function openSurveyWithConfirm(e) {
  e.preventDefault();
  if (confirm('You are about to open the Metro Survey in a new tab. Continue?')) {
    window.open('survey.html', '_blank');
  }
}

const surveyLink = document.getElementById('survey-link');
const surveyButton = document.getElementById('open-survey');

if (surveyLink) surveyLink.addEventListener('click', openSurveyWithConfirm);
if (surveyButton) surveyButton.addEventListener('click', openSurveyWithConfirm);

/* ============================= */
/*  Survey page hook (safe)      */
/* ============================= */
if (document.getElementById('metro-survey')) {
  // TODO: Survey-specific logic goes here later
}