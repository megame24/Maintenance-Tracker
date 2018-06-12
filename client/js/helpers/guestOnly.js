/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import { handleRedirectError } from './handleError.js';
 * import parseJwt from './parseJwt.js';
 */

const baseUrl = window.location.origin;
const token = window.localStorage.getItem('token');

// guests' only pass
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
