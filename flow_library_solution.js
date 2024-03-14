const http = require("http");
const async = require("async");

const { getSearchParams, convertToURL, sendResponse } = require("./utils");

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
