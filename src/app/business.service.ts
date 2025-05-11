import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Business} from "./models";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getBusiness(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.apiUrl}/business/${id}`);
  }

  getAllBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}/business`);
  }

  postBusiness(business: any){
    return this.http.post<any>(`${this.apiUrl}/business`, business);
  }

  updateBusiness(business: any){
    return this.http.put<any>(`${this.apiUrl}/business`, business);
  }

  getBusinessByOwner(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.apiUrl}/business/owner/${id}`);
  }

  searchBusiness(query: string): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}/business/search/${query}`);
  }

  getBusinessRatingStats(businessId: number): Observable<{ averageRating: number; totalReviews: number; ratingDistribution: { [key: number]: number } }> {
    return this.http.get<{ averageRating: number; totalReviews: number; ratingDistribution: { [key: number]: number } }>(
      `${this.apiUrl}/api/reviews/business/${businessId}/stats`
    );
  }
}
