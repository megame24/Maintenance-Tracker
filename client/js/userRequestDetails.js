
const init = () => {
  const requestDetailParent = document.getElementsByClassName('request-detail-parent')[0];
  const displayUsername = document.getElementById('display-username');
  const errorMessage = document.getElementsByClassName('error-message')[0];
  const successMessage = document.getElementsByClassName('success-message')[0];

  const baseUrl = window.location.origin;
  const token = window.localStorage.getItem('token');
  const displayMessage = (message, successOrerrorMessge) => {
    const successOrerror = successOrerrorMessge;
    successOrerror.innerText = message.message;
    successOrerror.classList.remove('hide');
    window.setTimeout(() => {
      successOrerror.classList.add('hide');
    }, 5000);
  };
  const isValidJson = (string) => {
    try {
      JSON.parse(string);
    } catch (err) {
      return false;
    }
    return true;
  };
  let id;
  if (window.location.search.substring(1)) {
    const params = window.location.search.substring(1).split('&');
    id = params[0];
    let message;
    if (params[1]) {
      message = window.atob(params[1]);
      if (isValidJson(message)) {
        message = JSON.parse(message);
      }
      if (message.success) {
        displayMessage(message, successMessage);
      }
      if (message.error) {
        displayMessage(message, errorMessage);
      }
    }
  } else {
    const message = {
      error: true,
      message: 'Request not found'
    };
    let queryString = JSON.stringify(message);
    queryString = window.btoa(queryString);
    window.location = `${baseUrl}/view-requests.html?${queryString}`;
    return;
  }
  const url = `${baseUrl}/api/v1/users/requests/${id}`;

  // perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
  const parseJwt = (jwToken) => {
    const base64Url = jwToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };

  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, {
    method: 'GET',
    headers
  });
  const statusDependents = (status) => {
    if (status === 'resolved') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-success';
      statusObj.message = 'Resolved';
      statusObj.hideDeleteBtn = '';
      statusObj.hideUpdateBtn = 'hide';
      return statusObj;
    }
    if (status === 'disapproved') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-danger';
      statusObj.message = 'Disapproved';
      statusObj.hideDeleteBtn = '';
      statusObj.hideUpdateBtn = 'hide';
      return statusObj;
    }
    if (status === 'approved') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-primary';
      statusObj.message = 'Work in Progress';
      statusObj.hideDeleteBtn = 'hide';
      statusObj.hideUpdateBtn = 'hide';
      return statusObj;
    }
    if (status === 'pending') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-tertiary';
      statusObj.message = 'Approval pending';
      statusObj.hideDeleteBtn = '';
      statusObj.hideUpdateBtn = '';
      return statusObj;
    }
  };
  fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        const message = {
          error: true,
          message: result.error.message
        };
        let queryString = JSON.stringify(message);
        queryString = window.btoa(queryString);
        window.location = `${baseUrl}/view-requests.html?${queryString}`;
        return;
      }
      const userDetails = parseJwt(token);
      displayUsername.append(userDetails.username);
      requestDetailParent.innerHTML = `
        <a href="/view-requests.html" class="btn btn-primary-ghost">All requests</a>
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
    });
};

window.onload = init();
