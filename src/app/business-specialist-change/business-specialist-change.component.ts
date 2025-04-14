import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {BusinessSpecialistPopupComponent} from "../business-specialist-popup/business-specialist-popup.component";
import {DropdownComponent} from "../dropdown/dropdown.component";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";

@Component({
  selector: 'app-business-specialist-change',
  standalone: true,
  imports: [
    BusinessSpecialistPopupComponent,
    DropdownComponent,
    NgIf,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './business-specialist-change.component.html',
  styleUrl: './business-specialist-change.component.css'
})
export class BusinessSpecialistChangeComponent implements OnInit{
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
