async function connectFormspree(formEl, successEl, formId) {
  const globalErr = formEl.querySelector('[data-fs-error]');
  const btn = formEl.querySelector('[type="submit"]');

  formEl.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (globalErr) globalErr.textContent = '';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/' + formId, {
        method: 'POST',
        body: new FormData(formEl),
        headers: { Accept: 'application/json' }
      });
      const json = await res.json();

      if (res.ok) {
        formEl.style.display = 'none';
        successEl.removeAttribute('hidden');
      } else {
        const msg = (json.errors || []).map(function (e) { return e.message; }).join(' ')
                    || 'Something went wrong — please try again.';
        if (globalErr) globalErr.textContent = msg;
        btn.disabled = false;
      }
    } catch (_) {
      if (globalErr) globalErr.textContent = 'Network error — please try again.';
      btn.disabled = false;
    }
  });
}

function initCyclingText() {
  const fields = ['Materials Science', 'Aerospace', 'Physics Simulation', 'Product Design', 'Engineering'];
  let idx = 0;
  const el = document.getElementById('cycling-field');

  // Lock the span width to the widest field to prevent layout shift.
  const probe = el.cloneNode(false);
  probe.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap;transition:none';
  document.body.appendChild(probe);
  let max = 0;
  fields.forEach(f => { probe.textContent = f; max = Math.max(max, probe.offsetWidth); });
  probe.remove();
  el.style.minWidth = max * 1.05 + 'px';

  setInterval(() => {
    el.classList.add('fade-out');
    setTimeout(() => {
      idx = (idx + 1) % fields.length;
      el.textContent = fields[idx];
      el.classList.replace('fade-out', 'pre-enter');
      el.getBoundingClientRect(); // force reflow
      el.classList.remove('pre-enter');
    }, 350);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', function () {
  initCyclingText();

  connectFormspree(
    document.getElementById('early-access-form'),
    document.getElementById('early-access-success'),
    'xkoaebyy'
  );
  connectFormspree(
    document.getElementById('contact-form'),
    document.getElementById('contact-success'),
    'xrevdklz'
  );
});
