const getQueryParams = (subUrl) => {
  if (!window.location.search.substring(1)) {
    return handleRedirectError('Request not found', subUrl);
  }
  const params = window.location.search.substring(1).split('&');
  id = params[0];
  if (!params[1]) return;
  message = window.atob(params[1]);
  if (!isValidJson(message)) return;
  message = JSON.parse(message);
  if (message.success) return displayMessage(message, successMessage);
  if (message.error) displayMessage(message, errorMessage);
};
