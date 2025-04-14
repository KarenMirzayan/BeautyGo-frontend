import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

export interface SelectItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrl: './multi-select-dropdown.component.css'
})
export class MultiSelectDropdownComponent {
  @Input() items: SelectItem[] = [];
  @Input() placeholder: string = 'Select items';
  @Output() selectionChange = new EventEmitter<number[]>();

  selectedIds: number[] = [];
  isDropdownOpen = false;

  get displayText(): string {
    if (this.selectedIds.length === 0) {
      return this.placeholder;
    }
    const selectedNames = this.items
      .filter(item => this.selectedIds.includes(item.id))
      .map(item => item.name);
    return selectedNames.join(', ') || this.placeholder;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSelection(id: number) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
    } else {
      this.selectedIds = [...this.selectedIds, id];
    }
    this.selectionChange.emit(this.selectedIds);
  }
}
