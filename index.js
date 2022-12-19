const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const axios = require("axios");
const replaceTemplate = require("./modules/replaceTemplate");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
let data,
  port = 2000;

function getData(apiUrl) {
  return new Promise((resolve, reject) => {
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(`Data: ${res.data}`);
        data = res.data;
        resolve(data);
      })
      .catch((err) => {
        console.log(`ERR: ${err}`);
        reject(err);
      });
  });
}
async function main() {
  const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf8");
  const stopsTempOverview = fs.readFileSync(`${__dirname}/templates/stops-template-overview.html`, "utf8");
  const stopsTempCard = fs.readFileSync(`${__dirname}/templates/stops-template-card.html`, "utf8");
  const busTempOverview = fs.readFileSync(`${__dirname}/templates/bus/buses-template-overview.html`, "utf8");
  const busTempCard = fs.readFileSync(`${__dirname}/templates/bus/buses-template-card.html`, "utf8");
  const dataStops = await getData(`https://localhost:7166/GetStop`);
  const dataBuses = await getData(`https://localhost:7166/GetBuses`);
  // console.log(`dataObj: ${dataObj}`);
  //const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
  //console.log(`slugs: ${slugs}`);

  const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === "/" || pathname === "/overview") {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const cardsHtml = dataStops.map((el) => replaceTemplate(stopsTempCard, el)).join("");
      const output = tempOverview.replace("{%INFO_CARDS%}", cardsHtml);
      res.end(output);
    } else if (pathname === "/stop") {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const stopsHtml = dataStops.map((el) => replaceTemplate(stopsTempCard, el)).join("");
      const output = stopsTempOverview.replace("{%STOPS_CARDS%}", stopsHtml);
      res.end(output);
    } else if (pathname === "/bus") {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const busHtml = dataBuses.map((el) => replaceTemplate(busTempCard, el)).join("");
      const output = busTempOverview.replace("{%BUSES_CARDS%}", busHtml);
      res.end(output);
    } else {
      res.writeHead(404, {
        "Content-type": "text/html",
        "my-own-header": "page not found",
      });
      res.end("<h1>Page not found!</h1>");
    }
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Listening on 127.0.0.1:${port}`);
  });
}

main();
