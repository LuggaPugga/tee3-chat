import { FileAttachment } from "@/lib/ai/generate"
import { db } from "@/utils/instant"

export function getContentTypeFromPath(path: string): string {
  const extension = path.toLowerCase().split(".").pop() || ""
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    pdf: "application/pdf",
    txt: "text/plain",
    md: "text/markdown",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }
  return mimeTypes[extension] || "application/octet-stream"
}

export async function uploadFilesToStorage(
  files: File[],
  messageId: string,
  userId: string
): Promise<FileAttachment[]> {
  const uploadPromises = files.map(async (file): Promise<FileAttachment> => {
    const path = `${userId}/messages/${messageId}/${file.name}`

    try {
      const uploadResult = await db.storage.uploadFile(path, file, {
        contentType: file.type,
      })

      const fileQuery = await db.queryOnce({
        $files: {
          $: {
            where: { id: uploadResult.data.id },
          },
        },
      })

      const uploadedFile = fileQuery.data.$files[0]

      return {
        id: uploadResult.data.id,
        url: uploadedFile?.url || "",
        path: uploadedFile?.path || path,
        contentType: file.type,
      }
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error)
      throw new Error(`Upload failed for ${file.name}`)
    }
  })

  return Promise.all(uploadPromises)
}

export function getMessageFiles(messageData: any): FileAttachment[] {
  return (
    messageData?.$files?.map((file: any) => ({
      id: file.id,
      url: file.url,
      path: file.path,
      contentType: getContentTypeFromPath(file.path),
    })) || []
  )
}

export const ACCEPTED_FILE_TYPES = [
  ".txt",
  ".md",
  ".pdf",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
]

export const MAX_FILE_SIZE = 10
export const MAX_FILES = 5
