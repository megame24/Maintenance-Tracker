
const init = () => {
  const loginForm = document.getElementById('loginForm');
  const usernameField = document.getElementById('username');
  const passwordField = document.getElementById('password');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementsByClassName('error-message')[0];
  const successMessage = document.getElementsByClassName('success-message')[0];

  const displayMessage = (message, successOrerrorMessge) => {
    const successOrerror = successOrerrorMessge;
    successOrerror.innerText = message.message;
    successOrerror.classList.remove('hide');
    window.setTimeout(() => {
      successOrerror.classList.add('hide');
    }, 5000);
  };

  const successRedirect = (baseUrl, subUrl, result) => {
    const message = {
      success: true,
      message: result.success.message
    };
    let queryString = JSON.stringify(message);
    queryString = window.btoa(queryString);
    window.location = `${baseUrl}/${subUrl}?${queryString}`;
  };

  const isValidJson = (string) => {
    try {
      JSON.parse(string);
    } catch (err) {
      return false;
    }
    return true;
  };

  if (window.location.search.substring(1)) {
    let message = window.atob(window.location.search.substring(1));
    if (isValidJson(message)) {
      message = JSON.parse(message);
    }
    if (message.success) {
      displayMessage(message, successMessage);
    }
    if (message.error) {
      displayMessage(message, errorMessage);
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
          const parseJwt = (jwToken) => {
            const base64Url = jwToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
          };

          const userDetails = parseJwt(token);
          if (userDetails.role === 'admin') {
            successRedirect(baseUrl, 'admin-dashboard.html', result);
          }
          if (userDetails.role === 'user') {
            successRedirect(baseUrl, 'view-requests.html', result);
          }
        }
      });
  };
};

window.onload = init();
