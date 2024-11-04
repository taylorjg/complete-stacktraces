import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import { SourceMapConsumer } from "source-map";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

class SourceMapper {
  constructor() {
    this.sourceMapConsumers = {};
  }

  async init(sourcesPath) {
    try {
      const items = await fs.readdir(sourcesPath);

      for (const item of items) {
        if (item.endsWith(`.js`)) {
          const jsFileName = item;
          const mapFilePath = path.join(sourcesPath, `${jsFileName}.map`);

          // console.log(`[SourceMapper.init]`, `Processing ${jsFileName}`);

          try {
            const contents = await fs.readFile(mapFilePath, `utf8`);
            const consumer = await new SourceMapConsumer(contents);

            this.sourceMapConsumers[jsFileName] = consumer;
            // console.log(`[SourceMapper.init]`, `Found ${mapFilePath}`);
          } catch (error) {
            console.log(
              `[SourceMapper.init]`,
              `Failed readFile for ${mapFilePath}`,
              error.message
            );
          }
        }
      }
    } catch (error) {
      console.log(
        `[SourceMapper.init]`,
        `Failed readdir for ${sourcesPath}`,
        error.message
      );
    }
  }

  getOriginalStacktrace(stackFrames) {
    return stackFrames.map((stackFrame) => {
      const jsFileName = path.basename(stackFrame.fileName);
      const sourceMapConsumer = this.sourceMapConsumers[jsFileName];

      if (sourceMapConsumer) {
        const generatedPosition = {
          line: stackFrame.lineNumber,
          column: stackFrame.columnNumber,
        };

        const originalPosition = sourceMapConsumer.originalPositionFor(generatedPosition);

        const lineNumber = originalPosition.line ?? stackFrame.lineNumber;
        const columnNumber = originalPosition.column !== null ? originalPosition.column + 1 : stackFrame.columnNumber;
        const functionName = originalPosition.name ?? stackFrame.functionName ?? ``;
        const fileName = originalPosition.source ?? stackFrame.fileName;
        const location = `${fileName}:${lineNumber}:${columnNumber}`;
        const source = functionName
          ? `    at ${functionName} (${location})`
          : `    at ${location}`;

        return {
          lineNumber,
          columnNumber,
          fileName,
          functionName,
          source,
        };
      } else {
        console.log(
          `[SourceMapper.getOriginalStacktrace]`,
          `No source map consumer found for ${jsFileName}`
        );
        return stackFrame;
      }
    });
  }
}

const sourceMapper = new SourceMapper();

sourceMapper.init(path.resolve(__dirname, `..`, `dist`, `assets`));

const expandStackRoute = (req, res) => {
  console.log(`req.body:`, req.body);

  const stackFrames = req.body.stackFrames || [];
  const expandedStackFrames = sourceMapper.getOriginalStacktrace(stackFrames);

  res.json({ expandedStackFrames });
};

export const expandedStackRouter = express.Router();

expandedStackRouter.post(`/expandStack`, expandStackRoute);
