
const baseUrl = window.location.origin;
const token = window.localStorage.getItem('token');

// perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
const parseJwt = (jwToken) => {
  const base64Url = jwToken.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};

if (token) {
  const userDetails = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  if (userDetails.exp > currentTime) {
    if (userDetails.role === 'admin') {
      handleRedirectSuccess('You are already logged in', 'admin-dashboard.html?');
    }
    if (userDetails.role === 'user') {
      handleRedirectSuccess('You are already logged in', 'view-requests.html?');
    }
  }
}
