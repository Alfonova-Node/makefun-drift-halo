"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = process.cwd();
const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".png": "image/png",
};
const server = http.createServer((req, res) => {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
    }
    catch {
        res.writeHead(400).end("Bad request");
        return;
    }
    if (pathname === "/")
        pathname = "/index.html";
    const file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(`${root}${path.sep}`)) {
        res.writeHead(403).end("Forbidden");
        return;
    }
    fs.stat(file, (error, stat) => {
        if (error || !stat.isFile()) {
            res.writeHead(404).end("Not found");
            return;
        }
        res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
        fs.createReadStream(file).pipe(res);
    });
});
const port = Number(process.argv[2] || 4173);
server.listen(port, "127.0.0.1", () => console.log(`Drift Halo at http://127.0.0.1:${port}`));
