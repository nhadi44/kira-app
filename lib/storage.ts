import fs from "fs/promises";
import path from "path";
import os from "os";

/**
 * KIRA Storage Abstraction
 * Currently uses local temporary storage.
 * Designed to be easily swapped with GCS or S3.
 */
export const storage = {
  /**
   * Create a secure temporary directory for project processing
   */
  async createTempDir(prefix: string = "kira-scan") {
    const tempPath = path.join(os.tmpdir(), `${prefix}-${Date.now()}`);
    await fs.mkdir(tempPath, { recursive: true });
    return tempPath;
  },

  /**
   * Safely remove temporary processing directories
   */
  async cleanup(tempPath: string) {
    try {
      if (tempPath.startsWith(os.tmpdir())) {
        await fs.rm(tempPath, { recursive: true, force: true });
      }
    } catch (error) {
      console.error("[STORAGE_CLEANUP_ERROR]", error);
    }
  },

  /**
   * Save an uploaded file to a temporary location
   */
  async saveFile(tempDir: string, filename: string, buffer: Buffer) {
    const filePath = path.join(tempDir, filename);
    await fs.writeFile(filePath, buffer);
    return filePath;
  },
};
