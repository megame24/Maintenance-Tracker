/* eslint-disable no-unused-vars */
const handleRedirectError = (errMessage, subUrl) => {
  const message = { error: true, message: errMessage };
  let queryString = JSON.stringify(message);
  queryString = window.btoa(queryString);
  window.location = `${baseUrl}/${subUrl}?${queryString}`;
};
