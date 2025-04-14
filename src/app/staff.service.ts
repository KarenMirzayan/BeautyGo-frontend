import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Service, Staff} from "./models";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private apiUrl = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  getStaff(id: number): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}business/staff/${id}`)
  }
}
