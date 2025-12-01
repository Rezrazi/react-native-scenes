#!/usr/bin/env bun
import { mkdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { $, Glob } from "bun";

const OUTPUT_DIR = "output";
const SCREENSHOTS_DIR = join(OUTPUT_DIR, "screenshots");
const DOCS_SCREENSHOTS = "../../apps/docs/public/screenshots";

/**
 * Clean up timestamped folders (2025-*)
 */
async function cleanTimestampedFolders(): Promise<void> {
  console.log("🧹 Cleaning timestamped folders...");

  const glob = new Glob("output/2025-*");
  let count = 0;

  for await (const folder of glob.scan(".")) {
    try {
      await $`rm -rf ${folder}`.quiet();
      count += 1;
      console.log(`  ✓ Removed ${folder}`);
    } catch (error) {
      console.error(`  ✗ Failed to remove ${folder}:`, error);
    }
  }

  console.log(`✅ Cleaned ${count} timestamped folder(s)\n`);
}

/**
 * Find all .mp4 files in screenshots directory
 */
async function findVideos(): Promise<string[]> {
  const glob = new Glob("output/screenshots/**/*.mp4");
  const files: string[] = [];

  for await (const file of glob.scan(".")) {
    files.push(file);
  }

  return files;
}

/**
 * Process a video with ffmpeg
 */
async function processVideo(inputPath: string): Promise<string | null> {
  try {
    const fileName = inputPath.split("/").pop() || "";
    const outputPath = join(OUTPUT_DIR, fileName);

    console.log(`🎬 Processing ${fileName}...`);

    const result = await $`ffmpeg -i ${inputPath} -vcodec libx264 -crf 23 -y ${outputPath}`.quiet();

    if (result.exitCode === 0) {
      console.log(`  ✓ Processed -> ${outputPath}`);
      return outputPath;
    }

    console.error(`  ✗ ffmpeg failed with exit code ${result.exitCode}`);
    return null;
  } catch (error) {
    console.error(`  ✗ Failed to process ${inputPath}:`, error);
    return null;
  }
}

/**
 * Process all videos with ffmpeg
 */
async function processAllVideos(): Promise<string[]> {
  console.log("🎥 Processing videos with ffmpeg...");

  const videos = await findVideos();

  if (videos.length === 0) {
    console.log("⚠️  No videos found to process\n");
    return [];
  }

  console.log(`📦 Found ${videos.length} video(s)\n`);

  const results = await Promise.all(videos.map((video) => processVideo(video)));

  const processed = results.filter((result) => result !== null) as string[];

  console.log(`✅ Processed ${processed.length}/${videos.length} video(s)\n`);

  return processed;
}

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
async function moveScreenshots(): Promise<void> {
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

      // Create target directory if it doesn't exist
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

/**
 * Clean up all mp4 and png files in output directory
 */
async function cleanupOutputFiles(): Promise<void> {
  console.log("🧹 Cleaning up output files...");

  const mp4Glob = new Glob("output/**/*.mp4");
  const pngGlob = new Glob("output/**/*.png");

  let count = 0;

  for await (const file of mp4Glob.scan(".")) {
    try {
      await Bun.file(file).delete();
      count += 1;
      console.log(`  ✓ Removed ${file}`);
    } catch (error) {
      console.error(`  ✗ Failed to remove ${file}:`, error);
    }
  }

  for await (const file of pngGlob.scan(".")) {
    try {
      await Bun.file(file).delete();
      count += 1;
      console.log(`  ✓ Removed ${file}`);
    } catch (error) {
      console.error(`  ✗ Failed to remove ${file}:`, error);
    }
  }

  console.log(`✅ Cleaned ${count} file(s)\n`);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🚀 Starting post-Maestro processing...\n");

  // Step 1: Clean timestamped folders
  await cleanTimestampedFolders();

  // Step 2: Process videos with ffmpeg
  const processedVideos = await processAllVideos();

  // Step 3: Upload videos to Vercel Blob (if any were processed)
  if (processedVideos.length > 0) {
    console.log("☁️  Uploading videos to Vercel Blob...");
    await $`bun run upload:videos`;
    console.log();
  }

  // Step 4: Move screenshots to docs
  await moveScreenshots();

  // Step 5: Clean up output files
  await cleanupOutputFiles();

  console.log("🎉 Post-processing complete!");
}

main();
