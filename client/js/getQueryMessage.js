/* eslint-disable no-unused-vars */
const getQueryMessage = () => {
  if (window.location.search.substring(1)) {
    let message = window.atob(window.location.search.substring(1));
    if (!isValidJson(message)) {
      return;
    }
    message = JSON.parse(message);
    if (message.success) {
      displayMessage(message, successMessage);
    }
    if (message.error) {
      displayMessage(message, errorMessage);
    }
  }
};
