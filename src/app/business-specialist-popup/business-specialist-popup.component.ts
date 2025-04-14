import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {StaffService} from "../staff.service";

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
export class BusinessSpecialistPopupComponent {
  specialistForm: FormGroup;

  @Input() isVisible: boolean = false; // Control visibility from parent
  @Output() closePopup = new EventEmitter<string>(); // Emit event to close popup

  constructor(private fb: FormBuilder, private staffService: StaffService,) {
    this.specialistForm = this.fb.group({
      name: ['', Validators.required],
      surname: [''],
      phone: ['', [Validators.required]],
      description: [''],
      position: ['', Validators.required],
      businessId: [5, Validators.required],
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
