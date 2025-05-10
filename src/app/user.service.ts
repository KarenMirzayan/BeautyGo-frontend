import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "./models";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  changePassword(id: number, oldPassword: string, newPassword: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${id}/change-password`, { oldPassword, newPassword });
  }

  uploadProfilePhoto(id: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${this.apiUrl}/${id}/upload-photo`, formData);
  }
}
