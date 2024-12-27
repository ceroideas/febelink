import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { SearchforyouService } from '../../services/searchforyou.service';

import { Subsector } from '../../interfaces/subsector';
import { AskForBudget as LegacyAskForBudget } from '../../interfaces/ask-for-budget';
import { Location } from '../../interfaces/location';

interface AskForBudget extends LegacyAskForBudget {
  selected?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html'
})
export class BudgetsComponent extends BaseComponent implements OnInit {

  @ViewChild('keywordsModal') keywordsModal: any;
  @ViewChild('subsectorsModal') subsectorsModal: any;

  provinces: Location[] = [];
  subsectors: Subsector[] = [];
  askForBudgets: AskForBudget[] = [];
  filteredAskForBudgets: AskForBudget[] = [];
  importedAskForBudgets: AskForBudget[] = [];
  importedNewAskForBudgets: AskForBudget[] = [];
  importedModifiedAskForBudgets: AskForBudget[] = [];
  importedDeletedAskForBudgets: AskForBudget[] = [];

  currentAskForBudget: AskForBudget | undefined = undefined;

  get someSelected(): boolean {
    return this.filteredAskForBudgets.some(item => item.selected);
  }

  get selected(): AskForBudget[] {
    return this.filteredAskForBudgets.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentAskForBudget?.isNew && !!this.currentAskForBudget?.subsector_id && !!this.currentAskForBudget?.description && !!this.currentAskForBudget?.location_id;
  }

  get canUpdate(): boolean {
    return !this.currentAskForBudget?.isNew && !!this.currentAskForBudget?.subsector_id && !!this.currentAskForBudget?.description && !!this.currentAskForBudget?.location_id;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keywordService: KeywordService,
    private cdRef: ChangeDetectorRef,
    private searchForYouService: SearchforyouService
  ) { 
    super();
  }

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.searchForYouService.getAllRequests([], []).then((data: any) => {
      this.askForBudgets = data.response;
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

  getSubsectors() {
    return this.keywordService.getSubSectorAll()
    .then((data: any) => {
      return data;
    })
    .catch((error) => {
      this.loading = false;
    });
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredAskForBudgets = this.askForBudgets.filter(item => item.description.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentAskForBudget = {
      id: 0,
      date: '',
      description: '',
      email: '',
      images: [],
      location: '',
      location_id: 0,
      name: '',
      phone: '',
      sector: '',
      sector_id: 0,
      subsector: '',
      subsector_id: 0,
      title: '',
      isNew: true,
    };
    this.showCreateModal();
  }
  showKeywords(event: any, item: AskForBudget) {
    event.stopPropagation();
    this.currentAskForBudget = item;
    this.keywordsModal.nativeElement.showModal();
  }
  showSubsectors(event: any, item: AskForBudget) {
    event.stopPropagation();
    this.currentAskForBudget = item;
    this.subsectorsModal.nativeElement.showModal();
  }
  showEdit(event: any, item: AskForBudget) {
    event.stopPropagation();
    this.currentAskForBudget = JSON.parse(JSON.stringify(item));
    this.showEditModal();
  }
  showDelete(event: any, item: AskForBudget) {
    event.stopPropagation();
    this.currentAskForBudget = item;
    this.showDeleteModal();
  }
  viewSubsector(event: any, item: AskForBudget) {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree(['admin/subsectors'], { queryParams: { subsector: item.subsector_id } }));
    window.open(url, '_blank');
  }
  viewLocation(event: any, item: AskForBudget) {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree(['admin/provinces'], { queryParams: { province: item.location_id } }));
    window.open(url, '_blank');
  }

  export() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += 'Descripcion;Profesión;Provincia\n';

    // Add data
    const itemsCsv = this.filteredAskForBudgets.map(item => {
      return `${item.description};${item.subsector};${item.location}`;
    })

    // Add data to csv
    csvContent += itemsCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "solicitudes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          const [description, subsector, location] = line.split(';');
          return { description, subsector, location };
        });

        // Parse data
        this.importedAskForBudgets = items.map((item: { description: string, subsector: string, location: string }) => {
          return {
            description: item.description,
            subsector: item.subsector,
            location: item.location,
            location_id: this.provinces.find(province => province.title === item.location)?.id || 0,
            subsector_id: this.subsectors.find(subsector => subsector.nombre === item.subsector)?.id || 0,
          }
        })

        // Check for new ask for budgets
        this.importedNewAskForBudgets = this.importedAskForBudgets.filter((sector: AskForBudget) => 
          !this.askForBudgets.find(item => item.description === sector.description)
        );

        // Check for modified ask for budgets
        this.importedModifiedAskForBudgets = this.importedAskForBudgets
        .filter((ask: AskForBudget) => 
          !!this.askForBudgets.find(item => item.description === ask.description)
        )
        .filter((ask: AskForBudget) => {
          // Check if sector has been modified
          const currentAskForBudget = this.askForBudgets.find(item => item.description === ask.description);
          return currentAskForBudget!.location !== ask.location || 
                 currentAskForBudget!.subsector !== ask.subsector
        });

        // Check for deleted ask for budgets
        this.importedDeletedAskForBudgets = this.askForBudgets.filter((ask: AskForBudget) => 
          !this.importedAskForBudgets.find(item => item.description === ask.description)
        );

        this.importSummaryModal.nativeElement.showModal();
      }
      reader.readAsText(file);
    }
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  async create() {
    this.loadingRequest = true;

    try {
      await this.searchForYouService.create({
        location: this.currentAskForBudget?.location_id.toString(),
        subsector: this.currentAskForBudget?.subsector_id.toString(),
        description: this.currentAskForBudget!.description,
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentAskForBudget = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.searchForYouService.delete(this.currentAskForBudget!.id);

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentAskForBudget = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteMultiple() {
    this.loadingRequest = true;

    try {
      for ( let sector of this.selected ) {
        await this.searchForYouService.delete(sector.id);
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
      await this.searchForYouService.update({
        id: this.currentAskForBudget?.id,
        location: this.currentAskForBudget?.location_id.toString(),
        subsector: this.currentAskForBudget?.subsector_id.toString(),
        description: this.currentAskForBudget!.description,
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentAskForBudget = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    this.loadingRequest = true;

    // Create new ask for budgets
    for(let item of this.importedNewAskForBudgets) {
      await this.searchForYouService.create({
        location: item?.location_id.toString(),
        subsector: item?.subsector_id.toString(),
        description: item!.description,
      });
    };

    // Update modified ask for budgets
    for(let item of this.importedModifiedAskForBudgets) {
      await this.searchForYouService.update({
        location: item?.location_id.toString(),
        subsector: item?.subsector_id.toString(),
        description: item!.description,
      });
    };

    // Delete deleted ask for budgets
    for(let item of this.importedDeletedAskForBudgets) {
      await this.searchForYouService.delete(item.id);
    };

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }
}
