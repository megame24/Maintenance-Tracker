/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import { displayError } from './helpers/handleError.js';
 * import handleRedirectSuccess from './helpers/handleSuccess.js';
 * import parseJwt from './helpers/parseJwt.js';
 */

const makeRequestForm = document.getElementById('make-request-form');
const titleField = document.getElementById('title');
const descriptionField = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementsByClassName('error-message')[0];
const displayUsername = document.getElementById('display-username');
const userDetails = parseJwt(token);

/**
 * create a request by making API call
 * @param {Object} request - fetch API request object 
 */
const makeRequest = (request) => {
  fetch(request)
    .then(res => res.json())
    .then((result) => {
      console.log(result);
      if (result.error) {
        return displayError(submitBtn, errorMessage, result.error.message, 'Make Request');
      }
      handleRedirectSuccess(result.success.message, 'view-requests.html?');
    });
};

/**
 * handle create request
 */
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
    const url = `${baseUrl}/api/v1/users/requests`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', token);
    const request = new Request(url, { method: 'POST', headers, body: formData });
    makeRequest(request);
  };
};

/**
 * call this on page load
 */
const init = () => {
  displayUsername.append(userDetails.username);
  makeRequestController();
};

window.onload = init();
