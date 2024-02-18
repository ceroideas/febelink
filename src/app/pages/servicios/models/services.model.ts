import {IFile} from '../../../components/file-picker/models/file.model';

export interface IServiceFull {
  productId?: number;
  cartId?: number;
  title?: string;
  description?: string;
  productUnitPrice?: number | string;
  unitTypeId?: number;
  subSectorId?: number;
  isTemplate?: number;
  images?: (string | IFile)[];
  whom?: string;
  buttonName?: number;

}
