import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";

@Component({
  selector: 'app-business-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective
  ],
  templateUrl: './business-page.component.html',
  styleUrl: './business-page.component.css'
})
export class BusinessPageComponent {
  salonForm: FormGroup;
  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  minutes: string[] = ['00', '15', '30', '45'];

  @Input() isVisible: boolean = false;
  @Output() closePopup = new EventEmitter<void>();

  // File inputs for avatar and photos
  avatarPreview: string | ArrayBuffer | null = null;
  photoPreviews: (string | ArrayBuffer | null)[] = [null, null, null]; // 3 photo slots

  constructor(private fb: FormBuilder) {
    this.salonForm = this.fb.group({
      avatar: [null],
      photos: [[]],
      name: [''],
      address: [''],
      phone1: ['', [Validators.required, Validators.pattern('^\\+7[0-9]{10}$')]],
      phone2: ['', Validators.pattern('^\\+7[0-9]{10}$')],
      description: [''],
      startHour: [''],
      startMinute: [''],
      endHour: [''],
      endMinute: [''],
      paymentMethods: [''],
      languages: ['Русский']
    });
  }

  ngOnInit(): void {}

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
        this.salonForm.patchValue({ avatar: input.files![0] });
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
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.salonForm.valid) {
      const rawPhone1 = this.salonForm.value.phone1.replace(/[\s()-]/g, '');
      const rawPhone2 = this.salonForm.value.phone2 ? this.salonForm.value.phone2.replace(/[\s()-]/g, '') : '';
      const formValue = {
        ...this.salonForm.value,
        phone1: rawPhone1,
        phone2: rawPhone2
      };
      console.log('Form Submitted!', formValue);
      this.closePopup.emit();
    } else {
      console.log('Form is invalid');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.popup-content');
    if (!clickedInside && this.isVisible) {
      this.closePopup.emit();
    }
  }
}
