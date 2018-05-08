/*
 * Mobile navbar functionalities
 *
 */

var mobileMenuToggle = document.querySelector(".toggle-menu");
var navHeader = document.querySelector(".nav-header");
var mobileMenu = document.querySelector(".mobile-menu");
mobileMenuToggle.onclick = function() {
    if (!mobileMenu.classList.contains("hide")) {
      mobileMenu.classList.add("hide");
      navHeader.classList.add("nav-header-shadow");
    } else {
      mobileMenu.classList.remove("hide");
      navHeader.classList.remove("nav-header-shadow");
    }
}

var navItemAdmin = document.querySelector(".admin .nav-item");
var dropDownMenuAdmin = document.querySelector(".admin .drop-down-menu");
navItemAdmin.onclick = function() {
    toggleHide(dropDownMenuAdmin);
}

var navItemRequest = document.querySelector(".request .nav-item");
var dropDownMenuRequest = document.querySelector(".request .drop-down-menu");
navItemRequest.onclick = function() {
    toggleHide(dropDownMenuRequest);
}

var navItemUser = document.querySelector(".user .nav-item");
var dropDownMenuUser = document.querySelector(".user .drop-down-menu");
navItemUser.onclick = function() {
    toggleHide(dropDownMenuUser);
}

function toggleHide(element) {
  if (!element.classList.contains("hide")) {
    element.classList.add("hide");
  } else {
    element.classList.remove("hide");
  }
};
