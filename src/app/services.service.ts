import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Service} from "./models";

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
}
