const handleRedirectError = (errMessage, subUrl) => {
  const message = { error: true, message: errMessage };
  let queryString = JSON.stringify(message);
  queryString = window.btoa(queryString);
  window.location = `${baseUrl}/${subUrl}?${queryString}`;
};

const displayError = (message) => {
  submitBtn.disabled = false;
  submitBtn.classList.remove('disabled');
  submitBtn.value = 'Make Request';
  errorMessage.innerText = message;
  errorMessage.classList.remove('hide');
};
