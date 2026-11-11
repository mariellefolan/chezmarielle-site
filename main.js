// Menu button (phone only): opens and closes the menu.
(function () {
  document.documentElement.classList.add('js');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    document.documentElement.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
})();

// Inquiry form: sends each submission to marielle@chezmarielle.com through Web3Forms.
(function () {
  var form = document.getElementById('inquiry');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');

  // "How did you hear about us?": Friend, An event, and Other each open a required follow-up field.
  var heard = document.getElementById('f-heard');
  var followUps = {
    'Friend': document.getElementById('field-referred'),
    'An event': document.getElementById('field-event'),
    'Other': document.getElementById('field-heard-other')
  };
  function showFollowUp() {
    Object.keys(followUps).forEach(function (choice) {
      var on = heard.value === choice;
      followUps[choice].hidden = !on;
      followUps[choice].querySelector('input').disabled = !on;
    });
  }
  heard.addEventListener('change', showFollowUp);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = Object.fromEntries(new FormData(form).entries());
    if (data.botcheck) return;
    delete data.botcheck;
    data.access_key = '2e7e68f5-13fb-44a7-ab45-3b33eaceabe3';
    data.subject = 'New inquiry from chezmarielle.com';
    data.from_name = 'Chez Marielle website';

    button.disabled = true;
    button.textContent = 'Sending...';
    status.textContent = '';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.success) {
          form.reset();
          showFollowUp();
          status.textContent = 'Thank you! Your inquiry has been sent.';
        } else {
          throw new Error('not sent');
        }
      })
      .catch(function () {
        status.textContent = 'Something went wrong. Please email hello@chezmarielle.com.';
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = 'Send';
      });
  });
})();
