import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReservationDto} from "./models";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  getCurrentReservations(phone:string) {
    const encodedPhone = encodeURIComponent(phone);
    return this.http.get<ReservationDto[]>(`${this.apiUrl}/client/current?phone=${encodedPhone}`)
  }

  getHistoricReservations(phone:string) {
    const encodedPhone = encodeURIComponent(phone);
    return this.http.get<ReservationDto[]>(`${this.apiUrl}/client/history?phone=${encodedPhone}`)
  }
}
