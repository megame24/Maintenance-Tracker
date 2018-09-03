/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import { displayError } from './helpers/handleError.js';
 * import handleRedirectSuccess from './helpers/handleSuccess.js';
 */

const signupForm = document.getElementById('signupForm');
const fullnameField = document.getElementById('name');
const usernameField = document.getElementById('username');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementsByClassName('error-message')[0];
const url = `${baseUrl}/api/v1/auth/signup`;

// fetch request header
const headers = new Headers();
headers.append('Content-Type', 'application/json');

const signupUser = (request) => {
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return displayError(errorMessage, result.error.message, submitBtn, 'Create Account');
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
 * handle sign up
 */
const signupController = () => {
  signupForm.onsubmit = (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.value = 'Creating Account ...';
    let formData = {
      fullname: fullnameField.value,
      username: usernameField.value,
      email: emailField.value,
      password: passwordField.value
    };
    formData = JSON.stringify(formData);
    const request = new Request(url, { method: 'POST', headers, body: formData });
    signupUser(request);
  };
};

/**
 * call this on page load
 */
const init = () => {
  signupController();
};

window.onload = init();
