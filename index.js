const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const SINGLE_PAGE_PATH = path.join(PUBLIC_DIR, "index.html");

const server = http.createServer((req, res) => {
  fs.readFile(SINGLE_PAGE_PATH, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal server error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    if (req.method === "HEAD") {
      res.end();
      return;
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Website is running on http://localhost:${PORT}`);
});
