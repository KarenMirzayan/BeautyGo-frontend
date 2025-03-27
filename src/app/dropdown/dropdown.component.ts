import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  isDropdownOpen = false;
  selectedProfession = 'Все профессии'; // Default text
  professions = ['Все профессии', 'Парикмахер', 'Визажист', 'Маникюрщик', 'Массажист'];

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectProfession(profession: string) {
    this.selectedProfession = profession;
    this.isDropdownOpen = false;
  }
}
