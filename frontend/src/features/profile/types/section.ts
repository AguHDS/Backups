export interface UserFile {
  publicId: string;
  url: string;
  sectionId: string;
}

export interface Section {
  id: number;
  title: string;
  description: string;
  files?: UserFile[];
}
