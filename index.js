const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const axios = require("axios");
const replaceTemplate = require("./modules/replaceTemplate");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
let data;
axios
  .get(
    `https://localhost:7166/GetBuses` // &lang=pl
  )
  .then((res) => {
    console.log(`Buses: ${res.data[0].id}`);
    data = res.data;
  })
  .catch((err) => {
    console.log(`ERR: ${err}`);
  });
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf8");
const dataObj = data;
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%BUS_CARDS%}", cardsHtml);
    res.end(output);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "page not found",
    });
    res.end("<h1>Page not found!</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
