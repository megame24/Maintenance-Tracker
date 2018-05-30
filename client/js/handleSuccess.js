const handleRedirectSuccess = (succMessage, subUrl) => {
  const message = { success: true, message: succMessage };
  let queryString = JSON.stringify(message);
  queryString = window.btoa(queryString);
  window.location = `${baseUrl}/${subUrl}${queryString}`;
};
