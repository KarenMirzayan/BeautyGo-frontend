import { Component } from '@angular/core';
import {BusinessFooterComponent} from "../business-footer/business-footer.component";
import {BusinessHeaderComponent} from "../business-header/business-header.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-business-registration',
  standalone: true,
  imports: [
    BusinessFooterComponent,
    BusinessHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './business-registration.component.html',
  styleUrl: './business-registration.component.css'
})
export class BusinessRegistrationComponent {
  businessForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.businessForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      companyName: ['', Validators.required],
      companyType: ['', Validators.required],
      masterCount: ['', Validators.required],
      website: [''],
      businessDescription: ['']
    });
  }

  submitForm() {
    if (this.businessForm.valid) {
      console.log(this.businessForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
