/**
 * display error or success message dialog box
 * @param {String} message - error or sucess message
 * @param {String} successOrerrorMessge - success or error message dialog box
 */
const displayMessage = (message, successOrerrorMessge) => {
  const successOrerror = successOrerrorMessge;
  successOrerror.innerText = message.message;
  successOrerror.classList.remove('hide');
  window.setTimeout(() => {
    successOrerror.classList.add('hide');
  }, 5000);
};
