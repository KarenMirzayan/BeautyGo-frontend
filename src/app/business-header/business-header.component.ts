import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-business-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './business-header.component.html',
  styleUrl: './business-header.component.css'
})
export class BusinessHeaderComponent {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
