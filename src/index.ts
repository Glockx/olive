#!/usr/bin/env node

import { InvalidArgumentError, program } from "commander";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import Color from "color";
import { createCanvas } from "canvas";
import pLimit from "p-limit";
import { optsSchema, type OliveCLIOptions } from "./types/OliveCLIOptions";

function myParseInt(value: string, dummyPrevious: any) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsedValue;
}

async function main() {
  program
    .version("1.0.0")
    .name("olive-cli")
    .description("A CLI tool to generate dummy images")
    .option<number>(
      "--count <number>",
      "Number of images to generate",
      (v) => myParseInt(v, 10),
      1
    )
    .option<number>(
      "--width <number>",
      "Image width in pixels",
      (v) => myParseInt(v, 10),
      100
    )
    .option<number>(
      "--height <number>",
      "Image height in pixels",
      (v) => myParseInt(v, 10),
      100
    )
    .option<number>(
      "--size <number>",
      "Square image size (overrides width and height)",
      (v) => myParseInt(v, 10)
    )
    .option("--type <string>", "Image type: solid, gradient, text", "solid")
    .option(
      "--color <string>",
      "Color for solid image (hex or name)",
      "#808080"
    )
    .option("--start-color <string>", "Gradient start color", "#ffffff")
    .option("--end-color <string>", "Gradient end color", "#000000")
    .option(
      "--direction <string>",
      "Gradient direction: horizontal, vertical",
      "horizontal"
    )
    .option("--text <string>", "Text content for text type", "Dummy Image")
    .option("--font <string>", "Font family for text", "Arial")
    .option(
      "--font-size <number>",
      "Font size for text",
      (v) => myParseInt(v, 10),
      20
    )
    .option("--text-color <string>", "Text color", "#000000")
    .option(
      "--background-color <string>",
      "Background color for text",
      "#ffffff"
    )
    .option("--format <string>", "Image format: png, jpeg", "png")
    .option(
      "--quality <number>",
      "JPEG quality (0-100)",
      (v) => parseInt(v, 10),
      80
    )
    .option("--output <string>", "Output folder", ".")
    .option("--prefix <string>", "File name prefix", "dummy")
    .option("--verbose", "Enable verbose output", false)
    .parse(process.argv);

  const opts = program.opts<OliveCLIOptions>();

  // -- Size override (before validation)
  if (opts.size) {
    opts.width = opts.height = opts.size;
  }

  const parseResult = optsSchema.safeParse(opts);
  if (!parseResult.success) {
    const errors = parseResult.error.issues
      .map((e: any) => `${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`Invalid CLI options:\n${errors}`);
  }
  // Use validated opts
  Object.assign(opts, parseResult.data);

  // -- Ensure output exists
  await fs.mkdir(opts.output, { recursive: true });

  // -- Pre-parse colors once
  const solidHex = Color(opts.color).hex();
  const startHex = Color(opts.startColor).hex();
  const endHex = Color(opts.endColor).hex();
  const textHex = Color(opts.textColor).hex();
  const bgHex = Color(opts.backgroundColor).hex();

  // -- Set up concurrency limiter based on CPU cores
  const concurrency = os.cpus().length;
  if (opts.verbose) {
    console.log(`Using concurrency limit of ${concurrency}`);
  }
  const tasks: Promise<void>[] = [];

  // Generate the image content once
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext("2d");
  const limit = pLimit(concurrency);

  if (opts.type === "solid") {
    ctx.fillStyle = solidHex;
    ctx.fillRect(0, 0, opts.width, opts.height);
  } else if (opts.type === "gradient") {
    const grad =
      opts.direction === "horizontal"
        ? ctx.createLinearGradient(0, 0, opts.width, 0)
        : ctx.createLinearGradient(0, 0, 0, opts.height);
    grad.addColorStop(0, startHex);
    grad.addColorStop(1, endHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, opts.width, opts.height);
  } else {
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, opts.width, opts.height);
    ctx.fillStyle = textHex;
    ctx.font = `${opts.fontSize}px ${opts.font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(opts.text, opts.width / 2, opts.height / 2);
  }

  // Generate the buffer once
  const quality = opts.format === "jpeg" ? opts.quality / 100 : undefined;
  const buffer =
    opts.format === "jpeg"
      ? canvas.toBuffer("image/jpeg", { quality: quality })
      : canvas.toBuffer("image/png");

  if (opts.verbose) {
    console.log(
      `Generated ${opts.type} image buffer: ${opts.width}x${opts.height}`
    );
  }

  // Write the same buffer to multiple files with concurrency
  for (let i = 1; i <= opts.count; i++) {
    tasks.push(
      limit(async () => {
        const ext = opts.format === "jpeg" ? "jpg" : "png";
        const fileName = `${opts.prefix}${i}.${ext}`;
        const outPath = path.join(opts.output, fileName);
        await fs.writeFile(outPath, buffer);

        if (opts.verbose) {
          const ts = new Date().toISOString();
          console.log(`[${ts}] [${i}/${opts.count}] Saved: ${outPath}`);
        }
      })
    );
  }

  // -- Await all tasks
  await Promise.all(tasks);
  console.log(`Generated ${opts.count} image(s) in ${opts.output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
