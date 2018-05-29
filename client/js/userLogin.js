
const init = () => {
  const loginForm = document.getElementById('loginForm');
  const usernameField = document.getElementById('username');
  const passwordField = document.getElementById('password');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');

  if (window.location.search.substring(1)) {
    let message = window.atob(window.location.search.substring(1));
    message = JSON.parse(message);
    if (message.success) {
      successMessage.innerText = message.message;
      successMessage.classList.remove('hide');
      window.setTimeout(() => {
        successMessage.classList.add('hide');
      }, 5000);
    }
    if (message.error) {
      errorMessage.innerText = message.message;
      errorMessage.classList.remove('hide');
      window.setTimeout(() => {
        errorMessage.classList.add('hide');
      }, 5000);
    }
  }

  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/v1/auth/login`;

  loginForm.onsubmit = (event) => {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.value = 'Logging in ...';

    let formData = {
      username: usernameField.value,
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
          const { token } = result;
          window.localStorage.setItem('token', token);
          // perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
          const parseJwt = (tk) => {
            const base64Url = tk.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
          };

          const userDetails = parseJwt(token);
          if (userDetails.role === 'admin') {
            const message = {
              success: true,
              message: result.success.message
            };
            let queryString = JSON.stringify(message);
            queryString = window.btoa(queryString);
            window.location = `${baseUrl}/admin-dashboard.html?${queryString}`;
          }
          if (userDetails.role === 'user') {
            const message = {
              success: true,
              message: result.success.message
            };
            let queryString = JSON.stringify(message);
            queryString = window.btoa(queryString);
            window.location = `${baseUrl}/view-requests.html?${queryString}`;
          }
        }
      });
  };
};

window.onload = init();
