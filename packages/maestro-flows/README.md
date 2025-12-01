# Maestro Flows - Post-Processing Automation

This package contains Maestro test flows and automated post-processing scripts for generating and managing app screenshots and videos.

## Workflow

When you run `bun run maestro`, the following automated workflow executes:

1. **Run Maestro Tests** - Executes all Maestro flows and generates recordings
2. **Post-Processing** (automatic via `postmaestro` hook):
   - Cleans up timestamped folders (`2025-*`)
   - Processes videos with ffmpeg (compresses using H.264 codec)
   - Uploads processed videos to Vercel Blob
   - Moves screenshots to docs with preserved folder structure
   - Cleans up temporary files

## Scripts

### `bun run maestro`
Runs Maestro tests and automatically triggers post-processing.

### `bun run process:recordings`
Manually run the post-processing pipeline:
- Clean timestamped folders
- Process videos with ffmpeg
- Upload to Vercel Blob
- Move screenshots to docs
- Clean up output files

### `bun run upload:videos`
Upload all `.mp4` files from the `output` directory to Vercel Blob.

**Requirements:**
- Set `BLOB_READ_WRITE_TOKEN` environment variable

```bash
export BLOB_READ_WRITE_TOKEN=your_token_here
bun run upload:videos
```

## File Structure

```
output/
  screenshots/          # Maestro output
    onboarding/
      *.mp4            # Source videos
      *.png            # Screenshots
  *.mp4                # Processed videos (after ffmpeg)
```

## Video Processing

Videos are processed with ffmpeg using these settings:
- Codec: H.264 (libx264)
- CRF: 23 (balanced quality/size)
- Output: `output/<name>.mp4`

## Screenshot Management

Screenshots are automatically moved from:
```
output/screenshots/onboarding/screenshot-1.png
```
to:
```
apps/docs/public/screenshots/onboarding/screenshot-1.png
```

The folder structure is preserved during the move.

## Dependencies

- **ffmpeg** - Must be installed on your system
- **@vercel/blob** - For uploading videos
- **Bun** - Runtime and glob support

