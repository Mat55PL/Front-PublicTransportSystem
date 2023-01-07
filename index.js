const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const axios = require("axios");
const replaceTemplate = require("./modules/replaceTemplate");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
let data, dataStops, dataBuses;
const port = 2000,
  serverIP = "51.83.129.124";

function getData(apiUrl) {
  return new Promise((resolve, reject) => {
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(`GET DATA FROM: ${apiUrl}`);
        data = res.data;
        resolve(data);
      })
      .catch((err) => {
        console.log(`ERR: ${err}`);
        reject(err);
      });
  });
}

function PostData(apiUrl, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(apiUrl, data)
      .then((res) => {
        data = res.data;
        resolve(data);
      })
      .catch((err) => {
        console.log(`ERR: ${err}`);
        reject(err);
      });
  });
}

async function refreshData() {
  try {
    dataStops = await getData(`https://localhost:7166/GetStop`);
    dataBuses = await getData(`https://localhost:7166/GetBuses`);
    console.log(`Refresh data at time: ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    return console.log(`[refreshData()]: ${err}`);
  }
}

async function main() {
  refreshData();
  const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf8");
  const stopsTempOverview = fs.readFileSync(`${__dirname}/templates/stops-template-overview.html`, "utf8");
  const stopsTempCard = fs.readFileSync(`${__dirname}/templates/stops-template-card.html`, "utf8");
  const busTempOverview = fs.readFileSync(`${__dirname}/templates/bus/buses-template-overview.html`, "utf8");
  const busTempCard = fs.readFileSync(`${__dirname}/templates/bus/buses-template-card.html`, "utf8");
  const tempBus = fs.readFileSync(`${__dirname}/templates/bus/buses-template-bus.html`, "utf8");
  // console.log(`dataObj: ${dataObj}`);
  //const slugs = jsonData.map((el) => slugify(el.id, { lower: true }));
  //console.log(`slugs: ${slugs}`);

  const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === "/" || pathname === "/overview") {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      refreshData();
      const cardsHtml = dataStops.map((el) => replaceTemplate(stopsTempCard, el)).join("");
      const output = tempOverview.replace("{%INFO_CARDS%}", cardsHtml);
      res.end(output);
    } else if (pathname === "/stop") {
      refreshData();
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      refreshData();
      const stopsHtml = dataStops.map((el) => replaceTemplate(stopsTempCard, el)).join("");
      const output = stopsTempOverview.replace("{%STOPS_CARDS%}", stopsHtml);
      res.end(output);
    } else if (pathname === "/buses") {
      refreshData();
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      if (dataBuses === undefined) {
        setTimeout(() => {
          refreshData();
        }, 1000);
      }
      const busHtml = dataBuses.map((el) => replaceTemplate(busTempCard, el)).join("");
      const output = busTempOverview.replace("{%BUSES_CARDS%}", busHtml);
      res.end(output);
    } else if (pathname === "/bus") {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      let index = dataBuses.findIndex((el) => el.id == query.id);
      const product = dataBuses[index];
      const output = replaceTemplate(tempBus, product);
      res.end(output);
    } else {
      res.writeHead(404, {
        "Content-type": "text/html",
        "my-own-header": "page not found",
      });
      res.end("<h1>Page not found!</h1>");
    }
  });

  server.listen(port, serverIP, () => {
    console.log(`Listening on ${serverIP}:${port}`);
  });
}

http
  .createServer((req, res) => {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString(); // odebranie danych
      });
      req.on("end", () => {
        console.log(body);
        //check is data already exist if yes then don't add
        if (dataStops.find((el) => el.number == body)) {
          console.log("Autobus już istnieje");
        }
        PostData(`https://localhost:7166/AddBus?`, body);
        data = undefined;
        res.writeHead(301, {
          location: "http://localhost:2000/",
        });
        res.end("Dodano autobus");
        //check is data sended to server if not then wait 1s and try
        if (data === undefined) {
          setTimeout(() => {
            refreshData();
          }, 1000);
        }
        refreshData();
      });
    } else {
      res.end("Tylko POST");
    }
  })
  .listen(2555);

main();
