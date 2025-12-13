export interface BaseSection {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
}

export interface UploadedFile {
  publicId: string;
  url: string;
  sectionId: string;
  sizeInBytes: number;
  userId: number | string;
  originalName?: string;
}

export interface SectionWithFile extends BaseSection {
  files?: UploadedFile[];
}

