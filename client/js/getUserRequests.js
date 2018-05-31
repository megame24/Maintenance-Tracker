let errorMessage,
  successMessage,
  noRequestDiv,
  tableBody;
const url = `${baseUrl}/api/v1/users/requests`;

const createNode = elem => document.createElement(elem);

const statusObj = (backgroundColor, message) => ({ backgroundColor, message });

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

const populateTableWithRequests = (result) => {
  if (result.length === 0) {
    noRequestDiv.classList.add('no-requests');
    noRequestDiv.innerHTML = '<i class="ion-plus-circled icon"></i><br /><br /><p>You have no requests at the moment, <a href="/make-request.html" class="btn btn-primary btn-small">click here</a> to make a request</p>';
  }
  result.forEach((elem) => {
    const row = createNode('tr');
    row.innerHTML = `<td class="dark-blue table-link"><a href="/user-request-details.html?${elem.id}">${elem.title}</a></td><td>${elem.type}</td><td class=${statusDependents(elem.status).backgroundColor}>${statusDependents(elem.status).message}</td>`;
    tableBody.appendChild(row);
  });
};

const headers = new Headers();
headers.append('authorization', token);
const request = new Request(url, { method: 'GET', headers });

const getUserRequests = () => {
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        handleRedirectError(result.error.message, 'login.html');
        return;
      }
      populateTableWithRequests(result);
    });
};

const init = () => {
  tableBody = document.getElementById('table-body');
  noRequestDiv = document.getElementById('no-requests');
  const displayUsername = document.getElementById('display-username');
  errorMessage = document.getElementsByClassName('error-message')[0];
  successMessage = document.getElementsByClassName('success-message')[0];
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  getQueryMessage();
  window.history.replaceState({}, '', '/view-requests.html');
  getUserRequests();
};

window.onload = init();
