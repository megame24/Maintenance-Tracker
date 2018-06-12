// perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
const parseJwt = (jwToken) => {
  const base64Url = jwToken.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};
