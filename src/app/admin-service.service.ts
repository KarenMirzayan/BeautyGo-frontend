import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BusinessApplicationDto} from "./models";

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private apiUrl = 'http://localhost:8080/admin/businessApplications'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  getBusinessApplications(): Observable<BusinessApplicationDto[]> {
    return this.http.get<BusinessApplicationDto[]>(this.apiUrl);
  }

  getBusinessApplicationById(id: number): Observable<BusinessApplicationDto> {
    return this.http.get<BusinessApplicationDto>(`${this.apiUrl}/${id}`);
  }

  approveBusinessApplication(id: number): Observable<BusinessApplicationDto> {
    return this.http.put<BusinessApplicationDto>(`${this.apiUrl}/${id}`, {});
  }
}
