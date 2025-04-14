import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";

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
  @Output() closePopup = new EventEmitter<void>(); // Emit event to close popup

  constructor(private fb: FormBuilder) {
    this.specialistForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', [Validators.required]],
      description: [''],
      profession: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.specialistForm.valid) {
      console.log('Form Submitted!', this.specialistForm.value);
      this.closePopup.emit(); // Close popup on successful submit
    } else {
      console.log('Form is invalid');
    }
  }

  // Close popup when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.popup-content');
    if (!clickedInside && this.isVisible) {
      this.closePopup.emit();
    }
  }
}
