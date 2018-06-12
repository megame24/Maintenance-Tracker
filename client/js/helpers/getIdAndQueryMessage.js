/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import displayMessage from './displayMessage.js';
 * import isValidJson from './isValidJson.js';
 */

/**
 * get id from query string
 */
const getId = () => {
  if (!window.location.search.substring(1)) {
    return false;
  }
  const params = window.location.search.substring(1).split('&');
  return params[0];
};

/**
 * decode and display error or success message gotten from query string
 */
const displayErrOrSuccMessage = (successMessage, errorMessage) => {
  if (!window.location.search.substring(1)) {
    return;
  }
  const params = window.location.search.substring(1).split('&');
  if (!params[1]) return;
  // decode query string to retrieve error or success message
  message = window.atob(params[1]);
  if (!isValidJson(message)) return;
  message = JSON.parse(message);
  if (message.success) displayMessage(message, successMessage);
  if (message.error) displayMessage(message, errorMessage);
};
