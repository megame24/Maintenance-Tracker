/**
 * redirect on success
 * @param {String} succMessage - success message 
 * @param {String} subUrl - url string
 */
const handleRedirectSuccess = (succMessage, subUrl) => {
  const message = { success: true, message: succMessage };
  let queryString = JSON.stringify(message);
  // encode success message in base-64
  queryString = window.btoa(queryString);
  // set encoded success message as query string and redirect
  window.location = `${baseUrl}/${subUrl}${queryString}`;
};
