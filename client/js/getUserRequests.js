
const init = () => {
  const tableBody = document.getElementById('table-body');
  const displayUsername = document.getElementById('display-username');
  const errorMessage = document.getElementsByClassName('error-message')[0];
  const successMessage = document.getElementsByClassName('success-message')[0];

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
  
  const token = window.localStorage.getItem('token');

  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/v1/users/requests`;
  const headers = new Headers();
  headers.append('authorization', token);
  const request = new Request(url, {
    method: 'GET',
    headers
  });

  const createNode = elem => document.createElement(elem);

  const statusBackground = (status) => {
    if (status === 'resolved') return 'background-success';
    if (status === 'disapproved') return 'background-danger';
    if (status === 'approved') return 'background-primary';
    if (status === 'pending') return 'background-tertiary';
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
      }
      // perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
      const parseJwt = (jwToken) => {
        const base64Url = jwToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
      };
      const userDetails = parseJwt(token);
      displayUsername.append(userDetails.username);
      result.forEach((elem) => {
        const row = createNode('tr');
        row.innerHTML = `<td class="dark-blue table-link"><a href="/request-details.html?${elem.id}">${elem.title}</a></td><td>${elem.type}</td><td class=${statusBackground(elem.status)}>${elem.status}</td>`;
        tableBody.appendChild(row);
      });
    });
};

window.onload = init();
