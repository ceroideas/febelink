import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { Link as LegacyLink } from '../../interfaces/link';

interface Link extends LegacyLink {
  selected?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-footer-links',
  templateUrl: './footer-links.component.html'
})
export class FooterLinksComponent extends BaseComponent implements OnInit {

  links: Link[] = [];
  filteredLinks: Link[] = [];
  importedLinks: Link[] = [];
  importedNewLinks: Link[] = [];
  importedModifiedLinks: Link[] = [];
  importedDeletedLinks: Link[] = [];

  currentLink: Link | undefined = undefined;

  get someSelected(): boolean {
    return this.filteredLinks.some(item => item.selected);
  }

  get selected(): Link[] {
    return this.filteredLinks.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentLink?.isNew && !!this.currentLink?.title && !!this.currentLink?.link && !!this.currentLink?.h1 && !!this.currentLink?.h2 && !!this.currentLink?.page_title && !!this.currentLink?.meta_description;
  }

  get canUpdate(): boolean {
    return !this.currentLink?.isNew && !!this.currentLink?.title && !!this.currentLink?.link && !!this.currentLink?.h1 && !!this.currentLink?.h2 && !!this.currentLink?.page_title && !!this.currentLink?.meta_description;
  }

  constructor(
    private router: Router,
    private keywordService: KeywordService,
  ) { 
    super();
  }

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.keywordService.getLinkFooterKeywords()
    .then((data: any) => {
      this.links = data.response;
      this.filter({ target: { value: this.currentFilter } });

      this.loading = false;
    })
    .catch((error) => {
      this.loading = false;
    });
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredLinks = this.links.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentLink = {
      id: 0,
      title: '',
      link: '',
      h1: '',
      h2: '',
      page_title: '',
      meta_description: '',
      isNew: true,
    };
    this.showCreateModal();
  }
  showEdit(event: any, item: Link) {
    event.stopPropagation();
    this.currentLink = JSON.parse(JSON.stringify(item));
    this.showEditModal();
  }
  showDelete(event: any, item: Link) {
    event.stopPropagation();
    this.currentLink = item;
    this.showDeleteModal();
  }

  viewLink(event: any, link: string) {
    event.stopPropagation();
    window.open(link, '_blank');
  }

  export() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += 'Título;Enlace;H1;H2;Título de página;Meta descripción\n';

    // Add data
    const linksCsv = this.filteredLinks.map(item => {
      return `${item.title};${item.link};${item.h1};${item.h2};${item.page_title};${item.meta_description}`;
    })

    // Add data to csv
    csvContent += linksCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enlaces.csv");
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
        const links = lines.map((line: string) => {
          const [title, link, h1, h2, page_title, meta_description] = line.split(';');
          return { title, link, h1, h2, page_title, meta_description };
        });

        // Parse data
        this.importedLinks = links.map((link: { title: string, link: string, h1: string, h2: string, page_title: string, meta_description: string }) => {
          return {
            title: link.title,
            link: link.link,
            h1: link.h1,
            h2: link.h2,
            page_title: link.page_title,
            meta_description: link.meta_description
          }
        })

        // Check for new links
        this.importedNewLinks = this.importedLinks.filter((link: Link) => 
          !this.links.find(item => item.title === link.title)
        );

        // Check for modified links
        this.importedModifiedLinks = this.importedLinks
        .filter((link: Link) => 
          !!this.links.find(item => item.title === link.title)
        )
        .filter((link: Link) => {
          // Check if link has been modified
          const currentLink = this.links.find(item => item.title === link.title);
          return currentLink!.link !== link.link || 
                 currentLink!.h1 !== link.h1 || 
                 currentLink!.h2 !== link.h2 || 
                 currentLink!.page_title !== link.page_title || 
                 currentLink!.meta_description !== link.meta_description;
        });

        // Check for deleted links
        this.importedDeletedLinks = this.links.filter((link: Link) => 
          !this.importedLinks.find(item => item.title === link.title)
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
      await this.keywordService.addLinkFooterKeyword({
        title: this.currentLink!.title, 
        link: this.currentLink!.link,
        pagetitle: this.currentLink!.page_title,
        h1: this.currentLink!.h1,
        h2: this.currentLink!.h2,
        description: this.currentLink!.meta_description
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentLink = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.keywordService.removeLinkFooterKeyword(Number(this.currentLink!.id));

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentLink = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteMultiple() {
    this.loadingRequest = true;

    try {
      for ( let link of this.selected ) {
        await this.keywordService.removeLinkFooterKeyword(link.id);
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
      // Update link
      await this.keywordService.updateLinkFooterKeyword({
        footer: this.currentLink!.id,
        title: this.currentLink!.title, 
        link: this.currentLink!.link,
        pagetitle: this.currentLink!.page_title,
        h1: this.currentLink!.h1,
        h2: this.currentLink!.h2,
        description: this.currentLink!.meta_description
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentLink = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    this.loadingRequest = true;

    // Create new links
    for(let link of this.importedNewLinks) {
      await this.keywordService.addLinkFooterKeyword({
        title: link.title, 
        link: link.link,
        pagetitle: link.page_title,
        h1: link.h1,
        h2: link.h2,
        description: link.meta_description
      });
    };

    // Update modified links
    for(let link of this.importedModifiedLinks) {
      await this.keywordService.updateLinkFooterKeyword({
        footer: this.links.find(item => item.title === link.title)!.id,
        title: link.title, 
        link: link.link || this.generateLink(link.title),
        pagetitle: link.page_title,
        h1: link.h1,
        h2: link.h2,
        description: link.meta_description
      });
    };

    // Delete deleted links
    for(let link of this.importedDeletedLinks) {
      await this.keywordService.removeLinkFooterKeyword(link.id);
    };

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }
}
