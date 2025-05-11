import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReviewDto} from "./models";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) {}

  createReview(review:ReviewDto) {
    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify(review)], { type: 'application/json' }));
    return this.http.post<ReviewDto>(this.apiUrl, formData);
  }

  getAllReviews() {
    return this.http.get<ReviewDto[]>(this.apiUrl);
  }

  verifyReview(id:number) {
    return this.http.post<ReviewDto[]>(`${this.apiUrl}/${id}/verify`, {})
  }

  deleteReview(id:number) {
    return this.http.delete<ReviewDto>(`${this.apiUrl}/${id}`);
  }

  getBusinessReviews(id:number) {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/business/${id}`);
  }
}
