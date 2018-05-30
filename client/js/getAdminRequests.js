let errorMessage,
  successMessage,
  resolveBtn,
  approveBtn,
  disapproveBtn,
  tableBody;

const createNode = elem => document.createElement(elem);

const approveAndDisapproveColumn = (status, elem) => {
  if (status === 'pending') {
    return `
    <td>
        <a href="#" data-id="${elem.id}" class="approve btn btn-small btn-primary">Approve</a>&nbsp;&nbsp;&nbsp;
        <a href="#" data-id="${elem.id}" class="disapprove btn btn-small btn-danger">Disapprove</a>
    </td>`;
  }
  if (status === 'approved' || status === 'resolved') {
    return '<td class="background-primary">Approved</td>';
  }
  if (status === 'disapproved') {
    return '<td class="background-danger">Disapproved</td>';
  }
};

const resolvedColumn = (status, elem) => {
  if (status === 'pending') {
    return '<td class="background-tertiary"></td>';
  }
  if (status === 'approved') {
    return `
    <td>
      <a href="#" data-id="${elem.id}" class="resolve btn btn-small btn-success">Resolve</a>
    </td>`;
  }
  if (status === 'disapproved') {
    return '<td class="background-danger"></td>';
  }
  if (status === 'resolved') {
    return '<td class="background-success">Resolved</td>';
  }
};

const populateTableWithRequests = (result) => {
  result.forEach((elem) => {
    const row = createNode('tr');
    row.innerHTML = 
    `<td class="dark-blue table-link">
        <a href="/admin-request-details.html?${elem.id}">${elem.title}</a>
    </td>
    <td class="table-not-mobile">${elem.type}</td>
    ${approveAndDisapproveColumn(elem.status, elem)}
    ${resolvedColumn(elem.status, elem)}`;
    tableBody.appendChild(row);
  });
};


const getAllRequests = () => {
  const url = `${baseUrl}/api/v1/requests`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'GET', headers });
  return fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'login.html');
      }
      populateTableWithRequests(result);
    });
};

const approveRequest = (event) => {
  const url = `${baseUrl}/api/v1/requests/${event.target.getAttribute('data-id')}/approve`;
  const headers = new Headers();
  headers.append('authorization', token);
  headers.append('Content-Type', 'application/json');
  let data = { status: 'approve' };
  data = JSON.stringify(data);
  const request = new Request(url, { method: 'PUT', headers, body: data });
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.error) {
        return handleRedirectError(result.error.message, 'admin-dashboard.html');
      }
      handleRedirectSuccess(result.success.message, 'admin-dashboard.html?');
    });
  event.target.removeEventListener('click', approveRequest);
};

const adminDuties = () => {
  for (let i = 0; i < approveBtn.length; i += 1) {
    approveBtn[i].addEventListener('click', approveRequest);
  }
};

const init = () => {
  tableBody = document.getElementById('table-body');
  const displayUsername = document.getElementById('display-username');
  errorMessage = document.getElementsByClassName('error-message')[0];
  successMessage = document.getElementsByClassName('success-message')[0];
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  getQueryMessage();
  window.history.replaceState({}, '', '/admin-dashboard.html');
  getAllRequests()
    .then(() => {
      approveBtn = document.getElementsByClassName('approve');
      disapproveBtn = document.getElementsByClassName('disapprove');
      resolveBtn = document.getElementsByClassName('resolve');
      adminDuties();
    });
};

window.onload = init();
