const displayMessage = (message, successOrerrorMessge) => {
  const successOrerror = successOrerrorMessge;
  successOrerror.innerText = message.message;
  successOrerror.classList.remove('hide');
  window.setTimeout(() => {
    successOrerror.classList.add('hide');
  }, 5000);
};
