import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { BusinessService } from '../business.service';
import { Business } from '../models';

@Component({
  selector: 'app-business-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective
  ],
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.css']
})
export class BusinessPageComponent implements OnInit {
  business: Business | undefined;
  salonForm: FormGroup;
  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  minutes: string[] = ['00', '15', '30', '45'];

  avatarPreview: string | ArrayBuffer | null = null;
  photoPreviews: (string | ArrayBuffer | null)[] = [null, null, null];

  constructor(private fb: FormBuilder, private businessService: BusinessService) {
    // Initialize form with default values
    this.salonForm = this.fb.group({
      // avatar: [null],
      // photos: [[]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      description: [''],
      // startHour: [''],
      // startMinute: [''],
      // endHour: [''],
      // endMinute: [''],
      id: [null, Validators.required],
      ownerId: [null, Validators.required],
      topic: [null, Validators.required],
      services: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBusiness();
  }

  loadBusiness(): void {
    this.businessService.getBusiness(5).subscribe({
      next: (response) => {
        console.log('Business loaded:', response);
        this.business = response;
        this.patchForm();
      },
      error: (error) => {
        console.error('Error loading business:', error);
      }
    });
  }

  patchForm(): void {
    if (this.business) {
      this.salonForm.patchValue({
        name: this.business.name || '',
        address: this.business.address || '',
        phone: this.business.phone || '',
        description: this.business.description || '',
        id: this.business.id,
        ownerId: this.business.ownerId,
        topic: this.business.topic,
        services: this.business.services,
        // startHour: '',
        // startMinute: '',
        // endHour: '',
        // endMinute: ''
      });
    }
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
        this.salonForm.patchValue({ avatar: input.files![0] });
        console.log('Avatar updated:', this.salonForm.get('avatar')?.value);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onPhotosChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreviews[index] = reader.result;
        const currentPhotos = this.salonForm.get('photos')?.value || [];
        currentPhotos[index] = input.files![0];
        this.salonForm.patchValue({ photos: currentPhotos });
        console.log('Photos updated:', this.salonForm.get('photos')?.value);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.salonForm.valid) {
      console.log('Form Submitted!', this.salonForm.value);
      this.businessService.putBusiness(this.salonForm.value).subscribe({
        next: (response) => {
          console.log(response)
          window.location.reload()
        },
        error: (error) => {
          console.log(error)
        }
      })
    } else {
      console.log('Form is invalid');
      this.salonForm.markAllAsTouched();
      console.log('Form errors:', this.salonForm.errors);
      Object.keys(this.salonForm.controls).forEach(key => {
        const control = this.salonForm.get(key);
        console.log(`Control ${key}:`, {
          value: control?.value,
          valid: control?.valid,
          errors: control?.errors
        });
      });
    }
  }
}
