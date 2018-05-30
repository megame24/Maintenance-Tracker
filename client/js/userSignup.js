let submitBtn,
  errorMessage,
  passwordField,
  usernameField,
  emailField,
  fullnameField,
  signupForm;

const headers = new Headers();
headers.append('Content-Type', 'application/json');
const url = `${baseUrl}/api/v1/auth/signup`;

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
    fetch(request).then(res => res.json())
      .then((result) => {
        if (result.error) {
          return displayError(result.error.message);
        }
        handleRedirectSuccess(result.success.message, 'login.html?');
      });
  };
};

const init = () => {
  signupForm = document.getElementById('signupForm');
  fullnameField = document.getElementById('name');
  usernameField = document.getElementById('username');
  emailField = document.getElementById('email');
  passwordField = document.getElementById('password');
  submitBtn = document.getElementById('submit-btn');
  errorMessage = document.getElementsByClassName('error-message')[0];
  signupController();
};

window.onload = init();
