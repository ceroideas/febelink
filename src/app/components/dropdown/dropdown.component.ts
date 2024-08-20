import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {

  @ViewChild('filterInput') filterInput: ElementRef | undefined;

  @Input() currentDropdownItem: string | undefined = undefined;
  @Input() dropdownItems: {title: string, action: () => any}[] = [];
  @Input() placeholder: string = '';
  @Input() lucideIcon: string = '';
  @Input() withFilter: boolean = false;
  @Input() dropdownPosition: 'left' | 'right' = 'left';
  
  filteredDropdownItems: {title: string, action: () => any}[] = [];

  opened: boolean = false;

  filterText: string = '';

  constructor( 
    private utilities: UtilitiesService,
    private cdRef: ChangeDetectorRef 
  ) { }

  ngOnInit() {
    this.filteredDropdownItems = this.dropdownItems;
  }

  toggleDropdown() {
    this.opened = !this.opened;

    if ( this.opened ) {
      this.cdRef.detectChanges();
      this.filterInput?.nativeElement.focus();
    } else {
      this.filterText = '';
      this.filterDropdownItems();
    }
  }
  closeDropdown() {
    this.opened = false;
    this.filterText = '';
    this.filterDropdownItems();
  }

  filterDropdownItems() {
    this.filteredDropdownItems = this.dropdownItems.filter( item => this.utilities.normalizeString(item.title).includes(this.utilities.normalizeString(this.filterText)) );
  }
}
