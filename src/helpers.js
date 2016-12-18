export const checkStatus = function(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }

  const err = new Error(res.statusText);
  err.response = res;
  throw err;
};
