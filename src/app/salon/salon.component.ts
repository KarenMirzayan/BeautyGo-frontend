import {Component, OnInit} from '@angular/core';
import {Business, Service} from "../models";
import {BusinessService} from "../business.service";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ServicesService} from "../services.service";

@Component({
  selector: 'app-salon',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    KeyValuePipe,
    RouterLink
  ],
  templateUrl: './salon.component.html',
  styleUrl: './salon.component.css'
})
export class SalonComponent implements OnInit{
  business: Business | null = null;
  services: Service[] = []
  groupedServices: { [key: string]: Service[] } = {};

  constructor(private businessService: BusinessService, private servicesService: ServicesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.businessService.getBusiness(id).subscribe((data) => {
          this.business = data;
        });
        this.servicesService.getServices(id).subscribe((data) => {
          this.services = data;
          console.log(data);
          this.groupServicesByTopic()
        })
      }
    });
  }

  private groupServicesByTopic(): void {
    this.groupedServices = this.services.reduce((acc, service) => {
      if (!acc[service.topic]) {
        acc[service.topic] = [];
      }
      acc[service.topic].push(service);
      return acc;
    }, {} as { [key: string]: Service[] });
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
}
