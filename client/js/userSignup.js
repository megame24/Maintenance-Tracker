
const init = () => {
  const signupForm = document.getElementById('signupForm');
  const fullnameField = document.getElementById('name');
  const usernameField = document.getElementById('username');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementsByClassName('error-message')[0];

  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/v1/auth/signup`;

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

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const request = new Request(url, {
      method: 'POST',
      headers,
      body: formData
    });
    fetch(request)
      .then(res => res.json())
      .then((result) => {
        if (result.error) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled');
          submitBtn.value = 'Create Account';
          errorMessage.innerText = result.error.message;
          errorMessage.classList.remove('hide');
        } else {
          const message = {
            success: true,
            message: result.success.message
          };
          let queryString = JSON.stringify(message);
          queryString = window.btoa(queryString);
          window.location = `${baseUrl}/login.html?${queryString}`;
        }
      });
  };
};

window.onload = init();
