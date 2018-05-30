let errorMessage,
  requestDetailParent,
  id,
  feedbackField,
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
  } else handleRedirectError('Request not found', 'admin-dashboard.html');
};

const statusObject = (backgroundColor, message) => ({
  backgroundColor,
  message
});

const statusDependents = (status) => {
  if (status === 'resolved') {
    const statusObj = statusObject('background-success', 'Resolved');
    statusObj.appendHtml = '&nbsp;';
    return statusObj;
  }
  if (status === 'disapproved') {
    const statusObj = statusObject('background-danger', 'Disapproved');
    statusObj.appendHtml = '&nbsp;';
    return statusObj;
  }
  if (status === 'approved') {
    const statusObj = statusObject('background-primary', 'Work in Progress');
    statusObj.appendHtml = `<hr /><form">
        <label for="feedback">Provide feedback</label>
        <textarea name="feedback" class="form-input" autofocus></textarea>
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

const getRequestDetails = request => 
  fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'admin-dashboard.html');
      }
      requestDetailParent.innerHTML = requestDetailsHTML(result);
    });

const approveRequest = () => {
  approveBtn.onclick = () => {
    const url = `${baseUrl}/api/v1/requests/${id}/approve`;
    const headers = new Headers();
    headers.append('authorization', token);
    headers.append('Content-Type', 'application/json');
    let data = { status: 'approve', feedback: feedbackField.value };
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
};

const init = () => {
  requestDetailParent = document.getElementsByClassName('request-detail-parent')[0];
  const displayUsername = document.getElementById('display-username');
  errorMessage = document.getElementsByClassName('error-message')[0];
  successMessage = document.getElementsByClassName('success-message')[0];
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  getQueryParams();
  window.history.replaceState({}, '', `/admin-request-details.html?${id}`);
  const url = `${baseUrl}/api/v1/requests/${id}`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'GET', headers });
  getRequestDetails(request)
    .then(() => {
      approveBtn = document.getElementById('approve');
      disapproveBtn = document.getElementById('disapprove');
      resolveBtn = document.getElementById('resolve');
      feedbackField = document.getElementById('feedback');
      approveRequest();
    });
};

window.onload = init();
