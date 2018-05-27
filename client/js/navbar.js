/*
 * Mobile navbar functionalities
 *
 */

function toggleHide(element) {
  element.classList.toggle('hide');
}

const mobileMenuToggle = document.querySelector('.toggle-menu');
const navHeader = document.querySelector('.nav-header');
const rightMenu = document.querySelector('.right-menu');
mobileMenuToggle.onclick = () => {
  rightMenu.classList.toggle('not-mobile');
  navHeader.classList.toggle('nav-header-shadow');
};

const navItemAdmin = document.querySelector('.admin .nav-item');
const dropDownMenuAdmin = document.querySelector('.admin .drop-down-menu');
if (navItemAdmin) {
  navItemAdmin.onclick = () => {
    toggleHide(dropDownMenuAdmin);
  };
}

const navItemRequest = document.querySelector('.request .nav-item');
const dropDownMenuRequest = document.querySelector('.request .drop-down-menu');
if (navItemRequest) {
  navItemRequest.onclick = () => {
    toggleHide(dropDownMenuRequest);
  };
}

const navItemUser = document.querySelector('.user .nav-item');
const dropDownMenuUser = document.querySelector('.user .drop-down-menu');
if (navItemRequest) {
  navItemUser.onclick = () => {
    toggleHide(dropDownMenuUser);
  };
}

