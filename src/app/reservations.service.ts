import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReservationDto} from "./models";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private apiUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  getCurrentReservations(phone:string) {
    const encodedPhone = encodeURIComponent(phone);
    return this.http.get<ReservationDto[]>(`${this.apiUrl}/client/current?phone=${encodedPhone}`)
  }

  getHistoricReservations(phone:string) {
    const encodedPhone = encodeURIComponent(phone);
    return this.http.get<ReservationDto[]>(`${this.apiUrl}/client/history?phone=${encodedPhone}`)
  }

  getReservation(reservationId:number): Observable<ReservationDto> {
    return this.http.get<ReservationDto>(`${this.apiUrl}/${reservationId}`);
  }
}
