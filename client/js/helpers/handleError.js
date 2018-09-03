/* eslint-disable no-param-reassign */

/**
 * redirect on error
 * @param {String} errMessage - error message 
 * @param {String} subUrl - url string
 */
const handleRedirectError = (errMessage, subUrl) => {
  const message = { error: true, message: errMessage };
  let queryString = JSON.stringify(message);
  // encode error message in base-64
  queryString = window.btoa(queryString);
  // set encoded error message as query string and redirect
  window.location = `${baseUrl}/${subUrl}?${queryString}`;
};

/**
 * display error on page
 * @param {String} message - error message 
 * @param {String} btnValue - button label
 */
const displayError = (errorMessage, message, submitBtn, btnValue) => {
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('disabled');
    submitBtn.value = btnValue;
  }
  errorMessage.innerText = message;
  errorMessage.classList.remove('hide');
};
