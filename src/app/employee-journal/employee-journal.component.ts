import { Component, OnInit } from '@angular/core';
import { EmployeeJournalPopupComponent } from '../employee-journal-popup/employee-journal-popup.component';
import { BusinessSpecialistPopupComponent } from '../business-specialist-popup/business-specialist-popup.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {ReservationDisplay, ReservationDto, TimeSlot} from "../models";

@Component({
  selector: 'app-employee-journal',
  standalone: true,
  imports: [
    EmployeeJournalPopupComponent,
    BusinessSpecialistPopupComponent,
    CommonModule
  ],
  templateUrl: './employee-journal.component.html',
  styleUrl: './employee-journal.component.css'
})
export class EmployeeJournalComponent implements OnInit {
  showPopup = false;
  selectedDate: Date = new Date();
  staffId: number | null = 19;
  reservations: ReservationDto[] = [];
  timeSlots: TimeSlot[] = [];
  reservationDisplays: ReservationDisplay[] = [];
  selectedTime: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('staffId');
      this.staffId = 19;
      console.log(this.staffId)
      this.fetchReservations();
    });
    this.initializeTimeSlots();
  }

  initializeTimeSlots(): void {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, isHalfHour: false, isAvailable: true });
      if (hour < 22) {
        slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, isHalfHour: true, isAvailable: true });
      }
    }
    this.timeSlots = slots;
    this.updateTimeSlots();
  }

  fetchReservations(): void {
    if (!this.staffId) return;

    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.http
      .get<ReservationDto[]>(`http://localhost:8080/api/reservations/staff/${this.staffId}?date=${dateStr}`)
      .subscribe({
        next: (reservations) => {
          this.reservations = reservations;
          this.updateTimeSlots();
          this.calculateReservationDisplays();
        },
        error: (err) => {
          console.error('Error fetching reservations:', err);
          this.reservations = [];
          this.updateTimeSlots();
          this.calculateReservationDisplays();
        }
      });
  }

  updateTimeSlots(): void {
    this.timeSlots = this.timeSlots.map(slot => {
      const slotStart = new Date(`${this.selectedDate.toISOString().split('T')[0]}T${slot.time}:00`);
      const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
      const isBooked = this.reservations.some(res => {
        const resStart = new Date(res.startTime);
        const resEnd = new Date(res.endTime);
        return resStart < slotEnd && resEnd > slotStart;
      });
      return { ...slot, isAvailable: !isBooked };
    });
  }

  calculateReservationDisplays(): void {
    const slotHeight:number = 35.67;
    const startHour = 8;
    this.reservationDisplays = this.reservations.map(res => {
      const start = new Date(res.startTime);
      const end = new Date(res.endTime);
      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes = end.getHours() * 60 + end.getMinutes();
      const durationMinutes = endMinutes - startMinutes;
      const top = ((startMinutes - startHour * 60) / 30) * slotHeight;
      console.log(top);
      const height = (durationMinutes / 30) * slotHeight;
      console.log(height);
      return { reservation: res, top, height };
    });
  }

  changeDate(direction: 'prev' | 'next'): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    this.selectedDate = newDate;
    this.fetchReservations();
  }

  canGoBack(): boolean {
    const prevDate = new Date(this.selectedDate);
    prevDate.setDate(this.selectedDate.getDate() - 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prevDate >= today;
  }

  formatDate(): string {
    const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const day = this.selectedDate.getDate();
    const month = months[this.selectedDate.getMonth()];
    const dayOfWeek = days[this.selectedDate.getDay()];
    return `${day} ${month} ${dayOfWeek}`;
  }

  formatTime(isoTime: string): string {
    const date = new Date(isoTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  openPopup(time: string): void {
    this.selectedTime = time;
    this.showPopup = true;
  }

  closePopup(message: string): void {
    this.showPopup = false;
    this.selectedTime = null;
    if (message === 'error') {
      alert('Не получилось создать запись. Пожалуйста, попробуйте снова');
    } else {
      this.fetchReservations();
    }
  }
}
