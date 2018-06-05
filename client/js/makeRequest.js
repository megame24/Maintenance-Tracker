let titleField,
  descriptionField,
  submitBtn,
  makeRequestForm,
  errorMessage;

const url = `${baseUrl}/api/v1/users/requests`;
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', token);

const makeRequest = (request) => {
  fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        return displayError(result.error.message, 'Make Request');
      }
      const message = {
        success: true,
        message: result.success.message
      };
      let queryString = JSON.stringify(message);
      queryString = window.btoa(queryString);
      window.location = `${baseUrl}/view-requests.html?${queryString}`;
    });
};

const makeRequestController = () => {
  makeRequestForm.onsubmit = (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.value = 'Making Request...';
    const typeField = document.querySelector('input[name=type]:checked');
    let formData = {
      title: titleField.value,
      description: descriptionField.value,
      type: typeField.value
    };
    formData = JSON.stringify(formData);
    const request = new Request(url, { method: 'POST', headers, body: formData });
    makeRequest(request);
  };
};

const init = () => {
  makeRequestForm = document.getElementById('make-request-form');
  titleField = document.getElementById('title');
  descriptionField = document.getElementById('description');
  submitBtn = document.getElementById('submit-btn');
  errorMessage = document.getElementsByClassName('error-message')[0];
  displayUsername = document.getElementById('display-username');
  userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  makeRequestController();
};

window.onload = init();
