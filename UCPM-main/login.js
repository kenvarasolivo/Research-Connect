const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

// Registrierung
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = registerForm.querySelector('input[name="username"]').value.trim();
  const email = registerForm.querySelector('input[name="email"]').value.trim();
  const password = registerForm.querySelector('input[name="password"]').value;
  const passwordRepeat = registerForm.querySelector('input[name="passwordRepeat"]').value;

  if (!username || !email || !password || !passwordRepeat) {
    alert('Bitte alle Felder ausfüllen!');
    return;
  }

  if (password !== passwordRepeat) {
    alert('Passwörter stimmen nicht überein!');
    return;
  }

  // Nutzer speichern
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.find(u => u.email === email)) {
    alert('Diese E-Mail ist bereits registriert!');
    return;
  }
  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('username', username);
  window.location.href = 'Index.html';
});

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.querySelector('input[name="username"]').value.trim();
  const password = loginForm.querySelector('input[name="password"]').value;

  if (!email || !password) {
    alert('Bitte E-Mail und Passwort eingeben!');
    return;
  }

  // Nutzer prüfen
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert('Falsche E-Mail oder Passwort!');
    return;
  }

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('username', user.username);
  window.location.href = 'Index.html';
});

document.addEventListener('DOMContentLoaded', () => {
  // Normales Login - DIESEN BLOCK ENTFERNEN!
  // document.getElementById('login-form').addEventListener('submit', function(e) {
  //   e.preventDefault();
  //   const email = this.username.value;
  //   const password = this.password.value;
  //   // Hier echte Authentifizierung einbauen!
  //   if (email && password) {
  //     localStorage.setItem('isLoggedIn', 'true');
  //     localStorage.setItem('username', email.split('@')[0]);
  //     localStorage.setItem('role', 'user');
  //     window.location.href = 'Index.html';
  //   }
  // });

  // Mitarbeiter-Login
  document.getElementById('staff-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.staffEmail.value.trim();
    const password = this.staffPassword.value;
    // Nur registrierte Mitarbeiter dürfen sich anmelden
    const staffProfiles = JSON.parse(localStorage.getItem('staffProfiles') || '[]');
    const staff = staffProfiles.find(s => s.email === email && s.password === password);
    if (staff) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', staff.name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('role', 'staff');
      window.location.href = 'Index.html';
    } else {
      alert('Falsche Dienst-E-Mail oder Passwort, oder Sie sind nicht registriert.');
    }
  });

  // Mitarbeiter-Registrierung
  const staffRegisterForm = document.getElementById('staff-register-form');
  if (staffRegisterForm) {
    staffRegisterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = this.staffName.value.trim();
      const email = this.staffEmail.value.trim();
      const password = this.staffPassword.value;
      const passwordRepeat = this.staffPasswordRepeat.value;
      // Optional: const staffID = this.staffID.value;

      if (!name || !email || !password || !passwordRepeat) {
        alert('Bitte alle Felder ausfüllen!');
        return;
      }
      if (!email.endsWith('@fh-aachen.de')) {
        alert('Bitte geben Sie eine gültige Dienst-E-Mail der FH Aachen ein.');
        return;
      }
      if (password !== passwordRepeat) {
        alert('Passwörter stimmen nicht überein!');
        return;
      }
      if (!this['staff-privacy'].checked || !this['staff-consent'].checked) {
        alert('Bitte stimmen Sie den Datenschutzbedingungen zu.');
        return;
      }

      // Prüfen, ob E-Mail schon registriert ist
      const staffProfiles = JSON.parse(localStorage.getItem('staffProfiles') || '[]');
      if (staffProfiles.find(s => s.email === email)) {
        alert('Diese Dienst-E-Mail ist bereits registriert!');
        return;
      }

      // Mitarbeiterdaten speichern (inkl. Passwort)
      staffProfiles.push({
        name: name,
        email: email,
        password: password,
        fachbereich: '',
        projekt: '',
        expertise: [],
        bild: 'images/default_staff.png'
      });
      localStorage.setItem('staffProfiles', JSON.stringify(staffProfiles));

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('role', 'staff');
      window.location.href = 'Index.html';
    });
  }
});
