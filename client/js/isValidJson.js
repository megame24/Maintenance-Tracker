/* eslint-disable no-unused-vars */
const isValidJson = (string) => {
  try {
    JSON.parse(string);
  } catch (err) {
    return false;
  }
  return true;
};
