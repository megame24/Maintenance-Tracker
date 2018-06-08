let errorMessage,
  successMessage,
  resolveBtn,
  approveBtn,
  disapproveBtn,
  tableBody,
  tableRows,
  filterSelection;

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
    return '<td>Approved</td>';
  }
  if (status === 'disapproved') {
    return '<td>Disapproved</td>';
  }
};

const resolvedColumn = (status, elem) => {
  if (status === 'pending') {
    return '<td></td>';
  }
  if (status === 'approved') {
    return `
    <td>
      <a href="#" data-id="${elem.id}" class="resolve btn btn-small btn-success">Resolve</a>
    </td>`;
  }
  if (status === 'disapproved') {
    return '<td></td>';
  }
  if (status === 'resolved') {
    return '<td>Resolved</td>';
  }
};

const populateTableWithRequests = (result) => {
  result.forEach((elem) => {
    const row = createNode('tr');
    row.classList.add('tr');
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

const updateStatus = (event, status) => {
  const url = `${baseUrl}/api/v1/requests/${event.target.getAttribute('data-id')}/${status}`;
  const headers = new Headers();
  headers.append('authorization', token);
  headers.append('Content-Type', 'application/json');
  let data = { status };
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

const approveRequest = (event) => {
  updateStatus(event, 'approve');
  event.target.removeEventListener('click', approveRequest);
};

const disapproveRequest = (event) => {
  updateStatus(event, 'disapprove');
  event.target.removeEventListener('click', disapproveRequest);
};

const resolveRequest = (event) => {
  updateStatus(event, 'resolve');
  event.target.removeEventListener('click', resolveRequest);
};

const statusUpdateBtnLoop = (btn, func) => {
  for (let i = 0; i < btn.length; i += 1) {
    btn[i].addEventListener('click', func);
  }
};

const adminDuties = () => {
  statusUpdateBtnLoop(approveBtn, approveRequest);
  statusUpdateBtnLoop(disapproveBtn, disapproveRequest);
  statusUpdateBtnLoop(resolveBtn, resolveRequest);
};

const filterByNone = (filter, elements) => {
  if (filter === 'none') {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove('hide');
    }
  }
};

const filterByMaintenance = (filter, elements) => {
  if (filter !== 'maintenance') return;
  for (let i = 0; i < elements.length; i += 1) {
    if (elements[i].getElementsByTagName('td')[1].innerHTML === 'repair') {
      elements[i].classList.add('hide');
    } else {
      elements[i].classList.remove('hide');
    }
  }
};

const filterByRepair = (filter, elements) => {
  if (filter !== 'repair') return;
  for (let i = 0; i < tableRows.length; i += 1) {
    if (tableRows[i].getElementsByTagName('td')[1].innerHTML === 'maintenance') {
      tableRows[i].classList.add('hide');
    } else {
      tableRows[i].classList.remove('hide');
    }
  }
};

const filterHandler = () => {
  filterSelection.onchange = (event) => {
    const filter = event.target.value;
    filterByNone(filter, tableRows);
    filterByMaintenance(filter, tableRows);
    filterByRepair(filter, tableRows);
  };
};

const init = () => {
  tableBody = document.getElementById('table-body');
  const displayUsername = document.getElementById('display-username');
  errorMessage = document.getElementsByClassName('error-message')[0];
  successMessage = document.getElementsByClassName('success-message')[0];
  filterSelection = document.getElementById('filter');
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  getQueryMessage();
  window.history.replaceState({}, '', '/admin-dashboard.html');
  getAllRequests()
    .then(() => {
      approveBtn = document.getElementsByClassName('approve');
      disapproveBtn = document.getElementsByClassName('disapprove');
      resolveBtn = document.getElementsByClassName('resolve');
      tableRows = document.getElementsByClassName('tr');
      adminDuties();
      filterHandler();
    });
};

window.onload = init();
