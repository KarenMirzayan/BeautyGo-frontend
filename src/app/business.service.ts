import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Business} from "./models";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private apiUrl = `${environment.apiUrl}/business`;

  constructor(private http: HttpClient) {}

  getBusiness(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.apiUrl}/${id}`);
  }

  getAllBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}`);
  }

  postBusiness(business: any){
    return this.http.post<any>(`${this.apiUrl}`, business);
  }

  updateBusiness(business: any){
    return this.http.put<any>(`${this.apiUrl}`, business);
  }

  getBusinessByOwner(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.apiUrl}/owner/${id}`);
  }

  searchBusiness(query: string): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}/search/${query}`);
  }
}
