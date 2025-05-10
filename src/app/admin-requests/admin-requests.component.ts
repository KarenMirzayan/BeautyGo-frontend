// src/app/admin-requests/admin-requests.component.ts
import { Component, OnInit } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {BusinessApplicationDto} from "../models";
import {AdminServiceService} from "../admin-service.service";

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [DropdownComponent, RouterLink, CommonModule],
  templateUrl: './admin-requests.component.html',
  styleUrl: './admin-requests.component.css',
})
export class AdminRequestsComponent implements OnInit {
  public orderby = ['Сначала ожидающие', 'Сначала выполненные'];
  public applications: BusinessApplicationDto[] = [];
  public pendingCount: number = 0;

  constructor(private businessApplicationService: AdminServiceService) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.businessApplicationService.getBusinessApplications().subscribe({
      next: (applications:any) => {
        this.applications = applications;
        console.log(applications);
        this.applications.sort((a: BusinessApplicationDto, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return -(dateB.getTime() - dateA.getTime());
        });
        this.pendingCount = applications.filter((app:BusinessApplicationDto)=> {
          return !app.verified
        }).length;
      },
      error: (error:any) => {
        console.error('Error fetching applications:', error);
      },
    });
  }

  onOrderByChange(selectedValue: string): void {
    if (selectedValue === 'По дате подачи') {
      this.applications.sort((a: BusinessApplicationDto, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
    } else if (selectedValue === 'Сначала ожидающие') {
      this.applications.sort((a, b) => {
        return a.verified === b.verified ? 0 : a.verified ? 1 : -1; // Pending (false) first
      });
    } else if (selectedValue === 'Сначала выполненные') {
      this.applications.sort((a, b) => {
        return a.verified === b.verified ? 0 : a.verified ? -1 : 1; // Done (true) first
      });
    }
  }
}
