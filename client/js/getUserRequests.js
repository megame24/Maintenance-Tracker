let errorMessage,
  successMessage,
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
  fetch(request)
    .then(res => res.json())
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
