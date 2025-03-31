import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  phone = '';
  password = '';
  name = '';
  password_confirmation = '';
  errorMessage = '';

  passwordsMatch = true;

  constructor(private authService: AuthService) {
  }

  toggleMode(mode: boolean) {
    this.isLoginMode = mode;
    this.passwordsMatch = true;
  }

  validatePasswords() {
    this.passwordsMatch = this.password === this.password_confirmation;
  }

  onSubmit() {
    if (!this.isLoginMode && !this.passwordsMatch) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    if (this.isLoginMode) {
      const loginData = { username: this.name, password: this.password };
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          localStorage.setItem('user', JSON.stringify(response));
          alert('Успешный вход!');
        },
        error: (err) => {
          console.error('Login error', err);
          this.errorMessage = 'Ошибка входа!';
        }
      });

    } else {
      // Register request
      const registerData = { phoneNumber: this.phone, username: this.name, password: this.password };
      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          alert('Регистрация успешна!');
        },
        error: (err) => {
          console.error('Registration error', err);
          this.errorMessage = 'Ошибка регистрации!';
        }
      });
    }
  }
}
