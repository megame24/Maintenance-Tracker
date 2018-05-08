/*
 * Mobile navbar functionalities
 *
 */

var mobileMenuToggle = document.querySelector(".toggle-menu");
var navHeader = document.querySelector(".nav-header");
var rightMenu = document.querySelector(".right-menu");
mobileMenuToggle.onclick = function() {
    if (!rightMenu.classList.contains("not-mobile")) {
      rightMenu.classList.add("not-mobile");
      navHeader.classList.add("nav-header-shadow");
    } else {
      rightMenu.classList.remove("not-mobile");
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
