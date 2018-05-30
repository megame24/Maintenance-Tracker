let submitBtn,
  errorMessage,
  usernameField,
  passwordField,
  successMessage;
const url = `${baseUrl}/api/v1/auth/login`;

const loginUser = (request) => {
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return displayError(result.error.message);
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

const headers = new Headers();
headers.append('Content-Type', 'application/json');

const loginController = (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled');
  submitBtn.value = 'Logging in ...';
  let formData = { username: usernameField.value, password: passwordField.value };
  formData = JSON.stringify(formData);
  const request = new Request(url, { method: 'POST', headers, body: formData });
  loginUser(request);
};

const init = () => {
  const loginForm = document.getElementById('loginForm');
  usernameField = document.getElementById('username');
  passwordField = document.getElementById('password');
  submitBtn = document.getElementById('submit-btn');
  errorMessage = document.getElementsByClassName('error-message')[0];
  successMessage = document.getElementsByClassName('success-message')[0];
  getQueryMessage();
  loginForm.addEventListener('submit', loginController);
};

window.onload = init();
