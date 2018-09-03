/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import getQueryMessage from './helpers/getQueryMessage.js';
 * import { handleRedirectError } from './helpers/handleError.js';
 * import handleRedirectSuccess from './helpers/handleSuccess.js';
 * import parseJwt from './helpers/parseJwt.js';
 */

let resolveBtn,
  approveBtn,
  disapproveBtn,
  tableRows;

const tableBody = document.getElementById('table-body');
const displayUsername = document.getElementById('display-username');
const errorMessage = document.getElementsByClassName('error-message')[0];
const successMessage = document.getElementsByClassName('success-message')[0];
const filterSelection = document.getElementById('filter');
const userDetails = parseJwt(token);

/**
 * create html node
 * @param {String} elem - html element string
 */
const createNode = elem => document.createElement(elem);

/**
 * build out 'approve/disapprove' html page column
 * @param {Object} elem - request
 */
const approveOrDisapproveColumn = (elem) => {
  const { status, id } = elem;
  if (status === 'pending') {
    return `
    <td>
        <a href="#" data-id="${id}" class="approve btn btn-small btn-primary">Approve</a>&nbsp;&nbsp;&nbsp;
        <a href="#" data-id="${id}" class="disapprove btn btn-small btn-danger">Disapprove</a>
    </td>`;
  }
  if (status === 'approved' || status === 'resolved') {
    return '<td>Approved</td>';
  }
  if (status === 'disapproved') {
    return '<td>Disapproved</td>';
  }
};

/**
 * build out 'resolve' html page column
 * @param {Object} elem - request
 */
const resolvedColumn = (elem) => {
  const { status, id } = elem;
  if (status === 'pending') {
    return '<td></td>';
  }
  if (status === 'approved') {
    return `
    <td>
      <a href="#" data-id="${id}" class="resolve btn btn-small btn-success">Resolve</a>
    </td>`;
  }
  if (status === 'disapproved') {
    return '<td></td>';
  }
  if (status === 'resolved') {
    return '<td>Resolved</td>';
  }
};

/**
 * populate html table with requests details
 * @param {Object} result - array of requests from API 
 */
const populateTableWithRequests = (result) => {
  result.forEach((elem) => {
    const row = createNode('tr');
    row.classList.add('tr');
    row.innerHTML = 
    `<td class="dark-blue table-link">
        <a href="/admin-request-details.html?${elem.id}">${elem.title}</a>
    </td>
    <td class="table-not-mobile">${elem.type}</td>
    ${approveOrDisapproveColumn(elem)}
    ${resolvedColumn(elem)}`;
    tableBody.appendChild(row);
  });
};

/**
 * get all requests from API
 */
const getAllRequests = () => {
  const url = `${baseUrl}/api/v1/requests`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, { method: 'GET', headers });
  return fetch(request)
    .then(res => res.json())
    .then((result) => {
      if (result.error) {
        return displayError(errorMessage, result.error.message);
      }
      populateTableWithRequests(result);
    });
};

/**
 * handle admin roles(approve, disapprove and resolve)
 * @param {Object} event - event handler's event object
 * @param {String} status - request's status
 */
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

/**
 * handle approve request
 * @param {Object} event - event handler's event object 
 */
const approveRequest = (event) => {
  updateStatus(event, 'approve');
  event.target.removeEventListener('click', approveRequest);
};

/**
 * handle disaprrove request
 * @param {Object} event - event handler's event object
 */
const disapproveRequest = (event) => {
  updateStatus(event, 'disapprove');
  event.target.removeEventListener('click', disapproveRequest);
};

/**
 * handle resolve request
 * @param {Object} event - event handler's event object 
 */
const resolveRequest = (event) => {
  updateStatus(event, 'resolve');
  event.target.removeEventListener('click', resolveRequest);
};

/**
 * add event listener to html buttons responsible for requests' status update
 * @param {Object} btn - html button elements 
 * @param {Function} func - event listener function
 */
const statusUpdateBtnLoop = (btn, func) => {
  for (let i = 0; i < btn.length; i += 1) {
    btn[i].addEventListener('click', func);
  }
};

/**
 * assign event handlers to the appropriate html buttons on the page
 */
const adminDuties = () => {
  statusUpdateBtnLoop(approveBtn, approveRequest);
  statusUpdateBtnLoop(disapproveBtn, disapproveRequest);
  statusUpdateBtnLoop(resolveBtn, resolveRequest);
};

/**
 * remove request filter
 * @param {String} filter - filter 
 * @param {Object} elements - html 'tr' elements
 */
const filterByNone = (filter, elements) => {
  if (filter === 'none') {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove('hide');
    }
  }
};

/**
 * filter requests by type maintenance
 * @param {String} filter - filter 
 * @param {Object} elements - html 'tr' elements
 */
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

/**
 * filter requests by type repair
 * @param {String} filter - filter 
 * @param {Object} elements - html 'tr' elements
 */
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

/**
 * handle filter request functionality
 */
const filterHandler = () => {
  filterSelection.onchange = (event) => {
    const filter = event.target.value;
    filterByNone(filter, tableRows);
    filterByMaintenance(filter, tableRows);
    filterByRepair(filter, tableRows);
  };
};

/**
 * call this on page load
 */
const init = () => {
  displayUsername.append(userDetails.username);
  getQueryMessage();
  // do not persist encrypted error or success message query string after page load
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
