import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() items: string[] = []; // Input for the list of dropdown items
  @Input() defaultText: string = 'Выберите вариант'; // Optional input for default text
  @Output() selectedValue = new EventEmitter<string>(); // Output to emit selected value

  isDropdownOpen = false;
  selectedItem: string;

  constructor() {
    this.selectedItem = this.defaultText;
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
