import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit{
  @Input() items: string[] = [];
  @Input() defaultText: string = 'Выберите вариант';
  @Output() selectedValue = new EventEmitter<string>();
  @Input() defaultIsSelectable: boolean = false;

  isDropdownOpen = false;
  selectedItem: string = '';

  constructor() {
  }

  ngOnInit(): void {
    this.selectedItem = this.defaultText;
    if (this.defaultIsSelectable) {
      this.items.push(this.defaultText);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectItem(item: string) {
    this.selectedItem = item;
    this.isDropdownOpen = false;
    this.selectedValue.emit(item);
  }
}
