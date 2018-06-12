/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import displayMessage from './displayMessage.js';
 * import isValidJson from './isValidJson.js';
 */

/**
 * get and display error or success message from query string
 */
const getQueryMessage = () => {
  if (window.location.search.substring(1)) {
    // decode query string to retrieve error or success message
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
