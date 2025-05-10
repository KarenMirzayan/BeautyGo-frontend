// src/app/review/review.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ReservationDto, ReviewDto} from '../models';
import { ReservationsService } from '../reservations.service';
import { BusinessService } from '../business.service';
import { ServicesService } from '../services.service';
import { StaffService } from '../staff.service';
import {ReviewService} from "../review.service";

interface ReviewForm {
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  reservationId: number = 0;
  reservation: ReservationDto | null = null;
  businessName: string = 'Unknown Salon';
  serviceName: string = 'Unknown Service';
  staffName: string = 'Unknown Master';
  formattedDateTime: string = '';
  reviewForm: ReviewForm = { rating: 0, comment: '' };
  user: { phoneNumber: string; name: string; email: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationsService: ReservationsService,
    private businessService: BusinessService,
    private servicesService: ServicesService,
    private staffService: StaffService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.reservationId) {
      console.error('No reservation ID found in URL');
      this.router.navigate(['/history']);
      return;
    }

    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        if (!this.user) {
          this.router.navigate(['/authentication']);
          return;
        }
      } catch (e) {
        console.error('Error parsing user:', e);
        this.router.navigate(['/authentication']);
        return;
      }
    } else {
      this.router.navigate(['/authentication']);
      return;
    }

    // Fetch reservation details
    this.fetchReservationDetails();
  }

  fetchReservationDetails(): void {
    if (!this.reservationId) return;

    this.reservationsService.getReservation(this.reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.fetchAdditionalDetails(reservation);
      },
      error: (err) => {
        console.error('Error fetching reservation:', err);
        this.router.navigate(['/history']);
      },
    });
  }

  fetchAdditionalDetails(reservation: ReservationDto): void {
    forkJoin({
      business: this.businessService.getBusiness(reservation.businessId),
      service: this.servicesService.getService(reservation.serviceId),
      staff: this.staffService.getStaff(reservation.staffId),
    }).subscribe({
      next: ({ business, service, staff }) => {
        this.businessName = business?.name || 'Unknown Salon';
        this.serviceName = service?.name || 'Unknown Service';
        this.staffName = staff?.name || 'Unknown Master';
        this.formattedDateTime = this.formatDateTime(reservation.startTime);
      },
      error: (err) => console.error('Error fetching additional details:', err),
    });
  }

  formatDateTime(isoTime: string): string {
    const d = new Date(isoTime);
    const date = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return `${date}, в ${time}`;
  }

  setRating(rating: number): void {
    this.reviewForm.rating = rating;
  }

  submitReview(): void {
    if (!this.user || !this.reservation || this.reviewForm.rating < 1 || this.reviewForm.rating > 5) {
      alert('Please provide a valid rating (1–5) and ensure you are logged in.');
      return;
    }

    const reviewDto: ReviewDto = {
      id: 0,
      createdAt: '',
      verified: false,
      businessId: this.reservation.businessId,
      reservationId: this.reservationId,
      customerName: this.user.name,
      customerEmail: this.user.email,
      rating: this.reviewForm.rating,
      comment: this.reviewForm.comment,
    };

    this.reviewService.createReview(reviewDto).subscribe({
      next: (response) => {
        alert('Review submitted successfully!');
        this.router.navigate(['/history']);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert('Failed to submit review. Please try again.');
      },
    });
  }

  navigateToHistory(): void {
    this.router.navigate(['/history']);
  }
}
