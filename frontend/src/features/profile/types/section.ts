export interface BaseSection {
  id: number;
  title: string;
  description: string;
}

export interface UploadedFile {
  publicId: string;
  url: string;
  sectionId: string;
}

export interface SectionWithFile extends BaseSection {
  files?: UploadedFile[];
}

