import { IFile } from "../../../components/file-picker/models/file.model";

export interface ISearchFull {
  
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  subsector?: string;
  title?: string;
  description?: string;
  isTemplate?: number;
  images?: (string | IFile)[];

}
