const logout = document.getElementById('logout');
logout.onclick = () => {
  window.localStorage.clear();
  window.location = baseUrl;
}
