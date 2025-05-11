// src/app/main/main.component.ts
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Business } from '../models';
import { BusinessService } from '../business.service';
import {CommonModule} from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  businesses: Business[] = [];
  searchQuery = new FormControl('');

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.businessService.getAllBusinesses().subscribe((businesses) => {
      this.businesses = businesses;
      this.fetchBusinessRatings();
    });
  }

  fetchBusinessRatings() {
    const ratingObservables = this.businesses.map((business) =>
      this.businessService.getBusinessRatingStats(business.id).pipe(
        map((stats) => ({
          ...business,
          averageRating: stats.averageRating, // Default to 0 if no reviews
        }))
      )
    );

    forkJoin(ratingObservables).subscribe({
      next: (updatedBusinesses) => {
        this.businesses = updatedBusinesses;
      },
      error: (err) => console.error('Error fetching business ratings:', err),
    });
  }

  search() {
    const query = this.searchQuery.value?.trim();
    if (query) {
      this.router.navigate([`/search/${encodeURIComponent(query)}`]);
      this.searchQuery.setValue('');
    }
  }

  business() {
    this.router.navigate(['business/']);
  }
}
