import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { preventDefault } from '../../../utils/utils';

@Component({
  selector: 'app-links-dropdown',
  templateUrl: './links-dropdown.component.html',
  styleUrls: ['./links-dropdown.component.scss'],
})
export class LinksDropdownComponent implements OnInit {

  @ViewChild('filterInput') filterInput: ElementRef | undefined;
  @ViewChild('selection') selection: ElementRef | undefined;

  @Input() currentDropdownItemSelection: {title: string, link: string, checked: boolean}[] = [];
  @Input() dropdownItems: {title: string, link: string, checked: boolean}[] = [];
  @Input() placeholder: string = '';
  @Input() lucideIcon: string = '';
  @Input() softLinks: boolean = false;
  
  @Output() itemClicked = new EventEmitter<{title: string, link: string, checked: boolean}>();
  @Output() currentSelectionUpdated = new EventEmitter<{title: string, link: string, checked: boolean}[]>();

  filteredDropdownItems: {title: string, link: string, checked: boolean}[] = [];

  opened: boolean = false;

  filterText: string = '';

  preventDefault = preventDefault;

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

  itemClick(item: {title: string, link: string, checked: boolean}) {
    item.checked = !item.checked;
    this.dropdownItems.find((i: {title: string, link: string, checked: boolean}) => i.title === item.title)!.checked = item.checked;

    if ( item.checked ) {
      this.currentDropdownItemSelection.push(item);
    } else {
      this.currentDropdownItemSelection = this.currentDropdownItemSelection.filter((i: {title: string, link: string, checked: boolean}) => i.title !== item.title);
    }

    this.cdRef.detectChanges();
    this.selection?.nativeElement.scrollTo({
      top: 0,
      left: this.selection?.nativeElement.scrollWidth,
      behavior: "smooth",
    });

    this.currentSelectionUpdated.emit(this.currentDropdownItemSelection);
    this.itemClicked.emit(item);
  }
}
