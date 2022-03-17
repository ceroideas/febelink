export enum FilePickType {
    IMAGE = 'image/x-png,image/jpeg,image/gif'
    , VIDEO = 'video/mp4'
    , BOTH = 'video/mp4,image/x-png,image/jpeg,image/gif'
}
export enum FileElementType {
      AVATAR
    , IMG
    , ION_IMG
    , VIDEO
    , ANY
}
export enum FileMaxSize { // In Bytes
      BLOB_TINY = 255               // Up to 0.255 bytes ( 0.000255 MB )
    , BLOB = 65535                  // Up to 64 Kb ( 0.064 MB )
    , BLOB_MEDIUM = 16777215        // Up to 16 Mb
    , BLOBL_LONG = 4294967295       // Up to 4 Gb
    , MAX_ALLOWED_PACKET = 4194304  // Up to 4 Mb
}

export interface IFile {
    type?: 'IFile'
    src?: string | ArrayBuffer
    file?: any
    format?: FilePickType
    ext?: string
}
