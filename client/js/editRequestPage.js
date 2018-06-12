/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import { getId } from './helpers/getIdAndQueryMessage.js';
 * import { handleRedirectError } from './helpers/handleError.js';
 * import handleRedirectSuccess from './helpers/handleSuccess.js';
 * import parseJwt from './helpers/parseJwt.js';
 */

let url;

const updateForm = document.getElementById('update-form');
const titleField = document.getElementById('title');
const descriptionField = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementsByClassName('error-message')[0];
const displayUsername = document.getElementById('display-username');
const userDetails = parseJwt(token);

/**
 * get request details to populate text fields
 */
const getRequest = () => {
  url = `${baseUrl}/api/v1/users/requests/${id}`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'GET', headers });
  return fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'view-requests.html');
      }
      titleField.value = result.title;
      descriptionField.innerText = result.description;
      document.querySelector(`input[value=${result.type}]`).checked = true;
    });
};

/**
 * handle update request call to the API
 * @param {Object} req - fetch API request object
 */
const updateRequest = (req) => {
  fetch(req).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return displayError(result.error.message, 'Update Request');
      }
      handleRedirectSuccess(result.success.message, `user-request-details.html?${id}&`);
    });
};

/**
 * handle update request
 */
const updateRequestController = () => {
  updateForm.onsubmit = (event) => {
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
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', token);
    const request = new Request(url, { method: 'PUT', headers, body: formData });
    updateRequest(request);
  };
};

/**
 * call this on page load
 */
const init = () => {
  // retrieve id from query string
  id = getId();
  if (!id) return handleRedirectError('Request not found', 'view-requests.html');
  displayUsername.append(userDetails.username);
  getRequest()
    .then(() => {
      updateRequestController();
    });
};

window.onload = init();
