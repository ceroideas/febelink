import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { ShadowUsersService } from '../../services/shadow-users.service';
import { ShadowProductsService } from '../../services/shadow-products.service';

import { Subsector } from '../../interfaces/subsector';
import { Location } from '../../interfaces/location';
import { City } from '../../interfaces/city';

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
  @ViewChild('editPackModal') editPackModal: any;

  provinces: Location[] = [];
  cities: City[] = [];
  subsectors: Subsector[] = [];
  ownUsers: OwnUser[] = [];
  ownProducts: OwnProduct[] = [];
  filteredOwnProducts: OwnProduct[] = [];
  importedOwnProducts: OwnProduct[] = [];
  importedNewOwnProducts: OwnProduct[] = [];
  importedModifiedOwnProducts: OwnProduct[] = [];
  importedDeletedOwnProducts: OwnProduct[] = [];

  availableProfessions: {subSectorId: number, subSectorName: string, removed?: boolean}[] = [];

  currentOwnUser: OwnUser | undefined = undefined;
  currentOwnProduct: OwnProduct | undefined = undefined;

  selectedSubsectorId: number = 0;
  selectedCityId: number | undefined = undefined;

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
      this.keywordService.getSubSectorAll(),
      this.keywordService.getLocationKeywords(),
      this.keywordService.getCityKeywords()
    ]).then(([productsdata, usersData, subsectorsData, locationsData, citiesData]) => {
      this.ownUsers = usersData.response;
      this.filter({ target: { value: this.currentFilter } });

      this.ownProducts = productsdata.response;
      this.subsectors = subsectorsData.response;
      this.provinces = locationsData.response;
      this.cities = citiesData.response.sort((a: City, b: City) => a.locations_id.title.localeCompare(b.locations_id.title));

      this.ownProducts.forEach((item: any) => {
        item.userId = item.ownerUserId;
        item.userName = item.ownerUsername;
        item.subSectorId = item.sub_sector_id;
        item.subsector = this.subsectors.find(subsector => subsector.id === item.subSectorId)?.nombre || '';
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
  showCreatePack() {
    this.currentOwnUser = {
      id: 0,
      nick: '',
      descripcion: '',
      phone: '',
      email: '',
      location: [],
      profession: [],
      isNew: true,
    };
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
    this.editPackModal.nativeElement.showModal();
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

  addSubsector() {
    const subsector = this.subsectors.find(subsector => subsector.id === Number(this.selectedSubsectorId));
    if ( subsector ) {
      this.currentOwnUser?.profession.push({ subSectorId: subsector.id, subSectorName: subsector.nombre });
    }

    setTimeout(() => {
      this.selectedSubsectorId = 0;
      this.cdRef.detectChanges();
    });
  }
  addLocation() {
    const city = this.cities.find(city => city.id === Number(this.selectedCityId));

    if ( city ) {
      const location = this.provinces.find(location => location.id === city?.locations_id.id);
      
      if ( location ) {
        this.currentOwnUser?.location.push(
          { locationId: location.id, location: location.title, city: city.title }
        );
      }
    }

    setTimeout(() => {
      this.selectedCityId = undefined;
      this.cdRef.detectChanges();
    });
  }

  getAvailableProfessions() {
    const user = this.ownUsers.find(user => user.id === Number(this.currentOwnProduct?.userId));

    if ( user ) {
      this.availableProfessions = user.profession;
    }
  }

  export() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += 'Usuario propio;Título;Descripcion;Profesión;Precio;Precio por;Texto boton\n';

    // Add data
    const itemsCsv = this.filteredOwnProducts.map(item => {
      return `${item.userName};${item.title};${item.description};${item.subsector};${item.productUnitPrice};${this.unitTypes.find(subitem => subitem.id === item.unitTypeId)?.name};${this.buttonNameMapped.find(subitem => subitem.id === item.buttonName)?.name}`;
    })

    // Add data to csv
    csvContent += itemsCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "servicios_propios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  exportPack() {

  }
  import() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        lines.shift(); // Remove header
        const items = lines.map((line: string) => {
          const [user, title, description, subsector, price, priceType, buttonName] = line.split(';');
          return { user, title, description, subsector, price, priceType, buttonName };
        });

        console.log(this.subsectors);

        // Parse data
        this.importedOwnProducts = items.map((
          item: { user: string, title: string, description: string, subsector: string, price: string, priceType: string, buttonName: string }
        ) => {
          return {
            id: 0,
            title: item.title,
            description: item.description,
            subsector: item.subsector,
            subSectorId: this.subsectors.find(subsector => subsector.nombre === item.subsector)?.id || 0,
            userId: this.ownUsers.find(subitem => subitem.nick === item.user)?.id || 0,
            userName: item.user,
            productUnitPrice: Number(item.price),
            unitTypeId: this.unitTypes.find(subitem => this.normalizeStringToCompare(subitem.name) === this.normalizeStringToCompare(item.priceType))?.id || 0,
            buttonName: this.buttonNameMapped.find(subitem => this.normalizeStringToCompare(subitem.name) === this.normalizeStringToCompare(item.buttonName))?.id || 0,
          }
        })

        console.log(items);
        console.log(this.importedOwnProducts);

        // Check for new own product
        this.importedNewOwnProducts = this.importedOwnProducts.filter((item: OwnProduct) => 
          !this.ownProducts.find(subitem => subitem.title === item.title && subitem.description === item.description)
        );

        // Check for modified own product
        this.importedModifiedOwnProducts = this.importedOwnProducts
        .filter((item: OwnProduct) => 
          !!this.ownProducts.find(subitem => subitem.title === item.title && subitem.description === item.description)
        )
        .filter((item: OwnProduct) => {
          // Check if sector has been modified
          const currentOwnProduct = this.ownProducts.find(subitem => subitem.title === item.title && subitem.description === item.description);
          return this.normalizeStringToCompare(currentOwnProduct!.subsector) !== this.normalizeStringToCompare(item.subsector) ||
                 this.normalizeStringToCompare(currentOwnProduct!.userName) !== this.normalizeStringToCompare(item.userName) ||
                 this.normalizeStringToCompare(currentOwnProduct!.productUnitPrice.toString()) !== this.normalizeStringToCompare(item.productUnitPrice.toString()) ||
                 this.normalizeStringToCompare(currentOwnProduct!.unitTypeId.toString()) !== this.normalizeStringToCompare(item.unitTypeId.toString()) ||
                 this.normalizeStringToCompare(currentOwnProduct!.buttonName.toString()) !== this.normalizeStringToCompare(item.buttonName.toString())
        });

        // Check for deleted own product
        this.importedDeletedOwnProducts = this.ownProducts.filter((item: OwnProduct) => 
          !this.importedOwnProducts.find(subitem => subitem.title === item.title && subitem.description === item.description)
        );

        this.importSummaryModal.nativeElement.showModal();
      }
      reader.readAsText(file);
    }
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }
  importPack() {

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
  async createPack() {
    this.loadingRequest = true;

    try {
      const user = await this.shadowUsersService.create({
        nick: this.currentOwnUser?.nick,
        description: this.currentOwnUser?.descripcion,
        phone: this.currentOwnUser?.phone,
        email: this.currentOwnUser?.email,
        locations: this.currentOwnUser?.location,
        professions: this.currentOwnUser?.profession.map(item => {
          return {
            id: item.subSectorId,
            name: item.subSectorName,
          }
        }),
      })

      await this.shadowProductsService.create({
        userId: user.response.id,
        productUnitPrice: this.currentOwnProduct?.productUnitPrice,
        unitTypeId: this.currentOwnProduct?.unitTypeId,
        subSectorId: this.currentOwnUser?.profession[0].subSectorId,
        title: this.currentOwnProduct?.title,
        description: this.currentOwnProduct?.description,
        buttonName: this.currentOwnProduct?.buttonName,
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editPackModal.nativeElement.close();
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
    this.loadingRequest = true;

    try {
      for ( let item of this.selected ) {
        await this.shadowProductsService.delete(item.id!);
      }

      this.getData(true);

      this.loadingRequest = false;
      this.multipleDeleteModal.nativeElement.close();
    } catch (error) {
      this.loadingRequest = false;
    }
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
  async updatePack() {
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
    this.loadingRequest = true;

    // Create new own product
    for(let item of this.importedNewOwnProducts) {
      await this.shadowProductsService.create({
        userId: item?.userId,
        productUnitPrice: item?.productUnitPrice,
        unitTypeId: item?.unitTypeId,
        subSectorId: item?.subSectorId,
        title: item?.title,
        description: item?.description,
        buttonName: item?.buttonName,
      });
    };

    // Update modified own product
    for(let item of this.importedModifiedOwnProducts) {
      await this.shadowProductsService.update({
        id: this.ownProducts.find(subitem => subitem.title === item.title && subitem.description === item.description)?.id,
        userId: item?.userId,
        productUnitPrice: item?.productUnitPrice,
        unitTypeId: item?.unitTypeId,
        subSectorId: item?.subSectorId,
        title: item?.title,
        description: item?.description,
        buttonName: item?.buttonName,
      });
    };

    // Delete deleted own product
    for(let item of this.importedDeletedOwnProducts) {
      await this.shadowProductsService.delete(this.ownProducts.find(subitem => subitem.title === item.title && subitem.description === item.description)?.id!);
    };

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }
  async applyPackImport() {
    this.loadingRequest = true;

    // Create new own product
    for(let item of this.importedNewOwnProducts) {
      await this.shadowProductsService.create({
        userId: item?.userId,
        productUnitPrice: item?.productUnitPrice,
        unitTypeId: item?.unitTypeId,
        subSectorId: item?.subSectorId,
        title: item?.title,
        description: item?.description,
        buttonName: item?.buttonName,
      });
    };

    // Update modified own product
    for(let item of this.importedModifiedOwnProducts) {
      await this.shadowProductsService.update({
        id: this.ownProducts.find(subitem => subitem.title === item.title && subitem.description === item.description)?.id,
        userId: item?.userId,
        productUnitPrice: item?.productUnitPrice,
        unitTypeId: item?.unitTypeId,
        subSectorId: item?.subSectorId,
        title: item?.title,
        description: item?.description,
        buttonName: item?.buttonName,
      });
    };

    // Delete deleted own product
    for(let item of this.importedDeletedOwnProducts) {
      await this.shadowProductsService.delete(this.ownProducts.find(subitem => subitem.title === item.title && subitem.description === item.description)?.id!);
    };

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }
}
