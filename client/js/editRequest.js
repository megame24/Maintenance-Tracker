let updateForm,
  submitBtn,
  headers,
  request,
  titleField,
  descriptionField,
  errorMessage,
  id,
  url;

const handleRedirectSuccess = (succMessage, subUrl) => {
  const message = { success: true, message: succMessage };
  let queryString = JSON.stringify(message);
  queryString = window.btoa(queryString);
  window.location = `${baseUrl}/${subUrl}?${id}&${queryString}`;
};

const handleUpdateRequestError = (errMessage) => {
  submitBtn.disabled = false;
  submitBtn.classList.remove('disabled');
  submitBtn.value = 'Update Request';
  errorMessage.innerText = errMessage;
  errorMessage.classList.remove('hide');
};

const getIdFromQueryString = () => {
  let gottenId;
  if (window.location.search.substring(1)) {
    gottenId = window.location.search.substring(1);
    return gottenId;
  }
  handleRedirectError('Request not found', 'view-requests.html');
  return false;
};

const submintForm = (event) => {
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
        handleUpdateRequestError(result.error.message);
        return;
      }
      handleRedirectSuccess(result.success.message, 'user-request-details.html');
    });
};

const init = () => {
  const displayUsername = document.getElementById('display-username');
  titleField = document.getElementById('title');
  descriptionField = document.getElementById('description');
  submitBtn = document.getElementById('submit-btn');
  updateForm = document.getElementById('update-form');
  errorMessage = document.getElementsByClassName('error-message')[0];
  if (!getIdFromQueryString) return;
  id = getIdFromQueryString();
  url = `${baseUrl}/api/v1/users/requests/${id}`;
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
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

  updateForm.addEventListener('submit', submintForm);
};

window.onload = init();
