#!/usr/bin/env bun
import { mkdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { Glob } from "bun";

const OUTPUT_DIR = "output";
const SCREENSHOTS_DIR = join(OUTPUT_DIR, "screenshots");
const DOCS_SCREENSHOTS = "../../apps/docs/public/screenshots";

/**
 * Find all .png files in screenshots directory
 */
async function findScreenshots(): Promise<string[]> {
  const glob = new Glob("output/screenshots/**/*.png");
  const files: string[] = [];

  for await (const file of glob.scan(".")) {
    files.push(file);
  }

  return files;
}

/**
 * Move screenshots to docs/public/screenshots maintaining folder structure
 */
async function main(): Promise<void> {
  console.log("📸 Moving screenshots to docs...");

  const screenshots = await findScreenshots();

  if (screenshots.length === 0) {
    console.log("⚠️  No screenshots found to move\n");
    return;
  }

  console.log(`📦 Found ${screenshots.length} screenshot(s)\n`);

  let moved = 0;

  for (const screenshot of screenshots) {
    try {
      // Get relative path from screenshots directory
      const relativePath = relative(SCREENSHOTS_DIR, screenshot);
      const targetPath = join(DOCS_SCREENSHOTS, relativePath);
      const targetDir = dirname(targetPath);

      // Create a target directory if it doesn't exist
      await mkdir(targetDir, { recursive: true });

      // Copy the file using Bun.write
      const sourceFile = Bun.file(screenshot);
      await Bun.write(targetPath, sourceFile);

      moved += 1;
      console.log(`  ✓ ${relativePath} -> ${targetPath}`);
    } catch (error) {
      console.error(`  ✗ Failed to move ${screenshot}:`, error);
    }
  }

  console.log(`✅ Moved ${moved}/${screenshots.length} screenshot(s)\n`);
}

await main();
