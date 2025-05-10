// src/app/admin-reviews/admin-reviews.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { StarsComponent } from '../stars/stars.component';
import { RouterLink } from '@angular/router';
import { ReservationsService } from '../reservations.service';
import { BusinessService } from '../business.service';
import { StaffService } from '../staff.service';
import { ReviewService } from '../review.service';
import { forkJoin, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ReviewDto } from '../models';

interface Filters {
  status: { pending: boolean; published: boolean };
  rating: { [key: number]: boolean };
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent, StarsComponent, RouterLink],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css',
})
export class AdminReviewsComponent implements OnInit {
  orderby = ['Сначала ожидающие', 'Сначала выполненные'];
  reviews: ReviewDto[] = [];
  filteredReviews: ReviewDto[] = [];
  pendingCount: number = 0;
  filters: Filters = {
    status: { pending: false, published: false },
    rating: { 1: false, 2: false, 3: false, 4: false, 5: false },
  };
  sortOption: string = 'По дате подачи';

  constructor(
    private reservationsService: ReservationsService,
    private businessService: BusinessService,
    private staffService: StaffService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        console.log('Fetched reviews:', reviews); // Debug response
        this.enhanceReviews(reviews).subscribe({
          next: (enhancedReviews: ReviewDto[]) => {
            this.reviews = enhancedReviews;
            this.pendingCount = enhancedReviews.filter((r) => !r.verified).length;
            this.applyFilters();
          },
          error: (err: any) => console.error('Error enhancing reviews:', err),
        });
      },
      error: (err) => console.error('Error fetching reviews:', err),
    });
  }

  enhanceReviews(reviews: ReviewDto[]): Observable<ReviewDto[]> {
    if (reviews.length === 0) {
      return of([]);
    }

    const observables = reviews.map((review) =>
      forkJoin({
        business: this.businessService.getBusiness(review.businessId),
        staff: review.reservationId
          ? this.reservationsService.getReservation(review.reservationId).pipe(
            switchMap((res) => this.staffService.getStaff(res.staffId))
          )
          : of(null),
      }).pipe(
        map(({ business, staff }) => ({
          ...review,
          businessName: business?.name || 'Название салона',
          staffName: staff?.name || 'Специалист',
        }))
      )
    );

    return forkJoin(observables);
  }

  applyFilters(): void {
    this.filteredReviews = this.reviews.filter((review) => {
      const statusMatch =
        (!this.filters.status.pending && !this.filters.status.published) ||
        (this.filters.status.pending && !review.verified) ||
        (this.filters.status.published && review.verified);

      const ratingMatch =
        (!this.filters.rating[1] &&
          !this.filters.rating[2] &&
          !this.filters.rating[3] &&
          !this.filters.rating[4] &&
          !this.filters.rating[5]) ||
        this.filters.rating[review.rating];

      return statusMatch && ratingMatch;
    });

    this.sortReviews();
  }

  clearFilters(): void {
    this.filters = {
      status: { pending: false, published: false },
      rating: { 1: false, 2: false, 3: false, 4: false, 5: false },
    };
    this.applyFilters();
  }

  onSortChange(option: string): void {
    this.sortOption = option;
    this.sortReviews();
  }

  sortReviews(): void {
    this.filteredReviews = [...this.filteredReviews].sort((a, b) => {
      if (this.sortOption === 'Сначала ожидающие') {
        return a.verified === b.verified
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : a.verified
            ? 1
            : -1;
      } else if (this.sortOption === 'Сначала выполненные') {
        return a.verified === b.verified
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : a.verified
            ? -1
            : 1;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  verifyReview(reviewId: number): void {
    if (!reviewId) {
      console.error('Invalid reviewId:', reviewId);
      return;
    }
    this.reviewService.verifyReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.map((r) => (r.id === reviewId ? { ...r, verified: true } : r));
        this.pendingCount = this.reviews.filter((r) => !r.verified).length;
        this.applyFilters();
      },
      error: (err) => console.error('Error verifying review:', err),
    });
  }

  deleteReview(reviewId: number): void {
    if (!reviewId) {
      console.error('Invalid reviewId:', reviewId);
      return;
    }
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter((r) => r.id !== reviewId);
          this.pendingCount = this.reviews.filter((r) => !r.verified).length;
          this.applyFilters();
        },
        error: (err) => console.error('Error deleting review:', err),
      });
    }
  }

  formatDate(isoDate: string): string {
    if (!isoDate) {
      return 'Неизвестно';
    }
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return 'Неверная дата';
    }
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? 'Сегодня' : diffDays <= 2 ? 'Вчера' : `${diffDays} дня назад`;
  }
}
