#!/usr/bin/env bun
import { join } from "node:path";
import { $, Glob } from "bun";

const OUTPUT_DIR = "output";

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

      // Delete the original video to avoid duplicates
      try {
        await Bun.file(inputPath).delete();
        console.log(`  ✓ Deleted original -> ${inputPath}`);
      } catch (deleteError) {
        console.error(`  ⚠️  Failed to delete original ${inputPath}:`, deleteError);
      }

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
async function main(): Promise<void> {
  console.log("🎥 Processing videos with ffmpeg...");

  const videos = await findVideos();

  if (videos.length === 0) {
    console.log("⚠️  No videos found to process\n");
    return;
  }

  console.log(`📦 Found ${videos.length} video(s)\n`);

  const results = await Promise.all(videos.map((video) => processVideo(video)));

  const processed = results.filter((result) => result !== null) as string[];

  console.log(`✅ Processed ${processed.length}/${videos.length} video(s)\n`);
}

main();
