import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Business} from "./models";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private apiUrl = 'http://localhost:8080/business'; // Change ID as needed

  constructor(private http: HttpClient) {}

  getBusiness(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.apiUrl}/${id}`);
  }

  getAllBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}`);
  }
}
