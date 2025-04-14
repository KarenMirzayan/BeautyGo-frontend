import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { MultiSelectDropdownComponent, SelectItem } from '../multi-select-dropdown/multi-select-dropdown.component';
import { BusinessService} from '../business.service';
import {StaffService} from "../staff.service";
import {Staff} from "../models";
import {ServicesService} from "../services.service";

@Component({
  selector: 'app-business-service-create',
  standalone: true,
  imports: [
    CommonModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    DropdownComponent,
    MultiSelectDropdownComponent
  ],
  templateUrl: './business-service-create.component.html',
  styleUrls: ['./business-service-create.component.css']
})
export class BusinessServiceCreateComponent implements OnInit {
  serviceForm: FormGroup;
  staffMembers: SelectItem[] = [];

  @Input() isVisible: boolean = false;
  @Output() closePopup = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private businessService: BusinessService, private staffService: StaffService,
              private servicesService: ServicesService) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      lowestPrice: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      highestPrice: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      topic: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      businessId: [5, Validators.required],
      staffIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStaffMembers();
  }

  loadStaffMembers(): void {
    this.staffService.getStaffs(5).subscribe({
      next: (staff: Staff[]) => {
        this.staffMembers = staff.map(s => ({ id: s.id, name: s.name }));
        console.log('Loaded staff:', this.staffMembers);
      },
      error: (error) => {
        console.error('Error loading staff:', error);
      }
    });
  }

  onStaffSelectionChange(selectedIds: number[]): void {
    this.serviceForm.patchValue({ staffIds: selectedIds });
    console.log('Masters updated:', this.serviceForm.get('staffIds')?.value);
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      console.log('Form Submitted!', this.serviceForm.value);
      this.servicesService.postService(this.serviceForm.value).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.serviceForm.reset()
          this.closePopup.emit("success")
        },
        error: (error) => {
          console.error(error);
          this.closePopup.emit("error")
        }
      })
      this.closePopup.emit();
    } else {
      console.log('Form is invalid');
      this.serviceForm.markAllAsTouched();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.popup-content');
    if (!clickedInside && this.isVisible) {
      this.closePopup.emit("closed");
    }
  }
}
