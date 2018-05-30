
const init = () => {
  const displayUsername = document.getElementById('display-username');
  const titleField = document.getElementById('title');
  const descriptionField = document.getElementById('description');
  const submitBtn = document.getElementById('submit-btn');
  const updateForm = document.getElementById('update-form');

  const baseUrl = window.location.origin;
  const token = window.localStorage.getItem('token');
  let id;
  if (window.location.search.substring(1)) {
    id = window.location.search.substring(1);
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
  // perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
  const parseJwt = (jwToken) => {
    const base64Url = jwToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };

  const url = `${baseUrl}/api/v1/users/requests/${id}`;
  const userDetails = parseJwt(token);
  displayUsername.append(userDetails.username);
  let headers = new Headers();
  headers.append('authorization', token);
  let request = new Request(url, {
    method: 'GET',
    headers
  });
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
      titleField.value = result.title;
      descriptionField.innerText = result.description;
      document.querySelector(`input[value=${result.type}]`).checked = true;
    });

    
  updateForm.onsubmit = (event) => {
    const typeField = document.querySelector('input[name=type]:checked');
    event.preventDefault();
  
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.value = 'Updating Request...';
  
    let formData = {
      title: titleField.value,
      description: descriptionField.value,
      type: typeField.value
    };
    formData = JSON.stringify(formData);
  
    headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', token);
    request = new Request(url, {
      method: 'PUT',
      headers,
      body: formData
    });
    fetch(request)
      .then(res => res.json())
      .then((result) => {
        if (result.error) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled');
          submitBtn.value = 'Update Request';
          errorMessage.innerText = result.error.message;
          errorMessage.classList.remove('hide');
          return;
        }
        const message = {
          success: true,
          message: result.success.message
        };
        let queryString = JSON.stringify(message);
        queryString = window.btoa(queryString);
        window.location = `${baseUrl}/user-request-details.html?${id}&${queryString}`;
      });
  };
};

window.onload = init();
