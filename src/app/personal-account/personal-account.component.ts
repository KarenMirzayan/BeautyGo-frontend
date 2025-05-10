// src/app/personal-account/personal-account.component.ts
import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import {User} from '../models';
import {UserService} from '../user.service';

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.css',
})
export class PersonalAccountComponent implements OnInit {
  user: User | null = null;
  editForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  passwordChangeForm: FormGroup;
  showPasswordModal = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\+7\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/),
      ]],
      email: ['', [Validators.email]],
      birthdate: ['', [Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/), this.dateValidator()]],
      gender: [''],
    });

    this.passwordChangeForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Custom validator for valid dates
  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const [day, month, year] = control.value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const isValid = date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
      return isValid ? null : { invalidDate: true };
    };
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user: User = JSON.parse(userString);
        if (user && user.id) {
          this.fetchUser(user.id);
        } else {
          this.router.navigate(['/authentication']);
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        this.router.navigate(['/authentication']);
      }
    } else {
      this.router.navigate(['/authentication']);
    }
  }

  fetchUser(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        console.log(user);
        this.editForm.patchValue({
          name: user.name,
          surname: user.surname,
          phoneNumber: user.phoneNumber,
          email: user.email,
          birthdate: user.birthdate ? this.formatDate(user.birthdate) : '',
          gender: user.gender || '',
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  saveChanges(): void {
    if (this.editForm.valid && this.user) {
      console.log(this.editForm.valid);
      console.log(this.editForm.value);
      const updatedUser: Partial<User> = {
        name: this.editForm.value.name,
        surname: this.editForm.value.surname,
        phoneNumber: this.editForm.value.phoneNumber,
        email: this.editForm.value.email,
        birthdate: this.editForm.value.birthdate
          ? new Date(this.editForm.value.birthdate.split('/').reverse().join('-')).toISOString().split('T')[0]
          : undefined,
        gender: this.editForm.value.gender || undefined,
      };
      this.userService.updateUser(this.user.id, updatedUser).subscribe({
        next: (user) => {
          this.user = user;
          this.error = null;
          alert('Changes saved successfully');
          localStorage.setItem('user', JSON.stringify(user));
        },
        error: (err) => {
          this.error = 'Failed to save changes';
          console.error(err);
        },
      });
    }
  }

  changePassword(): void {
    if (this.passwordChangeForm.valid && this.user) {
      this.userService.changePassword(
        this.user.id,
        this.passwordChangeForm.value.oldPassword,
        this.passwordChangeForm.value.newPassword
      ).subscribe({
        next: () => {
          this.showPasswordModal = false;
          this.passwordChangeForm.reset();
          alert('Password changed successfully');
        },
        error: (err) => {
          this.error = 'Failed to change password';
          console.error(err);
        },
      });
    }
  }

  uploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.user) {
      const file = input.files[0];
      this.userService.uploadProfilePhoto(this.user.id, file).subscribe({
        next: (user) => {
          this.user = user;
          this.error = null;
          localStorage.setItem('user', JSON.stringify(user));
        },
        error: (err) => {
          this.error = 'Failed to upload photo';
          console.error(err);
        },
      });
    }
  }

  togglePasswordModal(): void {
    this.showPasswordModal = !this.showPasswordModal;
  }

  protected readonly document = document;
  protected readonly console = console;
}
