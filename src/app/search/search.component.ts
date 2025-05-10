// src/app/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { BusinessService } from '../business.service';
import { Business } from '../models';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

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
    RouterLink
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
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
    // Get query from URL
    this.route.paramMap.subscribe(params => {
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
        this.businesses = businesses.map(b => ({
          ...b,
          rating: b.rating ?? 0 // Default to 0 if rating is undefined
        }));
        this.businesses.sort((a, b) => a.name.localeCompare(b.name));
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.error('Error searching businesses:', err);
        this.businesses = [];
        this.filteredBusinesses = [];
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.value?.trim();
    if (query) {
      this.router.navigate([`/search/${encodeURIComponent(query)}`]);
      // No need to call searchBusinesses here; ngOnInit will handle it via route change
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
      filtered = filtered.filter(b => b.rating >= minRating);
    }

    // Sort
    if (order === 'По рейтингу') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredBusinesses = filtered;
  }

  toggleRatingFilter(rating: number | null): void {
    if (rating === null) {
      // "С любым рейтингом" clears all filters
      this.ratingFilters = [];
    } else {
      if (this.ratingFilters.includes(rating)) {
        this.ratingFilters = this.ratingFilters.filter(r => r !== rating);
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
}
