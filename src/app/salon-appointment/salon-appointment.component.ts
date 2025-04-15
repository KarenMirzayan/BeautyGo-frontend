import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaffService } from '../staff.service';
import { BusinessService } from '../business.service';
import { ServicesService } from '../services.service';
import { CommonModule, Location } from '@angular/common';
import { AvailableTimeSlot, Business, Service, Staff } from '../models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-salon-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective
  ],
  templateUrl: './salon-appointment.component.html',
  styleUrls: ['./salon-appointment.component.css']
})
export class SalonAppointmentComponent implements OnInit {
  business: Business | null = null;
  service: Service | null = null;
  staff: Staff[] = [];
  availableTimes: string[] = [];
  appointmentForm: FormGroup;
  minDate: Date = new Date();
  errorMessage: string | null = null;

  constructor(
    private businessService: BusinessService,
    private servicesService: ServicesService,
    private staffService: StaffService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.setDateBounds();
    this.appointmentForm = this.fb.group({
      staffId: [0, Validators.required],
      date: [null, Validators.required],
      time: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      notes: ['']
    });
  }

  setDateBounds() {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const businessId = Number(params.get('business_id'));
      const serviceId = Number(params.get('service_id'));

      if (businessId) {
        this.businessService.getBusiness(businessId).subscribe({
          next: (data) => {
            this.business = data;
            console.log('Business:', data);
          },
          error: (error) => {
            console.error('Error loading business:', error);
            this.errorMessage = 'Failed to load business details.';
          }
        });
      }

      if (serviceId) {
        this.servicesService.getService(serviceId).subscribe({
          next: (data) => {
            this.service = data;
            console.log('Service:', data);
            this.loadStaff();
          },
          error: (error) => {
            console.error('Error loading service:', error);
            this.errorMessage = 'Failed to load service details.';
          }
        });
      }
    });

    // Subscribe to staffId and date changes with debounce
    this.appointmentForm.get('staffId')?.valueChanges.pipe(debounceTime(100)).subscribe((staffId) => {
      console.log('StaffId changed:', staffId);
      this.fetchAvailableTimes();
    });
    this.appointmentForm.get('date')?.valueChanges.pipe(debounceTime(100)).subscribe((date) => {
      console.log('Date changed:', date);
      this.fetchAvailableTimes();
    });
  }

  loadStaff(): void {
    if (this.service?.staffIds) {
      this.staff = [];
      this.service.staffIds.forEach((staffId) => {
        this.staffService.getStaff(staffId).subscribe({
          next: (data) => {
            this.staff.push(data);
            console.log('Staff loaded:', data);
          },
          error: (error) => {
            console.error('Error loading staff:', error);
            this.errorMessage = 'Failed to load staff members.';
          }
        });
      });
    }
  }

  selectStaff(id: number): void {
    this.appointmentForm.patchValue({ staffId: id });
    this.appointmentForm.markAsDirty();
    console.log('Staff selected:', id);
  }

  selectTime(time: string): void {
    this.appointmentForm.patchValue({ time });
    this.appointmentForm.markAsDirty();
    console.log('Time selected:', time);
  }

  onDateChange(date: Date): void {
    this.appointmentForm.patchValue({ date });
    this.appointmentForm.markAsDirty();
    console.log('Datepicker changed:', date);
    this.fetchAvailableTimes();
  }

  fetchAvailableTimes(): void {
    const { staffId, date } = this.appointmentForm.value;
    console.log('Fetching times with:', { staffId, date, businessId: this.business?.id, serviceId: this.service?.id });
    if (this.business?.id && this.service?.id && date && date instanceof Date && !isNaN(date.getTime())) {
      const formattedDate = this.formatDate(date);
      console.log('Formatted date:', formattedDate);
      this.servicesService
        .getAvailableTimeSlots(this.business.id, this.service.id, staffId, formattedDate)
        .subscribe({
          next: (slots: AvailableTimeSlot[]) => {
            this.availableTimes = slots.map(slot => {
              const slotTime = new Date(slot.startTime);
              console.log('Raw slot startTime:', slot.startTime, 'Parsed:', slotTime);
              return slotTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });
            });
            console.log('Available times loaded:', this.availableTimes);
            // Reset time if current selection is not available
            if (!this.availableTimes.includes(this.appointmentForm.get('time')?.value)) {
              this.appointmentForm.patchValue({ time: '' });
            }
            if (this.availableTimes.length === 0) {
              this.errorMessage = 'No available time slots for this date and staff.';
            } else {
              this.errorMessage = null;
            }
          },
          error: (error: any) => {
            console.error('Error fetching time slots:', error);
            this.availableTimes = [];
            this.appointmentForm.patchValue({ time: '' });
            this.errorMessage = 'Failed to load available time slots.';
          }
        });
    } else {
      console.log('Cannot fetch times: missing data', {
        businessId: this.business?.id,
        serviceId: this.service?.id,
        date,
        isValidDate: date instanceof Date && !isNaN(date.getTime())
      });
      this.availableTimes = [];
      this.appointmentForm.patchValue({ time: '' });
    }
  }

  formatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateTime(date: Date, time: string): string {
    if (!(date instanceof Date) || isNaN(date.getTime()) || !time) {
      console.error('Invalid date or time:', { date, time });
      return '';
    }
    const [hours, minutes] = time.split(':').map(Number);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hourStr = String(hours).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    return `${year}-${month}-${day}T${hourStr}:${minuteStr}:00`; // e.g., "2025-04-16T09:00:00"
  }

  submitAppointment(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const appointmentData = {
        serviceId: this.service?.id,
        staffId: formValue.staffId,
        businessId: this.business?.id,
        customerName: formValue.name,
        customerEmail: formValue.email,
        customerPhone: formValue.phone,
        startTime: this.formatDateTime(formValue.date, formValue.time),
        notes: formValue.comment
      };
      console.log('Submitting appointment:', appointmentData);
      this.servicesService.createAppointment(appointmentData).subscribe({
        next: (response: any) => {
          console.log('Appointment created:', response);
          this.appointmentForm.reset({ staffId: 0 });
          this.appointmentForm.markAsPristine();
          this.location.back();
        },
        error: (error: any) => {
          console.error('Error creating appointment:', error);
          this.errorMessage = 'Failed to create appointment. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid');
      this.appointmentForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields.';
      console.log('Form errors:', this.appointmentForm.errors);
      Object.keys(this.appointmentForm.controls).forEach(key => {
        const control = this.appointmentForm.get(key);
        console.log(`Control ${key}:`, {
          value: control?.value,
          valid: control?.valid,
          errors: control?.errors
        });
      });
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} час ${remainingMinutes} минут`;
    } else if (hours > 0) {
      return `${hours} час`;
    } else {
      return `${remainingMinutes} минут`;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
