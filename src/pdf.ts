import { createServer } from "http";
import { join, extname } from "path";
import { statSync, readFile } from "fs";
import type { AstroIntegration } from "astro";
import type { ResumeSchema } from "@kurone-kito/jsonresume-types";

export default function pdf(): AstroIntegration {
  return {
    name: "astro-plugin-pdf",
    hooks: {
      "astro:build:done": async ({ routes }) => {
        const server = createServer((req, res) => {
          let filePath = join("./dist", req.url === "/" ? "index.html" : req.url || "");
          if (statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");

          const mimeTypes: { [key: string]: string } = {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
          };

          const contentType = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";

          readFile(filePath, (error, content) => {
            if (error) {
              res.writeHead(500).end(`Error: ${error.code}`);
            } else {
              res.writeHead(200, { "Content-Type": contentType }).end(content, "utf-8");
            }
          });
        });

        server.listen(54544);

        const { default: pdf } = await import("puppeteer");
        const browser = await pdf.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"], headless: "new" });

        for (const route of routes) {
          const locale = route.route.split("/")[1];
          const resume = (await import(`./data/resume${locale ? "." + locale : ""}.json`)) as ResumeSchema;
          const page = await browser.newPage();
          await page.goto(`http://localhost:54544${route.route}`, { waitUntil: "load" });
          await page.pdf({
            path: `./dist/resume_${resume.basics?.name?.split(" ").join("_").toLowerCase()}${locale ? "_" + locale : ""}.pdf`,
            format: "A4",
            printBackground: true,
          });
          await page.close();
        }
        await browser.close();
      },
    },
  };
}
