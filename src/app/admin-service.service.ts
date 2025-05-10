import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BusinessApplicationDto} from "./models";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private apiUrl = `${environment.apiUrl}/admin/businessApplications`; // Adjust the base URL as needed

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
