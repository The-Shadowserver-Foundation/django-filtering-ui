export default () => {
  // Get the query string from the URL
  const queryString = window.location.search;
  // Parse the query string parameters
  return new URLSearchParams(queryString);
};
