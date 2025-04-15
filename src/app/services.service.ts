import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {AvailableTimeSlot, Service} from "./models";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  getServices(id: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}business/services/${id}`)
  }

  getService(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}service/${id}`);
  }

  postService(service: any) {
    return this.http.post<any>(`${this.apiUrl}service`, service);
  }

  getAvailableTimeSlots(
    businessId: number,
    serviceId: number,
    staffId: number,
    date: string
  ): Observable<AvailableTimeSlot[]> {
    let params = new HttpParams()
      .set('businessId', businessId.toString())
      .set('serviceId', serviceId.toString())
      .set('staffId', staffId.toString())
      .set('date', date);
    return this.http.get<AvailableTimeSlot[]>(`${this.apiUrl}api/reservations/available`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/reservations`, appointment).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => new Error('Failed to fetch data from server'));
  }
}
