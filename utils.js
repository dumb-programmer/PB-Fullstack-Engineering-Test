const getSearchParams = (url) => {
  const searchParams = {};
  const params = url.split("?")[1].split("&");
  for (const param of params) {
    [key, value] = param.split("=");
    if (key && value) {
      if (searchParams[key]) {
        searchParams[key].push(value);
      } else {
        searchParams[key] = [value];
      }
    }
  }
  return searchParams;
};

const sendResponse = (res, values) => {
  htmlResponse = `<html>
      <head></head>
      <body>
      
          <h1> Following are the titles of given websites: </h1>
      
          <ul>
             ${values
               .map((value) => `<li>${value?.address} - ${value?.title}</li>`)
               .join("")}
          </ul>
      </body>
      </html>`;
  res.write(htmlResponse);
  res.end();
};

const convertToURL = (address) => {
  if (!address.startsWith("http://") && !address.startsWith("https://")) {
    return `https://${address}`;
  }
  return address;
};

module.exports = { getSearchParams, sendResponse, convertToURL };
