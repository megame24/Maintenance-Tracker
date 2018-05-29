
const init = () => {
  const makeRequestForm = document.getElementById('make-request-form');
  const titleField = document.getElementById('title');
  const descriptionField = document.getElementById('description');
  const typeField = document.querySelector('input[name=type]:checked');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementsByClassName('error-message')[0];

  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/v1/users/requests`;

  makeRequestForm.onsubmit = (event) => {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.value = 'Making Request...';

    let formData = {
      title: titleField.value,
      description: descriptionField.value,
      type: typeField.value
    };
    formData = JSON.stringify(formData);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const token = window.localStorage.getItem('token');
    headers.append('authorization', token);
    const request = new Request(url, {
      method: 'POST',
      headers,
      body: formData
    });
    fetch(request)
      .then(res => res.json())
      .then((result) => {
        if (result.error) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled');
          submitBtn.value = 'Make Request';
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
        window.location = `${baseUrl}/view-requests.html?${queryString}`;
      });
  };
};

window.onload = init();
