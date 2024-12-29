import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { ShadowUsersService } from '../../services/shadow-users.service';
import { ShadowProductsService } from '../../services/shadow-products.service';

import { Subsector } from '../../interfaces/subsector';
import { Location } from '../../interfaces/location';
import { OwnUser } from '../shadow-users/shadow-users.component';

interface OwnProduct {
  id?: number;
  title: string;
  description: string;
  subsector: string;
  subSectorId: number;
  userId: number;
  userName?: string;
  productUnitPrice: number;
  unitTypeId: number;
  buttonName: number;
  selected?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-shadow-products',
  templateUrl: './shadow-products.component.html'
})
export class ShadowProductsComponent extends BaseComponent implements OnInit {

  @ViewChild('keywordsModal') keywordsModal: any;
  @ViewChild('subsectorsModal') subsectorsModal: any;

  provinces: Location[] = [];
  subsectors: Subsector[] = [];
  ownUsers: OwnUser[] = [];
  ownProducts: OwnProduct[] = [];
  filteredOwnProducts: OwnProduct[] = [];
  importedOwnProducts: OwnProduct[] = [];
  importedNewOwnProducts: OwnProduct[] = [];
  importedModifiedOwnProducts: OwnProduct[] = [];
  importedDeletedOwnProducts: OwnProduct[] = [];

  availableProfessions: {subSectorId: number, subSectorName: string, removed?: boolean}[] = [];

  currentOwnProduct: OwnProduct | undefined = undefined;

  unitTypes = [
    {id: 1, name: 'Día', shorthand: 'día', lang: 'ES'},
    {id: 2, name: 'Mes', shorthand: 'mes', lang: 'ES'},
    {id: 3, name: 'Año', shorthand: 'año', lang: 'ES'},
    {id: 4, name: 'Unidad', shorthand: 'ud.', lang: 'ES'},
    {id: 5, name: 'Hora', shorthand: 'hora', lang: 'ES'},
    {id: 6, name: 'Consulta', shorthand: 'consulta', lang: 'ES'},
    {id: 7, name: 'Sesión', shorthand: 'sesión', lang: 'ES'},
    {id: 8, name: 'Jornada', shorthand: 'jornada', lang: 'ES'},
    {id: 9, name: 'Oferta', shorthand: 'oferta', lang: 'ES'},
    {id: 10, name: 'Campaña', shorthand: 'campaña', lang: 'ES'},
    {id: 11, name: 'Porcentaje', shorthand: '%', lang: 'ES'},
    {id: 12, name: 'Donación', shorthand: 'donación', lang: 'ES'},
    {id: 13, name: 'Presupuesto', shorthand: 'presupuesto', lang: 'ES'},
  ];

  buttonNameMapped = [
    {id: 1, name: 'Más Informacion'},
    {id: 2, name: 'Pedir Presupuesto'},
    {id: 3, name: 'Hacer una consulta'},
    {id: 4, name: 'Comprar Ahora'},
  ];

  get someSelected(): boolean {
    return this.filteredOwnProducts.some(item => item.selected);
  }

  get selected(): OwnProduct[] {
    return this.filteredOwnProducts.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentOwnProduct?.isNew && !!this.currentOwnProduct?.title && !!this.currentOwnProduct?.description;
  }

  get canUpdate(): boolean {
    return !this.currentOwnProduct?.isNew && !!this.currentOwnProduct?.title && !!this.currentOwnProduct?.description;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keywordService: KeywordService,
    private cdRef: ChangeDetectorRef,
    private shadowUsersService: ShadowUsersService,
    private shadowProductsService: ShadowProductsService,
  ) { 
    super();
  }

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.loading = false;

