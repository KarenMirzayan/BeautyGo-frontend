import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Service, Staff} from "./models";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private apiUrl = `${environment.apiUrl}/`;

  constructor(private http: HttpClient) { }

  getStaffs(id: number): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}business/staff/${id}`)
  }

  getStaff(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}staff/${id}`)
  }

  postStaff(staff: any) {
    return this.http.post<Staff>(`${this.apiUrl}staff`, staff);
  }
}
