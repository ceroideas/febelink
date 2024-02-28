import { IFile } from "src/app/components/file-picker/models/file.model";

export interface ISearchFull {
  
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  description?: string;
  isTemplate?: number;
  images?: (string | IFile)[];

}
