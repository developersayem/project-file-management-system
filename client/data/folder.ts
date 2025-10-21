export interface FileItemType {
  _id: string;
  name: string;
  price?: number;
  numbers?: number;
  currency?: string;
}

export interface FolderType {
  _id: string;
  name: string;
  leads?: number;
  files?: FileItemType[];
  subfolders?: FolderType[];
}
