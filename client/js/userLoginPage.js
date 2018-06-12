/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import { displayError } from './helpers/handleError.js';
 * import handleRedirectSuccess from './helpers/handleSuccess.js';
 * import parseJwt from './helpers/parseJwt.js';
 */

const loginForm = document.getElementById('loginForm');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementsByClassName('error-message')[0];
const successMessage = document.getElementsByClassName('success-message')[0];
const url = `${baseUrl}/api/v1/auth/login`;

/**
 * login user by making call to the API
 * @param {Object} request - fetch API request object 
 */
const loginUser = (request) => {
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return displayError(submitBtn, errorMessage, result.error.message, 'Login');
      }
      const { token } = result;
      window.localStorage.setItem('token', token);
      const userDetails = parseJwt(token);
      if (userDetails.role === 'admin') {
        handleRedirectSuccess(result.success.message, 'admin-dashboard.html?');
      }
      if (userDetails.role === 'user') {
        handleRedirectSuccess(result.success.message, 'view-requests.html?');
      }
    });
};

/**
 * handle user login
 */
const loginController = () => {
  loginForm.onsubmit = (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.value = 'Logging in...';
    let formData = { username: usernameField.value, password: passwordField.value };
    formData = JSON.stringify(formData);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const request = new Request(url, { method: 'POST', headers, body: formData });
    loginUser(request);
  };
};

/**
 * call this on page load
 */
const init = () => {
  getQueryMessage();
  // do not persist encrypted error or success message query string after page load
  window.history.replaceState({}, '', '/login.html');
  loginController();
};

window.onload = init();
