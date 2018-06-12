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
  feedbackField;

const errorMessage = document.getElementsByClassName('error-message')[0];
const successMessage = document.getElementsByClassName('success-message')[0];
const requestDetailParent = document.getElementsByClassName('request-detail-parent')[0];
const displayUsername = document.getElementById('display-username');
const userDetails = parseJwt(token);

/**
 * abstract status properties
 * @param {String} backgroundColor - visual indicator of status
 * @param {String} message - written indicator of status
 */
const statusObject = (backgroundColor, message) => ({ backgroundColor, message });

/**
 * update page content based on status
 * @param {String} status -  request's status
 */
const statusDependents = (status) => {
  if (status === 'resolved') {
    const statusObj = statusObject('background-success', 'Resolved');
    statusObj.appendHtml = `<a href="#" id="trash" class="btn btn-danger">Trash&nbsp;
        <i class="icon ion-android-delete"></i>
    </a>`;
    return statusObj;
  }
  if (status === 'disapproved') {
    const statusObj = statusObject('background-danger', 'Disapproved');
    statusObj.appendHtml = `<a href="#" id="trash" class="btn btn-danger">Trash&nbsp;
        <i class="icon ion-android-delete"></i>
    </a>`;
    return statusObj;
  }
  if (status === 'approved') {
    const statusObj = statusObject('background-primary', 'Work in Progress');
    statusObj.appendHtml = `<hr /><form">
        <label for="feedback">Provide feedback</label>
        <textarea name="feedback" id="feedback" class="form-input" autofocus></textarea>
        <input type="submit" id="resolve" class="btn btn-success form-input" value="Resolve"/>
    </form>`;
    return statusObj;
  }
  if (status === 'pending') {
    const statusObj = statusObject('background-tertiary', 'Approval pending');
    statusObj.appendHtml = `<hr /><form">
        <label for="feedback">Provide feedback</label>
        <textarea name="feedback" id="feedback" class="form-input" autofocus></textarea>
        <input type="submit" id="approve" class="btn btn-primary form-input" value="Approve"/>
        <input type="submit" id="disapprove" class="btn btn-danger form-input" value="Disapprove"/>
    </form>`;
    return statusObj;
  }
};

/**
 * build out request details page
 * @param {Object} result - returned object from API call
 */
const requestDetailsHTML = result =>
  `<div class="request-detail">
      <h2>${result.title}</h2>
      <p>${result.description}</p>
      <p><strong>Requested by:</strong> ${result.owner}</p>
      <p><strong>Request date:</strong> ${new Date(Number(result.date)).toDateString()}</p>
      <div class="status ${statusDependents(result.status).backgroundColor}">${statusDependents(result.status).message}</div>
      <div class="request-type">${result.type}</div>
  </div>
  ${statusDependents(result.status).appendHtml}`;

/**
 * get request details from the API
 * @param {Object} request - fetch API request object 
 */
const getRequestDetails = request => 
  fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'admin-dashboard.html');
      }
      requestDetailParent.innerHTML = requestDetailsHTML(result);
    });

/**
 * handle trash request functionality
 */
const trashRequest = () => {
  const url = `${baseUrl}/api/v1/requests/${id}`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'DELETE', headers });
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'admin-dashboard.html');
      }
      handleRedirectSuccess(result.success.message, 'admin-dashboard.html?');
    });
};

/**
 * add event handler to trash button
 */
const trashEventHandler = () => {
  if (trashBtn) {
    trashBtn.onclick = () => {
      trashRequest();
    };
  }
};

/**
 * handle admin roles(approve, disapprove and resolve)
 * @param {String} status - request's status 
 */
const updateStatus = (status) => {
  const url = `${baseUrl}/api/v1/requests/${id}/${status}`;
  const headers = new Headers();
  headers.append('authorization', token);
  headers.append('Content-Type', 'application/json');
  let data = { status, feedback: feedbackField.value };
  data = JSON.stringify(data);
  const request = new Request(url, { method: 'PUT', headers, body: data });
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'admin-dashboard.html');
      }
      handleRedirectSuccess(result.success.message, 'admin-dashboard.html?');
    });
};

/**
 * add event listener to approve request button
 */
const approveRequestEventHandler = () => {
  if (approveBtn) {
    approveBtn.onclick = () => {
      updateStatus('approve');
    };
  }
};

/**
 * add event listener to disapprove request button
 */
const disapproveRequestEventHandler = () => {
  if (disapproveBtn) {
    disapproveBtn.onclick = () => {
      updateStatus('disapprove');
    };
  }
};

/**
 * add event listener to resolve request button
 */
const resolveRequestEventHandler = () => {
  if (resolveBtn) {
    resolveBtn.onclick = () => {
      updateStatus('resolve');
    };
  }
};

/**
 * call this on page load
 */
const init = () => {
  id = getId();
  if (!id) return handleRedirectError('Request not found', 'admin-dashboard.html');
  displayErrOrSuccMessage(successMessage, errorMessage);
  // do not persist encrypted error or success message query string after page load
  window.history.replaceState({}, '', `/admin-request-details.html?${id}`);
  displayUsername.append(userDetails.username);
  const url = `${baseUrl}/api/v1/requests/${id}`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'GET', headers });
  getRequestDetails(request)
    .then(() => {
      approveBtn = document.getElementById('approve');
      disapproveBtn = document.getElementById('disapprove');
      resolveBtn = document.getElementById('resolve');
      trashBtn = document.getElementById('trash');
      feedbackField = document.getElementById('feedback');
      approveRequestEventHandler();
      disapproveRequestEventHandler();
      resolveRequestEventHandler();
      trashEventHandler();
    });
};

window.onload = init();
