import { Component, ViewChild } from "@angular/core";

import { toSlug } from '../../utils/utils';

@Component({ template: '' })
export abstract class BaseComponent {

  @ViewChild('editModal') editModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('multipleDeleteModal') multipleDeleteModal: any;
  @ViewChild('importSummaryModal') importSummaryModal: any;

  loading: boolean = true;
  loadingRequest: boolean = false;

  currentFilter: string = '';

  abstract get someSelected(): boolean;
  abstract get selected(): any[];
  abstract get canCreate(): boolean;
  abstract get canUpdate(): boolean;

  abstract getData(refresh: boolean): void;
  abstract filter(event: any): void;
  abstract export(): void;
  abstract import(): void;
  abstract create(): void;
  abstract update(): void;
  abstract delete(): void;
  abstract deleteMultiple(): void;

  showCreateModal() {
    this.editModal.nativeElement.showModal();
  }
  showEditModal() {
    this.editModal.nativeElement.showModal();
  }
  showDeleteModal() {
    this.deleteModal.nativeElement.showModal();
  }
  showMultipleDeleteModal() {
    this.multipleDeleteModal.nativeElement.showModal();
  }

  closeDeleteModal() {
    this.deleteModal.nativeElement.close();
  }
  closeMultipleDeleteModal() {
    this.multipleDeleteModal.nativeElement.close();
  }
  closeImportSummaryModal() {
    this.importSummaryModal.nativeElement.close();
  }

  onImageError(item: any) {
    item.icon = '';
  }

  generateLink(string: string | undefined, prefix: string = '', suffix: string = ''): string {
    if (!string) return '';
    return `${prefix && prefix + '-'}${toSlug(string).toLocaleLowerCase()}${suffix && '-' + suffix}`;
  }

  normalizeStringToCompare(string: string | undefined | null): string {
    if (!string) return '';
    return string;
  }
}
