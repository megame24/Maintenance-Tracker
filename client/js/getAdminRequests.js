
const init = () => {
  const tableBody = document.getElementById('table-body');
  const displayUsername = document.getElementById('display-username');
  const errorMessage = document.getElementsByClassName('error-message')[0];
  const successMessage = document.getElementsByClassName('success-message')[0];

  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/v1/requests`;
  const token = window.localStorage.getItem('token');

  // perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
  const parseJwt = (jwToken) => {
    const base64Url = jwToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };

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

  if (window.location.search.substring(1)) {
    let message = window.atob(window.location.search.substring(1));
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

  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, {
    method: 'GET',
    headers
  });

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
      result.forEach((elem) => {
        const row = createNode('tr');
        row.innerHTML = 
        `<td class="dark-blue table-link">
            <a href="/admin-request-details.html">${elem.title}</a>
        </td>
        <td class="table-not-mobile">${elem.type}</td>
        ${approveAndDisapproveColumn(elem.status)}
        ${resolvedColumn(elem.status)}`;
        tableBody.appendChild(row);
      });
    });
};

window.onload = init();
