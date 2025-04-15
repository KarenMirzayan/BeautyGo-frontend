import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { MultiSelectDropdownComponent, SelectItem } from '../multi-select-dropdown/multi-select-dropdown.component';
import { BusinessService } from '../business.service';
import { StaffService } from '../staff.service';
import { Staff, User } from '../models';
import { ServicesService } from '../services.service';
import { Router } from '@angular/router';

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
  businessId: number = 0;
  user: User | null = null;
  errorMessage: string | null = null;
  categories: string[] = [
    'Парикмахерские услуги',
    'Ногтевой сервис',
    'Макияж',
    'Ресницы',
    'Удаление волос',
    'Брови'
  ];

  @Input() isVisible: boolean = false;
  @Output() closePopup = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private staffService: StaffService,
    private servicesService: ServicesService,
    private router: Router
  ) {

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData) as User;
        console.log('User loaded:', this.user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.user = null;
      }
    } else {
      console.log('No user found in localStorage');
      this.router.navigate(['business', 'login']);
    }


    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      lowestPrice: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      highestPrice: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      topic: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      businessId: [null, Validators.required],
      staffIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.user?.id) {
      this.loadBusiness();
    } else {
      this.router.navigate(['business', 'login']);
    }
  }

  loadBusiness(): void {
    this.businessService.getBusinessByOwner(this.user!.id).subscribe({
      next: (response) => {
        console.log('Business loaded:', response);
        this.businessId = response.id;
        this.serviceForm.patchValue({ businessId: this.businessId });
        this.serviceForm.markAsPristine(); // Reset dirty state
        console.log('Form after business load:', {
          value: this.serviceForm.value,
          valid: this.serviceForm.valid,
          dirty: this.serviceForm.dirty
        });
        this.loadStaffMembers();
      },
      error: (error) => {
        console.error('Error loading business:', error);
        this.errorMessage = 'Failed to load business. Please register a business first.';
        this.router.navigate(['business', 'register']);
      }
    });
  }

  loadStaffMembers(): void {
    if (this.businessId) {
      this.staffService.getStaffs(this.businessId).subscribe({
        next: (staff: Staff[]) => {
          this.staffMembers = staff.map(s => ({ id: s.id, name: s.name }));
          console.log('Loaded staff:', this.staffMembers);
          if (this.staffMembers.length === 0) {
            this.errorMessage = 'No staff members available. Please add staff first.';
          }
        },
        error: (error) => {
          console.error('Error loading staff:', error);
          this.errorMessage = 'Failed to load staff members.';
        }
      });
    }
  }

  onCategorySelectionChange(category: string): void {
    this.serviceForm.patchValue({ topic: category });
    this.serviceForm.markAsDirty();
    console.log('Category updated:', this.serviceForm.get('topic')?.value);
  }

  onStaffSelectionChange(selectedIds: number[]): void {
    this.serviceForm.patchValue({ staffIds: selectedIds });
    this.serviceForm.markAsDirty();
    console.log('Staff IDs updated:', this.serviceForm.get('staffIds')?.value);
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      console.log('Form Submitted!', this.serviceForm.value);
      const formData = {
        ...this.serviceForm.value,
        lowestPrice: parseInt(this.serviceForm.value.lowestPrice, 10),
        highestPrice: parseInt(this.serviceForm.value.highestPrice, 10),
        duration: parseInt(this.serviceForm.value.duration, 10)
      };
      this.servicesService.postService(formData).subscribe({
        next: (response) => {
          console.log('Service created:', response);
          this.serviceForm.reset({ businessId: this.businessId }); // Preserve businessId
          this.serviceForm.markAsPristine();
          this.closePopup.emit('success');
        },
        error: (error) => {
          console.error('Error creating service:', error);
          this.errorMessage = 'Failed to create service. Please try again.';
          this.closePopup.emit('error');
        }
      });
    } else {
      console.log('Form is invalid');
      this.serviceForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields.';
      console.log('Form errors:', this.serviceForm.errors);
      Object.keys(this.serviceForm.controls).forEach(key => {
        const control = this.serviceForm.get(key);
        console.log(`Control ${key}:`, {
          value: control?.value,
          valid: control?.valid,
          errors: control?.errors
        });
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.popup-content');
    if (!clickedInside && this.isVisible) {
      this.closePopup.emit('closed');
    }
  }
}
