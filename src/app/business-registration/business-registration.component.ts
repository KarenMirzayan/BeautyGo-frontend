import { Component } from '@angular/core';
import { BusinessFooterComponent } from '../business-footer/business-footer.component';
import { BusinessHeaderComponent } from '../business-header/business-header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { User } from '../models';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-business-registration',
  standalone: true,
  imports: [
    BusinessFooterComponent,
    BusinessHeaderComponent,
    ReactiveFormsModule,
    NgxMaskDirective,
    DropdownComponent,
    CommonModule
  ],
  templateUrl: './business-registration.component.html',
  styleUrls: ['./business-registration.component.css']
})
export class BusinessRegistrationComponent {
  businessForm: FormGroup;
  user: User | null = null;
  categories: string[] = [
    'Парикмахерские услуги',
    'Ногтевой сервис',
    'Макияж',
    'Ресницы',
    'Удаление волос',
    'Брови'
  ];
  successMessage: string | null = null; // For success feedback
  errorMessage: string | null = null; // For error feedback

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private businessService: BusinessService
  ) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser) as User;
    } else {
      this.user = {
        id: 0,
        fullname: '',
        phoneNumber: '',
        email: null,
        role: 'USER'
      };
    }

    this.businessForm = this.fb.group({
      firstName: [this.user.id !== 0 ? this.user.fullname : '', Validators.required],
      lastName: ['', Validators.required],
      phone: [this.user.id !== 0 ? this.user.phoneNumber : '', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      name: ['', Validators.required],
      masterCount: ['', Validators.required],
      websites: [''],
      description: [''],
      ownerId: [this.user.id !== 0 ? this.user.id : 0],
      topic: ['', Validators.required]
    });

    if (this.businessForm.value.ownerId === 0) {
      this.router.navigate(['business', 'login']);
    }
  }

  onSelectionChange(category: string) {
    this.businessForm.patchValue({ topic: category });
    console.log('Topic set to:', this.businessForm.get('topic')?.value); // Debug
  }

  submitForm() {
    if (this.businessForm.valid) {
      console.log('Submitting:', this.businessForm.value);
      this.successMessage = null;
      this.errorMessage = null;

      this.businessService.postBusiness(this.businessForm.value).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.successMessage = 'Регистрация удалась!';
          setTimeout(() => {
            this.router.navigate(['business', 'page']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Регистрация не удалась. Пожалуйста, попробуйте снова';
        }
      });
    } else {
      console.log('Form is invalid');
      this.businessForm.markAllAsTouched();
      this.errorMessage = 'Пожалуйста, заполните обязательные поля.';
      this.successMessage = null;
    }
  }
}
