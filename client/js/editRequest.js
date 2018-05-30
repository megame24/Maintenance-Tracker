/* eslint-disable no-unused-vars */
let updateForm,
  submitBtn,
  headers,
  request,
  titleField,
  descriptionField,
  errorMessage;

const getIdFromQueryString = () => {
  let gottenId;
  if (window.location.search.substring(1)) {
    gottenId = window.location.search.substring(1);
    return gottenId;
  }
  handleRedirectError('Request not found', 'view-requests.html');
  return false;
};

id = getIdFromQueryString();
const url = `${baseUrl}/api/v1/users/requests/${id}`;

const getRequest = () => {
  headers = new Headers();
  headers.append('authorization', token);
  request = new Request(url, { method: 'GET', headers });
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        handleRedirectError(result.error.message, 'view-requests.html');
        return;
      }
      titleField.value = result.title;
      descriptionField.innerText = result.description;
      document.querySelector(`input[value=${result.type}]`).checked = true;
    });
};

const updateRequest = (event) => {
  const typeField = document.querySelector('input[name=type]:checked');
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled');
  submitBtn.value = 'Updating Request...';
  let formData = {
    title: titleField.value,
    description: descriptionField.value,
    type: typeField.value
  };
  formData = JSON.stringify(formData);
  headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', token);
  request = new Request(url, { method: 'PUT', headers, body: formData });
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        displayError(result.error.message);
        return;
      }
      handleRedirectSuccess(result.success.message, `user-request-details.html?${id}&`);
    });
};

const init = () => {
  const displayUsername = document.getElementById('display-username');
  titleField = document.getElementById('title');
  descriptionField = document.getElementById('description');
  submitBtn = document.getElementById('submit-btn');
  updateForm = document.getElementById('update-form');
  errorMessage = document.getElementsByClassName('error-message')[0];
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  getRequest();
  updateForm.addEventListener('submit', updateRequest);
};

window.onload = init();
