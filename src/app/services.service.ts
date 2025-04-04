import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Service} from "./models";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = "http://localhost:8080/service";

  constructor(private http: HttpClient) { }

  getServices(id: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/${id}`)
  }

  getService(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }
}
