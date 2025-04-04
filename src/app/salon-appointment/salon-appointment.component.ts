import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StaffService} from '../staff.service';
import {BusinessService} from '../business.service';
import {ServicesService} from '../services.service';
import {CommonModule, NgForOf} from '@angular/common';
import {Business, Service, Staff} from '../models';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-salon-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salon-appointment.component.html',
  styleUrl: './salon-appointment.component.css'
})
export class SalonAppointmentComponent implements OnInit {
  business: Business | null = null;
  service: Service | null = null;
  staff: Staff[] = [];
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  availableTimes: string[] = ['10:00', '11:00', '11:30', '12:00'];

  minDate: string = '';
  maxDate: string = '';

  constructor(
    private businessService: BusinessService,
    private servicesService: ServicesService,
    private staffService: StaffService,
    private route: ActivatedRoute
  ) {
    this.setDateBounds();
  }

  setDateBounds() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}T09:00`;
    this.maxDate = `${year}-${month}-${day}T18:00`;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const businessId = Number(params.get('business_id'));
      const serviceId = Number(params.get('service_id'));

      if (businessId) {
        this.businessService.getBusiness(businessId).subscribe((data) => {
          this.business = data;
        });
      }

      if (serviceId) {
        this.servicesService.getService(serviceId).subscribe((data) => {
          this.service = data;
        });

        this.staffService.getStaff(serviceId).subscribe((data) => {
          this.staff = data;
        });
      }
    });
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }
}
