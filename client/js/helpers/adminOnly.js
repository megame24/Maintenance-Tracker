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

// validate admin pages
if (token) {
  const userDetails = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);
  if (userDetails.exp > currentTime) {
    if (userDetails.role === 'user') {
      handleRedirectError('You do not have permission to visit that page', 'view-requests.html');
    }
  } else {
    handleRedirectError('Authentication failed', 'login.html');
  }
} else {
  handleRedirectError('Authentication failed', 'login.html');
}
