/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import { handleRedirectError } from './helpers/handleError.js';
 * import parseJwt from './helpers/parseJwt.js';
 */

const tableBody = document.getElementById('table-body');
const noRequestDiv = document.getElementById('no-requests');
const displayUsername = document.getElementById('display-username');
const errorMessage = document.getElementsByClassName('error-message')[0];
const successMessage = document.getElementsByClassName('success-message')[0];
const userDetails = parseJwt(token);
const url = `${baseUrl}/api/v1/users/requests`;

/**
 * create html node
 * @param {String} elem - html element string
 */
const createNode = elem => document.createElement(elem);

/**
 * abstract status properties
 * @param {String} backgroundColor - visual indicator of status
 * @param {String} message - written indicator of status
 */
const statusObj = (backgroundColor, message) => ({ backgroundColor, message });

/**
 * update page content based on status
 * @param {String} status -  request's status
 */
const statusDependents = (status) => {
  if (status === 'resolved') {
    return statusObj('background-success', 'Resolved');
  }
  if (status === 'disapproved') {
    return statusObj('background-danger', 'Disapproved');
  }
  if (status === 'approved') {
    return statusObj('background-primary', 'Work in Progress');
  }
  if (status === 'pending') {
    return statusObj('background-tertiary', 'Approval pending');
  }
};

/**
 * populate html table with requests
 * @param {Object} result - returned object from API call
 */
const populateTableWithRequests = (result) => {
  if (result.length === 0) {
    noRequestDiv.classList.add('no-requests');
    noRequestDiv.innerHTML = '<i class="ion-plus-circled icon"></i><br /><br /><p>You have no requests at the moment, <a href="/make-request.html" class="btn btn-primary btn-small">click here</a> to make a request</p>';
    return;
  }
  result.forEach((elem) => {
    const row = createNode('tr');
    row.innerHTML = `<td class="dark-blue table-link"><a href="/user-request-details.html?${elem.id}">${elem.title}</a></td><td>${elem.type}</td><td class=${statusDependents(elem.status).backgroundColor}>${statusDependents(elem.status).message}</td>`;
    tableBody.appendChild(row);
  });
};

/**
 * get user requests from API
 */
const getUserRequests = () => {
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'GET', headers });
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        handleRedirectError(result.error.message, 'login.html');
        return;
      }
      populateTableWithRequests(result);
    });
};

/**
 * call this on page load
 */
const init = () => {
  displayUsername.append(userDetails.username);
  getQueryMessage();
  // do not persist encrypted error or success message query string after page load
  window.history.replaceState({}, '', '/view-requests.html');
  getUserRequests();
};

window.onload = init();
