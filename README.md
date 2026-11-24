# END-SEM

Login / Register / Logout frontend project built with HTML, CSS, and JavaScript.

How to run:
  1. Install Node.js/npm.
  2. In this folder, run: npm.cmd install
  3. Run: npm.cmd start
  4. Open: http://localhost:4173

Alternatively, because this is a static HTML/CSS/JavaScript project,
you can still open index.html directly in a browser.

Structure:
  index.html      Login page (start here)
  register.html   Registration page
  home.html       Page shown after login (has the Logout button)
  css/style.css   Styling
  js/auth.js      Register, login, logout logic (uses localStorage)

Flow:
  Register -> Login -> Home -> Logout -> back to Login page
