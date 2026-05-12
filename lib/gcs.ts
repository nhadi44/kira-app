import { Storage } from "@google-cloud/storage";

// Gunakan credentials bawaan (akan otomatis terdeteksi di Cloud Run)
const storage = new Storage();

const BUCKET_NAME = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || "kira-project-archives-gen-lang-client-0046546237";

/**
 * Generate sebuah Signed URL untuk upload file langsung dari browser
 */
export async function generateV4UploadSignedUrl(filename: string, contentType: string = "application/zip") {
  const options = {
    version: "v4" as const,
    action: "write" as const,
    expires: Date.now() + 15 * 60 * 1000, // Valid selama 15 menit
    contentType,
  };

  const [url] = await storage
    .bucket(BUCKET_NAME)
    .file(filename)
    .getSignedUrl(options);

  return url;
}

/**
 * Unduh file dari GCS ke penyimpanan sementara lokal
 */
export async function downloadFileFromGCS(filename: string, destination: string) {
  const options = {
    destination,
  };

  await storage.bucket(BUCKET_NAME).file(filename).download(options);
}

/**
 * Hapus file dari GCS setelah diproses untuk menghemat ruang
 */
export async function deleteFileFromGCS(filename: string) {
  try {
    await storage.bucket(BUCKET_NAME).file(filename).delete();
  } catch (error) {
    console.error(`[GCS_DELETE_ERROR] Failed to delete ${filename}:`, error);
  }
}
