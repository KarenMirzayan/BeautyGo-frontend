import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {StaffService} from "../staff.service";
import {BusinessService} from "../business.service";
import {ServicesService} from "../services.service";
import {Router} from "@angular/router";
import {User} from "../models";

@Component({
  selector: 'app-business-specialist-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective
  ],
  templateUrl: './business-specialist-popup.component.html',
  styleUrl: './business-specialist-popup.component.css'
})
export class BusinessSpecialistPopupComponent implements OnInit{
  specialistForm: FormGroup;
  businessId: number = 0;
  user: User | null = null;
  errorMessage: string | null = null;

  @Input() isVisible: boolean = false; // Control visibility from parent
  @Output() closePopup = new EventEmitter<string>(); // Emit event to close popup

  constructor(private fb: FormBuilder,
              private businessService: BusinessService,
              private staffService: StaffService,
              private servicesService: ServicesService,
              private router: Router) {

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

    this.specialistForm = this.fb.group({
      name: ['', Validators.required],
      surname: [''],
      phone: ['', [Validators.required]],
      description: [''],
      position: ['', Validators.required],
      businessId: [null, Validators.required],
    });
  }

  ngOnInit() {
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
        this.specialistForm.patchValue({ businessId: this.businessId });
        this.specialistForm.markAsPristine(); // Reset dirty state
        console.log('Form after business load:', {
          value: this.specialistForm.value,
          valid: this.specialistForm.valid,
          dirty: this.specialistForm.dirty
        });
      },
      error: (error) => {
        console.error('Error loading business:', error);
        this.errorMessage = 'Failed to load business. Please register a business first.';
        this.router.navigate(['business', 'register']);
      }
    });
  }

  onSubmit(): void {
    if (this.specialistForm.valid) {
      this.specialistForm.patchValue({phone: `+7${this.specialistForm.value.phone}`});
      console.log('Form Submitted!', this.specialistForm.value);
      this.staffService.postStaff(this.specialistForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.specialistForm.reset();
          this.closePopup.emit("success");
        },
        error: (error) => {
          console.log(error);
          this.closePopup.emit("error");
        }
      })
    } else {
      console.log('Form is invalid');
      this.specialistForm.markAllAsTouched();
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
