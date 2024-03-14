const http = require("http");
const Q = require("q");

const { getSearchParams, convertToURL, sendResponse } = require("./utils");

const server = http.createServer((req, res) => {
  const url = req.url;

  if (/^\/I\/want\/title\?/.test(url)) {
    const searchParams = getSearchParams(url);
    Q.all(
      searchParams["address"].map((address) =>
        fetch(convertToURL(address))
          .then((response) => response.text())
          .then((text) => {
            const title = text.match(/<title>(.*?)<\/title>/)[1];
            return { address, title };
          })
          .catch(() => {
            return { address, title: "NO RESPONSE" };
          })
      )
    ).then((values) => {
      sendResponse(res, values);
    });
  } else {
    res.statusCode = 404;
    res.write("Not found");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
