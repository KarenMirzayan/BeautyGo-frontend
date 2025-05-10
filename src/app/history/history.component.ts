// src/app/history/history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationDto } from '../models';
import { ReservationsService } from '../reservations.service';
import { BusinessService } from '../business.service';
import { ServicesService } from '../services.service';
import { StaffService } from '../staff.service';

interface EnhancedReservation {
  id: number;
  startTime: string;
  endTime: string;
  salonName: string;
  serviceName: string;
  masterAvatarUrl: string;
  status: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  activeTab: 'current' | 'history' = 'current';
  currentReservations: EnhancedReservation[] = [];
  historyReservations: EnhancedReservation[] = [];
  groupedCurrent: { [key: string]: EnhancedReservation[] } = {};
  groupedHistory: { [key: string]: EnhancedReservation[] } = {};
  user: { phoneNumber: string; name: string; email: string } | null = null;

  constructor(
    private router: Router,
    private reservationsService: ReservationsService,
    private businessService: BusinessService,
    private serviceService: ServicesService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        if (this.user) {
          this.fetchReservations();
        } else {
          this.router.navigate(['/authentication']);
        }
      } catch (e) {
        console.error('Error parsing user:', e);
        this.router.navigate(['/authentication']);
      }
    } else {
      this.router.navigate(['/authentication']);
    }
  }

  fetchReservations(): void {
    if (!this.user?.phoneNumber) return;

    this.reservationsService.getCurrentReservations(this.user.phoneNumber).subscribe({
      next: (reservations) => {
        this.enhanceReservations(reservations).subscribe(enhanced => {
          this.currentReservations = enhanced;
          this.groupedCurrent = this.groupByMonthYear(enhanced);
        });
      },
      error: (err) => console.error('Error fetching current reservations:', err),
    });

    this.reservationsService.getHistoricReservations(this.user.phoneNumber).subscribe({
      next: (reservations) => {
        this.enhanceReservations(reservations).subscribe(enhanced => {
          this.historyReservations = enhanced;
          this.groupedHistory = this.groupByMonthYear(enhanced);
        });
      },
      error: (err) => console.error('Error fetching history reservations:', err),
    });
  }

  enhanceReservations(reservations: ReservationDto[]): Observable<EnhancedReservation[]> {
    const observables = reservations.map(res =>
      forkJoin({
        business: this.businessService.getBusiness(res.businessId),
        service: this.serviceService.getService(res.serviceId),
        staff: this.staffService.getStaff(res.staffId),
      }).pipe(
        map(({ business, service, staff }) => ({
          id: res.id,
          startTime: res.startTime,
          endTime: res.endTime,
          salonName: business?.name || 'Unknown Salon',
          serviceName: service?.name || 'Unknown Service',
          masterAvatarUrl: 'pfp_placeholder.png',
          status: res.status,
        }))
      )
    );
    return forkJoin(observables);
  }

  groupByMonthYear(reservations: EnhancedReservation[]): { [key: string]: EnhancedReservation[] } {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];
    const grouped: { [key: string]: EnhancedReservation[] } = {};

    reservations.forEach(res => {
      const date = new Date(res.startTime);
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(res);
    });

    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${yearA}-${months.indexOf(monthA) + 1}-01`);
      const dateB = new Date(`${yearB}-${months.indexOf(monthB) + 1}-01`);
      return this.activeTab === 'history' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    const sortedGrouped: { [key: string]: EnhancedReservation[] } = {};
    sortedKeys.forEach(key => {
      grouped[key].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
  }

  switchTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
    this.groupedCurrent = this.groupByMonthYear(this.currentReservations);
    this.groupedHistory = this.groupByMonthYear(this.historyReservations);
  }

  formatDateTime(isoTime: string): string {
    const d = new Date(isoTime);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()} в ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  navigateToReview(reservationId: number): void {
    this.router.navigate([`/review/${reservationId}`]);
  }

  bookAgain(): void {
    this.router.navigate(['book']);
  }

  protected readonly Object = Object;
}