    Promise.all([
      this.shadowProductsService.get(),
      this.shadowUsersService.get(),
    ]).then(([productsdata, usersData]) => {
      this.ownUsers = usersData.response;
      this.filter({ target: { value: this.currentFilter } });

      this.ownProducts = productsdata.response;

      this.ownProducts.forEach((item: any) => {
        item.userId = item.ownerUserId;
        item.userName = item.ownerUsername;
        item.subSectorId = item.sub_sector_id;
        item.productUnitPrice = Number(item.unitPrice);
      });

      this.filter({ target: { value: this.currentFilter } });

      this.loading = false;
      this.cdRef.detectChanges();
    })
    .catch((error) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });

    this.keywordService.getLocationKeywords()
    .then((data: any) => {
      this.provinces = data.response;
      this.cdRef.detectChanges();
    })

    this.keywordService.getSubSectorAll()
    .then((data: any) => {
      this.subsectors = data.response;
      this.cdRef.detectChanges();
    })
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredOwnProducts = this.ownProducts.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentOwnProduct = {
      id: 0,
      title: '',
      description: '',
      subsector: '',
      subSectorId: 0,
      userId: 0,
      productUnitPrice: 0,
      unitTypeId: 0,
      buttonName: 0,
      isNew: true,
    };
    this.showCreateModal();
  }
  showKeywords(event: any, item: OwnProduct) {
    event.stopPropagation();
    this.currentOwnProduct = item;
    this.keywordsModal.nativeElement.showModal();
  }
  showSubsectors(event: any, item: OwnProduct) {
    event.stopPropagation();
    this.currentOwnProduct = item;
    this.subsectorsModal.nativeElement.showModal();
  }
  showEdit(event: any, item: OwnProduct) {
    event.stopPropagation();
    this.currentOwnProduct = JSON.parse(JSON.stringify(item));
    this.getAvailableProfessions();
    this.showEditModal();
  }
  showDelete(event: any, item: OwnProduct) {
    event.stopPropagation();
    this.currentOwnProduct = item;
    this.showDeleteModal();
  }

  getAvailableProfessions() {
    const user = this.ownUsers.find(user => user.id === Number(this.currentOwnProduct?.userId));

    if ( user ) {
      this.availableProfessions = user.profession;
    }
  }

  export() {
    // let csvContent = "data:text/csv;charset=utf-8,";

    // // Add header
    // csvContent += 'Título;Descripcion;Profesión;Provincia;Ciudad\n';

    // // Add data
    // const itemsCsv = this.filteredOwnProducts.map(item => {
    //   return `${item.title};${item.description};${item.subsector};${item.location};${item.city}`;
    // })

    // // Add data to csv
    // csvContent += itemsCsv.join('\n');

    // // Download csv
    // const encodedUri = encodeURI(csvContent);
    // const link = document.createElement("a");
    // link.setAttribute("href", encodedUri);
    // link.setAttribute("download", "servicios_propios.csv");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  }
  import() {
    // const input = document.createElement('input');
    // input.type = 'file';
    // input.accept = '.csv';
    // input.onchange = (event: any) => {
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     const csv = e.target.result;
    //     const lines = csv.split('\n');
    //     lines.shift(); // Remove header
    //     const items = lines.map((line: string) => {
    //       const [description, subsector, location] = line.split(';');
    //       return { description, subsector, location };
    //     });

    //     // Parse data
    //     this.importedOwnProducts = items.map((
    //       item: { title: string, description: string, subsector: string, location: string, city: string }
    //     ) => {
    //       return {
    //         title: item.title,
    //         description: item.description,
    //         subsector: item.subsector,
    //         location: item.location,
    //         location_id: this.provinces.find(province => province.title === item.location)?.id || 0,
    //         subsector_id: this.subsectors.find(subsector => subsector.nombre === item.subsector)?.id || 0,
    //         city: item.city,
    //       }
    //     })

    //     // Check for new own product
    //     this.importedNewOwnProducts = this.importedOwnProducts.filter((item: OwnProduct) => 
    //       !this.ownProducts.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city)
    //     );

    //     // Check for modified own product
    //     this.importedModifiedOwnProducts = this.importedOwnProducts
    //     .filter((item: OwnProduct) => 
    //       !!this.ownProducts.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city)
    //     )
    //     .filter((item: OwnProduct) => {
    //       // Check if sector has been modified
    //       const currentOwnProduct = this.ownProducts.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city);
    //       return currentOwnProduct!.title !== item.title || 
    //              currentOwnProduct!.description !== item.description
    //     });

    //     // Check for deleted own product
    //     this.importedDeletedOwnProducts = this.ownProducts.filter((item: OwnProduct) => 
    //       !this.importedOwnProducts.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city)
    //     );

    //     this.importSummaryModal.nativeElement.showModal();
    //   }
    //   reader.readAsText(file);
    // }
    // document.body.appendChild(input);
    // input.click();
    // document.body.removeChild(input);
  }

  async create() {
    this.loadingRequest = true;

    try {
      await this.shadowProductsService.create({
        userId: this.currentOwnProduct?.userId,
        productUnitPrice: this.currentOwnProduct?.productUnitPrice,
        unitTypeId: this.currentOwnProduct?.unitTypeId,
        subSectorId: this.currentOwnProduct?.subSectorId,
        title: this.currentOwnProduct?.title,
        description: this.currentOwnProduct?.description,
        buttonName: this.currentOwnProduct?.buttonName,
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentOwnProduct = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.shadowProductsService.delete(this.currentOwnProduct!.id!);

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentOwnProduct = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteMultiple() {
    // this.loadingRequest = true;

    // try {
    //   for ( let item of this.selected ) {
    //     await this.searchForYouService.delete(item.id!);
    //   }

    //   this.getData(true);

    //   this.loadingRequest = false;
    //   this.multipleDeleteModal.nativeElement.close();
    // } catch (error) {
    //   this.loadingRequest = false;
    // }
  }
  async update() {
    this.loadingRequest = true;

    try {
      // Update sector
      await this.shadowProductsService.update({
        id: this.currentOwnProduct?.id,
        userId: this.currentOwnProduct?.userId,
        productUnitPrice: this.currentOwnProduct?.productUnitPrice,
        unitTypeId: this.currentOwnProduct?.unitTypeId,
        subSectorId: this.currentOwnProduct?.subSectorId,
        title: this.currentOwnProduct?.title,
        description: this.currentOwnProduct?.description,
        buttonName: this.currentOwnProduct?.buttonName,
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentOwnProduct = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    // this.loadingRequest = true;

    // // Create new own product
    // for(let item of this.importedNewOwnProducts) {
    //   await this.searchForYouService.create({
    //     location: item?.location_id.toString(),
    //     subsector: item?.subsector_id.toString(),
    //     description: item!.description,
    //   });
    // };

    // // Update modified own product
    // for(let item of this.importedModifiedOwnProducts) {
    //   await this.searchForYouService.update({
    //     location: item?.location_id.toString(),
    //     subsector: item?.subsector_id.toString(),
    //     description: item!.description,
    //   });
    // };

    // // Delete deleted own product
    // for(let item of this.importedDeletedOwnProducts) {
    //   await this.searchForYouService.delete(item.id!);
    // };

    // this.getData(true);

    // this.loadingRequest = false;
    // this.closeImportSummaryModal()
  }
}
