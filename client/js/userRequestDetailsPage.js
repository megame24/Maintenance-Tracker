/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import { getId, displayErrOrsuccMessage } from './helpers/getIdAndQueryMessage.js';
 * import { handleRedirectError } from './helpers/handleError.js';
 * import handleRedirectSuccess from './helpers/handleSuccess.js';
 * import parseJwt from './helpers/parseJwt.js';
 */

let id,
  url;
  
const requestDetailParent = document.getElementsByClassName('request-detail-parent')[0];
const displayUsername = document.getElementById('display-username');
const errorMessage = document.getElementsByClassName('error-message')[0];
const successMessage = document.getElementsByClassName('success-message')[0];
const userDetails = parseJwt(token);

// fetch request header
const headers = new Headers();
headers.append('authorization', token);

/**
 * abstract status properties
 * @param {String} backgroundColor - visual indication of status
 * @param {String} message - written indication of status
 * @param {String} hideDeleteBtn - hide delete button
 * @param {String} hideUpdateBtn - hide update button
 */
const statusObj = (backgroundColor, message, hideDeleteBtn, hideUpdateBtn) => ({
  backgroundColor,
  message,
  hideDeleteBtn,
  hideUpdateBtn
});

/**
 * update page content based on status
 * @param {String} status -  request's status
 */
const statusDependents = (status) => {
  if (status === 'resolved') {
    return statusObj('background-success', 'Resolved', '', 'hide');
  }
  if (status === 'disapproved') {
    return statusObj('background-danger', 'Disapproved', '', 'hide');
  }
  if (status === 'approved') {
    return statusObj('background-primary', 'Work in Progress', 'hide', 'hide');
  }
  if (status === 'pending') {
    return statusObj('background-tertiary', 'Approval pending', '', '');
  }
};

/**
 * build out request details page
 * @param {Object} result - returned object from API call 
 */
const requestDetailsHTML = result =>
  `<a href="/view-requests.html" class="btn btn-primary-ghost">All requests</a>
  <div class="request-detail">
      <h2>${result.title}</h2>
      <p>${result.description}</p>
      <p><strong>Request date:</strong> ${new Date(Number(result.date)).toDateString()}</p>
      <div class="status ${statusDependents(result.status).backgroundColor}">${statusDependents(result.status).message}</div>
      <div class="request-type">${result.type}</div>
  </div>
  <hr />
  <h4>Feedback from an admin</h4>
  <div class="feedback">
      <p>${result.feedback}</p>
  </div>
  <a href="/edit-request.html?${result.id}" class="btn btn-tertiary ${statusDependents(result.status).hideUpdateBtn}">Edit&nbsp;
      <i class="icon ion-edit"></i>
  </a>
  <a href="#" id="delete" class="btn btn-danger ${statusDependents(result.status).hideDeleteBtn}">Delete&nbsp;
      <i class="icon ion-android-delete"></i>
  </a>`;

/**
 * get request's details from the API
 * @param {Object} request - fetch API request object 
 */
const getRequestDetails = request => 
  fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'view-requests.html');
      }
      requestDetailParent.innerHTML = requestDetailsHTML(result);
    });

/**
 * handle delete request
 * @param {Object} deleteBtn - html delete button element
 */
const deleteRequest = (deleteBtn) => {
  if (!deleteBtn) return;
  const delBtn = deleteBtn;
  const request = new Request(url, { method: 'DELETE', headers });
  delBtn.onclick = () => {
    fetch(request).then(res => res.json())
      .then((result) => {
        if (result.error) {
          return handleRedirectError(result.error.message, 'view-requests.html');
        }
        handleRedirectSuccess(result.success.message, 'view-requests.html?');
      });
  };
};

/**
 * call this on page load
 */
const init = () => {
  // retrieve id from query string
  id = getId();
  if (!id) return handleRedirectError('Request not found', 'view-requests.html');
  // display parsed error or success message from query string
  displayErrOrSuccMessage(successMessage, errorMessage);
  // do not persist encrypted error or success message query string after page load
  window.history.replaceState({}, '', `/user-request-details.html?${id}`);
  displayUsername.append(userDetails.username);
  url = `${baseUrl}/api/v1/users/requests/${id}`;
  const request = new Request(url, { method: 'GET', headers });
  getRequestDetails(request)
    .then(() => {
      const deleteBtn = document.getElementById('delete');
      deleteRequest(deleteBtn);
    });
};

window.onload = init();
