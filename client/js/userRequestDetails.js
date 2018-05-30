let errorMessage,
  requestDetailParent,
  id,
  successMessage;

const getQueryParams = () => {
  if (window.location.search.substring(1)) {
    const params = window.location.search.substring(1).split('&');
    id = params[0];
    if (params[1]) {
      message = window.atob(params[1]);
      if (!isValidJson(message)) return;
      message = JSON.parse(message);
      if (message.success) displayMessage(message, successMessage);
      if (message.error) displayMessage(message, errorMessage);
    }
  } else handleRedirectError('Request not found', 'view-requests.html');
};

const statusObj = (backgroundColor, message, hideDeleteBtn, hideUpdateBtn) => ({
  backgroundColor,
  message,
  hideDeleteBtn,
  hideUpdateBtn
});

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
  <a href="#" class="btn btn-danger ${statusDependents(result.status).hideDeleteBtn}">Delete&nbsp;
      <i class="icon ion-android-delete"></i>
  </a>`;

const getRequestDetails = (request) => {
  fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'view-requests.html');
      }
      requestDetailParent.innerHTML = requestDetailsHTML(result);
    });
};

const init = () => {
  requestDetailParent = document.getElementsByClassName('request-detail-parent')[0];
  const displayUsername = document.getElementById('display-username');
  errorMessage = document.getElementsByClassName('error-message')[0];
  successMessage = document.getElementsByClassName('success-message')[0];
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  getQueryParams();
  const url = `${baseUrl}/api/v1/users/requests/${id}`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'GET', headers });
  getRequestDetails(request);
};

window.onload = init();
