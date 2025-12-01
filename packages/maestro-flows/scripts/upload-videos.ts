import { put } from "@vercel/blob";
import { Glob } from "bun";

async function findMp4Files(): Promise<string[]> {
  const glob = new Glob("output/**/*.mp4");

  const files: string[] = [];

  for await (const file of glob.scan(".")) {
    files.push(file);
  }

  return files;
}

/**
 * Upload a single video file to Vercel Blob
 */
async function uploadVideo(filePath: string): Promise<string | null> {
  try {
    const file = Bun.file(filePath);

    const fileName = filePath.split("/").pop() || filePath;

    console.log(`📤 Uploading ${fileName}...`);

    const { url } = await put(`videos/${fileName}`, file, {
      access: "public",
      contentType: "video/mp4",
      addRandomSuffix: false,
      multipart: true,
    });

    console.log(`✅ Uploaded ${fileName} -> ${url}`);

    return url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error);

    return null;
  }
}

/**
 * Upload all .mp4 files to Vercel Blob
 */
async function uploadAllVideos(): Promise<void> {
  console.log("🔍 Searching for .mp4 files...");

  const mp4Files = await findMp4Files();

  if (mp4Files.length === 0) {
    console.log("⚠️  No .mp4 files found in output directory");
    return;
  }

  console.log(`📦 Found ${mp4Files.length} video file(s)\n`);

  const results = await Promise.allSettled(mp4Files.map((file) => uploadVideo(file)));

  const successful = results.filter((result) => result.status === "fulfilled" && result.value !== null).length;

  console.log(`\n🎉 Upload complete: ${successful}/${mp4Files.length} files uploaded successfully`);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.error("❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set");

    console.log("\n💡 Set it by running: export BLOB_READ_WRITE_TOKEN=your_token_here");

    process.exit(1);
  }

  await uploadAllVideos();
}

main();
