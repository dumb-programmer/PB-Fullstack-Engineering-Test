const http = require("http");
const async = require("async");

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

const server = http.createServer((req, res) => {
  const url = req.url;

  if (/^\/I\/want\/title\?/.test(url)) {
    const searchParams = getSearchParams(url);

    async.map(
      searchParams["address"],
      (address, callback) =>
        fetch(convertToURL(address))
          .then((response) => response.text())
          .then((text) => {
            const title = text.match(/<title>(.*?)<\/title>/)[1];
            callback(null, { address, title });
          })
          .catch(() => {
            callback(null, { address, title: "NO RESPONSE" });
          }),
      (err, result) => {
        sendResponse(res, result);
      }
    );
  } else {
    res.statusCode = 404;
    res.write("Not found");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
