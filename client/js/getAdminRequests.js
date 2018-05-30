let errorMessage,
  successMessage,
  tableBody;

const createNode = elem => document.createElement(elem);

const approveAndDisapproveColumn = (status) => {
  if (status === 'pending') {
    return `
    <td>
        <a href="#" class="btn btn-small btn-primary">Approve</a>&nbsp;&nbsp;&nbsp;
        <a href="#" class="btn btn-small btn-danger">Disapprove</a>
    </td>`;
  }
  if (status === 'approved' || status === 'resolved') {
    return '<td class="background-primary">Approved</td>';
  }
  if (status === 'disapproved') {
    return '<td class="background-danger">Disapproved</td>';
  }
};

const resolvedColumn = (status) => {
  if (status === 'pending') {
    return '<td class="background-tertiary"></td>';
  }
  if (status === 'approved') {
    return `
    <td>
      <a href="#" class="btn btn-small btn-success">Resolve</a>
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
    ${approveAndDisapproveColumn(elem.status)}
    ${resolvedColumn(elem.status)}`;
    tableBody.appendChild(row);
  });
};

const url = `${baseUrl}/api/v1/requests`;
const headers = new Headers();
headers.append('authorization', token);
const request = new Request(url, { method: 'GET', headers });

const getAllRequests = () => {
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
  getAllRequests();
};

window.onload = init();
