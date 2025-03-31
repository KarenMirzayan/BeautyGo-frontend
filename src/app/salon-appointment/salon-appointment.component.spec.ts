import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonAppointmentComponent } from './salon-appointment.component';

describe('SalonAppointmentComponent', () => {
  let component: SalonAppointmentComponent;
  let fixture: ComponentFixture<SalonAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
