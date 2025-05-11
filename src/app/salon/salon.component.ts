// src/app/salon/salon.component.ts
import { Component, OnInit } from '@angular/core';
import { Business, Service, ReviewDto } from '../models';
import { BusinessService } from '../business.service';
import { ServicesService } from '../services.service';
import { ReviewService } from '../review.service';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-salon',
  standalone: true,
  imports: [
    CommonModule,
    KeyValuePipe,
    RouterLink,
  ],
  templateUrl: './salon.component.html',
  styleUrl: './salon.component.css',
})
export class SalonComponent implements OnInit {
  business: Business = {} as Business;
  services: Service[] = [];
  reviews: ReviewDto[] = [];
  groupedServices: { [key: string]: Service[] } = {};
  totalReviews: number = 0;

  constructor(
    private businessService: BusinessService,
    private servicesService: ServicesService,
    private reviewService: ReviewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        // Fetch business details
        this.businessService.getBusiness(id).subscribe({
          next: (data) => {
            this.business = data;
            this.fetchRatingStats(id);
            this.fetchReviews(id);
          },
          error: (err) => console.error('Error fetching business:', err),
        });

        // Fetch services
        this.servicesService.getServices(id).subscribe({
          next: (data) => {
            this.services = data;
            this.groupServicesByTopic();
          },
          error: (err) => console.error('Error fetching services:', err),
        });
      }
    });
  }

  private fetchRatingStats(businessId: number): void {
    this.businessService.getBusinessRatingStats(businessId).subscribe({
      next: (stats) => {
        if (this.business) {
          this.business.averageRating = stats.averageRating ? Number(stats.averageRating.toFixed(1)) : undefined;
          this.totalReviews = stats.totalReviews || 0;
        }
      },
      error: (err) => console.error('Error fetching rating stats:', err),
    });
  }

  private fetchReviews(businessId: number): void {
    this.reviewService.getBusinessReviews(businessId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (err) => console.error('Error fetching reviews:', err),
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

  formatReviewDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  getStarString(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return fullStars + emptyStars;
  }

  getBusinessImage(): string {
    return this.business?.imageUrls && this.business.imageUrls.length > 0 ? this.business.imageUrls[0] : 'img.png';
  }

  getCarouselImages(): string[] {
    return this.business?.imageUrls && this.business.imageUrls.length > 0 ? this.business.imageUrls : ['img.png'];
  }
}
