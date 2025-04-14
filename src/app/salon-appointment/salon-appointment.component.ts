import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StaffService} from '../staff.service';
import {BusinessService} from '../business.service';
import {ServicesService} from '../services.service';
import {CommonModule, NgForOf} from '@angular/common';
import {Business, Service, Staff} from '../models';
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";

@Component({
  selector: 'app-salon-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './salon-appointment.component.html',
  styleUrl: './salon-appointment.component.css'
})
export class SalonAppointmentComponent implements OnInit {
  business: Business | null = null;
  service: Service | null = null;
  staff: Staff[] = [];
  availableTimes: string[] = ['10:00', '11:00', '11:30', '12:00'];
  selectedTime: string = '';
  selectedDate: string = '';
  staff_id: number = 0;

  minDate: Date = new Date();

  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('commentInput') commentInput!: ElementRef;

  constructor(
    private businessService: BusinessService,
    private servicesService: ServicesService,
    private staffService: StaffService,
    private route: ActivatedRoute
  ) {
    this.setDateBounds();
  }

  setDateBounds() {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const businessId = Number(params.get('business_id'));
      const serviceId = Number(params.get('service_id'));

      if (businessId) {
        this.businessService.getBusiness(businessId).subscribe((data) => {
          this.business = data;
          console.log("Business:");
          console.log(data);
        });
      }

      if (serviceId) {
        this.servicesService.getService(serviceId).subscribe((data) => {
          this.service = data;
          console.log("Service:");
          console.log(data);
        });

        this.staffService.getStaff(businessId).subscribe((data) => {
          this.staff = data;
          console.log("Staff:");
          console.log(data);
        });
      }
    });
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  selectStaff(id: number) {
    this.staff_id = id;
  }

  submitAppointment() {
    const formData = {
      service_id: this.service?.id,
      staff_id: this.staff_id,
      date: new Date(this.selectedDate).toISOString().split('T')[0],
      start_time: this.selectedTime,
      name: this.nameInput.nativeElement.value,
      phone: this.phoneInput.nativeElement.value,
      comment: this.commentInput.nativeElement.value,
    };

    console.log('Collected form data:', formData);
  }
}
