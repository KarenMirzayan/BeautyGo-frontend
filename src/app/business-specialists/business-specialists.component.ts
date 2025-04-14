import { Component, OnInit } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { BusinessSpecialistPopupComponent } from '../business-specialist-popup/business-specialist-popup.component';
import { BusinessSpecialistChangeComponent } from '../business-specialist-change/business-specialist-change.component';
import { Staff } from '../models';
import { StaffService } from '../staff.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-business-specialists',
  standalone: true,
  imports: [
    DropdownComponent,
    BusinessSpecialistPopupComponent,
    BusinessSpecialistChangeComponent,
    NgForOf
  ],
  templateUrl: './business-specialists.component.html',
  styleUrls: ['./business-specialists.component.css']
})
export class BusinessSpecialistsComponent implements OnInit {
  showPopupCreate: boolean = false;
  showPopupUpdate: boolean = false;
  staff: Staff[] = [];
  filteredStaff: Staff[] = [];
  positions: string[] = [];
  searchTerm: string = '';
  selectedPosition: string = '';

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getStaffs(5).subscribe({
      next: (data) => {
        console.log('Staff loaded:', data);
        this.staff = data;
        this.filteredStaff = data;
        this.updatePositions();
      },
      error: (error) => {
        console.error('Error loading staff:', error);
      }
    });
  }

  updatePositions(): void {
    const uniquePositions = Array.from(new Set(this.staff.map(s => s.position)));
    this.positions = ['Все профессии', ...uniquePositions];
  }

  openPopupCreate(): void {
    this.showPopupCreate = true;
  }

  closePopupCreate(message: string): void {
    this.showPopupCreate = false;
    if (message === 'error') {
      alert('Не получилось создать специалиста. Пожалуйста, попробуйте снова');
    } else if (message === 'success') {
      this.loadStaff();
    }
  }

  openPopupUpdate(): void {
    this.showPopupUpdate = true;
  }

  closePopupUpdate(): void {
    this.showPopupUpdate = false;
  }

  onPositionSelected(position: string): void {
    this.selectedPosition = position;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }
  applyFilters(): void {
    let tempStaff = this.staff;
    if (this.searchTerm) {
      tempStaff = tempStaff.filter(s =>
        `${s.name} ${s.surname}`.toLowerCase().includes(this.searchTerm)
      );
    }
    if (this.selectedPosition && this.selectedPosition !== 'Все профессии') {
      tempStaff = tempStaff.filter(s => s.position === this.selectedPosition);
    }
    this.filteredStaff = tempStaff;
  }
}
