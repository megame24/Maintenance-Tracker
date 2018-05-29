
const init = () => {
  const tableBody = document.getElementById('table-body');
  const displayUsername = document.getElementById('display-username');
  const errorMessage = document.getElementsByClassName('error-message')[0];
  const successMessage = document.getElementsByClassName('success-message')[0];

  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/v1/users/requests`;
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


  const statusDependents = (status) => {
    if (status === 'resolved') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-success';
      statusObj.message = 'Resolved';
      return statusObj;
    }
    if (status === 'disapproved') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-danger';
      statusObj.message = 'Disapproved';
      return statusObj;
    }
    if (status === 'approved') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-primary';
      statusObj.message = 'Work in Progress';
      return statusObj;
    }
    if (status === 'pending') {
      const statusObj = {};
      statusObj.backgroundColor = 'background-tertiary';
      statusObj.message = 'Approval pending';
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
        window.location = `${baseUrl}/login.html?${queryString}`;
        return;
      }
      const userDetails = parseJwt(token);
      displayUsername.append(userDetails.username);
      result.forEach((elem) => {
        const row = createNode('tr');
        row.innerHTML = `<td class="dark-blue table-link"><a href="/user-request-details.html?${elem.id}">${elem.title}</a></td><td>${elem.type}</td><td class=${statusDependents(elem.status).backgroundColor}>${statusDependents(elem.status).message}</td>`;
        tableBody.appendChild(row);
      });
    });
};

window.onload = init();
