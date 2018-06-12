/**
 * check if a passed in string is a valid JSON
 * @param {String} string 
 */
const isValidJson = (string) => {
  try {
    JSON.parse(string);
  } catch (err) {
    return false;
  }
  return true;
};
