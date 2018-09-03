export default {
  error500: err => ({
    error: {
      message: 'Internal server error, check your request parameters or check back later',
      error: err,
    }
  })
};
