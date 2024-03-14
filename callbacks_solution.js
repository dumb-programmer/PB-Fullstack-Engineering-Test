const http = require("http");

const { getSearchParams, convertToURL, sendResponse } = require("./utils");

const server = http.createServer((req, res) => {
  const url = req.url;

  if (/^\/I\/want\/title\?/.test(url)) {
    const searchParams = getSearchParams(url);

    const values = [];
    let remaining = searchParams["address"].length;

    searchParams["address"].map((address, index) =>
      fetch(convertToURL(address))
        .then((response) => response.text())
        .then((text) => {
          const title = text.match(/<title>(.*?)<\/title>/)[1];
          values[index] = { address, title };
          remaining--;
          if (remaining === 0) {
            sendResponse(res, values);
          }
        })
        .catch(() => {
          values[index] = { address, title: "NO RESPONSE" };
          remaining--;
          if (remaining === 0) {
            sendResponse(res, values);
          }
        })
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
