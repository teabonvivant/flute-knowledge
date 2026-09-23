import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const port = Number.parseInt(process.env.PORT ?? "8032", 10);

const types = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function sendFile(res, filePath) {
  if (!existsSync(filePath)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": types[extname(filePath)] ?? "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}

function pageFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/$/, "");
  if (clean === "") return join(root, ".next", "server", "app", "index.html");
  return join(root, ".next", "server", "app", `${clean.slice(1)}.html`);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);
  const pathname = url.pathname;

  if (pathname.startsWith("/_next/static/")) {
    sendFile(res, join(root, ".next", "static", pathname.replace("/_next/static/", "")));
    return;
  }
  if (pathname === "/_next/image") {
    const source = url.searchParams.get("url") ?? "";
    if (source.startsWith("/images/")) {
      sendFile(res, join(root, "public", source));
      return;
    }
  }
  if (pathname.startsWith("/images/")) {
    sendFile(res, join(root, "public", pathname));
    return;
  }
  sendFile(res, pageFile(pathname));
}).listen(port, "127.0.0.1", () => {
  console.log(`Flute Atlas static preview: http://127.0.0.1:${port}`);
});
