const logout = document.getElementById('logout');
if (logout) {
  logout.onclick = () => {
    window.localStorage.clear();
    window.location = baseUrl;
  };
}
