// src/app/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessService } from '../business.service';
import { Business } from '../models';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    DropdownComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  orderby = ['По названию', 'По рейтингу'];
  businesses: Business[] = [];
  filteredBusinesses: Business[] = [];
  searchQuery = new FormControl('');
  query: string = '';
  ratingFilters: number[] = []; // e.g., [3, 4, 5] for ratings 3+, 4+, 5+

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const query = params.get('query');
      if (query) {
        this.query = decodeURIComponent(query);
        this.searchQuery.setValue(this.query);
        this.searchBusinesses(this.query);
      }
    });
  }

  searchBusinesses(query: string): void {
    this.query = query;
    this.businessService.searchBusiness(query).subscribe({
      next: (businesses) => {
        this.businesses = businesses;
        this.fetchBusinessRatings();
      },
      error: (err) => {
        console.error('Error searching businesses:', err);
        this.businesses = [];
        this.filteredBusinesses = [];
      },
    });
  }

  fetchBusinessRatings() {
    const ratingObservables = this.businesses.map((business) =>
      this.businessService.getBusinessRatingStats(business.id).pipe(
        map((stats) => ({
          ...business,
          averageRating: stats.averageRating ? Number(stats.averageRating.toFixed(1)) : undefined,
          imageUrls: business.imageUrls || [], // Ensure imageUrls is defined
        }))
      )
    );

    forkJoin(ratingObservables).subscribe({
      next: (updatedBusinesses) => {
        this.businesses = updatedBusinesses;
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.error('Error fetching business ratings:', err);
        this.applyFiltersAndSort();
      },
    });
  }

  onSearch(): void {
    const query = this.searchQuery.value?.trim();
    if (query) {
      this.router.navigate([`/search/${encodeURIComponent(query)}`]);
    }
  }

  orderBy(order: string): void {
    this.applyFiltersAndSort(order);
  }

  applyFiltersAndSort(order: string = this.orderby[0]): void {
    let filtered = [...this.businesses];

    // Apply rating filters
    if (this.ratingFilters.length > 0) {
      const minRating = Math.max(...this.ratingFilters);
      filtered = filtered.filter((b) => b.averageRating !== undefined && b.averageRating >= minRating);
    }

    // Sort
    if (order === 'По рейтингу') {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredBusinesses = filtered;
  }

  toggleRatingFilter(rating: number | null): void {
    if (rating === null) {
      this.ratingFilters = [];
    } else {
      if (this.ratingFilters.includes(rating)) {
        this.ratingFilters = this.ratingFilters.filter((r) => r !== rating);
      } else {
        this.ratingFilters.push(rating);
      }
    }
    this.applyFiltersAndSort();
  }

  clearFilters(): void {
    this.ratingFilters = [];
    this.applyFiltersAndSort();
  }

  getBusinessImage(business: Business): string {
    return business.imageUrls && business.imageUrls.length > 0 ? business.imageUrls[0] : 'img.png';
  }
}
