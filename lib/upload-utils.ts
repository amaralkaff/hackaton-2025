import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

// Upload file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<UploadResult> {
  try {
    // Create unique filename
    const timestamp = Date.now()
    const fileName = `${path}/${timestamp}_${file.name}`

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Upload multiple files
export async function uploadMultipleFiles(
  files: File[],
  bucket: string,
  path: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadFile(file, bucket, path))
  return Promise.all(uploadPromises)
}

// Validate file type
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0]
      return file.type.startsWith(category + '/')
    }
    return file.type === type
  })
}

// Validate file size (in MB)
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Handle file input change
export function handleFileInputChange(
  event: React.ChangeEvent<HTMLInputElement>,
  options: {
    allowedTypes?: string[]
    maxSizeMB?: number
    onSuccess: (files: File[]) => void
    onError: (error: string) => void
  }
) {
  const files = Array.from(event.target.files || [])

  if (files.length === 0) {
    return
  }

  // Validate file types
  if (options.allowedTypes) {
    const invalidFiles = files.filter(
      file => !validateFileType(file, options.allowedTypes!)
    )
    if (invalidFiles.length > 0) {
      options.onError(
        `Invalid file type: ${invalidFiles.map(f => f.name).join(', ')}`
      )
      return
    }
  }

  // Validate file sizes
  if (options.maxSizeMB) {
    const oversizedFiles = files.filter(
      file => !validateFileSize(file, options.maxSizeMB!)
    )
    if (oversizedFiles.length > 0) {
      options.onError(
        `File too large: ${oversizedFiles.map(f => f.name).join(', ')} (max ${options.maxSizeMB}MB)`
      )
      return
    }
  }

  options.onSuccess(files)
}
