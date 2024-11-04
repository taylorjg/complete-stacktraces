import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { expandedStackRouter } from "./expand-stack.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const PORT = process.env.PORT || 3010;
const PUBLIC_FOLDER = path.resolve(__dirname, "..", "dist");

const main = () => {
  const app = express();
  app.use('/', express.static(PUBLIC_FOLDER));
  app.use(express.json());
  app.use(expandedStackRouter);

  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
};

main();
