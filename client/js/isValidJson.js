const isValidJson = (string) => {
  try {
    JSON.parse(string);
  } catch (err) {
    return false;
  }
  return true;
};
