/*
 * Mobile navbar functionalities
 *
 */

var mobileMenuToggle = document.querySelector(".toggle-menu");
var navHeader = document.querySelector(".nav-header");
var rightMenu = document.querySelector(".right-menu");
mobileMenuToggle.onclick = function() {
    rightMenu.classList.toggle("not-mobile");
    navHeader.classList.toggle("nav-header-shadow");
}

var navItemAdmin = document.querySelector(".admin .nav-item");
var dropDownMenuAdmin = document.querySelector(".admin .drop-down-menu");
if (navItemAdmin) {
  navItemAdmin.onclick = function() {
      toggleHide(dropDownMenuAdmin);
  }
}

var navItemRequest = document.querySelector(".request .nav-item");
var dropDownMenuRequest = document.querySelector(".request .drop-down-menu");
if (navItemRequest) {
  navItemRequest.onclick = function() {
      toggleHide(dropDownMenuRequest);
  }
}

var navItemUser = document.querySelector(".user .nav-item");
var dropDownMenuUser = document.querySelector(".user .drop-down-menu");
if (navItemRequest) {
  navItemUser.onclick = function() {
      toggleHide(dropDownMenuUser);
  }
}

function toggleHide(element) {
  element.classList.toggle('hide');
};
