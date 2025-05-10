// src/app/business-page/business-page.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { BusinessService } from '../business.service';
import { Business, User } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.css'],
})
export class BusinessPageComponent implements OnInit {
  business: Business | undefined;
  salonForm: FormGroup;
  user: User | null;
  photoPreviews: (string | null)[] = [null, null, null]; // Initial 3 slots
  photoFiles: (File | null)[] = [null, null, null]; // Store File objects
  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private router: Router
  ) {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData) as User;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.user = null;
      }
    } else {
      this.user = null;
      console.log('No user found in localStorage');
      this.router.navigate(['business', 'login']);
    }
    this.salonForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      description: [''],
      id: [null, Validators.required],
      ownerId: [null, Validators.required],
      topic: ['', Validators.required],
      services: [[]],
    });
  }

  ngOnInit(): void {
    this.loadBusiness();
  }

  loadBusiness(): void {
    this.businessService.getBusinessByOwner(this.user?.id || 0).subscribe({
      next: (response) => {
        console.log('Business loaded:', response);
        this.business = response;
        this.patchForm();
        this.loadImages();
      },
      error: (error) => {
        console.error('Error loading business:', error);
        this.router.navigate(['business', 'register']);
      },
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
      });
      console.log('Form after patch:', {
        value: this.salonForm.value,
        valid: this.salonForm.valid,
        errors: this.salonForm.errors,
      });
      Object.keys(this.salonForm.controls).forEach((key) => {
        const control = this.salonForm.get(key);
        console.log(`Control ${key}:`, {
          value: control?.value,
          valid: control?.valid,
          errors: control?.errors,
        });
      });
    }
  }

  loadImages(): void {
    if (this.business?.imageUrls) {
      this.photoPreviews = [...this.business.imageUrls, ...Array(3 - this.business.imageUrls.length).fill(null)];
      this.photoFiles = Array(this.photoPreviews.length).fill(null);
    }
  }

  onPhotoChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreviews[index] = reader.result as string;
        this.photoFiles[index] = file;
        this.salonForm.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  addPhotoSlot(): void {
    this.photoPreviews.push(null);
    this.photoFiles.push(null);
  }

  get avatarPreview(): string | null {
    return this.photoPreviews[0]; // First photo is avatar
  }

  onSubmit(): void {
    if (this.salonForm.valid) {
      const formData = new FormData();
      const businessData: Partial<Business> = {
        ...this.salonForm.value,
        imageUrls: this.business?.imageUrls || [], // Preserve existing URLs
      };
      formData.append('business', new Blob([JSON.stringify(businessData)], { type: 'application/json' }));

      // Append photos as 'images'
      this.photoFiles.forEach((file, index) => {
        if (file) {
          formData.append('images', file, file.name);
        }
      });

      console.log('Submitting form data:', formData);
      this.businessService.updateBusiness(formData).subscribe({
        next: (response) => {
          console.log('Business updated:', response);
          this.business = response;
          this.patchForm();
          this.loadImages();
          this.salonForm.markAsPristine();
        },
        error: (error:any) => {
          console.error('Error updating business:', error);
        },
      });
    } else {
      console.log('Form is invalid');
      this.salonForm.markAllAsTouched();
      console.log('Form errors:', this.salonForm.errors);
      Object.keys(this.salonForm.controls).forEach((key) => {
        const control = this.salonForm.get(key);
        console.log(`Control ${key}:`, {
          value: control?.value,
          valid: control?.valid,
          errors: control?.errors,
        });
      });
    }
  }
}
